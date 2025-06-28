<template>
    <div class="relative top-[120px] left-[200px] w-[2000px]">
        <h1 class="text-center text-[30px]">Lettura tema natale</h1>
        <div class="persone">
            <span class="hidden">
            <button @click="Carica('Roberto')">Roberto Russo</button>
            <button @click="Carica('Silvia')">Silvia Pingitore</button>
            <button @click="Carica('Alessandro')">Alessandro Sari</button>
            </span>
            <br />
            <button v-for="(persona, index) in Utenti" :key="index" @click="CaricaDaDb(persona.Id!)">
                {{ persona.Nome }}
            </button>
            <button @click="FaseAggiungi" class="!bg-yellow-600">Aggiungi persona</button>
        </div>
        <div v-if="NuovaPersona || IdSegno.Id != '0'">
            Nome: <input v-model="Nome" /> Data di nascita: <input v-model="DataNascita" type="date" /> Luogo di
            nascita:
            <span class="hidden">{{ IdSegno }}</span>
            <input v-model="LuogoNascita" /> Ora di nascita: <input type="time" v-model="OraNascita" /><br />
            Nikname: <input type="text" v-model="Nikname" /> Password: <input v-model="Password" />
            <br /><br />
            <table>
                <tr>
                    <td>Ascendente:</td>
                    <td><select v-model="IdSegno.Ascendente.Pianeta.IdSegno">
                            <option value="0">Scegli</option>
                            <option v-for="(segno, index) in Pinia.TemaNataleSegni().getElenco" :key="index"
                                :value="segno.Id">
                                {{ segno.Nome }}
                            </option>
                        </select>
                        Gradi: <input type="text" v-model="IdSegno.Ascendente.Pianeta.Gradi" />
                        Retogrado: <input type="checkbox" v-model="IdSegno.Ascendente.Pianeta.Retrogrado" />
                        Casa:
                        <select v-model="IdSegno.Ascendente.Casa.Id">
                            <option value="0">Scegli</option>
                            <option v-for="(casa, index) in Pinia.TemaNataleCase().getElenco" :key="index" :value="casa.Id">
                                {{casa.Sigla}}
                            </option>
                        </select>                        
                        Segno casa: <select v-model="IdSegno.Ascendente.Casa.IdSegno">
                            <option value="0">Scegli</option>
                            <option v-for="(segno, index) in Pinia.TemaNataleSegni().getElenco" :key="index"
                                :value="segno.Id">
                                {{ segno.Nome }}
                            </option>
                        </select>
                        Gradi: <input type="text" v-model="IdSegno.Ascendente.Casa.Gradi" />
                    </td>
                </tr>
                <template v-for="(item, index) in Elenco" :key="index">
                <tr  v-if="item.Id != '-OTNGbJNeL1iAigmP9mn' && item.Id != '-OTNGtJ4TPBGCGaUHHnj' && item.Id != '-OTNIsVXtSXf0GTws-AQ'">
                    <td>{{ item.Nome }} in:</td>
                    <td class="text-left">                        
                        <select v-model="IdSegno[item.Nome]['Pianeta']['IdSegno']">
                            <option value="0">Scegli</option>
                            <option v-for="(segno, index) in Pinia.TemaNataleSegni().getElenco" :key="index"
                                :value="segno.Id">
                                {{ segno.Nome }}
                            </option>                            
                        </select>
                        Gradi: <input type="text" v-model="IdSegno[item.Nome]['Pianeta']['Gradi']" />
                        Retrogrado: <input type="checkbox" v-model="IdSegno[item.Nome]['Pianeta']['Retrogrado']" />
                        Casa:
                        <select v-model="IdSegno[item.Nome].Casa.Id">
                            <option value="0">Scegli</option>
                            <option v-for="(casa, index) in Pinia.TemaNataleCase().getElenco" :key="index" :value="casa.Id">
                                {{casa.Sigla}}
                            </option>
                        </select>                         
                        Segno casa: <select v-model="IdSegno[item.Nome]['Casa']['IdSegno']">
                            <option value="0">Scegli</option>
                            <option v-for="(segno, index) in Pinia.TemaNataleSegni().getElenco" :key="index"
                                :value="segno.Id">
                                {{ segno.Nome }}
                            </option>
                        </select> 
                        Gradi: <input type="text" v-model="IdSegno[item.Nome]['Casa']['Gradi']" />
                    </td>
                </tr>
                </template>
                <tr>
                    <td colspan="2">
                        <button v-if="IdSegno.Id != '0'" @click="AggiornaPersona" :disabled="!Verifica"
                            :class="Verifica ? 'Abilitato' : 'Disabilitato'">Aggiorna</button>
                        <button v-if="NuovaPersona" @click="AggiungiPersona" :disabled="!Verifica"
                            :class="Verifica ? 'Abilitato' : 'Disabilitato'">Aggiungi</button>
                    </td>
                </tr>
            </table>
        </div>
        <div v-if="IdSegno.Sole !== '0'" class="text-center">
            <span v-html="TrovaSegno('Sole', IdSegno.Sole)" />
        </div>
        <div v-if="IdSegno.Luna !== '0'" class="text-center">
            <span v-html="TrovaSegno('Luna', IdSegno.Luna)" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { computed, ref } from 'vue'
const IdUtente = ref('')
const Nome = ref('')
const DataNascita = ref('')
const LuogoNascita = ref('')
const OraNascita = ref('')
const Nikname = ref('')
const Password = ref('')
const NuovaPersona = ref(false)
const Elenco = ref(Pinia.TemaNatalePianeti().getElenco)

const IdSegno: any = ref({
    Id: '0',
    Ascendente: '0',
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

const Utenti = computed(() => {
    return Pinia.TemaNataleUtenti().getElenco
})

const Verifica = computed(() => {
    let test = true
    if (Nome.value === '' ||
        Password.value === '' ||
        DataNascita.value === '' ||
        LuogoNascita.value === '' ||
        OraNascita.value === '' ||
        IdSegno.value.Ascendente === '0' ||
        IdSegno.value.Sole === '0' ||
        IdSegno.value.Luna === "0" ||
        IdSegno.value.Mercurio === "0" ||
        IdSegno.value.Venere === "0" ||
        IdSegno.value.Marte === "0" ||
        IdSegno.value.Giove === "0" ||
        IdSegno.value.Saturno === "0" ||
        IdSegno.value.Urano === "0" ||
        IdSegno.value.Nettuno === "0" ||
        IdSegno.value.Plutone === "0") {
        //test = false
    }
    //console.log(test)
    return test
})
const FaseAggiungi = () => {
    NuovaPersona.value = true,
        IdSegno.value = {
            Id: '0',
            Ascendente: {
                Pianeta: {
                    Id: '0',
                    IdSegno: '0',
                    Retrogrado: false
                },
                Casa: {
                    Id: '0',
                    IdSegno: '0'
                }
            },
            Sole: {
                Pianeta: {
                    Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === "Sole")[0]?.Id,
                    IdSegno: '0',
                    Retrogrado: false
                },
                Casa: {
                    Id: '0',
                    IdSegno: '0'
                }
            },
            Luna: {
                Pianeta: {
                    Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === "Luna")[0]?.Id,
                    IdSegno: '0',
                    Retrogrado: false
                },
                Casa: {
                    Id: '0',
                    IdSegno: '0'
                }
            },
            Mercurio: {
                Pianeta: {
                    Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === "Mercurio")[0]?.Id,
                    IdSegno: '0',
                    Retrogrado: false
                },
                Casa: {
                    Id: '0',
                    IdSegno: '0'
                }
            },
            Venere: {
                Pianeta: {
                    Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === "Venere")[0]?.Id,
                    IdSegno: '0',
                    Retrogrado: false
                },
                Casa: {
                    Id: '0',
                    IdSegno: '0'
                }
            },
            Marte: {
                Pianeta: {
                    Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === "Marte")[0]?.Id,
                    IdSegno: '0',
                    Retrogrado: false
                },
                Casa: {
                    Id: '0',
                    IdSegno: '0'
                }
            },
            Giove: {
                Pianeta: {
                    Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === "Giove")[0]?.Id,
                    IdSegno: '0',
                    Retrogrado: false
                },
                Casa: {
                    Id: '0',
                    IdSegno: '0'
                }
            },
            Saturno: {
                Pianeta: {
                    Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === "Saturno")[0]?.Id,
                    IdSegno: '0',
                    Retrogrado: false
                },
                Casa: {
                    Id: '0',
                    IdSegno: '0'
                }
            },
            Urano: {
                Pianeta: {
                    Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === "Urano")[0]?.Id,
                    IdSegno: '0',
                    Retrogrado: false
                },
                Casa: {
                    Id: '0',
                    IdSegno: '0'
                }
            },
            Nettuno: {
                Pianeta: {
                    Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === "Nettuno")[0]?.Id,
                    IdSegno: '0',
                    Retrogrado: false
                },
                Casa: {
                    Id: '0',
                    IdSegno: '0'
                }
            },
            Plutone: {
                Pianeta: {
                    Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === "Plutone")[0]?.Id,
                    IdSegno: '0',
                    Retrogrado: false
                },
                Casa: {
                    Id: '0',
                    IdSegno: '0'
                }
            }
        }
    Nome.value = ''
    Nikname.value = ''
    Password.value = ''
    DataNascita.value = ''
    LuogoNascita.value = ''
}

const CaricaDaDb = (Id: string) => {
    const dati = Pinia.TemaNataleUtenti().getElenco.find((item) => item.Id === Id)
    console.log(dati)    
    if (dati) {
        IdUtente.value = dati.Id!
        Nome.value = dati.Nome
        Nikname.value = dati.Nikname
        Password.value = dati.Password
        DataNascita.value = dati.DataNascita
        OraNascita.value = dati.OraNascita
        LuogoNascita.value = dati.LuogoNascita
        IdSegno.value = dati.Segni
        NuovaPersona.value = false
    }
}

const Carica = (nome: string) => {
    if (nome === 'Roberto') {
        IdSegno.value = {
            Id: '1',
            Ascendente: '-ONp0AGXL0t7Wgm1KWT7',
            Sole: '-OMgft35eGbU8yABLLZ-',
            Luna: '-ONp0PD2WowH2ZTvk5E9',
            Mercurio: '-OMgft35eGbU8yABLLZ-',
            Venere: '-OMgft35eGbU8yABLLZ-',
            Marte: '-OM1ANrwkIou_C258QEg',
            Giove: '-ONp0K70V_ZTMyTPs4Cw',
            Saturno: '-OMgfhi0vKAv1ZxyDdrN',
            Urano: '-ONp-xvgoa9VbnqKm3bt',
            Nettuno: '-ONp0AGXL0t7Wgm1KWT7',
            Plutone: '-ONp0AGXL0t7Wgm1KWT7'
        }
        Nome.value = 'Roberto Russo'
        DataNascita.value = '1973-06-21'
        LuogoNascita.value = 'Imperia'
    }
    if (nome === 'Silvia') {
        IdSegno.value = {
            Id: '2',
            Ascendente: '-OMghBLqj9RVr8OC0O--',
            Sole: '-OM1ANrwkIou_C258QEg',
            Luna: '-ONp0AGXL0t7Wgm1KWT7',
            Mercurio: '-ONp0PD2WowH2ZTvk5E9',
            Venere: '-OM1F6NvGZI5oI7bmp8q',
            Marte: '-ONp0K70V_ZTMyTPs4Cw',
            Giove: '-OM1ANrwkIou_C258QEg',
            Saturno: '-OMgft35eGbU8yABLLZ-',
            Urano: '-ONp04Nt-sdQFjzWA3Hb',
            Nettuno: '-ONp0AGXL0t7Wgm1KWT7',
            Plutone: '-ONp-xvgoa9VbnqKm3bt'
        }
        Nome.value = 'Silvia Pingitore'
        DataNascita.value = '1975-04-01'
        LuogoNascita.value = 'Torino'
    }
    if (nome === 'Alessandro') {
        IdSegno.value = {
            Id: '3',
            Ascendente: '-OMghBLqj9RVr8OC0O--',
            Sole: '-OMgft35eGbU8yABLLZ-',
            Luna: '-OM1ANrwkIou_C258QEg',
            Mercurio: '-OMgft35eGbU8yABLLZ-',
            Venere: '-OMgfhi0vKAv1ZxyDdrN',
            Marte: '-OM1ANrwkIou_C258QEg',
            Giove: '-ONp-xvgoa9VbnqKm3bt',
            Saturno: '-ONp0K70V_ZTMyTPs4Cw',
            Urano: '-ONp0FDqwj6-NNZ3fNCT',
            Nettuno: '-ONp0FDqwj6-NNZ3fNCT',
            Plutone: '-ONp04Nt-sdQFjzWA3Hb'
        }
        Nome.value = 'Alessandro Sari'
        DataNascita.value = '1993-07-11'
        LuogoNascita.value = 'Iesolo'
    }
    NuovaPersona.value = false
    //console.log('Carica', IdSegno.value)
}

const AggiungiPersona = () => {
    console.log(Nome.value)
    console.log(Password.value)    
    console.log(DataNascita.value)
    console.log(OraNascita.value)    
    console.log(IdSegno.value)        
    
    Pinia.TemaNataleUtenti().Aggiungi({
        Nome: Nome.value,
        Nikname: Nikname.value,
        Password: Password.value,
        DataNascita: DataNascita.value,
        OraNascita: OraNascita.value,
        LuogoNascita: LuogoNascita.value,
        IdSegni: IdSegno.value
    })
}

const AggiornaPersona = () => {
    /*console.log(IdUtente.value)      
    console.log(Nome.value)
    console.log(Password.value)    
    console.log(DataNascita.value)
    console.log(OraNascita.value)    
    console.log(IdSegno.value)   
    */
    Pinia.TemaNataleUtenti().Aggiorna({
        Id: IdUtente.value,
        Nome: Nome.value,
        Nikname: Nikname.value,
        Password: Password.value,
        DataNascita: DataNascita.value,
        OraNascita: OraNascita.value,
        LuogoNascita: LuogoNascita.value,
        Segni: IdSegno.value
    })
}
const TrovaSegno = (NomePianeta: string, IdSegno: string) => {
    const DatiSegni = Pinia.TemaNataleSegni().getElenco.find((item) => item.Id === IdSegno)
    let Spiegazione = ''
    if (DatiSegni) {
        const Elemento = Pinia.TemaNataleElementi().getElenco.find((item) => item.Id === DatiSegni.Elemento)
        const NomeElemento = Elemento?.Nome
        const NomeSegno = DatiSegni.Nome
        const Pianeta: any = Pinia.TemaNatalePianeti().getElenco.find((item) => item.Nome === NomePianeta)
        const SegniPianeta: any = Pianeta?.Segno
        const ElementiPianeta: any = Pianeta?.Elemento
        if (SegniPianeta) {
            if (NomePianeta === 'Sole') {
                const Polarità = Pinia.TemaNatalePolaritàSegni().getElenco.find((item) => item.Id === DatiSegni.Polarità)
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
                    '<br />' + 'Le tue parole chiave sono: ' + DatiSegni.ParoleChiavi +
                    '<br />' + Opposto?.Significato +
                    '<br />' + DatiSegni.Significato +
                    '<br /><br />' + '<b>Punti di forza sono</b>:<br /><div class="ml-5">' + DatiSegni.Forza + '</div>' +
                    '<br />' + '<b>Punti di debolezza sono</b>:<br /><div class="ml-5">' + DatiSegni.Debolezza + '</div><br />'
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
            const elemento = Object.keys(ElementiPianeta).find(item => item === NomeElemento)
            const segno = Object.keys(SegniPianeta).find(item => item === NomeSegno)
            //console.log('Elemento:', elemento, 'Segno:', segno, ElementiPianeta, NomeElemento);

            if (elemento) {
                //console.log(Pianeta, elemento, ElementiPianeta[elemento])
                Spiegazione += '<div class="text-left bg-white w-[1200px] m-auto"><b>' + NomePianeta + '</b>:' +
                    '<br />' + Pianeta.Significato +
                    '<br />' + 'Le sue parole chiavi sono ' + Pianeta.ParoleChiavi +
                    '<br /> Le parole chiavi del pianeta ' + NomePianeta + ' nell\'elemento ' + elemento + ' sono: ' + ElementiPianeta[elemento] +
                    '</div>'
            }
            if (segno) {
                //console.log(Pianeta, segno, SegniPianeta[segno])
                Spiegazione += '<div class="text-left bg-white w-[1200px] m-auto">' +
                    'Le parole chiavi del ' + NomePianeta + ' in ' + NomeSegno + ' sono: ' + SegniPianeta[segno].ParoleChiavi +
                    '<br />' + SegniPianeta[segno].Significato +
                    '</div>'
            }

        }
    }
    return Spiegazione
}
</script>
<style lang="scss" scoped>
.persone {
    button {
        @apply bg-yellow-500 p-2 m-2 text-black rounded rounded-[45px];
    }
}

.Abilitato {
    @apply bg-green-300 p-2 m-2 text-black rounded rounded-[45px];
}

.Disabilitato {
    @apply bg-red-300 p-2 m-2 text-black rounded rounded-[45px] cursor-not-allowed;
}
</style>