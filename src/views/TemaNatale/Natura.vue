<template>
    <div class="relative top-[120px] left-[200px]">
        <h1 class="text-center text-[30px]">Natura</h1>
        <h2 class="text-center">Fonte:</h2>
        <div>            
            <Rtable :items="Items" :pinia="Pinia.TemaNataleNatura()" />
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

const Elenco = ref(Pinia.TemaNataleNatura().getElenco)

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
            Significato:
            {
                Type: 'text',
                Value: item.Significato,
                Class: 'w-[800px]',
                Valido: 'p'
            },
              Discorsivo:
            {
                Type: 'text',
                Value: item.Discorsivo,
                Class: 'w-[800px]',
                Valido: 'p'
            },
        }
    })
})
</script>
<style lang="scss">
    #TemaNataleStagiolni {
        th {
            font-weight: bold;
        }
    }
</style>