<template>
  <div class="relative top-[120px]">
    <h2 class="text-center text-[30px]">Libri</h2>
    <div class="text-center text-[20px] mb-5">
      {{ LibriAcquistati.Numero }} libri acquistati a {{ LibriAcquistati.Costo }}€ in
      {{ LibriAcquistati.Data }}
    </div>
    <div>
      <Rtable :items="Items" :pinia="Pinia.Libri()" />
    </div>
    <div class="text-center text-[20px] mb-5" @click="Silvia = !Silvia">
      {{ LibriVenduti.Numero }} libri venduti a {{ LibriVenduti.Incasso }}€ quindi rimngono
      {{ LibriAcquistati.Numero - LibriVenduti.Numero }} libri a casa<br />      
    </div>
    <span v-if="Silvia" class="block text-center text-[20px] mb-5">
        <div>A Silvia spetta {{ (LibriVenduti.Incasso * 0.2).toFixed(2) }}€</div>
        <div class="z-10 relative">
          <Rtable :items="ElencoProvvigioniSilvia" :pinia="Pinia.ProvvigioniLibroSilvia()" />
        </div>
      </span>
  </div>
</template>
<script lang="ts" setup>
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import { Pinia } from '@/stores/'
import { computed, ref } from 'vue'
import { Data_ggmmaaaa_aaaammgg } from '@/assets/helpers/MyMixin'
const LibriAcquistati = {
  Numero: 50,
  Data: '19 maggio 2026',
  Costo: 136.2
}
const Elenco = ref(Pinia.Libri().getElenco)
const ProvvigioniLibroSilvia = ref(Pinia.ProvvigioniLibroSilvia().getElenco)

const LibriVenduti = computed(() => {
  return {
    Numero: Pinia.Libri().getElenco.reduce((acc, item) => acc + Number(item.NumLibri), 0),
    Incasso: Pinia.Libri().getElenco.reduce((acc, item) => acc + Number(item.Incasso), 0)
  }
})
const Silvia = ref(false)
const Items = computed(() => {
  return Elenco.value.map((item) => {
    return {
      Id: {
        Type: 'string',
        Value: item.Id,
        Class: 'text-left'
      },
      Aquirente: {
        Type: 'string',
        Value: item.Aquirente,
        Class: 'text-left'
      },
      Data: {
        Type: 'date',
        Value: Data_ggmmaaaa_aaaammgg(item.Data),
        Class: 'text-center',
        Valido: 'p'
      },
      NumLibri: {
        Type: 'number',
        Value: item.NumLibri,
        Class: 'text-center',
        Intero: true,
        Valido: 'p'
      },
      Incasso: {
        Type: 'number',
        Value: item.Incasso,
        Class: 'text-center',
        Valido: 'p'
      },
      MetodoPagamento: {
        Type: 'select',
        Value: item.MetodoPagamento,
        Class: 'text-center',
        Valido: 'p',
        Array: DatiCombo()
      }
    }
  })
})
const ElencoProvvigioniSilvia = computed(() => {
  return ProvvigioniLibroSilvia.value.map((item) => {
    return {
      Id: {
        Type: 'string',
        Value: item.Id,
        Class: 'text-left'
      },
      Data: {
        Type: 'date',
        Value: Data_ggmmaaaa_aaaammgg(item.Data),
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

const DatiCombo = () => {
  return [
    {
      text: 'Contanti',
      value: 'Contanti'
    },
    {
      text: 'Satispay',
      value: 'Satispay'
    }
  ]
}
</script>
