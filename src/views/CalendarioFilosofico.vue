<template>
    <div class="relative top-[120px]">
        <h1 class="text-center text-[30px]">Calendario filosofico</h1>
        <div>
            <Rtable :items="Items" :pinia="Pinia.CalendarioFilosofico()" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores/'
import Rtable from '@/components/ComponenteTabella/CostrisciTabella.vue'
import { computed } from 'vue';
import { Data_ggmmaaaa_aaaammgg } from '@/assets/helpers/MyMixin'

const Elenco = Pinia.CalendarioFilosofico().getElenco

const Items = computed(() => {
    return Elenco.map((item) => {
        return {
            Id:
            {
                Type: "string",
                Value: item.Id,
                Class: "text-left",
                Visibile: false
            },
            Data:
            {
                Type: "date",
                Value: Data_ggmmaaaa_aaaammgg(item.Data),
                Class: "text-center",
                Valido: 'p'
            },
            Frase:
            {
                Type: "textarea",
                Value: item.Frase,
                Class: "text-left w-full",
                Valido: 'p'
            },
            Firma:
            {
                Type: "text",
                Value: item.Firma,
                Class: "text-center",
            }            
        }
    })
})
</script>
