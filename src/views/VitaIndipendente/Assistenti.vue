<template>
    <div class="relative top-[120px]">
        <h1 class="text-center text-[30px]">Gestione Assistenti</h1>
        <Rtable :items="Items" :pinia="Pinia.Assistenti()" :piniaverifica="Pinia.Buste()" />
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { computed } from 'vue'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
const Elenco = Pinia.Assistenti().getElenco
import { Data_ggmmaaaa_aaaammgg, DataOggiInglese } from '@/assets/helpers/MyMixin'

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
            Nome:
            {
                Type: "string",
                Value: item.Nome,
                Class: "text-left ml-5",
                Valido: 'p'
            },
            Cognome:
            {
                Type: "string",
                Value: item.Cognome,
                Class: "text-left ml-5",
                Valido: 'p'
            },
            Assunzione:
            {
                Type: "date",
                Value: Data_ggmmaaaa_aaaammgg(item.Assunzione),
                Class: "text-center",
                Valido: 'p'
            },
            Livello:
            {
                Type: "string",
                Value: item.Livello,
                Class: "text-center",
                Valido: 'p'
            },
            Licenziamento:
            {
                Type: "date",
                Value: item.Licenziamento === 'vuoto' || item.Licenziamento === '' ? DataOggiInglese() : Data_ggmmaaaa_aaaammgg(item.Licenziamento!),
                Class: "text-center",
                Visibile: item.Licenziamento === 'vuoto' || item.Licenziamento === '' ? 'hidden' : 'visible'
            }
        }
    })
})
</script>