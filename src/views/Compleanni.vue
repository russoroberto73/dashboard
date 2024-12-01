<template>
    <div>
        <h1 class="text-center text-[30px]">Compleanni</h1>
        <table class="text-center m-auto w-[400px]">
            <tr>
                <th>Nome</th>
                <th>Cognome</th>
                <th>Data di nascita</th>
            </tr>
            <template v-for="(Compleanno, index) in Compleanni">
                <tr :class="Compleanno.Test ? 'giornocompleanno' : ''">
                    <td>
                        {{ Compleanno.Nome }}
                    </td>
                    <td>
                        {{ Compleanno.Cognome }}
                    </td>
                    <td>
                        {{ Compleanno.Giorno }} {{ MeseDaNumeroANome(Compleanno.Mese) }} {{ Compleanno.Anno }}
                    </td>
                </tr>
            </template>
        </table>
    </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { Pinia } from '@/stores/index'
import { MeseDaNumeroANome } from '@/assets/helpers/MyMixin';

const FirebaseCompleanni = Pinia.Compleanni()
const Compleanni = computed(() => {
    return FirebaseCompleanni.getElenco('tutti')
})
</script>
<style lang="scss" scoped>
</style>