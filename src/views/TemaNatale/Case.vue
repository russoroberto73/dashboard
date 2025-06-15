<template>
    <div class="relative top-[120px] left-[200px]">
        <h1 class="text-center text-[30px]">Le case</h1>
        <div>            
            <Rtable :items="Items" :pinia="Pinia.TemaNataleCase()" />
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

const Elenco = ref(Pinia.TemaNataleCase().getElenco)

const Items = computed(() => {
    return Elenco.value.map((item) => {
        return {
            Id: 
            {
                Type: "text",
                Value: item.Id
            },
            Sigla: 
            {
                Type: "text",
                Value: item.Sigla,
                Valido: 'p'
            },
            Elemento:
            {
                Type: 'select',
                Array: DatiComboElementi(),
                Value: item.Elemento,
                Valido: 'p'
            },
            Segno:
            {
                Type: 'select',
                Array: DatiComboSegni(),
                Value: item.Segno
            },
            Significato:
            {
                Type: 'text',
                Value: item.Significato,
                Valido: 'p'
            }
        }
    })
})
const DatiComboElementi = () => {
    const tmp = Pinia.TemaNataleElementi().getElenco.sort((a, b) => {
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