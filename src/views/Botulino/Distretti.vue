<template>
    <div class="relative top-[120px] left-[200px]">
    <h1>Distretti Muscoli</h1>
    <div>
        <Rtable :items="Items" :pinia="Pinia.BotulinoDistretti()" />
    </div>
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import { ref, computed } from 'vue';

const Elenco = ref(Pinia.BotulinoDistretti().getElenco)
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
            Descrizione:
            {
                Type: 'text',             
                Value: item.Descrizione,
                Valido: 'p'
            }
        }
    })
})
</script>
<style lang="">
    
</style>