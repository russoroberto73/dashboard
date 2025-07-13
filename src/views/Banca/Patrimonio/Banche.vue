<template>
    <div class="relative top-[120px]">
        <h1 class="text-center text-[30px]">Gestione Patrimonio Banche</h1>
        <RTable :items="Items" :pinia="Pinia.PatrimonioBanche()" />
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { computed } from 'vue';

import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'
const Elenco = Pinia.PatrimonioBanche().getElenco

const Items = computed(() => {
    return Elenco.map((item: any) => {
        return {
            Id: {
                Type: 'string',
                Value: item.Id,
                Class: 'text-left'
            },
            Nome: {
                Type: 'string',
                Value: item.Nome,
                Class: 'text-left ml-5',
                Valido: 'p'
            },
            Posizione: {
                Type: 'text',
                Value: item.Posizione,
                Class: 'text-left'
            },
        }
    })
})

</script>
<style lang="">

</style>