<template>
    <div class="relative top-[120px] left-[200px]">
        <h1 class="text-center text-[30px]">Governatori</h1>
        <div>            
            <Rtable :items="Items" :pinia="Pinia.TemaNataleGovernatoriSegni()" />
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

const Elenco = ref(Pinia.TemaNataleGovernatoriSegni().getElenco)

const Items = computed(() => {
    return Elenco.value.map((item) => {
        return {
            Id: 
            {
                Type: "text",
                Value: item.Id
            },            
            Pianeta:
            {
                Type: 'text',
                Value: item.Pianeta
            },
            Segno:
            {
                Type: 'text',
                Value: item.Segno
            },            
            Significato:
            {
                Type: 'textarea',
                Value: item.Significato,
                Class: 'w-full',
                Valido: 'p'
            }
        }
    })
})
</script>
<style lang="scss">
    
</style>