<template>
    <div>
        <div class="mb-[50px] flex m-auto grid grid-rows-2" :class="Items.length != 0 ? 'hidden' : ''">
            <textarea class="w-[90%] h-[150px] m-auto p-2" v-model="MovimentiExcel" />
            <button class="p-5 bg-Bottone  w-[300px] m-auto text-[24px] rounded-[45px]"
                @click="ConvertiJson()">Converti</button>
        </div>
        <div class="h-[300px] overflow-y-auto">
            <RTable :items="Items" :pinia="Pinia.Movimenti()" v-if="Items.length > 0" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
const MovimentiExcel = ref(`28/11/2024\t\t-116,5\tSEPA Direct Debit\tSERVIZIO ELETTRICO NAZIONALE Addebito SDD fattura a Vs carico da IT620010000009633951000 Mand O563610060447783 Per 011910381755832 DD8J002411082411313 0800AC41104VG90000010441\n
28/11/2024\t1850,6\t\tStipendio	Ord: FONDAZIONE LINKS LEADING INNOVATION KNOWLEDGE FOR SOCIETY Ben: RUSSO ROBERTO Dt-ord: 28/11/2024 Banca Ord: INTESA SANPAOLO SPA Info-Cli: RETRIBUZIONE 11 2024\tContabilizzato
`)
const ArrayMovimenti: any = ref([])
import { Data_ggmmaaaa_aaaammgg } from '@/assets/helpers/MyMixin'
import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import { Pinia } from '@/stores';

const ConvertiJson = () => {
    const Righe = MovimentiExcel.value.split("\n")
    Righe.forEach((item) => {
        const Campi: any = item.split("\t")
        if (item) {
            Campi[1] = Campi[1].length > 0 ? Campi[1].replace(',', '.') : '0'
            Campi[2] = Campi[1].length > 0 ? Campi[2].substring(1, Campi[2].length) : '0'
            Campi[2] = Campi[2].replace(',', '.')
            if (Campi[1].split('.')[1] && Campi[1].split('.')[1].length === 1) {
                Campi[1] = Campi[1]+ '0'
            }
            if (Campi[2].split('.')[1] && Campi[2].split('.')[1].length === 1) {
                Campi[2] = Campi[2]+ '0'
            }
        }
        if (Campi[0].length > 0) {
            ArrayMovimenti.value.push([Data_ggmmaaaa_aaaammgg(Campi[0]), Campi[1], Campi[2], Campi[3], Campi[4]])
        }
    })
    //console.log(ArrayMovimenti)    
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
                Value: item[0],
                ControllaIntervallo: 1,
                Valido: 'p'
            },
            Accrediti: {
                Type: 'number',
                Value: item[1] ? item[1]: '0',
                Controlla2Campi: '0'
            },
            Addebiti: {
                Type: 'number',
                Value: item[2] ? item[2]: '0',
                Controlla2Campi: '0'
            },
            Descrizione: {
                Type: 'string',
                Value: item[3],
                Valido: 'p'
            },
            DescrizioneEstesa: {
                Type: 'string',
                Value: item[4],
                Valido: 'p',
            },
            IdCategoria: {
                Type: 'select',
                Value: Pinia.Categorie().getCercaCategoria(item[4]),
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
