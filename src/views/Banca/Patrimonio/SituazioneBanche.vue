<template>
  <div class="relative top-[120px] text-center">
    <h1 class="text-center text-[30px]">Gestione Situazione Fideuram</h1>
    <div class="w-[1010px] m-auto text-left">
      <div class="font-bold text-xl">30 aprile disinvestito 25.000 euro</div>
    </div>
    <RTable :items="Items" :pinia="Pinia.SituazioneFideuram()" />
        <div class="w-[1010px] m-auto text-left">
      <div class="font-bold text-xl">Totale euro usati per la gestione badanza: {{ formatEuro(SommaMovimento) }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { computed } from 'vue'
    import { formatEuro } from '@/assets/helpers/MyMixin'
import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'
const Elenco = Pinia.SituazioneFideuram().getElenco

const Items = computed(() => {
  return Elenco.map((item: any) => {
    //console.log(item)
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
        Class: 'text-center'
      },
      ImportoTotale: {
        Type: 'number',
        Value: item.ImportoTotale,
        Class: 'text-center',
        Valido: 'p'
      },
      Conto: {
        Type: 'number',
        Value: item.Conto,
        Class: 'text-center',
        Valido: 'p'
      },
      PatrimonioBanche: {
        Type: 'number',
        Value: TestImportoPatrimonio.value(item),
        Class: 'text-center',
        ReadOnly: true
      }
    }
  }).sort((a, b) => {
    const dateA = new Date(a.Data.Value)
    const dateB = new Date(b.Data.Value)
    return dateA.getTime() - dateB.getTime()
  })
})

const TestImportoPatrimonio = computed(() => {
  return (item: any) => {
    return (item.ImportoTotale && item.Conto) ? (Number(item.ImportoTotale) - Number(item.Conto)).toFixed(2) : '01'
/*    if (!isNaN(Number(item.ImportoTotale) - Number(item.Conto))) {
        if (!item.PatrimonioBanche || item.PatrimonioBanche === '0.00' || item.PatrimonioBanche === '1.00') {
        return '01'
        }
      console.log(item.ImportoTotale, item.Conto, Number(item.ImportoTotale) - Number(item.Conto))
      return (item.ImportoTotale - item.Conto).toFixed(2)
    } else {
      return '01'
    }*/
  }
}) 

const SommaMovimento = computed(() => {
  return Elenco.reduce((acc: number, item: any) => {
    return acc + Number(item.Movimento)
  }, 0)
})
</script>
<style lang="scss">
#SituazioneFideuram {
  th {
    padding: 0px !important;
  }
}
</style>
