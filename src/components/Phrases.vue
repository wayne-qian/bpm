<script setup lang="ts">
import { ref } from 'vue'
const keyPhrases = 'phrases'
const keyCurrentPhraseID = 'curPhraseID'

const emit = defineEmits<{ (event: 'phrase', phrase: string): void }>()

type Phrase = {
    id: number
    name: string
    phrase: string
}

const presets: Phrase[] = [
    { id: -1, name: 'Tick 4th', phrase: 'drumKit: T t t t' },
    { id: -2, name: 'Tick 8th', phrase: 'drumKit: Tt tt tt tt' },
    {
        id: -3, name: 'Straight Rock', phrase: `
drumKit: hh hh hh hh
drumKit: -- s- -- s-
drumKit: k- -- -k -k
`},
    {
        id: -4, name: 'Funky One', phrase: `
drumKit: h-h- h-h- h-h- h-h- | h-h- h-h- h-h- h-h-
drumKit: ---- s--s -s-- --s- | -s-- s--s -s-- s---
drumKit: k--- ---- k-k- ---- | --k- ---- --k- --k-
`},
    {
        id: -5, name: 'South Side Shuffle', phrase: `
drumKit: h-h h-h h-h h-h
drumKit: --- s-- --- s-s
drumKit: k-k --- k-k ---
`},


]

const phrases = (() => {
    const phrases = [...presets]

    try {
        const saved = JSON.parse(localStorage.getItem(keyPhrases) || '[]')
        phrases.push(...saved)
    } catch { }
    return phrases
})()

const curPhrase = ref((() => {
    let id = parseInt(localStorage.getItem(keyCurrentPhraseID)!)
    let p = phrases.find(p => p.id === id)
    return p || presets[0]
})())

function selectPhrase(phrase: Phrase) {
    curPhrase.value = phrase
    localStorage.setItem(keyCurrentPhraseID, phrase.id + '')
    emit('phrase', phrase.phrase)
}

emit('phrase', curPhrase.value.phrase)

</script>

<template>
    <div class="dropdown-center">
        <button class="btn dropdown-toggle" style="min-width: 50%;" type="button" data-bs-toggle="dropdown"
            aria-expanded="false">
            {{ curPhrase.name }}
        </button>
        <ul class="dropdown-menu">
            <li v-for="(p, i) in phrases" :key="p.id"><a class="dropdown-item" @click="selectPhrase(p)">{{ (i +
                1)
                + '. ' +
                p.name }}</a></li>
            <div class="dropdown-divider"></div>
            <li><a class="dropdown-item">New Phrase</a></li>
        </ul>
    </div>
</template>
