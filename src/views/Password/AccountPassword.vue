<template>
    <div class="relative top-[120px]">
        <h1 class="text-center text-[30px]">Account password</h1>
        <div>
            <Rtable :items="Items" :pinia="Pinia.AccountPassword()" />
        </div>        
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import { ref, computed } from 'vue';

const Elenco = ref(Pinia.AccountPassword().getElenco)

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
            Utente: {
                Type: "text",
                Value: item.Utente,
                Valido: 'p'
            },
            Password: {
                Type: "text",
                Value: item.Password,
                Valido: 'p'
            },
            Varie: {
                Type: 'string',
                Value: item.Varie
            },
            IdGruppo: {
                Type: "select",
                Array: DatiCombo(),
                Value: item.IdGruppo,
                Valido: 'p'
            }
        }
    })
})


const DatiCombo = () => {
    const tmp = Pinia.GruppiPassword().getElenco.sort((a, b) => {
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
