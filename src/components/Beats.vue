<script setup lang="ts">
const props = defineProps<{
    mutes: Set<number>
    beatCount: number
    curBeat: number
}>()

function onclick(i: number) {
    if (props.mutes.has(i)) {
        props.mutes.delete(i)
    } else {
        props.mutes.add(i)
    }
}

</script>
<template>
    <button v-for="i in beatCount" :key="i" class="btn mx-1 p-0"
        style="transition: none;border-radius: 50%; width:3em;height:3em"
        :class="i - 1 === curBeat ? 'btn-success' : 'btn-dark'" @click="onclick(i - 1)">
        <svg :class="mutes.has(i - 1) ? '' : 'invisible'" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
            fill="currentColor" viewBox="0 0 16 16">
            <path
                d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
        </svg>
    </button>
</template>