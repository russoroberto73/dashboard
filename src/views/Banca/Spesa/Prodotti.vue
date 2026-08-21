<template>
  <div>
    <RTable :items="Items" :pinia="Pinia.Prodotti()" />
  </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { computed } from 'vue'
import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'
const Elenco = Pinia.Prodotti().getElenco

const Items = computed(() => {
  if (Elenco.length === 0) {
    return [
      {
        Id: {
          Type: 'string',
          Value: '-1',
          Class: 'text-left'
        },
        IdCategoriaProdotto: {
          Type: 'select',
          Value: 'Tabella vuota',
          Class: 'text-left ml-5',
          Valido: 'p',
          Array: DatiCombo()
        },
        CategoriaProdotto: {
          Type: 'select',
          Value: 'Tabella vuota',
          Class: 'text-left ml-5',
          Valido: 'p',
          Array: DatiCombo()
        },
        Prodotto: {
          Type: 'string',
          Value: 'Tabella vuota',
          Class: 'text-left ml-5',
          Valido: 'p'
        },
        Nome: {
          type: 'string',
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
        IdCategoriaProdotto: {
          Type: 'select',
          Value: item.IdCategoriaProdotto,
          Class: 'text-left ml-5',
          Valido: 'p',
          Array: DatiCombo()
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

const DatiCombo = () => {
  const tmp = Pinia.CategorieProdotti().getElenco.sort((a, b) => {
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
<style lang=""></style>
