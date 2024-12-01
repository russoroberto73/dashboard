<template>
    <div class="relative top-[120px]">
        <h1 class="text-center text-[30px]">Gestione Categorie</h1>
        <RTable :items="Items" :pinia="Pinia.Categorie()" :piniaverifica="Pinia.Movimenti()" />
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { computed } from 'vue';

import RTable from '@/components/ComponenteTabella/CostrisciTabella.vue'
const Elenco = Pinia.Categorie().getElenco

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
                Class: 'text-left ml-5',
                Valido: 'p'
            },
            TestoDaAssociareCategoria: {
                Type: 'string',
                Value: item.TestoDaAssociareCategoria,
                Class: 'text-center'
            },
            Visibile: {
                Type: 'boolean',
                Value: item.Visibile,
                Class: 'text-center'
            },
            IdSuperCategoria: {
                Type: 'select',
                Array: DatiCombo(),
                Value: item.IdSuperCategoria, //Pinia.SuperCategorie().getElenco.find((itemsc) => itemsc.Id === item.IdSuperCategoria)?.Nome,
                Class: 'text-left'
            },
        }
    })
})

const DatiCombo = () => {
    const tmp = Pinia.SuperCategorie().getElenco.sort((a, b) => {
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