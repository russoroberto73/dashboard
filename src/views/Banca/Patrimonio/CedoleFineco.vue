<template>
  <div class="relative top-[120px] m-auto">
    <h1 class="text-center text-[30px]">Cedole fineco</h1>
    <div v-for="anno in Anni" :key="anno">
      <table>
        <tr>
          <td rowspan="2"></td>
          <td colspan="12" class="!bg-green-600">{{ anno }}</td>
        </tr>
        <tr>
          <td v-for="(mese, index) in Mesi" :key="index" class="!bg-yellow-300">{{ mese }}</td>
        </tr>
        <tr v-for="(titolo, index) in Titoli" :key="index">
          <td :class="titolo.ColoreSfondo">{{ titolo.Descrizione }}</td>
          <td
            v-for="(mese, index) in Mesi"
            :key="index"
            :class="importotitoli(anno, index + 1, titolo.Sic)[0]?.ColoreSfondo"
          >
            {{ formatEuro(importotitoli(anno, index + 1, titolo.Sic)[0]?.Accrediti) }}
          </td>
        </tr>
        <tr>
          <td rowspan="2"></td>
          <td v-for="(mese, index) in Mesi" :key="index">
            {{formatEuro(
              Number(
                TotaliAnnualiDivisiPerMese.find((item) => item.Anno === Number(anno))?.Mesi[
                  index
                ] ?? 0
              ))
            }}
          </td>
        </tr>
        <tr>
          <td colspan="12" class="!bg-yellow-300">
            {{formatEuro(Number(
              (
                TotaliAnnualiDivisiPerMese.find((item) => item.Anno === Number(anno))?.Mesi.reduce(
                  (somma, mese) => somma + mese,
                  0
                ) ?? 0
              )))
            }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { Pinia } from '@/stores'
import { formatEuro } from '@/assets/helpers/MyMixin'

const Anni = Array.from({ length: new Date().getFullYear() + 1 - 2025 + 1 }, (_, i) => 2025 + i)
const Mesi = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre'
]
const Titoli = [
  {
    Sic: 'IE000XZ4USS4',
    Descrizione:
      'Smart Global Defence Callable after 7Y Fineco AM Fund acquistato 10/6/25 max 2037   5%x3a 3% 4asucc',
    ColoreSfondo: '!bg-orange-300'
  },
  {
    Sic: 'IE000HO72KL1',
    Descrizione:
      'Smart Global Defence Callable after 7Y Fineco AM Fund I acquistato 18/7/25  MAX 2037 5%x3a 3% 4asucc',
    ColoreSfondo: '!bg-blue-300'
  },
  {
    Sic: 'LU1731833643',
    Descrizione:
      'Fidelity Funds - Global Short Duration Income acquistato 7/4/25 no scadenza no garanzia',
    ColoreSfondo: '!bg-green-400'
  },
  {
    Sic: 'IE000DCQQZU5',
    Descrizione: 'Smart Global Defence Callable after 4Y acquistato 7/4/25 max 2034 4%X4a poi 2,3%',
    ColoreSfondo: '!bg-green-200'
  }
]
const importotitoli = computed(() => {
  return (anno: number, mese: number, Sic: string) => {
    return Titoli.flatMap((element) =>
      Pinia.Movimenti()
        .getElenco.filter(
          (item) =>
            item.DescrizioneEstesa?.includes(element.Sic) &&
            item.DescrizioneEstesa.includes('Dividendo')
        )
        .map((item) => ({
          Sic: element.Sic,
          Data: item.Data,
          Anno: item.Data.substring(6, 10),
          Mese: item.Data.substring(3, 5),
          Accrediti: item.Accrediti,
          ColoreSfondo: element.ColoreSfondo
        }))
    ).filter((item) => {
      if (Number(item.Anno) !== anno) return false
      if (Number(item.Mese) !== mese) return false
      if (item.Sic !== Sic) return false

      return true
    })
  }
})

const TotaliAnnualiDivisiPerMese = computed(() => {
  return Anni.map((anno) => ({
    Anno: anno,
    Mesi: Mesi.map((_, index) =>
      Titoli.reduce((totale, titolo) => {
        const Accrediti = importotitoli.value(anno, index + 1, titolo.Sic)

        return totale + Accrediti.reduce((somma, item) => somma + Number(item.Accrediti || 0), 0)
      }, 0)
    )
  }))
})
</script>
<style lang="scss" scoped>
table {
  @apply m-auto my-5;
}
table,
td {
  @apply bg-white border border-black p-1 !text-black;
}
</style>
