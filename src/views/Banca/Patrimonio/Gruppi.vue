<template>
    <div class="relative top-[120px]">
        <h1 class="text-center text-[30px]">Gestione Patrimonio gruppi</h1>
        <RTable :items="Items" :pinia="Pinia.PatrimonioGruppi()" />
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { computed } from 'vue';

import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'
const Elenco = Pinia.PatrimonioGruppi().getElenco

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
            IdBanca: {
                Type: 'select',
                Array: DatiCombo(),
                Value: item.IdBanca,
                Class: 'text-left'
            },
            Posizione: {
                Type: 'text',
                Value: item.Posizione,
                Class: 'text-left'
            }
        }
    })
})


const DatiCombo = () => {
    const tmp = Pinia.PatrimonioBanche().getElenco.sort((a, b) => {
        if (a.Nome < b.Nome) {
            return -1
        } else if (a.Nome > b.Nome) {
            return 1
        }
        return 0
    })
    return tmp.map((item) => {
        return {
            text: item.Nome,
            value: item.Id
        }
    })
}
</script>
<style lang="">

</style>