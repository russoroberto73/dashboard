<template>
  <div>
    <div class="hidden">
      <button class="bg-yellow-500 p-2 rounded-[45px] m-5" @click="EliminaCarrello">Elimina</button>
    </div>
    <div class="text-center">
      Data:
      <select v-model="DataSelezionata" class="border border-blue-900 p-1 m-3 Bordo">
        <option value="0">Seleziona una data</option>
        <option v-for="(item, index) in ElencoDate()" :key="index" :value="item">
          {{ item }}
        </option>
      </select>
    </div>
    <RTable :items="Items" :pinia="Pinia.Carrello()" />
    <br />
    <div class="border-2 border-blue-900 w-[700px] m-auto p-2 mb-2">
      <button @click="() => (Spesa = !Spesa)" class="bg-blue-500 text-white p-2 rounded">
        Spesa
      </button>
    </div>
    <div class="grid grid-cols-3 gap-4 bg-white w-[900px] p-3 m-3 Bordo m-auto">
      <div
        v-for="(item, index) in ElencoCategorieProdotti"
        :key="index"
        class="border border-[2px] border-blue-900 p-0 m-3 Bordo"
      >
        <h2 class="text-lg font-bold text-center">{{ item.Nome }}</h2>
        <div
          v-for="(itemp, index) in ElencoProdotti.filter((p) => p.IdCategoriaProdotto === item.Id)"
          :key="index"
        >
          <template v-if="Spesa">
            <div
              v-if="Elenco.find((p) => p.Id === itemp.Id && p.Data === DataSelezionata)"
              class="grid grid-cols-2"
            >
              <span class="ml-5">{{ itemp }}</span>
              <span class="flex justify-end mr-5">{{
                Elenco.find((p) => p.IdProdotto === itemp.Id && p.Data === DataSelezionata)?.Qty
              }}</span>
            </div>
          </template>
          <template v-else>
            <div
              class="border border-[1px] border-blue-900 p-0 m-3 Bordo grid grid-cols-[1fr_50px]"
              :class="getQty(itemp) ? 'bg-green-300' : ''"
            >
              <div>{{ itemp.Nome }}({{ getQty(itemp) }})</div>
              <div class="flex justify-end items-end">
                <BTNAggiungi
                  class="BTNAzione w-[20px]"
                  :class="
                    DataSelezionata === '0' ? 'bg-gray-400 cursor-not-allowed' : 'cursor-pointer bg-yellow-500'
                  "
                  :disabled="DataSelezionata === '0'"
                  @click="Aggiungi_prodotto(itemp)"
                />
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { ref, computed } from 'vue'
import { Data_NewDate_aaaammgg } from '@/assets/helpers/MyMixin'
import BTNAggiungi from '@/assets/IconeSvg/Aggiungi.vue'
import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'
const Elenco = Pinia.Carrello().getElenco
const ElencoProdotti = Pinia.Prodotti().getElenco
const ElencoCategorieProdotti = Pinia.CategorieProdotti().getElenco
const Oggi = Data_NewDate_aaaammgg(new Date())
const DataSelezionata = ref('0')
const Spesa = ref(false)
const Items = computed(() => {
  if (Elenco.length === 0) {
    return [
      {
        Id: {
          Type: 'string',
          Value: '-1',
          Class: 'text-left'
        },
        Data: {
          Type: 'date',
          Value: Oggi,
          Class: 'text-left ml-5',
          Valido: 'p'
        },
        IdProdotto: {
          Type: 'select',
          Array: DatiCombo(),
          Value: 'Tabella vuota',
          Class: 'text-left ml-5',
          Valido: 'p'
        },
        Qty: {
          Type: 'number',
          Value: 1,
          Class: 'text-left ml-5',
          Valido: 'p'
        }
      }
    ]
  }
  return Elenco.filter(
    (item) => DataSelezionata.value === '0' || item.Data === DataSelezionata.value
  ).map((item) => ({
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
    IdProdotto: {
      Type: 'select',
      Array: DatiCombo(),
      Value: item.IdProdotto,
      Class: 'text-left ml-5',
      Valido: 'p'
    },
    Qty: {
      Type: 'number',
      Intero: true,
      Value: item.Qty,
      Class: 'text-center',
      Valido: 'p'
    }
  }))
})

const Aggiungi_prodotto = (item: any) => {
  const Payload: any = {
    Data: DataSelezionata.value,
    IdProdotto: item.Id
  }
  const TrovaProdotto = Pinia.Carrello().getElenco.find((Payload) => {
    return Payload.IdProdotto === item.Id
  })
  if (TrovaProdotto) {
    TrovaProdotto.Data = DataSelezionata.value
    TrovaProdotto.Qty = Number(TrovaProdotto.Qty) + 1
    Pinia.Carrello().Aggiorna({ ...TrovaProdotto, Id: TrovaProdotto.Id })
  } else {
    Pinia.Carrello().Aggiungi({ ...Payload, Qty: 1 })
  }
}

const DatiCombo = () => {
  const tmp = Pinia.Prodotti().getElenco.sort((a, b) => {
    if (a.Nome < b.Nome) {
      return -1
    } else if (a.Prodotto > b.Prodotto) {
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

const ElencoDate = () => {
  return [
    ...new Set(
      Pinia.Carrello().getElenco.map((item) => {
        return item.Data
      })
    )
  ]
}

const getQty = (itemp: any) => {
  //  console.log(itemp, DataSelezionata.value)
  const QtyCarrello = Elenco.find((item) => {
    if (item.Data === DataSelezionata.value && item.IdProdotto === itemp.Id) return item
  })
  if (QtyCarrello) {
    return QtyCarrello.Qty
  } else {
    return 0
  }
}

  const EliminaCarrello = () => { 
    Elenco.forEach((item) => { 
      console.log(item.Id, item)
      if (item.Id) {
        Pinia.Carrello().Elimina(item.Id)
      }
    })    
  }
</script>
<style lang=""></style>
