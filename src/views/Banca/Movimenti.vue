<template>
    <div class="relative top-[120px] p-5">
        Parti da: <input type="date" v-model="DataPartenza" />
        <h1 class="text-center text-[30px]">Movimenti</h1>
        <div class="hidde">
            <RTable :items="Items" :pinia="Pinia.Movimenti()" />
        </div>
        <AggiungiMovimentiDaExcel class="mt-5" />
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Pinia } from '@/stores'
import { computed, onMounted } from 'vue'
import { Data_ggmmaaaa_aaaammgg } from '@/assets/helpers/MyMixin'
import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'

import AggiungiMovimentiDaExcel from '@/components/Banca/AggiungiMovimentiDaExcel.vue'

const DataPartenza = ref('2024-12-27')
const Elenco = ref(Pinia.Movimenti().getElenco)

const Items = computed(() => {       
    return Elenco.value.map((item) => {
        //console.log(new Date(Data_ggmmaaaa_aaaammgg(item.Data)).getTime())        
        if ((new Date(Data_ggmmaaaa_aaaammgg(item.Data)).getTime()) > new Date(DataPartenza.value).getTime()) 
        return {
            Id: {
                Type: 'string',
                Value: item.Id,
                Class: 'text-center',
            },
            Data: {
                Type: 'date',
                Value: Data_ggmmaaaa_aaaammgg(item.Data),
                Class: 'text-center',
                Valido: 'p'
            },
            Accrediti: {
                Type: 'number',
                Value: item.Accrediti,
                Class: 'text-center',
                Controlla2Campi: '0'
            },
            Addebiti: {
                Type: 'number',
                Value: item.Addebiti,
                Class: 'text-center',
                Controlla2Campi: '0'
            },
            Descrizione: {
                Type: 'string',
                Value: item.Descrizione,
                Class: 'text-left',
                Valido: 'p'
            },
            DescrizioneEstesa: {
                Type: 'string',
                Value: item.DescrizioneEstesa,
                Class: 'text-left w-full',
                Valido: 'p'
            },
            IdCategoria: {
                Type: 'select',
                Value: item.IdCategoria,
                Array: DatiCombo(),
                Class: 'text-left',
                Valido: 'p'
            }
        }
    }). filter((item) => item != undefined)
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

onMounted(() => {
    setTimeout(() => {
        Elenco.value = Pinia.Movimenti().getElenco
    }, 600)
})
</script>