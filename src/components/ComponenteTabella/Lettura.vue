<template>
    <div :class="VerificaPassato(item[Object.keys(item)[n]])">
        <span v-if="item[Object.keys(item)[n]].Type === 'date'">
            <span v-if="!item[Object.keys(item)[n]].Visibile || item[Object.keys(item)[n]].Visibile === 'visible'">
                {{ ConvertiDataInglese(item[Object.keys(item)[n]].Value) }}
            </span>
        </span>
        <span v-else-if="item[Object.keys(item)[n]].Type === 'number'">
            {{ formatEuro(item[Object.keys(item)[n]].Value) }}
        </span>
        <span v-else-if="item[Object.keys(item)[n]].Type === 'select'">
            {{ IdComboNome(item[Object.keys(item)[n]]) }}
        </span>
        <span v-else-if="item[Object.keys(item)[n]].Type === 'boolean'">
            <label class="inline-flex items-center cursor-not-allowed">
                <input type="checkbox" :checked="item[Object.keys(item)[n]].Value" class="sr-only peer" disabled>
                <div
                    class="relative w-11 h-6 bg-red-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-grenn-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-300">
                </div>
            </label>
        </span>
        <span v-else v-html="item[Object.keys(item)[n]].Value" />                
    </div>
</template>
<script setup lang="ts">
import { formatEuro } from '@/assets/helpers/MyMixin';
import { mymixin } from './Script'
import { computed } from 'vue'

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
const VerificaPassato = computed(() => {
    return (obj: any) => {
        const oggi = new Date()
        if (obj.ControllaDataPassata) {
            if (new Date(obj.Value).getTime() < oggi.getTime()) {
                return 'bg-green-300'
            }
        }
        return ''
    }
})
const { ConvertiDataInglese, IdComboNome } = mymixin(props)

</script>