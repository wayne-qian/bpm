<script setup lang="ts">
import Phrases from './components/Phrases.vue'
import Timing from './components/Timing.vue'
import Beats from './components/Beats.vue'
import * as Player from './player';
import { ref, watch } from 'vue';

const bpm = ref(parseInt(localStorage.getItem('bpm')!) || 60)
watch(bpm, newVal => {
    localStorage.setItem('bpm', '' + newVal)
    if (session.value) {
        session.value.tempo(newVal)
    }
})

const beats = ref<ReturnType<typeof Player.parsePhrase>>([])
const session = ref(null as ReturnType<typeof Player.play> | null)
const curBeat = ref(-1)
const toggling = ref(false)

let screenWakeLock: WakeLockSentinel | null = null

function replay() {
    if (session.value) {
        session.value.stop()
        curBeat.value = -1
        session.value = Player.play(beats.value, index => curBeat.value = index)
        session.value.tempo(bpm.value)
    }
}

async function play() {
    if (toggling.value || session.value) {
        return
    }
    toggling.value = true
    try {
        session.value = Player.play(beats.value, index => curBeat.value = index)
        session.value.tempo(bpm.value)
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

document.onvisibilitychange = (() => {
    return () => {
        if (document.visibilityState !== "visible") {
            stop()
        }
    }
})()

async function setPhrase(phrase: string) {
    beats.value = Player.parsePhrase(phrase)
    replay()
}
</script>

<template>
    <div class="h-100 text-center d-flex flex-column justify-content-between">
        <div class="py-3">
            <span> ♪ BPM</span>
        </div>
        <div class="">
            <Phrases @phrase="setPhrase" class="col-2" />
            <Beats :cur-beat="curBeat" :beats="beats" />
        </div>

        <Timing v-model:bpm="bpm" />
        <div class="py-5 bg-dark">
            <button class="btn btn-primary btn-lg" :disabled="toggling" @click="session ? stop() : play()">
                <svg v-if="session" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor"
                    viewBox="0 0 16 16">
                    <path
                        d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor"
                    viewBox="0 0 16 16">
                    <path
                        d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped></style>
