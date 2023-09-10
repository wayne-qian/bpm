import { Audio } from './audio'
import { type Phrase } from './phrase'

export function play(phrase: Phrase, bpm: number, muteBeats: Set<number>) {
    const audio = new Audio()
    const queuedBeats: { when: number, index: number }[] = []

    const bpb = phrase.tracks[0]?.bpb || 4
    let playing = true
    let beatTime = audio.currentTime + 0.2
    let beatCount = 0
    let _onBeat: (index: number) => void

    queuedBeats.push({ when: beatTime, index: beatCount })

    const schedule = () => {
        const curTime = audio.currentTime
        while (beatTime < curTime + 0.2) {
            const beatDur = 60 / bpm
            phrase.tracks.forEach(track => {
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

        for (; ;) {
            const b0 = queuedBeats[0]
            if (!b0) break
            if (b0.when > curTime) break

            queuedBeats.shift()
            _onBeat && _onBeat(b0.index)
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
