<template>
    <div class="relative top-[120px] left-[200px]">
    <h1>Distretti Muscoli</h1>
    <div>
        <Rtable :items="Items" :pinia="Pinia.BotulinoQtyDate()" />
    </div>
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import { ref, computed } from 'vue';

const Elenco = ref(Pinia.BotulinoQtyDate().getElenco)
const Items = computed(() => {
    return Elenco.value.map((item) => {
        return {
            Id: 
            {
                Type: "text",
                Value: item.Id
            },            
            Data: 
            {
                Type: "date",
                Value: item.Data,
                Valido: 'p'
            },
            IdMuscolo: 
            {
                Type: "select",
                Array: DatiCombo(),
                Value: item.IdMuscolo,
                Valido: 'p'
            },
            Qty:
            {
                Type: 'text',             
                Value: item.Qty,
                Valido: 'p'
            },
            Parte:
            {
                Type: 'text',             
                Value: item.Parte,
                Valido: 'p'
            }
        }
    })
})
const DatiCombo = () => {
    const tmp = Pinia.BotulinoMuscoli().getElenco.sort((a, b) => {
        if (a.Sigla < b.Sigla) {
            return -1
        } else if (a.Sigla > b.Sigla) {
            return 1
        }
        return 0
    })
    return tmp.map((item) => {
        return {
            text: item.Sigla,
            value: item.Id
        }
    })
}

</script>