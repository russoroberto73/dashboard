<template>
    <textarea :disabled="TestModificaElimina === 'E'"
    v-model="Use().ObjStore[Object.keys(Use().ItemsStore[0])[n]]" :class="item[Object.keys(item)[n]].Class" />
</template>
<script setup lang="ts">
import { Use } from '@/stores/modules/CostruisciTabella.module'
import { mymixin } from './Script'

const props = defineProps(
    {
        item: {
            type: Object,
            required: true
        },        
        n: {
            type: Number,
            required: true
        }
    }
)

const { TestModificaElimina } = mymixin(props)

</script>