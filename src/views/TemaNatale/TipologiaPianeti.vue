<template>
    <div class="relative top-[120px] left-[200px]">
        <h1 class="text-center text-[30px]">Tipologia pianeti</h1>
        <div>            
            <Rtable :items="Items" :pinia="Pinia.TemaNataleTipologiaPianeti()" />
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

const Elenco = ref(Pinia.TemaNataleTipologiaPianeti().getElenco)

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
                Valido: 'p'
            }
        }
    })
})
</script>
<style lang="scss">
    
</style>