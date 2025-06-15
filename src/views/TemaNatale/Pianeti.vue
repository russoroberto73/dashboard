<template>
    <div class="relative top-[120px] left-[200px]">
        <h1 class="text-center text-[30px]">I pianeti</h1>
        <div>            
            {{Items}}
            <Rtable :items="Items" :pinia="Pinia.TemaNatalePianeti()" />
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

const Elenco = ref(Pinia.TemaNatalePianeti().getElenco)

const Items = computed(() => {
    return Elenco.value.map((item) => {
        return {
            Id: 
            {
                Type: "text",
                Value: item.Id
            },
            Nome: 
            {
                Type: "text",
                Value: item.Nome,
                Valido: 'p'
            },
            Tipologia:
            {
                Type: 'select',
                Array: DatiCombo(),
                Value: item.Tipologia
            },
            ParoleChiavi:
            {
                Type: 'text',
                Value: item.ParoleChiavi,
                Valido: 'p'
            },
            Significato:
            {
                Type: 'text',
                Value: item.Significato,
                Class: 'w-[400px]',
                Valido: 'p'
            }
        }
    })
})
const DatiCombo = () => {
    const tmp = Pinia.TemaNataleTipologiaPianeti().getElenco.sort((a, b) => {
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