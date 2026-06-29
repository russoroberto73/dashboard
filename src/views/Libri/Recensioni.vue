<template>
  <div>
    <h2 class="text-center text-[30px]">Recensioni Libri</h2>
    <Rtable :items="Items" :pinia="Pinia.Recensioni()" />
  </div>
</template>
<script lang="ts" setup>
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import { Pinia } from '@/stores/'
import { computed, ref } from 'vue'
const Elenco = ref(Pinia.Recensioni().getElenco)
const Items = computed(() => {
  return Elenco.value.map((item) => {
    return {
      Id: {
        Type: 'string',
        Value: item.Id,
        Class: 'text-left'
      },
      Firma: {
        Type: 'string',
        Value: item.Firma,
        Class: 'text-left'
      },
      Testo: {
        Type: 'string',
        Value: item.Testo,
        Class: 'text-left w-full'
      },
      Libro: {
        Type: 'select',
        Value: item.Libro,
        Class: 'text-left',
        Array: DatiCombo()
      }
    }
  })
})

const DatiCombo = () => {
  const tmp = Pinia.Libro().getElenco.sort((a, b) => {
      console.log(a.Titolo, b.Titolo);
        if (a.Titolo < b.Titolo) {
            return -1
        } else if (a.Titolo > b.Titolo) {
            return 1
        }
        return 0
    })
    return tmp.map((item) => {
        return {
            text: item.Titolo,
            value: item.Id
        }
    })
}
</script>
<style lang=""></style>
