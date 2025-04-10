<template>
    <label class="inline-flex items-center cursor-pointer">
        <input type="checkbox" v-model="Use().ObjStore[Object.keys(Use().ItemsStore[0])[n]]" class="sr-only peer">
        <div
            class="relative w-11 h-6 bg-red-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600">
        </div>
    </label>
</template>
<script setup lang="ts">
import { Use } from '@/stores/modules/CostruisciTabella.module'

const props = defineProps(
    {
        n: {
            type: Number,
            required: true
        }
    }
)
</script>
