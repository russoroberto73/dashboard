<template>
  <div class="relative top-[120px]">
    <h1 class="text-center text-[30px]">Gestione Patrimonio Titoli Date</h1>
    <div class="flex justify-center my-5">
      <div class="flex flex-col space-y-4">
        <div class="mb-5">
          <select v-model="Data">
            <option value="0" disabled>Seleziona una data</option>
            <option v-for="date in ComboDate" :key="date.value" :value="date.value">
              {{ date.text }}
            </option>
            <option value="999">Aggiungi nuova data</option>
          </select>
        </div>
        <div v-if="Data === '999'" class="text-center">
          <input type="text" v-model="NuovaData" placeholder="Inserisci nuova data" /><br />
          <button @click="AggiungiData" class="bg-Bottone rounded-[45px] p-3 mt-5">Aggiungi</button>
        </div>
      </div>
    </div>
    <div class="w-[1000px] m-auto bg-white p-5 mt-5">
      <span class="flex justify-end mr-14">
        <span>Controvalore</span>
      </span>
      <div v-for="(item, index) in ElencoBanche" :key="index" class="mb-5">
        <h2 class="text-lg font-bold">{{ item.Nome }}</h2>
        <div v-for="(gruppo, index) in Gruppi(item.Id)" :key="index" class="ml-5">
          <h3 class="text-md font-semibold">{{ gruppo.Nome }}</h3>
          <ul>
            <li
              v-for="(titolo, index) in Titoli(gruppo.Id)"
              :key="index"
              class="ml-5 flex justify-between"
            >
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
import { ref, computed } from 'vue'

const ElencoDate = Pinia.PatrimonioDate().getElenco
const ElencoBanche = Pinia.PatrimonioBanche().getElenco

  const Data = ref('0')
  const NuovaData = ref('')
const AggiungiData = () => {
  if (NuovaData.value.trim() !== '') {    
    /*
    Pinia.PatrimonioDate().AggiungiData(NuovaData.value)
    NuovaData.value = ''
    Data.value = '0' // Reset the selection after adding a new date*/
  }
} 
const Gruppi = computed(() => {
  return (IdBanca: string) => {
    const ElencoGruppi = Pinia.PatrimonioGruppi().getElenco.filter(
      (item) => item.IdBanca === IdBanca
    )
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
    const ElencoTitoli = Pinia.PatrimonioTitoli().getElenco.filter(
      (item) => item.IdGruppo === IdGruppo
    )
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

const ComboDate = computed(() => {
  return ElencoDate.map((item: any) => {
    return {
      text: item.Data,
      value: item.Id
    }
  })
})
</script>
<style lang=""></style>
