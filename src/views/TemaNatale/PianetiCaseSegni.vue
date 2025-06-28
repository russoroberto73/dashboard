<template>
    <div class="relative top-[120px] left-[200px]">
        <h1 class="text-center text-[30px]">Pianeti case segni</h1>
        <div>            
            <Rtable :items="Items" :pinia="Pinia.TemaNatalePianetiCaseSegni()" />
        </div>
    </div>
</template>
<script setup lang="ts">

/**
 * case
 * sigla, gruppo, segno, Significato
 * I, IV, VII, X ANG
 * 2, 5, 8, 11 SUC
 * 3, 6., 9, 12 CADENTI
 */


 import { Pinia } from '@/stores'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import { ref, computed } from 'vue';

const Elenco = ref(Pinia.TemaNatalePianetiCaseSegni().getElenco)

const Items = computed(() => {
    return Elenco.value.map((item) => {
        return {
            Id: 
            {
                Type: "text",
                Value: item.Id
            },
            IdPianeta: 
            {
                Type: "select",
                Array: DatiComboPianeti(),
                Value: item.IdPianeta                
            },
            IdSegnoPianeta:
            {
                Type: 'select',
                Array: DatiComboSegni(),
                Value: item.IdSegnoPianeta
            },
            Retrogrado:
            {
                Type: 'boolean',
                Value: item.Retrogrado
            },
            Casa:
            {
                Type: 'select',
                Array: DatiComboCase(),
                Value: item.Casa
            },
            IdSegnoCasa:
            {
                Type: 'select',
                Array: DatiComboSegni(),
                Value: item.IdSegnoCasa
            },
            Significato:
            {
                Type: 'text',
                Value: item.Significato,
                Valido: 'p',
                Class: 'w-[400px]'
            },
            ParoleChiavi:
            {
                Type: 'text',
                Value: item.ParoleChiavi,
                Valido: 'p',
                Class: 'w-[400px]'
            }
        }
    })
})
const DatiComboPianeti = () => {
    const tmp = Pinia.TemaNatalePianeti().getElenco.sort((a, b) => {
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

const DatiComboCase = () => {
    const tmp = Pinia.TemaNataleCase().getElenco
    return tmp.map((item) => {
        return {
            text: item.Sigla,
            value: item.Id
        }
    })
}
const DatiComboSegni = () => {
    const tmp = Pinia.TemaNataleSegni().getElenco.sort((a, b) => {
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
<style lang="scss">
    
</style>