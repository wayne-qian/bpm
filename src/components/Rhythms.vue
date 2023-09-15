<script setup lang="ts">
import { ref } from 'vue'
const keyRhythms = 'rhythms'
const keyCurrentRhythmID = 'curRhythmID'

const emit = defineEmits<{ (event: 'rhythm', rhythm: string): void }>()

type Rhythm = {
    id: number
    name: string
    content: string
}

const presets: Rhythm[] = [
    { id: -1, name: 'Tick 4th', content: 'drumKit: T t t t' },
    { id: -2, name: 'Tick 8th', content: 'drumKit: Tt tt tt tt' },
    { id: -4, name: 'Piano 4th', content: 'piano.5: g... c... c... c...' },
    { id: -5, name: 'Piano 8th', content: 'piano.5: g.c. c.c. c.c. c.c.' },
    {
        id: -3, name: 'Straight Rock', content: `
drumKit: hh hh hh hh
drumKit: -- s- -- s-
drumKit: k- -- -k -k
`},
    {
        id: -4, name: 'Funky One', content: `
drumKit: h-h- h-h- h-h- h-h- | h-h- h-h- h-h- h-h-
drumKit: ---- s--s -s-- --s- | -s-- s--s -s-- s---
drumKit: k--- ---- k-k- ---- | --k- ---- --k- --k-
`},
    {
        id: -5, name: 'South Side Shuffle', content: `
drumKit: h-h h-h h-h h-h
drumKit: --- s-- --- s-s
drumKit: k-k --- k-k ---
`},


]

const rhythms = (() => {
    const rhythms = [...presets]

    try {
        const saved = JSON.parse(localStorage.getItem(keyRhythms) || '[]')
        rhythms.push(...saved)
    } catch { }
    return rhythms
})()

const curRhythm = ref((() => {
    let id = parseInt(localStorage.getItem(keyCurrentRhythmID)!)
    let p = rhythms.find(p => p.id === id)
    return p || presets[0]
})())

function selectRhythm(rhythm: Rhythm) {
    curRhythm.value = rhythm
    localStorage.setItem(keyCurrentRhythmID, rhythm.id + '')
    emit('rhythm', rhythm.content)
}

emit('rhythm', curRhythm.value.content)

</script>

<template>
    <div class="dropdown-center">
        <button class="btn dropdown-toggle" style="min-width: 50%;" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            {{ curRhythm.name }}
        </button>
        <ul class="dropdown-menu">
            <li v-for="(r, i) in rhythms" :key="r.id"><a class="dropdown-item" @click="selectRhythm(r)">{{ (i +
                1)
                + '. ' +
                r.name }}</a></li>
            <div class="dropdown-divider"></div>
            <li><a class="dropdown-item">New Rhythm</a></li>
        </ul>
    </div>
</template>
