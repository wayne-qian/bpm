type PlayNote = (dest: AudioNode, when: number, duration: number) => void


function playSnare(dest: AudioNode, when: number, duration: number) {
    duration = Math.min(0.18, duration)
    const ctx = dest.context

    const filter = ctx.createBiquadFilter()
    filter.connect(dest)
    filter.type = "highpass"
    filter.frequency.value = 320 // Measured in Hz

    // Control the gain of our snare white noise
    const noiseGain = ctx.createGain();
    noiseGain.connect(filter)
    noiseGain.gain.setValueAtTime(1, when);
    noiseGain.gain.exponentialRampToValueAtTime(
        0.01,
        when + duration
    );

    const noiseSrc = ctx.createBufferSource()
    noiseSrc.connect(noiseGain)
    noiseSrc.buffer = generateNoiseBuffer(ctx)
    noiseSrc.start(when);
    noiseSrc.stop(when + duration);

    // Control the gain of our snare oscillator
    const oscGain = ctx.createGain();
    oscGain.connect(dest)
    oscGain.gain.setValueAtTime(0.7, when);
    oscGain.gain.exponentialRampToValueAtTime(
        0.01,
        when + duration / 2
    );

    // Set up an oscillator to provide a 'snap' sound
    const osc = ctx.createOscillator();
    osc.connect(oscGain)
    osc.type = "triangle";
    osc.frequency.value = 80

    osc.start(when);
    osc.stop(when + duration);
}

function playHihat(dest: AudioNode, when: number, duration: number) {
    duration = Math.min(0.15, duration)
    const ctx = dest.context

    const filter = ctx.createBiquadFilter()
    filter.connect(dest)
    filter.type = "highpass"
    filter.frequency.value = 9000 // Measured in Hz

    // Control the gain of our snare white noise
    const noiseGain = ctx.createGain();
    noiseGain.connect(filter)
    noiseGain.gain.setValueAtTime(0.5, when);
    noiseGain.gain.exponentialRampToValueAtTime(
        0.001,
        when + duration
    );

    const noiseSrc = ctx.createBufferSource()
    noiseSrc.connect(noiseGain)
    noiseSrc.buffer = generateNoiseBuffer(ctx)
    noiseSrc.start(when);
    noiseSrc.stop(when + duration);
}

function playKick(dest: AudioNode, when: number, duration: number) {
    duration = Math.min(0.5, duration)
    const ctx = dest.context

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, when);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        when + duration
    );
    gain.connect(dest);

    const osc = ctx.createOscillator();
    osc.connect(gain);

    // Frequency in Hz. This corresponds to a C note.
    osc.frequency.setValueAtTime(200, when);
    osc.frequency.exponentialRampToValueAtTime(
        0.001,
        when + duration
    );

    osc.start(when);
    // This will stop the oscillator after half a second.
    osc.stop(when + duration)
}

function playTick(dest: AudioNode, when: number, duration: number, freq: number) {
    duration = Math.min(0.2, duration)
    const ctx = dest.context

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(1, when);
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        when + duration
    );
    gain.connect(dest);

    const osc = ctx.createOscillator();
    osc.connect(gain);

    osc.frequency.value = freq

    osc.start(when);
    osc.stop(when + duration)
}

const generateNoiseBuffer = (() => {
    let buf: AudioBuffer
    return (ctx: BaseAudioContext) => {
        if (!buf) {
            buf = ctx.createBuffer(
                2,
                ctx.sampleRate / 2, // 0.5s is enough
                ctx.sampleRate
            );
            for (let c = 0; c < buf.numberOfChannels; c++) {
                const data = buf.getChannelData(c);
                for (let i = 0; i < buf.length; i++) {
                    data[i] = (Math.random() - 0.5) / 3;
                }
            }
        }
        return buf
    }
})()

const drumKit: { [s: string]: PlayNote } = {
    's': playSnare,
    'k': playKick,
    'h': playHihat,
    't': (dest, when, duration) => playTick(dest, when, duration, 1500),
    'T': (dest, when, duration) => playTick(dest, when, duration, 1890),
}


const sets: { [s: string]: { [s: string]: PlayNote } } = {
    'drumKit': drumKit
}

type StringParam = {
    baseFreq: number
    harmonicSeries: number[]
    attackDur: number
    decayDur: number
    releaseDur: number
    sustainLevel: number
    vibrato: number
}

function playString(dest: AudioNode, when: number, duration: number, param: StringParam) {
    const ctx = dest.context

    const vibGain = ctx.createGain()
    vibGain.gain.value = 1.5

    const vib = ctx.createOscillator()
    vib.connect(vibGain)
    vib.frequency.value = param.vibrato
    vib.start(when)
    vib.stop(when + duration)

    const attackDur = Math.min(param.attackDur, duration / 20);
    const decayDur = Math.min(param.decayDur, duration / 10);
    const releaseDur = Math.min(param.releaseDur, duration / 2);

    const noteGain = ctx.createGain();
    noteGain.connect(dest)

    noteGain.gain.setValueAtTime(0, when);
    noteGain.gain.linearRampToValueAtTime(1, when + attackDur);
    noteGain.gain.linearRampToValueAtTime(
        param.sustainLevel,
        when + attackDur + decayDur
    );
    noteGain.gain.linearRampToValueAtTime(param.sustainLevel / 3, when + duration - releaseDur);
    noteGain.gain.exponentialRampToValueAtTime(0.001, when + duration);

    param.harmonicSeries.forEach((lvl, i) => {
        const gain = ctx.createGain()
        gain.connect(noteGain)
        gain.gain.value = lvl

        const n = ctx.createOscillator()
        n.connect(gain)
        vibGain.connect(n.frequency);
        n.frequency.value = param.baseFreq * (i + 1)

        n.start(when);
        n.stop(when + duration);
    })
}


const scaleList: [string, number][] = [
    ['c', 261.63],
    ["C", 277.18],
    ["d", 293.66],
    ["D", 311.13],
    ["e", 329.63],
    ["f", 349.23],
    ["F", 369.99],
    ["g", 392.0],
    ["G", 415.3],
    ["a", 440.0],
    ["A", 466.16],
    ["b", 493.88],
]

for (let i = 0; i < 4; i++) {
    const set: { [s: string]: PlayNote } = {}
    scaleList.forEach(v => {
        const [sym, freq] = v
        set[sym] = (dest, when, duration) => playString(dest, when, duration, {
            baseFreq: freq * Math.pow(2, i),
            attackDur: 0.01,
            decayDur: 0.02,
            releaseDur: 0.2,
            sustainLevel: 0.3,
            vibrato: 3,
            harmonicSeries: [0.5, 0.1, 0.05, 0.02, 0.01,0.005, 0.001]
        })
    })
    sets[`piano.${i}`] = set
    if (i === 0) {
        sets['piano'] = set
    }
}


const masterGainValue = 1

export class Audio {
    private ctx: AudioContext
    private master: GainNode
    private compressor: DynamicsCompressorNode

    constructor() {
        this.ctx = new AudioContext()
        this.master = this.ctx.createGain()
        this.master.connect(this.ctx.destination)
        this.master.gain.value = masterGainValue

        this.compressor = this.ctx.createDynamicsCompressor()
        this.compressor.connect(this.master)
    }

    get currentTime() {
        return this.ctx.currentTime
    }

    play(set: string, sym: string, strength: number, when: number, duration: number) {
        const gain = this.ctx.createGain()
        gain.connect(this.compressor)
        gain.gain.value = strength

        const play = (sets[set] || {})[sym]
        if (play) {
            play(gain, when, duration)
            return true
        }
        return false
    }

    mute(when: number, duration: number) {
        this.master.gain.setValueAtTime(0, when)
        this.master.gain.setValueAtTime(masterGainValue, when + duration)
    }

    close() {
        this.master.disconnect()
        this.compressor.disconnect()
    }
}
