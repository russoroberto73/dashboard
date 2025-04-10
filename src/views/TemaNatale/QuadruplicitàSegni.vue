<template>
    <div class="relative top-[120px] left-[200px]">
        <h1 class="text-center text-[30px]">Quadruplicità</h1>
        <h2 class="text-center">Fonte:</h2>
        <div>            
            <Rtable :items="Items" :pinia="Pinia.TemaNataleQuadruplicitàSegni()" />
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

const Elenco = ref(Pinia.TemaNataleQuadruplicitàSegni().getElenco)

const Items = computed(() => {
    return Elenco.value.map((item) => {
        return {
            Id: 
            {
                Type: "text",
                Value: item.Id
            },
            IdStagione: 
            {
                Type: "select",
                Array: DatiComboStagioni(),
                Value: item.IdStagione
            },
            IdNatura: 
            {
                Type: "select",
                Array: DatiComboNatura(),
                Value: item.IdNatura
            },
            Significato:
            {
                Type: 'text',
                Value: item.Significato,
                Class: 'w-[800px]',
                Valido: 'p'
            },
        }
    })
})
const DatiComboStagioni = () => {
    const tmp = Pinia.TemaNataleStagioni().getElenco.sort((a, b) => {
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
const DatiComboNatura = () => {
    const tmp = Pinia.TemaNataleNatura().getElenco.sort((a, b) => {
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
    #TemaNataleStagiolni {
        th {
            font-weight: bold;
        }
    }
</style>