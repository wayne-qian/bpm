<script setup lang="ts">
const props = defineProps({ bpm: Number })
const emit = defineEmits(['update:bpm'])

function delta(d: number) {
    let newBpm = Math.min(Math.max(props.bpm! + d, 20), 300)
    emit('update:bpm', newBpm)
}
</script>

<template>
    <div class="btn-group">
        <button class="btn btn-secondary" @click="delta(-10)">-10</button>
        <button class="btn btn-secondary" @click="delta(-5)">-5</button>
        <button class="btn btn-secondary" @click="delta(-1)">-1</button>
        &ThickSpace;
        <button class="btn btn-secondary" @click="delta(1)">+1</button>
        <button class="btn btn-secondary" @click="delta(5)">+5</button>
        <button class="btn btn-secondary" @click="delta(10)">+10</button>
    </div>
</template>
