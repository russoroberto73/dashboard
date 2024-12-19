<template>
    <div class="relative top-[120px]">
        <h1 class="text-center text-[30px]">Gestione Super categorie</h1>
        <RTable :items="Items" :pinia="Pinia.SuperCategorie()" :piniaverifica="Pinia.Categorie()" />
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { computed } from 'vue';

import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'
const Elenco = Pinia.SuperCategorie().getElenco

const Items = computed(() => {
    return Elenco.map((item) => {
        return {
            Id: {
                Type: 'string',
                Value: item.Id,
                Class: 'text-left'
            },
            Nome: {
                Type: 'string',
                Value: item.Nome,
                Class: 'text-left',
                Valido: 'p'
            }
        }
    })
})
</script>
<style lang="">

</style>