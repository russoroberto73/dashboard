<template>
    <div class="relative top-[120px]">
        <h1 class="text-center text-[30px]">Gestione Situazione Fideuram</h1>
        <RTable :items="Items" :pinia="Pinia.SituazioneFideuram()" />
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { computed } from 'vue';

import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import { Data_ggmmaaaa_aaaammgg } from '@/assets/helpers/MyMixin';
const Elenco = Pinia.SituazioneFideuram().getElenco

const Items = computed(() => {
    return Elenco.map((item: any) => {
        return {
            Id: {
                Type: 'string',
                Value: item.Id,
                Class: 'text-left'
            },
            Data: {
                Type: 'date',
                Value: item.Data,
                Class: 'text-left ml-5',
                Valido: 'p'
            },
            Movimento: {
                Type: 'number',
                Value: item.Movimento,
                Class: 'text-center',
            },
            ImportoTotale: {
                Type: 'number',
                Value: item.ImportoTotale,
                Class: 'text-center',
                Valido: 'p'
            },
        }
    }).sort((a, b) => {
        const dateA = new Date(a.Data.Value);
        const dateB = new Date(b.Data.Value);
        console.log(dateA, dateB)
        return dateA.getTime() - dateB.getTime();
    })
})

</script>
<style lang="scss">
#SituazioneFideuram {
    th {
        padding: 0px !important;
    }
}
</style>