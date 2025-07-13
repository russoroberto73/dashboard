<template>
    <div class="relative top-[120px] left-[200px]">
        <h1 class="text-center text-[30px]">I segni zodiacali</h1>
        <button @click="Consultazione = !Consultazione" class="bg-Bottone p-2 rounded-[45px]">
            <div v-if="Consultazione">Modifica</div>
            <div v-else>Consultazione</div>
        </button>
        <div v-if="Consultazione">
            Segno:
            <select v-model="IdSegno">
                <option value="0">Scegli</option>
                <option v-for="(segno, index) in Pinia.TemaNataleSegni().getElenco" :key="index" :value="segno.Id">
                    {{ segno.Nome }}</option>
            </select><br />
            <span v-html="CaratteristicaSegno(IdSegno)" />
        </div>
        <div v-else>
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

const Consultazione = ref(true)
const IdSegno = ref('0')
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
                Valido: 'p',
                Class: 'w-[100px]'
            },
            Immagine: {
                Type: "text",
                Value: item.Immagine,
                Class: 'w-[100px]'
            },
            Periodo: {
                Type: "text",
                Value: item.Periodo,
                Valido: 'p',
                Class: 'w-[100px]'
            },
            Quadruplicità:
            {
                Type: "select",
                Array: DatiComboQuadruplicità(),
                Value: item.Quadruplicità,
            },
            Governatore:
            {
                Type: "select",
                Array: DatiComboGovernatore(),
                Value: item.Governatore,
            },
            Opposto:
            {
                Type: "select",
                Array: DatiComboOpposti(),
                Value: item.Opposto,
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
                Type: 'textarea',
                Value: item.Significato,
                Valido: 'p',
                Class: 'w-[200px]'
            },
            ParoleChiavi:
            {
                Type: "text",
                Value: item.ParoleChiavi,
                Valido: 'p',
                Class: 'w-[200px]'
            },
            Forza:
            {
                Type: "textarea",
                Value: item.Forza,
                Valido: 'p',
                Class: 'w-[200px]'
            },
            Debolezza:
            {
                Type: "textarea",
                Value: item.Debolezza,
                Valido: 'p',
                Class: 'w-[200px]'
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
        if (a.Pianeta < b.Pianeta) {
            return -1
        } else if (a.Pianeta > b.Pianeta) {
            return 1
        }
        return 0
    })
    return tmp.map((item) => {
        return {
            text: item.Pianeta + ' ( per ' + item.Segno + ')',
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
        const Natura = Pinia.TemaNataleNatura().getElenco.find((itemn) => item.IdNatura === itemn.Id)?.Nome
        return {
            text: Stagione + ' ' + Natura,
            value: item.Id
        }
    })
}

const CaratteristicaSegno = computed(() => {
    return (IdSegno: string) => {
        const DatiSegni = Pinia.TemaNataleSegni().getElenco.find((item) => item.Id === IdSegno)    
        if (DatiSegni) {
            const Polarità = Pinia.TemaNatalePolaritàSegni().getElenco.find((item) => item.Id === DatiSegni.Polarità)
            const Elemento = Pinia.TemaNataleElementi().getElenco.find((item) => item.Id === DatiSegni.Elemento)
            const Governatore = Pinia.TemaNataleGovernatoriSegni().getElenco.find((item) => item.Id === DatiSegni.Governatore)
            const Opposto =    Pinia.TemaNataleOppostoSegni().getElenco.find((item) => item.Id === DatiSegni.Opposto)
            const Quadruplicità = Pinia.TemaNataleQuadruplicitàSegni().getElenco.find((item) => item.Id === DatiSegni.Quadruplicità)
            const Stagione = Pinia.TemaNataleStagioni().getElenco.find((itemst) => Quadruplicità?.IdStagione === itemst.Id)?.Nome
            const Natura = Pinia.TemaNataleNatura().getElenco.find((itemn) => Quadruplicità?.IdNatura === itemn.Id)?.Nome
            return '<table class="border border-[1px] border-blue-900"><tr><td colspan=2 class="border border-[1px] border-blue-900">'+DatiSegni?.Nome + ' (' + DatiSegni.Periodo + ')</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Polarità:</td><td class="border border-[1px] border-blue-900 text-left">' + Polarità?.Nome + '<br />' + Polarità?.Significato + '</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Quadruplicità:</td><td class="border border-[1px] border-blue-900 text-left">' + Natura +' ' + Stagione + '<br />' + Quadruplicità?.Significato + '</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Elemento:</td><td class="border border-[1px] border-blue-900 text-left">' + Elemento?.Nome + '<br />' + Elemento?.Significato + '</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Governatore:</td><td class="border border-[1px] border-blue-900 text-left">' + Governatore?.Pianeta + '<br />' + Governatore?.Significato + '</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Parole chiavi:</td><td class="border border-[1px] border-blue-900 text-left">' + DatiSegni.ParoleChiavi + '</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Significato:</td><td class="border border-[1px] border-blue-900 text-left">' + DatiSegni.Significato + '</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Opposto:</td><td class="border border-[1px] border-blue-900 text-left">' + Opposto?.Opposto + '<br />' + Opposto?.Significato + '</td></tr>' +
                '<tr><td colspan=2 class="border border-[1px] border-blue-900 text-left">Punti di forza:</td></tr><td></td><td class="border border-[1px] border-blue-900 text-left">' + DatiSegni?.Forza + '</td></tr>' +
                '<tr><td colspan=2 class="border border-[1px] border-blue-900  text-left">Punti di debolezza:</td></tr><tr><td></td><td class="border border-[1px] border-blue-900 text-left">' + DatiSegni?.Debolezza +
                '</td></tr></table>'
        } else {
            return ''
        }
    }
})
</script>
