<template>
    <div>
        730
        <RTable :items="Items" :pinia="Pinia.Rimborsi730()" />

    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores';
import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import { computed } from 'vue'

const Elenco = Pinia.Rimborsi730().getElenco
const Items = computed(() => {
    return Elenco.map((item) => {
        return {
            Id: {
                Type: 'number',
                Value: item.Id,
                Class: 'text-left'
            },
            Anno: {
                Type: 'string',
                Value: item.Anno,
                Class: 'text-center',
                Valido: 'p'
            },
            Importo: {
                Type: 'number',
                Value: item.Importo,
                Class: 'text-center',
                Valido: 'p'
            }
        }
    })
})
</script>
