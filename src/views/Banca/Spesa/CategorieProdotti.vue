<template>
  <div>
    <RTable :items="Items" :pinia="Pinia.CategorieProdotti()" />
  </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { computed } from 'vue'
import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'
const Elenco = Pinia.CategorieProdotti().getElenco

const Items = computed(() => {
  if (Elenco.length === 0) {
    return [
      {
        Id: {
          Type: 'string',
          Value: '-1',
          Class: 'text-left'
        },
        Nome: {
          Type: 'string',
          Value: 'Tabella vuota',
          Class: 'text-left ml-5',
          Valido: 'p'
        }
      }
    ]
  } else {
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
        }
      }
    })
  }
})
</script>
<style lang=""></style>
