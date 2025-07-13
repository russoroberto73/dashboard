<template>
  <div class="relative top-[120px]">
    <h1 class="text-center text-[30px]">Gestione Patrimonio Titoli</h1>
    <RTable :items="Items" :pinia="Pinia.PatrimonioTitoli()" />
    <div class="w-[1000px] m-auto bg-white p-5 mt-5 hidden">   
        <span class="flex justify-end mr-14">
            <span>Controvalore</span>
        </span>
      <div v-for="(item, index) in ElencoBanche" :key="index" class="mb-5">
        <h2 class="text-lg font-bold">{{ item.Nome }}</h2>
        <div v-for="(gruppo, index) in Gruppi(item.Id)" :key="index" class="ml-5">
          <h3 class="text-md font-semibold">{{ gruppo.Nome }}</h3>
          <ul>
            <li v-for="(titolo, index) in Titoli(gruppo.Id)" :key="index" class="ml-5 flex justify-between">
              <span>{{ titolo.Nome }}</span>
              <span class="ml-3 font-mono text-gray-500 w-[180px] text-center">
                <span class="mx-3">0</span>
                <span class="mx-3">0</span>
                <span class="mx-3">0</span>                
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { computed } from 'vue'

import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'
const Elenco = Pinia.PatrimonioTitoli().getElenco
const ElencoBanche = Pinia.PatrimonioBanche().getElenco
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
      IdGruppo: {
        Type: 'select',
        Array: DatiCombo(),
        Value: item.IdGruppo,
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
  const tmp = Pinia.PatrimonioGruppi().getElenco.sort((a, b) => {
    if (a.Nome < b.Nome) {
      return -1
    } else if (a.Nome > b.Nome) {
      return 1
    }
    return 0
  })
  return tmp.map((item) => {
    //console.log(item)
    return {
      text:
        item.Nome +
        ' (' +
        Pinia.PatrimonioBanche().getElenco.find((banca) => banca.Id === item.IdBanca)?.Nome +
        ')',
      value: item.Id
    }
  })
}

const Gruppi = computed(() => {
    return (IdBanca: string) => {
      const ElencoGruppi = Pinia.PatrimonioGruppi().getElenco.filter((item) => item.IdBanca === IdBanca)
      return ElencoGruppi.sort((a, b) => {
        if (parseInt(a.Posizione) < parseInt(b.Posizione)) {
          return -1
        } else if (parseInt(a.Posizione) > parseInt(b.Posizione)) {
          return 1
        }
        return 0
      })
    }
})
const Titoli = computed(() => {
  return (IdGruppo: string) => {
    const ElencoTitoli = Pinia.PatrimonioTitoli().getElenco.filter((item) => item.IdGruppo === IdGruppo)
    return ElencoTitoli.sort((a, b) => {
      if (parseInt(a.Posizione) < parseInt(b.Posizione)) {
        return -1
      } else if (parseInt(a.Posizione) > parseInt(b.Posizione)) {
        return 1
      }
      return 0
    })
  }
})
</script>
<style lang=""></style>
