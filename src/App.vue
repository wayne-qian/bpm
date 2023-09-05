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
    <div class="card h-100 border-dark text-center">
        <div class="card-header">
            ♪ BPM
        </div>

        <div class="card-body d-flex flex-column align-items-center">
            <div class="my-auto">
                <div class="fw-lighter mb-4" style="font-size:6em;line-height: 1em;">{{ bpm }}</div>
                <Phrases @phrase="setPhrase" />
                <Beats :cur-beat="curBeat" :beats="beats" />
            </div>
            <Timing v-model:bpm="bpm" />
        </div>
        <div class="card-footer">
            <button class="btn btn-primary" :disabled="toggling" @click="session ? stop() : play()"><i class="bi mx-3"
                    style="font-size: 1.5rem;" :class="session ? 'bi-stop-fill' : 'bi-play-fill'"></i></button>
        </div>
    </div>
</template>

<style scoped></style>
