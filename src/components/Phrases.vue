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
    { id: -1, name: 'Tick 4th', phrase: 't1, t, t, t' },
    { id: -2, name: 'Tick 8th', phrase: 't1 t, t t, t t, t t' },
    { id: -3, name: 'Straight rock', phrase: 'h h, h h, h h, h h/ k, s, x k, s k' },
    { id: -4, name: 'Funky One', phrase: 'h h, h h, x !!h, h h/ !!k,,k k,/,s x x s ,x s x x,x x s x' },
    { id: -5, name: 'South Side Shuffle', phrase: 'h x h, h x h, h x h, h x h/ k x k,,k x k,/,s,,s x s' }
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
    <button class="btn btn-lg dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {{ curPhrase.name }}
    </button>
    <ul class="dropdown-menu">
        <li v-for="(p, i) in phrases" :key="p.id"><a class="dropdown-item" @click="selectPhrase(p)">{{ (i +
            1)
            + '. ' +
            p.name }}</a></li>
    </ul>
</template>
