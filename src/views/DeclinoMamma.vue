<template>
    <div class="relative top-[120px]">
        <h1 class="text-center text-[30px]">Situazione Mamma</h1>
        <Rtable :items="Items" :pinia="Pinia.DeclinoMamma()" />
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { computed } from 'vue'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
const Elenco = Pinia.DeclinoMamma().getElenco
import { Data_ggmmaaaa_aaaammgg } from '@/assets/helpers/MyMixin'

const Items = computed(() => {
    return Elenco.map((item) => {        
        return {
            Id:
            {
                Type: "string",
                Value: item.Id,
                Class: "text-left",
                VerificaEliminazione: true
            },
            Data:
            {
                Type: "date",
                Value: Data_ggmmaaaa_aaaammgg(item.Data),
                Class: "text-center ml-5",
                Valido: 'p'
            },
            OrariMedicine:
            {
                Type: "string",
                Value: item.OrariMedicine,
                Class: "text-center ml-5",
                Valido: 'p'
            },
            Pressione:
            {
                Type: "string",
                Value: item.Pressione,
                Class: "text-left ml-5",
                Valido: 'p'
            },
            Resoconto:
            {
                Type: "textarea",
                Value: item.Resoconto,
                Class: "text-center w-full",
                Valido: 'p'
            }
        }
    })
})
</script>