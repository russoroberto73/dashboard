<template>
    <div class="mb-[50px] flex m-auto grid grid-rows-2">
        <textarea class="w-[90%] h-[150px] m-auto p-2" v-model="MovimentiExcel" />
        <button class="p-5 bg-Bottone  w-[300px] m-auto text-[24px] rounded-[45px]"
            @click="ConvertiJson()">Converti</button>
        <RTable :items="Items" :pinia="Pinia.Movimenti()" />
{{DatiCombo()}}
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
const MovimentiExcel = ref('')
const ArrayMovimenti: any = ref([])
import { Round, Data_ggmmaaaa_aaaammgg } from '@/assets/helpers/MyMixin'
import RTable from '@/components/ComponenteTabella/CostrisciTabella.vue'
import { Pinia } from '@/stores';

const ConvertiJson = () => {
    const Righe = MovimentiExcel.value.split("\n")
    Righe.forEach((item) => {
        const Campi: any = item.split("\t")
        if (item) {
            Campi[1] = Round(Campi[1].replace(',','.'), 2)
            Campi[2] = Campi[2].substring(1, Campi[2].length)
            Campi[2] = Round(Campi[2].replace(',','.'), 2)
        }
        if (Campi[0].length > 0) {
            ArrayMovimenti.value.push([Data_ggmmaaaa_aaaammgg(Campi[0]), Campi[1], Campi[2], Campi[3], Campi[4]])
        }
    })
}
const Items = computed(() => {   
    return ArrayMovimenti.value.map((item: any) => {
        return {
            Id: {
                Type: 'string',
                Value: 'soloinserimento'
            },
            Data: {
                Type: 'date',
                Value: item[0]
            },
            Accrediti: {
                Type: 'string',
                Value: item[1]
            },
            Addebiti: {
                Type: 'string',
                Value: item[2]
            },
            Descrizione: {
                Type: 'string',
                Value: item[3]
            },
            DescrizioneEstesa: {
                Type: 'string',
                Value: item[4]
            },
            IdCategoria: {
                Type: 'select',
                Value: '',
                Array: DatiCombo(),
                Class: 'text-left',
                Valido: 'p',
                ForzaModifica: 'p'
            }
        }
    })
})
const DatiCombo = () => {
    const tmp = Pinia.Categorie().getElenco.sort((a, b) => {
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
