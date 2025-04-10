<template>
    <div class="relative top-[120px]">
        <h1 class="text-center text-[30px]">Gruppi password</h1>
        <div>
            <Rtable :items="Items" :pinia="Pinia.GruppiPassword()" :piniaverifica="Pinia.AccountPassword()" />
        </div>        
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import { ref, computed } from 'vue';

const Elenco = ref(Pinia.GruppiPassword().getElenco)

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
            }
        }
    })
})
</script>
