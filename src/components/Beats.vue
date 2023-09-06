<script setup lang="ts">
defineProps<{
    beats: { mute: boolean }[]
    curBeat: number
}>()

</script>
<template>
    <button v-for="(beat, i) in beats" :key="i" class="btn mx-1 p-0"
        style="transition: none;border-radius: 50%; width:3em;height:3em"
        :class="i === curBeat ? 'btn-success' : 'btn-dark'" @click="beat.mute = !beat.mute">
        <svg :class="beat.mute ? '' : 'invisible'" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="currentColor" viewBox="0 0 16 16">
            <path
                d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
        </svg>
    </button>
</template>