<template>
    <div class="relative top-[120px] left-[200px]">        
        <h1 class="text-center text-[30px]">Polarità segni zodiacali</h1>
        <h2 class="text-center">Fonte: <a href="https://www.astroval.it/polarita.html">https://www.astroval.it/polarita.html</a></h2>
        <br />
        <h3 class="text-center font-bold">Binario o della duplicità [Polarità]</h3>
        <br />
        <p class="w-[600px] m-auto text-justify">
        Il numero di pianeti presenti in segni maschili o femminili è una guida molto utile per le prime deduzioni, le quali però dovranno essere confermate o meno dalle altre risultanze.
        La polarità sottolinea la forte connessione che unisce fra loro i segni opposti perchè le caratteristiche dell'uno si riflettono in modo contrario nel segno opposto.</p>
        <br />
        <div>
            <Rtable :items="Items" :pinia="Pinia.TemaNatalePolaritàSegni()" />
        </div>
    </div>
</template>
<script setup lang="ts">

/**
 * case
 * sigla, gruppo, segno, Significato
 * I, IV, VII, X ANG
 * 2, 5, 8, 11 SUC
 * 3, 6., 9, 12 CADENTI
 */


 import { Pinia } from '@/stores'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import { ref, computed } from 'vue';

const Elenco = ref(Pinia.TemaNatalePolaritàSegni().getElenco)

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
                Class: 'w-[400px]',
                Valido: 'p'
            },
            Significato:
            {
                Type: 'text',
                Value: item.Significato,
                Class: 'w-[500px]',
                Valido: 'p'
            },
            Discorsivo: {                
                Type: 'text',
                Value: item.Discorsivo,
                Class: 'w-[500px]',
                Valido: 'p'
            }
        }
    })
})
</script>
<style lang="scss">
        #TemaNataleClassificazioneTemi {
        th {
            font-weight: bold;
        }
    }
</style>