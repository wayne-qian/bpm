<script setup lang="ts">
defineProps<{ playing: boolean }>()
</script>
<template>
    <button class="btn btn-primary btn-lg">
        <svg v-if="playing" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor"
            viewBox="0 0 16 16">
            <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" fill="currentColor" viewBox="0 0 16 16">
            <path
                d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
        </svg>
    </button>
</template>