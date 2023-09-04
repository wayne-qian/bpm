<script setup lang="ts">
import Phrases from './components/Phrases.vue'
import * as Player from './player';
import { reactive, ref } from 'vue';

const cfg = reactive({
    bpm: parseInt(localStorage.getItem('bpm') || '60'),
})

const beats = ref(Player.parsePhrase('h h, h h, h h, h h/k,s,. k,s k'))
const session = ref(null as ReturnType<typeof Player.play> | null)
const curBeat = ref(-1)

let screenWakeLock: WakeLockSentinel

function play() {
    if (session.value) {
        session.value.stop()
        session.value = null
        curBeat.value = -1
        if (screenWakeLock) {
            screenWakeLock.release()
        }
    } else {
        session.value = Player.play(beats.value, index => curBeat.value = index)
        session.value.tempo(cfg.bpm)
        if (navigator.wakeLock) {
            navigator.wakeLock.request('screen').then(lock => {
                screenWakeLock = lock
            })
        }
    }
}


function tempo(delta: number) {
    cfg.bpm = Math.min(Math.max(cfg.bpm + delta, 20), 300)
    session.value && session.value.tempo(cfg.bpm)
    localStorage.setItem('bpm', '' + cfg.bpm)
}

</script>

<template>
    <div class="card h-100 border-dark text-center">
        <div class="card-header">
            ♪ BPM
        </div>
        <div class="card-body d-flex flex-column align-items-center">
            <div class="my-auto">
                <div class="fw-lighter mb-4" style="font-size:6em;line-height: 1em;">{{ cfg.bpm }}</div>
                <div>
                    <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Straight Rock
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </div>
                <div>
                    <div class="d-inline-block mt-2" v-for="(beat, i) in beats" :key="i">
                        {{ i + 1 }}
                        <br>
                        <button class="btn btn-secondary mx-1 py-3 px-2" style="transition: none;"
                            :class="i === curBeat ? 'bg-success' : 'bg-dark'" @click="beat.mute = !beat.mute">
                            <i class="bi bi-volume-mute-fill" :class="beat.mute ? '' : 'invisible'"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="btn-group mt-4">
                <button class="btn btn-secondary" @click="tempo(-10)">-10</button>
                <button class="btn btn-secondary" @click="tempo(-5)">-5</button>
                <button class="btn btn-secondary" @click="tempo(-1)">-1</button>
                &ThickSpace;
                <button class="btn btn-secondary" @click="tempo(1)">+1</button>
                <button class="btn btn-secondary" @click="tempo(5)">+5</button>
                <button class="btn btn-secondary" @click="tempo(10)">+10</button>
            </div>
        </div>
        <div class="card-footer">
            <button class="btn btn-primary" @click="play"><i class="bi mx-3" style="font-size: 1.5rem;"
                    :class="!!session ? 'bi-stop-fill' : 'bi-play-fill'"></i></button>
        </div>

    </div>
</template>

<style scoped></style>
