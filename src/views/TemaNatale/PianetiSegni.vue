<template>
    <div class="relative top-[120px] left-[200px] w-[1200px] m-auto">
        <h1 class="text-center text-[30px]">I segni dei pianeti</h1>
        Pianeta:
        <select v-model="IdPianeta" class="w-[200px]">
            <option value="0">Scegli</option>
            <option v-for="(pianeta, index) in ComboPianeti" :key="index" :value="pianeta.Id">
                {{ pianeta.Nome }}
            </option>
        </select>        
        <button @click="Aggiungi()">Aggiungi</button>
        <div v-if="TrovaPianeta" class="FormTabella">
            <table class="border border-3 w-full">
                <tr><td colspan="2" class="text-left w-[139px]">Nome:</td><td>
                    <input type="text" v-model="NomePianeta" />: {{TrovaPianeta?.Nome}}
                </td></tr>
                <tr><td colspan="2" class="text-left bg-gray-300">Tipologia:</td><td class="bg-gray-300">
                    <table  class="!bg-gray-300">
                        <tr>
                            <td class="text-left">Id:</td><td>{{PianetaIdTipologia_NomeTipologia(IdTipologia)?.Id}}</td>
                        </tr><tr>
                            <td class="text-left">Nome:</td><td class="w-full">
                                <select v-model="IdTipologia">
                                    <option value="0">Scegli</option>
                                    <option v-for="(tipologia, index) in DatiCombiTipologia" :key="index" :value="tipologia.text">
                                        {{ tipologia.value }}
                                    </option>
                                </select>
                                {{PianetaIdTipologia_NomeTipologia(IdTipologia)?.Nome}}</td>
                        </tr><tr>
                            <td class="text-left">Significato:</td><td>
                                <input type="text" v-model="SignificatoTipologia" class="w-full bg-gray-300" />
                            </td>
                        </tr>
                    </table>
                </td></tr>
                <tr><td colspan="2" class="text-left">Parole chiavi:</td><td>
                    <input type="text" v-model="PianetaParoleChiavi" class="w-full" />
                </td></tr>                
                <tr><td colspan="2" class="text-left pb-7 align-top">Parole chiavi Retrogrado:</td><td class="align-top">
                    <input type="text" v-model="PianetaParoleChiaviRetrogrado" class="w-full" />
                </td></tr>
                <tr><td colspan="2" class="text-left">Significato:</td><td class="align-top">
                    <input type="text" v-model="PianetaSignificato" class="w-full" />
                </td></tr>
                <tr><td colspan="2" class="text-left">Significato Retrogrado:</td><td class="align-top">
                    <input type="text" v-model="PianetaSignificatoRetrogrado" class="w-full" />
                </td></tr>
                <tr><td class="text-left bg-green-400 w-[63px]">Elementi:</td></tr>
                <tr v-for="(significato, elemento) in TrovaPianeta.Elemento" :key="elemento" class="bg-green-400">
                    <td></td>
                    <td class="text-left w-[76px]">{{elemento}}</td>
                    <td class="bg-green-300">
                        <input type="text" v-model="PianetaElementi[elemento]" class="w-full bg-green-400" />
                    </td>
                </tr>
                <tr><td class="text-left">Segni:</td></tr>
                <tr v-for="(parolechiavi_significato, segno) in TrovaPianeta.Segno" :key="segno">
                    <td></td>
                    <td class="text-left align-top">{{segno}}</td>
                    <td>
                        <table>
                            <tr>
                                <td class="text-left align-top">Parole&nbsp;Chiavi:</td>
                                <td class="w-[120px]">
                                    <input type="text" v-model="PianetaSegni[segno].ParoleChiavi" class="w-full" />
                                </td>
                            </tr>
                            <tr>
                                <td class="text-left">Parole&nbsp;Chiavi Retrogrado:</td>
                                <td class="w-[120px]">
                                    <input type="text" v-model="PianetaSegni[segno].ParoleChiaviRetrogrado" class="w-full" />
                                </td>
                            </tr>
                            <tr>
                                <td class="!text-left">Significato:</td>
                                <td class="w-full">
                                <input type="text" v-model="PianetaSegni[segno].Significato" class="w-full" />
                                </td>
                            </tr>                            
                            <tr>
                                <td class="!text-left">Significato Retrogrado:</td>
                                <td class="w-full">
                                <input type="text" v-model="PianetaSegni[segno].SignificatoRetrogrado" class="w-full" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr><td colspan="3">                    
                    <span class="hidden">
                    {{IdPianeta}} - {{IdTipologia}} - {{SignificatoTipologia}} - {{PianetaParoleChiavi}} - {{PianetaSignificato}} - 
                     {{PianetaElementi}} - {{PianetaSegni}}
                    </span>
                <BTNSalva class="BTNAzione BTNSalva" @click="Salva" /></td></tr>
            </table>            
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Pinia } from '@/stores'
import { computed } from 'vue'
import BTNSalva from '@/components/ComponenteTabella/IconeSvg/Salva.vue'

const Elenco = Pinia.TemaNatalePianeti().getElenco
const IdPianeta = ref('0')
const NomePianeta = ref('')
const IdTipologia = ref('vuoto')
const SignificatoTipologia = ref('')
const PianetaParoleChiavi = ref('')
const PianetaParoleChiaviRetrogrado = ref('llk')
const PianetaSignificato = ref('')
const PianetaSignificatoRetrogrado = ref('')
const PianetaElementi:any = ref(
    {Acqua: '', Aria: '', Fuoco: '', Terra: ''}
)
const PianetaSegni: any = ref(
    {Ariete: {ParoleChiavi: '', Significato: '', ParoleChiaviRetrogrado: '', SignificatoRetrogrado: ''}, 
     Toro: {ParoleChiavi: '', Significato: '', ParoleChiaviRetrogrado: '', SignificatoRetrogrado: ''}, 
     Gemelli: {ParoleChiavi: '', Significato: '', ParoleChiaviRetrogrado: '', SignificatoRetrogrado: ''}, 
     Cancro: {ParoleChiavi: '', Significato: '', ParoleChiaviRetrogrado: '', SignificatoRetrogrado: ''}, 
     Leone: {ParoleChiavi: '', Significato: '', ParoleChiaviRetrogrado: '', SignificatoRetrogrado: ''}, 
     Vergine: {ParoleChiavi: '', Significato: '', ParoleChiaviRetrogrado: '', SignificatoRetrogrado: ''}, 
     Bilancia: {ParoleChiavi: '', Significato: '', ParoleChiaviRetrogrado: '', SignificatoRetrogrado: ''}, 
     Scorpione: {ParoleChiavi: '', Significato: '', ParoleChiaviRetrogrado: '', SignificatoRetrogrado: ''}, 
     Sagittario: {ParoleChiavi: '', Significato: '', ParoleChiaviRetrogrado: '', SignificatoRetrogrado: ''}, 
     Capricorno: {ParoleChiavi: '', Significato: '', ParoleChiaviRetrogrado: '', SignificatoRetrogrado: ''}, 
     Acquario: {ParoleChiavi: '', Significato: '', ParoleChiaviRetrogrado: '', SignificatoRetrogrado: ''}, 
     Pesci: {ParoleChiavi: '', Significato: '', ParoleChiaviRetrogrado: '', SignificatoRetrogrado: ''}, 
})
const ComboPianeti = computed(() => {
    return Elenco.map((item) => {
        return {
            Id: item.Id,
            Nome: item.Nome
        }
    })
})


const TrovaPianeta: any = computed(() => {
    if (IdPianeta.value != '0') {
        const Pianeta: any = Elenco.find(item => item.Id === IdPianeta.value)
        console.log('TrovaPianeta', Pianeta)
        NomePianeta.value = Pianeta?.Nome || ''
        IdTipologia.value = Pianeta?.Tipologia
        PianetaParoleChiavi.value = Pianeta?.ParoleChiavi || ''
        PianetaParoleChiaviRetrogrado.value = Pianeta?.ParoleChiaviRetrogrado || ''
        PianetaSignificato.value = Pianeta?.Significato || ''
        PianetaSignificatoRetrogrado.value = Pianeta?.SignificatoRetrogrado || ''
        SignificatoTipologia.value = PianetaIdTipologia_NomeTipologia.value(IdTipologia.value)?.Significato || ''
        if (Pianeta?.Elemento) {
            PianetaElementi.value = {
                Acqua: Pianeta.Elemento.Acqua,
                Aria: Pianeta.Elemento.Aria,
                Fuoco: Pianeta.Elemento.Fuoco,
                Terra: Pianeta.Elemento.Terra
            }
        } else {
            PianetaElementi.value = []
        }
        if (Pianeta?.Segno) {
            PianetaSegni.value = {
                Ariete: Pianeta.Segno.Ariete,
                Toro: Pianeta.Segno.Toro,
                Gemelli: Pianeta.Segno.Gemelli,
                Cancro: Pianeta.Segno.Cancro,
                Leone: Pianeta.Segno.Leone,
                Vergine: Pianeta.Segno.Vergine,
                Bilancia: Pianeta.Segno.Bilancia,
                Scorpione: Pianeta.Segno.Scorpione,
                Sagittario: Pianeta.Segno.Sagittario,
                Capricorno: Pianeta.Segno.Capricorno,
                Acquario: Pianeta.Segno.Acquario,
                Pesci: Pianeta.Segno.Pesci
            }
        } else {
            PianetaSegni.value = []
        }   
        console.log('TrovaPianeta', Pianeta,PianetaParoleChiaviRetrogrado)
        return Pianeta ? Pianeta : []
    }
})
/*
const TrovaTipologia = computed(() => {
    if (TrovaPianeta.value) {
        return TrovaPianeta.value.Tipologia
    }
    return ''
})*/
const PianetaIdTipologia_NomeTipologia = computed(() => {
    return (IdTipologia: string) => {
        return Pinia.TemaNataleTipologiaPianeti().getElenco.find(item => item.Id === IdTipologia)
    }
})
const DatiCombiTipologia = computed(() => {
    return Pinia.TemaNataleTipologiaPianeti().getElenco.map((item) => {
        return {
            text: item.Id,
            value: item.Nome
        }
    })
})
const Salva = () => {
    /*Oggettone.value = {
        IdPianeta: IdPianeta.value,
        NomePianeta: NomePianeta.value,
        IdTipologia: IdTipologia.value,
        SignificatoTipologia: SignificatoTipologia.value,
        PianetaParoleChiavi: PianetaParoleChiavi.value,
        PianetaSignificato: PianetaSignificato.value,
        PianetaElementi: PianetaElementi.value,
        PianetaSegni: PianetaSegni.value
    }*
    console.log('Oggettone', {
        IdPianeta: IdPianeta.value,
        Nome: NomePianeta.value,
        IdTipologia: IdTipologia.value,
        SignificatoTipologia: SignificatoTipologia.value,
        PianetaParoleChiavi: PianetaParoleChiavi.value,
        PianetaSignificato: PianetaSignificato.value,
        PianetaElementi: {
            Acqua: PianetaElementi.value.Acqua,
            Aria: PianetaElementi.value.Aria,
            Fuoco: PianetaElementi.value.Fuoco,
            Terra: PianetaElementi.value.Terra  
        },
        PianetaSegni: {
            Ariete: { ParoleChiavi: PianetaSegni.value.Ariete.ParoleChiavi, Significato: PianetaSegni.value.Ariete.Significato },
            Toro: { ParoleChiavi: PianetaSegni.value.Toro.ParoleChiavi, Significato: PianetaSegni.value.Toro.Significato },
            Gemelli: { ParoleChiavi: PianetaSegni.value.Gemelli.ParoleChiavi, Significato: PianetaSegni.value.Gemelli.Significato },
            Cancro: { ParoleChiavi: PianetaSegni.value.Cancro.ParoleChiavi, Significato: PianetaSegni.value.Cancro.Significato },
            Leone: { ParoleChiavi: PianetaSegni.value.Leone.ParoleChiavi, Significato: PianetaSegni.value.Leone.Significato },
            Vergine: { ParoleChiavi: PianetaSegni.value.Vergine.ParoleChiavi, Significato: PianetaSegni.value.Vergine.Significato },
            Bilancia: { ParoleChiavi: PianetaSegni.value.Bilancia.ParoleChiavi, Significato: PianetaSegni.value.Bilancia.Significato },
            Scorpione: { ParoleChiavi: PianetaSegni.value.Scorpione.ParoleChiavi, Significato: PianetaSegni.value.Scorpione.Significato },
            Sagittario: { ParoleChiavi: PianetaSegni.value.Sagittario.ParoleChiavi, Significato: PianetaSegni.value.Sagittario.Significato },
            Capricorno: { ParoleChiavi: PianetaSegni.value.Capricorno.ParoleChiavi, Significato: PianetaSegni.value.Capricorno.Significato },
            Acquario: { ParoleChiavi: PianetaSegni.value.Acquario.ParoleChiavi, Significato: PianetaSegni.value.Acquario.Significato },
            Pesci: { ParoleChiavi: PianetaSegni.value.Pesci.ParoleChiavi, Significato: PianetaSegni.value.Pesci.Significato }
        }
    })
    */
    Pinia.TemaNatalePianeti().Aggiorna({
        IdPianeta: IdPianeta.value,
        Nome: NomePianeta.value,
        IdTipologia: IdTipologia.value,
        ParoleChiavi: PianetaParoleChiavi.value,
        ParoleChiaviRetrogrado: PianetaParoleChiaviRetrogrado.value,
        Significato: PianetaSignificato.value,
        SignificatoRetrogrado: PianetaSignificatoRetrogrado.value,
        Elemento: {
            Acqua: PianetaElementi.value.Acqua,
            Aria: PianetaElementi.value.Aria,
            Fuoco: PianetaElementi.value.Fuoco,
            Terra: PianetaElementi.value.Terra  
        },
        Segno: {
            Ariete: { ParoleChiavi: PianetaSegni.value.Ariete.ParoleChiavi, Significato: PianetaSegni.value.Ariete.Significato,
                ParoleChiaviRetrogrado: PianetaSegni.value.Ariete.ParoleChiaviRetrogrado, 
                SignificatoRetrogrado: PianetaSegni.value.Ariete.SignificatoRetrogrado
             },
            Toro: { ParoleChiavi: PianetaSegni.value.Toro.ParoleChiavi, Significato: PianetaSegni.value.Toro.Significato,
                ParoleChiaviRetrogrado: PianetaSegni.value.Toro.ParoleChiaviRetrogrado, 
                SignificatoRetrogrado: PianetaSegni.value.Toro.SignificatoRetrogrado
             },
            Gemelli: { ParoleChiavi: PianetaSegni.value.Gemelli.ParoleChiavi, Significato: PianetaSegni.value.Gemelli.Significato,
                ParoleChiaviRetrogrado: PianetaSegni.value.Gemelli.ParoleChiaviRetrogrado, 
                SignificatoRetrogrado: PianetaSegni.value.Gemelli.SignificatoRetrogrado
             },
            Cancro: { ParoleChiavi: PianetaSegni.value.Cancro.ParoleChiavi, Significato: PianetaSegni.value.Cancro.Significato,
                ParoleChiaviRetrogrado: PianetaSegni.value.Cancro.ParoleChiaviRetrogrado, 
                SignificatoRetrogrado: PianetaSegni.value.Cancro.SignificatoRetrogrado
             },
            Leone: { ParoleChiavi: PianetaSegni.value.Leone.ParoleChiavi, Significato: PianetaSegni.value.Leone.Significato,
                ParoleChiaviRetrogrado: PianetaSegni.value.Leone.ParoleChiaviRetrogrado, 
                SignificatoRetrogrado: PianetaSegni.value.Leone.SignificatoRetrogrado
             },
            Vergine: { ParoleChiavi: PianetaSegni.value.Vergine.ParoleChiavi, Significato: PianetaSegni.value.Vergine.Significato,
                ParoleChiaviRetrogrado: PianetaSegni.value.Vergine.ParoleChiaviRetrogrado, 
                SignificatoRetrogrado: PianetaSegni.value.Vergine.SignificatoRetrogrado
             },
            Bilancia: { ParoleChiavi: PianetaSegni.value.Bilancia.ParoleChiavi, Significato: PianetaSegni.value.Bilancia.Significato,
                ParoleChiaviRetrogrado: PianetaSegni.value.Bilancia.ParoleChiaviRetrogrado, 
                SignificatoRetrogrado: PianetaSegni.value.Bilancia.SignificatoRetrogrado
             },
            Scorpione: { ParoleChiavi: PianetaSegni.value.Scorpione.ParoleChiavi, Significato: PianetaSegni.value.Scorpione.Significato,
                ParoleChiaviRetrogrado: PianetaSegni.value.Scorpione.ParoleChiaviRetrogrado, 
                SignificatoRetrogrado: PianetaSegni.value.Scorpione.SignificatoRetrogrado
             },
            Sagittario: { ParoleChiavi: PianetaSegni.value.Sagittario.ParoleChiavi, Significato: PianetaSegni.value.Sagittario.Significato,
                ParoleChiaviRetrogrado: PianetaSegni.value.Sagittario.ParoleChiaviRetrogrado, 
                SignificatoRetrogrado: PianetaSegni.value.Sagittario.SignificatoRetrogrado
             },
            Capricorno: { ParoleChiavi: PianetaSegni.value.Capricorno.ParoleChiavi, Significato: PianetaSegni.value.Capricorno.Significato,
                ParoleChiaviRetrogrado: PianetaSegni.value.Capricorno.ParoleChiaviRetrogrado, 
                SignificatoRetrogrado: PianetaSegni.value.Capricorno.SignificatoRetrogrado
             },
            Acquario: { ParoleChiavi: PianetaSegni.value.Acquario.ParoleChiavi, Significato: PianetaSegni.value.Acquario.Significato, 
                ParoleChiaviRetrogrado: PianetaSegni.value.Acquario.ParoleChiaviRetrogrado, 
                SignificatoRetrogrado: PianetaSegni.value.Acquario.SignificatoRetrogrado},
            Pesci: { ParoleChiavi: PianetaSegni.value.Pesci.ParoleChiavi, Significato: PianetaSegni.value.Pesci.Significato,
                ParoleChiaviRetrogrado: PianetaSegni.value.Pesci.ParoleChiaviRetrogrado, 
                SignificatoRetrogrado: PianetaSegni.value.Pesci.SignificatoRetrogrado
             }
        }})
    console.log('salva', PianetaSegni)
}
const Aggiungi = () => {
    Pinia.TemaNatalePianeti().Aggiungi({
        Nome: 'nuovo',
        IdTipologia: '0',
        Significato: 'SIG',
        ParoleChiavi: 'parole chiavi',
        Elemento: {
            Acqua: '',
            Aria: '',
            Fuoco: '',
            Terra: ''
        },
        Segno: {
            Ariete: { ParoleChiavi: '', Significato: '' },
            Toro: { ParoleChiavi: '', Significato: '' },
            Gemelli: { ParoleChiavi: '', Significato: '' },
            Cancro: { ParoleChiavi: '', Significato: '' },
            Leone: { ParoleChiavi: '', Significato: '' },
            Vergine: { ParoleChiavi: '', Significato: '' },
            Bilancia: { ParoleChiavi: '', Significato: '' },
            Scorpione: { ParoleChiavi: '', Significato: '' },
            Sagittario: { ParoleChiavi: '', Significato: '' },
            Capricorno: { ParoleChiavi: '', Significato: '' },
            Acquario: { ParoleChiavi: '', Significato: '' },
            Pesci: { ParoleChiavi: '', Significato: '' }
        }
    })
}
onMounted(() => {
    
})
</script>