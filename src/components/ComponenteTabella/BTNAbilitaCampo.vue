<template>
    <button class="BTNAzione" style="width: fit-content;" @click="AbilitaCampo(item, n)">Abilita</button>
</template>
<script setup lang="ts">
import { mymixin } from './Script'
const props = defineProps(
    {
        item: {
            type: Object,
            required: true
        },
        n: {
            type:Number,
            required: true
        }
    }
)
const { AbilitaCampo } = mymixin(props)

</script>
