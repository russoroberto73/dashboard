<template>
    <div>
        <h1 class="text-center text-[30px]">Gestione Assistenti Nero</h1>
        <Rtable :items="Items" :pinia="Pinia.AssistentiNero()" />
    </div>
</template>
<script setup lang="ts">
    import { Pinia } from '@/stores'
    import { computed } from 'vue'
    import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
    const Elenco = Pinia.AssistentiNero().getElenco

const Items = computed(() => {
    return Elenco.map((item) => {
        return {
            Id:
            {
                Type: "string",
                Value: item.Id,
                Class: "text-left"
            },
            Nome:
            {
                Type: "string",
                Value: item.Nome,
                Class: "text-left ml-5",
                Valido: 'p'
            },
            IdCategoriaBanca:
            {
                Type: "select",
                Value: item.IdCategoriaBanca,
                Class: "text-center",
                Array: DatiCombo()
            },
            Colore:
            {
                Type: "color",
                Value: item.Colore,
                Class: "text-center"
             }
        }
    })
})

const DatiCombo = () => {
    const tmp = Pinia.Categorie().getElenco.sort((a, b) => {
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