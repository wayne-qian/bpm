<script setup lang="ts">
type Phrase = {
    name: string
    phrase: string
}
const presetPhrases = [
    
]

const phrases = (() => {
    let p: Phrase[] = []
    try {
        p = JSON.parse(localStorage.getItem('phrases') || '[]')
    } catch { }
    return p
})()

</script>

<template>
    <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Straight Rock
    </button>
    <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
    </ul>
</template>
