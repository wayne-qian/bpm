<script setup lang="ts">
defineProps<{
    beats: { mute: boolean }[]
    curBeat: number
}>()

</script>
<template>
    <div>
        <div class="d-inline-block mt-2" v-for="(beat, i) in beats" :key="i">
            <button class="btn btn-secondary mx-1 pt-0 pb-4 px-2 text-center" style="transition: none;"
                :class="i === curBeat ? 'bg-success' : 'bg-dark'" @click="beat.mute = !beat.mute">
                <svg :class="beat.mute ? '' : 'invisible'" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                    fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
                </svg>
                <div>{{ i + 1 }}</div>
            </button>
        </div>
    </div>
</template>