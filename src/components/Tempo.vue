<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({ bpm: Number })
const emit = defineEmits(['update:bpm'])

function normalizeBPM(bpm: number) {
    return Math.round(Math.min(Math.max(bpm || 0, 20), 300))
}
function delta(d: number) {
    emit('update:bpm', normalizeBPM(props.bpm! + d))
}

const tapping = ref(false)
const taps: number[] = []
let timerID = -1

function tap() {
    taps.push(performance.now())
    if (taps.length > 1) {
        tapping.value = true
    }

    while (taps.length > 4) {
        taps.shift()
    }

    if (taps.length === 4) {

        const t = taps[taps.length - 1] - taps[0]
        const newBPM = 60 * 1000 / (t / (taps.length - 1))
        emit('update:bpm', normalizeBPM(newBPM))
    }

    timerID >= 0 && clearTimeout(timerID)
    timerID = setTimeout(() => {
        taps.length = 0
        timerID = -1
        tapping.value = false
    }, 2000)
}
</script>

<template>
    <div class="text-center" style="user-select: none;">
        <div class="text-secondary">BPM</div>
        <span class="fw-lighter" style="font-size:7em;line-height: 1em;cursor: pointer;" @click="tap">{{ bpm }}</span>
        <div class="mt-4">
            <div class="position-absolute w-100" :class="tapping ? '' : 'invisible'">TAP</div>
            <div class="btn-group" :class="tapping ? 'invisible' : ''">
                <button class="btn btn-secondary py-2 dbtn" @click="delta(-10)">-10</button>
                <button class="btn btn-secondary py-2 dbtn" @click="delta(-5)">-5</button>
                <button class="btn btn-secondary py-2 dbtn" @click="delta(-1)">-1</button>
                &ThickSpace;
                <button class="btn btn-secondary py-2 dbtn" @click="delta(1)">+1</button>
                <button class="btn btn-secondary py-2 dbtn" @click="delta(5)">+5</button>
                <button class="btn btn-secondary py-2 dbtn" @click="delta(10)">+10</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.dbtn {
    width: 3.5em;
}
</style>