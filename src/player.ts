import { Audio } from './audio'
import { type Rhythm } from './rhythm'

export function play(rhythm: Rhythm, bpm: number, muteBeats: Set<number>) {
    const audio = new Audio()
    const queuedBeats: { when: number, index: number }[] = []

    const bpb = rhythm.tracks[0]?.bpb || 4
    let playing = true
    let beatTime = audio.currentTime + 0.2
    let beatCount = 0
    let _onBeat: (index: number) => void

    queuedBeats.push({ when: beatTime, index: beatCount })

    const schedule = () => {
        const curTime = audio.currentTime
        while (beatTime < curTime + 0.2) {
            const beatDur = 60 / bpm
            rhythm.tracks.forEach(track => {
                track.beats[beatCount % track.beats.length]?.notes
                    .forEach(note => {
                        audio.play(
                            track.set,
                            note.sym,
                            1,
                            beatTime + beatDur * note.offset,
                            beatDur * note.duration
                        )
                    })
            })

            queuedBeats.push({ when: beatTime, index: beatCount % bpb })
            if (muteBeats.has(beatCount % bpb)) {
                audio.mute(beatTime, beatDur)
            }
            beatTime += beatDur
            beatCount++
        }
        while (queuedBeats.length) {
            const b0 = queuedBeats[0]
            if (b0.when <= curTime) {
                queuedBeats.shift()
                _onBeat && _onBeat(b0.index)
            } else {
                break
            }
        }
    }

    const onFrame = () => {
        if (playing) {
            schedule()
            requestAnimationFrame(onFrame)
        }
    }
    onFrame()
    return {
        stop() {
            playing = false
            audio.close()
        },
        tempo(newBpm: number) {
            bpm = newBpm
        },
        set onBeat(cb: (index: number) => void) {
            _onBeat = cb
        }
    }
}
