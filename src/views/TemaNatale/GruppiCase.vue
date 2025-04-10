<template>
    <div class="relative top-[120px] left-[200px]">
        <h1>Gruppi case</h1>
        <div>            
            <Rtable :items="Items" :pinia="Pinia.TemaNataleGruppiCase()" />
        </div>
    </div>
</template>
<script setup lang="ts">

/**
 * gruppi   angolari azione, succedenti sicurezza, cadenti apprendimento
 * nome, parola_chiave, segno
 * 
 */


 import { Pinia } from '@/stores'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import { ref, computed } from 'vue';

const Elenco = ref(Pinia.TemaNataleGruppiCase().getElenco)

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
            ParolaChiave:
            {
                Type: 'text',
                Value: item.ParolaChiave,
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