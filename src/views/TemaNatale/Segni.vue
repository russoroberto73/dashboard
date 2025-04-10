<template>
    <div class="relative top-[120px] left-[200px]">
        <h1>I segni zodiacali</h1>
        <div>            
            <Rtable :items="Items" :pinia="Pinia.TemaNataleSegni()" />
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

const Elenco = ref(Pinia.TemaNataleSegni().getElenco)

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
            Quadruplicità: 
            {
                Type: "select",
                Array: DatiComboQuadruplicità(),
                Value: item.Quadruplicità,
                Valido: 'p'
            },            
            Governatore: 
            {
                Type: "select",
                Array: DatiComboGovernatore(),
                Value: item.Governatore,
                Valido: 'p'
            },
            Opposto: 
            {
                Type: "text",
                Value: item.Opposto,
                Valido: 'p'
            },
            Elemento: {
                Type: 'select',
                Array: DatiComboElementi(), 
                Value: item.Elemento,
            },
            Polarità:
            {
                Type: 'select',
                Array: DatiComboClassificazione(),
                Value: item.Polarità,
            },
            Significato:
            {
                Type: 'text',
                Value: item.Significato,
                Valido: 'p',
                Class: 'w-[500px]'
            },
            ParoleChiavi: 
            {
                Type: "text",
                Value: item.ParoleChiavi,
                Valido: 'p',
                Class: 'w-[500px]'
            }
        }
    })
})


const DatiComboOpposti = () => {
    const tmp = Pinia.TemaNataleOppostoSegni().getElenco.sort((a, b) => {
        if (a.Opposto < b.Opposto) {
            return -1
        } else if (a.Opposto > b.Opposto) {
            return 1
        }
        return 0
    })
    return tmp.map((item) => {
        return {
            text: item.Opposto,
            value: item.Id
        }
    })
}

const DatiComboElementi = () => {
    const tmp = Pinia.TemaNataleElementi().getElenco.sort((a, b) => {
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
const DatiComboClassificazione = () => {
    const tmp = Pinia.TemaNatalePolaritàSegni().getElenco.sort((a, b) => {
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
const DatiComboGovernatore = () => {
    const tmp = Pinia.TemaNataleGovernatoriSegni().getElenco.sort((a, b) => {
        if (a.Segno < b.Segno) {
            return -1
        } else if (a.Segno > b.Segno) {
            return 1
        }
        return 0
    })
    return tmp.map((item) => {
        return {
            text: item.Segno,
            value: item.Id
        }
    })
}
const DatiComboQuadruplicità = () => {
    const tmp = Pinia.TemaNataleQuadruplicitàSegni().getElenco/*.sort((a, b) => {
        if (a.Nome < b.Nome) {
            return -1
        } else if (a.Nome > b.Nome) {
            return 1
        }
        return 0
    })*/
    return tmp.map((item) => {
        const Stagione = Pinia.TemaNataleStagioni().getElenco.find((itemst) => item.IdStagione === itemst.Id)?.Nome
        const Natura = Pinia.TemaNataleNatura().getElenco.find((itemn) =>item.IdNatura === itemn.Id)?.Nome
        return {
            text: Stagione + ' ' + Natura,
            value: item.Id
        }
    })
}

</script>
<style lang="scss">
    
</style>