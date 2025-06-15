<template>
    <div class="relative top-[120px] left-[200px] w-[2000px]">
        <h1 class="text-center text-[30px]">Lettura tema natale</h1>
        Nome: <input v-model="Nome" /> Data di nascita: <input v-model="DataNascita" type="date" /> Luogo di nascita:
        <input v-model="LuogoNascita" />
        <div v-for="(item, index) in Elenco">
            {{ item.Nome }} in:
            <select v-model="IdSegno[item.Nome]">
                <option value="0">Scegli</option>
                <option v-for="(segno, index) in Pinia.TemaNataleSegni().getElenco" :key="index" :value="segno.Id">
                    {{ segno.Nome }}
                </option>
            </select><br />
        </div>
        <div v-if="IdSegno.Sole !== '0'" class="text-center">
            <span v-html="TrovaSegno('Sole', IdSegno.Sole)" />
        </div>
        <div v-if="IdSegno.Luna !== '0'" class="text-center">
            Luna<br />
            <span v-html="TrovaSegno('Luna', IdSegno.Luna)" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { ref, computed } from 'vue';
const Nome = ref('')
const DataNascita = ref('')
const LuogoNascita = ref('')
const Elenco = ref(Pinia.TemaNatalePianeti().getElenco)
const IdSegno: any = ref({
    Sole: '0',
    Luna: '0',
    Mercurio: '0',
    Venere: '0',
    Marte: '0',
    Giove: '0',
    Saturno: '0',
    Urano: '0',
    Nettuno: '0',
    Plutone: '0'
})

const TrovaSegno = (NomePianeta: string, IdSegno: string) => {
    const DatiSegni = Pinia.TemaNataleSegni().getElenco.find((item) => item.Id === IdSegno)
    let Spiegazione = ''
    if (DatiSegni) {
        const NomeSegno = DatiSegni.Nome
        const Pianeta: any = Pinia.TemaNatalePianeti().getElenco.find((item) => item.Nome === NomePianeta)
        const SegniPianeta: any = Pianeta?.Segno
        if (SegniPianeta) {
            if (NomePianeta === 'Sole') {
            const Polarità = Pinia.TemaNatalePolaritàSegni().getElenco.find((item) => item.Id === DatiSegni.Polarità)
            const Elemento = Pinia.TemaNataleElementi().getElenco.find((item) => item.Id === DatiSegni.Elemento)
            const Governatore = Pinia.TemaNataleGovernatoriSegni().getElenco.find((item) => item.Id === DatiSegni.Governatore && item.Segno === NomeSegno)
            const Opposto = Pinia.TemaNataleOppostoSegni().getElenco.find((item) => item.Id === DatiSegni.Opposto)
            const Quadruplicità = Pinia.TemaNataleQuadruplicitàSegni().getElenco.find((item) => item.Id === DatiSegni.Quadruplicità)
            const Stagione = Pinia.TemaNataleStagioni().getElenco.find((itemst) => Quadruplicità?.IdStagione === itemst.Id)
            const Natura = Pinia.TemaNataleNatura().getElenco.find((itemn) => Quadruplicità?.IdNatura === itemn.Id)
            Spiegazione = '<div class="text-left bg-white w-[1200px] m-auto">' +
            'Tema natale di ' + Nome.value + ' (' + DataNascita.value + ', ' + LuogoNascita.value + ')<br />' +
            '<b>' + DatiSegni.Nome + '</b>' +
            '<br />' + Polarità?.Significato +
            '<br />' + 'Stagione: ' + Stagione?.Nome + ' - ' + Stagione?.Significato +
            '<br />' + 'Natura: ' + Natura?.Nome + ' - ' + Natura?.Significato +
            '<br />' + Quadruplicità?.Significato +
            '<br />' + Elemento?.Significato +
            '<br />' + Governatore?.Significato +
            '<br />' + 'Le tue parole chiavi sono ' + DatiSegni.ParoleChiavi +
            '<br />' + Opposto?.Significato +
            '<br />' + DatiSegni.Significato +
            '<br /><br />' + '<b>I tuoi punti di forza sono</b>:<br /><div class="ml-5">' + DatiSegni.Forza + '</div>' +
            '<br />' + '<b>I tuoi punti di debolezza sono</b>:<br /><div class="ml-5">' + DatiSegni.Debolezza + '</div>'
            /*Spiegazione += '<table class="border border-[1px] border-blue-900 mt-5"><tr><td colspan=2 class="border border-[1px] border-blue-900">' + DatiSegni?.Nome + ' (' + DatiSegni.Periodo + ')</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Polarità:</td><td class="border border-[1px] border-blue-900 text-left">' + Polarità?.Nome + '<br />' + Polarità?.Significato + '</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Quadruplicità:</td><td class="border border-[1px] border-blue-900 text-left">' + Natura + ' ' + Stagione + '<br />' + Quadruplicità?.Significato + '</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Elemento:</td><td class="border border-[1px] border-blue-900 text-left">' + Elemento?.Nome + '<br />' + Elemento?.Significato + '</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Governatore:</td><td class="border border-[1px] border-blue-900 text-left">' + Governatore?.Pianeta + '<br />' + Governatore?.Significato + '</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Parole chiavi:</td><td class="border border-[1px] border-blue-900 text-left">' + DatiSegni.ParoleChiavi + '</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Significato:</td><td class="border border-[1px] border-blue-900 text-left">' + DatiSegni.Significato + '</td></tr>' +
                '<tr><td class="border border-[1px] border-blue-900">Opposto:</td><td class="border border-[1px] border-blue-900 text-left">' + Opposto?.Opposto + '<br />' + Opposto?.Significato + '</td></tr>' +
                '<tr><td colspan=2 class="border border-[1px] border-blue-900 text-left">Punti di forza:</td></tr><td></td><td class="border border-[1px] border-blue-900 text-left">' + DatiSegni?.Forza + '</td></tr>' +
                '<tr><td colspan=2 class="border border-[1px] border-blue-900  text-left">Punti di debolezza:</td></tr><tr><td></td><td class="border border-[1px] border-blue-900 text-left">' + DatiSegni?.Debolezza +
                '</td></tr></table>'*/
            }
            const elemento = Object.keys(SegniPianeta).find(item => item === NomeSegno)
            if (elemento) {
                console.log(Pianeta, elemento, SegniPianeta[elemento])
                Spiegazione += '<div class="text-left"><b>' + NomePianeta + '</b>:<br /><b>Parole chiavi</b>: ' + Pianeta.ParoleChiavi +
                    '<br /><b>Significato</b>: ' + Pianeta.Significato + '<br /><b>' +
                    NomePianeta + ' in ' + elemento + '</b>:<br /><b>' +
                    'Parole chiavi</b>: ' + SegniPianeta[elemento].ParoleChiavi + '<br /><b>Significato</b>: ' + SegniPianeta[elemento].Significato + '</div>'
            }

        }
    }
    return Spiegazione
}
</script>
<style lang="scss" scoped></style>