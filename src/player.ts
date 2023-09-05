import { Audio } from './audio'

type Note = {
    sym: string
    offset: number
    duration: number
    gain: number
}

export type Beat = { notes: Note[], mute: boolean }

function prefixLen(str: string, p: string) {
    let len = 0
    for (; str[len] === p; len++) { }
    return len
}


function parseBeat(beatStr: string) {
    const notes = beatStr.split(/\s+/).filter(note => note)
    const duration = 1 / notes.length
    return notes.map<Note>((note, i) => {
        let gain = 1
        let accent = prefixLen(note, '!')
        if (accent > 0) {
            gain *= (accent + 1)
            note = note.slice(accent)
        } else {
            let weak = prefixLen(note, '?')
            gain /= (weak + 1)
            note = note.slice(weak)
        }

        return { sym: note, offset: duration * i, duration, gain }
    })
}

function parseBar(barStr: string) {
    const beats = barStr.split(',')
        .map<Beat>(beatStr => ({ notes: parseBeat(beatStr.trim()), mute: false }))

    const normalizedBeats: Beat[] = []
    let lastNote: Note
    beats.forEach(beats => {
        const normalizedNotes: Note[] = []
        beats.notes.forEach(note => {
            if (note.sym === '-') {
                if (lastNote) {
                    lastNote.duration += note.duration
                }
            } else {
                normalizedNotes.push(note)
                lastNote = note
            }
        })
        normalizedBeats.push({ notes: normalizedNotes, mute: false })
    })
    return normalizedBeats
}

export function parsePhrase(phraseStr: string) {
    const bars = phraseStr.split('/')
        .filter(bar => bar)
        .map(parseBar)

    const mixedBeats: Beat[] = []
    for (let i = 0; ; i++) {
        const notes: Note[] = []
        let hasMore = false
        bars.forEach(beats => {
            const beat = beats[i]
            if (beat) {
                notes.push(...beat.notes)
                hasMore = true
            }
        })
        if (!hasMore) break

        notes.sort((a, b) => a.offset - b.offset)
        mixedBeats.push({ notes, mute: false })
    }
    return mixedBeats
}

export function play(beats: Beat[], onBeat: (index: number) => void) {
    const audio = new Audio()
    const queuedBeats: { when: number, index: number }[] = []

    let playing = true
    let bpm = 60

    let beatTime = audio.currentTime + 0.1
    let beatCount = 0

    queuedBeats.push({ when: beatTime, index: beatCount })

    const schedule = () => {
        const curTime = audio.currentTime
        while (beatTime < curTime + 1) {
            const beatIndex = beatCount % beats.length
            const beat = beats[beatIndex]
            queuedBeats.push({ when: beatTime, index: beatIndex })

            const beatDur = 60 / bpm
            beat.notes.forEach(note => {
                audio.play(
                    note.sym,
                    note.gain,
                    beatTime + beatDur * note.offset,
                    beatDur * note.duration)

            })
            if (beat.mute) {
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
            onBeat(b0.index)
        }
    }

    const onTimer = () => {
        if (playing) {
            schedule()
            setTimeout(onTimer, 250)
        }
    }
    const onFrame = () => {
        if (playing) {
            schedule()
            requestAnimationFrame(onFrame)
        }
    }

    setTimeout(() => {
        onTimer()
        onFrame()
    }, 0)

    return {
        stop() {
            playing = false
            audio.close()
        },
        tempo(newBpm: number) {
            bpm = newBpm
        }
    }
}
