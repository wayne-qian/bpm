
export type Note = {
    sym: string
    offset: number
    duration: number
}
export type Beat = {
    notes: Note[]
}

export type Track = {
    set: string
    bpb: number
    beats: Beat[]
}

export type Phrase = {
    tracks: Track[]
}

export function parseBeat(beatStr: string): Beat {
    if (!beatStr.length) {
        return { notes: [] }
    }
    const beat: Beat = { notes: [] }
    for (let i = 0; i < beatStr.length; i++) {
        beat.notes.push({
            sym: beatStr[i],
            offset: i / beatStr.length,
            duration: 1 / beatStr.length,
        })
    }
    return beat
}

export function parseTrack(trackStr: string): Track {
    const track: Track = {
        set: '',
        bpb: 4,
        beats: []
    }
    const i = trackStr.indexOf(':')
    if (i < 0) return track

    track.set = trackStr.slice(0, i).trim()
    trackStr.slice(i + 1)
        .trim()
        .split('|')
        .map(t => t.trim())
        .forEach((barStr, i) => {
            const beats = barStr.split(/\s+/)
                .filter(b => !!b)
                .map(parseBeat)
            if (i === 0 && beats.length) {
                track.bpb = beats.length
            }
            track.beats.push(...beats)
        })

    let lastNote: Note
    track.beats = track.beats.map<Beat>(beat => {
        const notes = beat.notes.reduce<Note[]>((prev, note) => {
            if (note.sym === '-') {
                if (lastNote) {
                    lastNote.duration += note.duration
                }
            } else {
                lastNote = note
                if (/^[0-9a-zA-Z]+$/.test(note.sym)) {
                    prev.push(note)
                }
            }
            return prev
        }, [])
        return {
            notes
        }
    })
    return track
}

export function parsePhrase(phraseStr: string): Phrase {
    return {
        tracks: phraseStr.split(/[\r\n]+/)
            .map(p => p.trim())
            .filter(p => !!p)
            .map(parseTrack)
    }
}

