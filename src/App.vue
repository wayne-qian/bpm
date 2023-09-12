<script setup lang="ts">
import Phrases from './components/Phrases.vue'
import Tempo from './components/Tempo.vue'
import Beats from './components/Beats.vue'
import * as Player from './player';
import { ref, watch } from 'vue';
import PlayBtn from './components/PlayBtn.vue';
import { type Phrase, parsePhrase } from './phrase';

const bpm = ref(parseInt(localStorage.getItem('bpm')!) || 60)
watch(bpm, newVal => {
    localStorage.setItem('bpm', '' + newVal)
    if (session.value) {
        session.value.tempo(newVal)
    }
})

const phrase = ref<Phrase>({ tracks: [] })
const session = ref(null as ReturnType<typeof Player.play> | null)
const curBeat = ref(-1)
const toggling = ref(false)
const muteBeats = ref(new Set<number>())

let screenWakeLock: WakeLockSentinel | null = null

function replay() {
    if (session.value) {
        session.value.stop()
        curBeat.value = -1
        session.value = Player.play(phrase.value, bpm.value, muteBeats.value)
        session.value.onBeat = index => curBeat.value = index
    }
}

async function play() {
    if (toggling.value || session.value) {
        return
    }
    toggling.value = true
    try {
        session.value = Player.play(phrase.value, bpm.value, muteBeats.value)
        session.value.onBeat = index => curBeat.value = index
        if (navigator.wakeLock) {
            screenWakeLock = await navigator.wakeLock.request('screen')
        }
    } finally {
        toggling.value = false
    }
}

async function stop() {
    if (toggling.value || !session.value) {
        return
    }
    toggling.value = true
    try {
        session.value.stop()
        session.value = null

        curBeat.value = -1
        if (screenWakeLock) {
            await screenWakeLock.release()
            screenWakeLock = null
        }
    } finally {
        toggling.value = false
    }
}

document.onvisibilitychange = () => {
    if (document.visibilityState !== "visible") {
        stop()
    }
}

async function setPhrase(phraseStr: string) {
    phrase.value = parsePhrase(phraseStr)
    muteBeats.value = new Set()
    replay()
}
</script>

<template>
    <div class="h-100 text-center d-flex flex-column justify-content-between">
        <div />
        <div>
            <Phrases @phrase="setPhrase" />
        </div>
        <div>
            <Beats :cur-beat="curBeat" :beatCount="phrase.tracks[0]?.bpb || 4" :mutes="muteBeats" />
        </div>
        <Tempo class="py-2 mt-3" v-model:bpm="bpm" />
        <div class="py-4 bg-dark">
            <PlayBtn :playing="!!session" @click="session ? stop() : play()" :disabled="toggling" />
        </div>
    </div>
</template>

<style scoped></style>
