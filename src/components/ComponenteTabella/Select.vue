<template>
    <select v-model="Use().ObjStore[Object.keys(Use().ItemsStore[0])[n]]"
        :class="item[Object.keys(item)[n]].Class">
        <option v-for="(option, index) in item[Object.keys(item)[n]].Array" :key="index" :value="option.value">
            {{ option.text }}
        </option>
    </select>
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

const { AssegnaValoreCombo } = mymixin(props)

</script>