<template>
    <div class="relative top-[120px]">
        <h1 class="text-center text-[30px]">Handiphone</h1>
        <button v-for="(categoria, index) in ElencoCategorie" :key="index" @click="CategoriaId = categoria.Id">{{
            categoria.Nome }}</button>
        <br />
        <Rtable :items="Items" :pinia="Pinia.HandiphoneParoleFrasi()" />
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { ref, computed } from 'vue'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'

const CategoriaId: any = ref('')
const ElencoCategorie = Pinia.HandiphoneCategorie().getElenco
const Elenco = ref(Pinia.HandiphoneParoleFrasi().getElenco)
const Items = computed(() => {
    return Elenco.value.map((item: any) => {
        if (item.CategoriaId === CategoriaId.value) {
            return {
                Id: {
                    Type: 'string',
                    Value: item.Id
                },
                Posizione: {
                    Type: 'string',
                    Value: item.Posizione,
                    Valido: 'p'
                },
                Codice: {
                    Type: 'string',
                    Value: item.Codice,
                    Valido: 'p'
                },
                Frase: {
                    Type: 'textarea',
                    Value: item.Frase,
                    Class: "text-left w-full p-2",
                    Valido: 'p'
                },
                CategoriaId: {
                    Type: 'string',
                    Value: item.CategoriaId,
                    Visibile: 'hidden'
                }
            }
        }
    }).filter((item) => item != undefined)
})
</script>
<style lang="css" scoped>
button {
    @apply bg-yellow-500 p-5 m-5 rounded-[45px];
}
</style>