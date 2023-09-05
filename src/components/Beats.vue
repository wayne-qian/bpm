<script setup lang="ts">
defineProps<{
    beats: { mute: boolean }[]
    curBeat: number
}>()

</script>
<template>
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
</template>