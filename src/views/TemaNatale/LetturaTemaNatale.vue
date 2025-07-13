<template>
  <div class="relative top-[120px] left-[200px] w-[2000px]">
    <h1 class="text-center text-[30px]">Lettura tema natale</h1>
    <div class="persone my-5">
      <button v-for="(persona, index) in Utenti" :key="index" @click="CaricaDaDb(persona.Id!)">
        {{ persona.Nome }}
      </button>
      <button @click="FaseAggiungi" class="!bg-yellow-600">Aggiungi persona</button>
    </div>
    <div v-if="NuovaPersona || IdSegno.Id != '0'">
      Nome: <input v-model="Nome" /> Sesso:
      <select v-model="Sesso">
        <option value="M">Maschio</option>
        <option value="F">Femmina</option>
      </select>
      Data di nascita:
      <input v-model="DataNascita" type="date" /> Luogo di nascita:
      <span class="hidden">{{ IdSegno }}</span>
      <input v-model="LuogoNascita" /> Ora di nascita:
      <input type="time" v-model="OraNascita" /><br />
      Nikname: <input type="text" v-model="Nikname" /> Password: <input v-model="Password" />
      <br /><br />
      <table>
        <tr>
          <td>Ascendente:</td>
          <td>
            <select v-model="IdSegno.Ascendente.Pianeta.IdSegno">
              <option value="0">Scegli</option>
              <option
                v-for="(segno, index) in Pinia.TemaNataleSegni().getElenco"
                :key="index"
                :value="segno.Id"
              >
                {{ segno.Nome }}
              </option>
            </select>
            Gradi: <input type="text" v-model="IdSegno.Ascendente.Pianeta.Gradi" /> Retogrado:
            <input type="checkbox" v-model="IdSegno.Ascendente.Pianeta.Retrogrado" />
            Casa:
            <select v-model="IdSegno.Ascendente.Casa.Id">
              <option value="0">Scegli</option>
              <option
                v-for="(casa, index) in Pinia.TemaNataleCase().getElenco"
                :key="index"
                :value="casa.Id"
              >
                {{ casa.Sigla }}
              </option>
            </select>
            Segno casa:
            <select v-model="IdSegno.Ascendente.Casa.IdSegno">
              <option value="0">Scegli</option>
              <option
                v-for="(segno, index) in Pinia.TemaNataleSegni().getElenco"
                :key="index"
                :value="segno.Id"
              >
                {{ segno.Nome }}
              </option>
            </select>
            Gradi: <input type="text" v-model="IdSegno.Ascendente.Casa.Gradi" />
          </td>
        </tr>
        <template v-for="(item, index) in Elenco" :key="index">
          <tr
            v-if="
              item.Id != '-OTNGbJNeL1iAigmP9mn' &&
              item.Id != '-OTNGtJ4TPBGCGaUHHnj' &&
              item.Id != '-OTNIsVXtSXf0GTws-AQ'
            "
            :class="riga === index ? 'bg-red-100' : ''"
          >
            <td>{{ item.Nome }} in:</td>
            <td class="text-left">
              <select v-model="IdSegno[item.Nome]['Pianeta']['IdSegno']">
                <option value="0">Scegli</option>
                <option
                  v-for="(segno, index) in Pinia.TemaNataleSegni().getElenco"
                  :key="index"
                  :value="segno.Id"
                >
                  {{ segno.Nome }}
                </option>
              </select>
              Gradi:
              <input type="text" v-model="IdSegno[item.Nome]['Pianeta']['Gradi']" /> Retrogrado:
              <input type="checkbox" v-model="IdSegno[item.Nome]['Pianeta']['Retrogrado']" />
              Casa:
              <select v-model="IdSegno[item.Nome].Casa.Id">
                <option value="0">Scegli</option>
                <option
                  v-for="(casa, index) in Pinia.TemaNataleCase().getElenco"
                  :key="index"
                  :value="casa.Id"
                >
                  {{ casa.Sigla }}
                </option>
              </select>
              Segno casa:
              <select v-model="IdSegno[item.Nome]['Casa']['IdSegno']">
                <option value="0">Scegli</option>
                <option
                  v-for="(segno, index) in Pinia.TemaNataleSegni().getElenco"
                  :key="index"
                  :value="segno.Id"
                >
                  {{ segno.Nome }}
                </option>
              </select>
              Gradi: <input type="text" v-model="IdSegno[item.Nome]['Casa']['Gradi']" />
            </td>
            <td>
              <button
                @click="Test(IdSegno[item.Nome], index)"
                class="bg-Bottone ml-2 px-2 rounded-[45px]"
              >
                Test
              </button>
            </td>
          </tr>
        </template>
        <tr>
          <td colspan="2">
            <button
              v-if="IdSegno.Id != '0'"
              @click="AggiornaPersona"
              :disabled="!Verifica"
              :class="Verifica ? 'Abilitato' : 'Disabilitato'"
            >
              Aggiorna
            </button>
            <button
              v-if="NuovaPersona"
              @click="AggiungiPersona"
              :disabled="!Verifica"
              :class="Verifica ? 'Abilitato' : 'Disabilitato'"
            >
              Aggiungi
            </button>
          </td>
        </tr>
      </table>
    </div>
    <div v-html="DatiTest" class="hidde" />
    <div v-if="DatiTest.length > 0" class="flex flex-col mt-5">
      {{ DatiDaAggiornare }}
      <div class="border border-[1px] border-blue-900 p-4">
        <div class="bg-gray-100">Pianeta</div>
        <table class="w-full border border-[1px] border-blue-900">
          <tr>
            <td class="w-[250px] text-right pr-3">Significato pianeta:</td>
            <td>
              <input
                v-if="DatiDaAggiornare['riguadro'] === 'Pianeta'"
                type="text"
                v-model="DatiDaAggiornare['Significato']"
                class="w-full"
              />
            </td>
          </tr>
          <tr>
            <td class="text-right pr-3">Parole chiave pianeta:</td>
            <td>
              <input
                v-if="DatiDaAggiornare['riguadro'] === 'Pianeta'"
                type="text"
                v-model="DatiDaAggiornare['Parolechiave']"
                class="w-full"
              />
            </td>
          </tr>
          <tr>
            <td class="text-right pt-3 pr-3">Significato pianeta retrogrado:</td>
            <td>
              <input
                v-if="DatiDaAggiornare['riguadro'] === 'Pianeta'"
                type="text"
                v-model="DatiDaAggiornare['SignificatoRetrogrado']"
                class="w-full"
              />
            </td>
          </tr>
          <tr>
            <td class="text-right pr-3">Parole chiave pianeta retrogrado:</td>
            <td>
              <input
                v-if="DatiDaAggiornare['riguadro'] === 'Pianeta'"
                type="text"
                v-model="DatiDaAggiornare['ParolechiaveRetrogrado']"
                class="w-full"
              />
            </td>
          </tr>
        </table>
        <div>
          <button
            class="bg-Bottone rounded-[45px] mt-4 px-4"
            @click="Aggiorna('Pianeta')"
            v-if="DatiDaAggiornare['riguadro'] != 'Pianeta'"
          >
            Aggiorna
          </button>
          <button
            class="bg-green-300 rounded-[45px] mt-4 px-4"
            :class="Salvato ? 'StoSalvando' : ''"
            @click="Salva('Pianeta')"
            v-else
          >
            Salva
          </button>
        </div>
      </div>
      <div class="border border-[1px] border-blue-900 p-4 mt-5">
        <div class="bg-gray-100">Pianeta in segno</div>
        <table class="w-full border border-[1px] border-blue-900">
          <tr>
            <td class="w-[300px] text-right pr-3">Significato pianeta segno:</td>
            <td>
              <input
                v-if="DatiDaAggiornare['riguadro'] === 'PianetaSegno'"
                type="text"
                v-model="DatiDaAggiornare['Significato']"
                class="w-full"
              />
            </td>
          </tr>
          <tr>
            <td class="text-right pr-3">Parole chiave pianeta segno:</td>
            <td>
              <input
                v-if="DatiDaAggiornare['riguadro'] === 'PianetaSegno'"
                type="text"
                v-model="DatiDaAggiornare['Parolechiave']"
                class="w-full"
              />
            </td>
          </tr>
          <tr>
            <td class="text-right pt-3 pr-3">Significato pianeta retrogrado segno:</td>
            <td>
              <input
                v-if="DatiDaAggiornare['riguadro'] === 'PianetaSegno'"
                type="text"
                v-model="DatiDaAggiornare['SignificatoRetrogrado']"
                class="w-full"
              />
            </td>
          </tr>
          <tr>
            <td class="text-right pr-3">Parole chiave pianeta retrogrado segno:</td>
            <td>
              <input
                v-if="DatiDaAggiornare['riguadro'] === 'PianetaSegno'"
                type="text"
                v-model="DatiDaAggiornare['ParolechiaveRetrogrado']"
                class="w-full"
              />
            </td>
          </tr>
        </table>
        <div>
          <button
            class="bg-Bottone rounded-[45px] mt-4 px-4"
            @click="Aggiorna('PianetaSegno')"
            v-if="DatiDaAggiornare['riguadro'] != 'PianetaSegno'"
          >
            Aggiorna
          </button>
          <button
            class="bg-green-300 rounded-[45px] mt-4 px-4"
            :class="Salvato ? 'StoSalvando' : ''"
            @click="Salva('PianetaSegno')"
            v-else
          >
            Salva
          </button>
        </div>
      </div>
      <div class="border border-[1px] border-blue-900 p-4 mt-5">
        <div class="bg-gray-100">Casa</div>
        <table class="w-full border border-[1px] border-blue-900">
          <tr>
            <td class="w-[250px] text-right pr-3">Significato casa:</td>
            <td>
              <input
                v-if="DatiDaAggiornare['riguadro'] === 'Casa'"
                type="text"
                v-model="DatiDaAggiornare['Significato']"
                class="w-full"
              />
            </td>
          </tr>
          <tr>
            <td class="text-right pr-3">Parole chiave casa:</td>
            <td>
              <input
                v-if="DatiDaAggiornare['riguadro'] === 'Casa'"
                type="text"
                v-model="DatiDaAggiornare['Parolechiave']"
                class="w-full"
              />
            </td>
          </tr>
        </table>
        <div>
          <button
            class="bg-Bottone rounded-[45px] mt-4 px-4"
            :class="Salvato ? 'StoSalvando' : ''"
            @click="Aggiorna('Casa')"
            v-if="DatiDaAggiornare['riguadro'] != 'Casa'"
          >
            Aggiorna
          </button>
          <button
            class="bg-green-300 rounded-[45px] mt-4 px-4"
            :class="Salvato ? 'StoSalvando' : ''"
            @click="Salva('Casa')"
            v-else
          >
            Salva
          </button>
        </div>
      </div>
      <div class="border border-[1px] border-blue-900 p-4 mt-5">
        <div class="bg-gray-100">Pianeta (opzionale retrogrado) in segno in casa in segno</div>
        <table class="w-full border border-[1px] border-blue-900">
          <tr>
            <td class="w-[350px] text-right pr-3">
              Significato pianeta in segno in casa in segno:
            </td>
            <td>
              <input
                v-if="DatiDaAggiornare['riguadro'] === 'PianetaSegnoCasaSegno'"
                type="text"
                v-model="DatiDaAggiornare['Significato']"
                class="w-full"
              />
            </td>
          </tr>
          <tr>
            <td class="text-right pr-3">Parole chiave pianeta in segno in casa in segno:</td>
            <td>
              <input
                v-if="DatiDaAggiornare['riguadro'] === 'PianetaSegnoCasaSegno'"
                type="text"
                v-model="DatiDaAggiornare['Parolechiave']"
                class="w-full"
              />
            </td>
          </tr>
        </table>
        <div>
          <button
            class="bg-Bottone rounded-[45px] mt-4 px-4"
            :class="Salvato ? 'StoSalvando' : ''"
            @click="Aggiorna('PianetaSegnoCasaSegno')"
            v-if="DatiDaAggiornare['riguadro'] != 'PianetaSegnoCasaSegno'"
          >
            Aggiorna
          </button>
          <button
            class="bg-green-300 rounded-[45px] mt-4 px-4"
            :class="Salvato ? 'StoSalvando' : ''"
            @click="Salva('PianetaSegnoCasaSegno')"
            v-else
          >
            Salva
          </button>
        </div>
      </div>
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
const riga = ref(0)
const IdUtente = ref('')
const Nome = ref('')
const Sesso = ref('M')
const DataNascita = ref('')
const LuogoNascita = ref('')
const OraNascita = ref('')
const Nikname = ref('')
const Password = ref('')
const NuovaPersona = ref(false)
const Salvato = ref(false)
const ObjPianeta = ref<{ Pianeta: { Id: string; [key: string]: any }; [key: string]: any }>({
  Pianeta: { Id: '' }
})
interface DatiAggiornamento {
  riguadro?: string
  Significato?: string
  [key: string]: any
}
const SegnoPianeta = ref('')
const DatiDaAggiornare = ref<DatiAggiornamento>({})
const DatiTest = ref('')

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
  if (
    Nome.value === '' ||
    Password.value === '' ||
    DataNascita.value === '' ||
    LuogoNascita.value === '' ||
    OraNascita.value === '' ||
    IdSegno.value.Ascendente === '0' ||
    IdSegno.value.Sole === '0' ||
    IdSegno.value.Luna === '0' ||
    IdSegno.value.Mercurio === '0' ||
    IdSegno.value.Venere === '0' ||
    IdSegno.value.Marte === '0' ||
    IdSegno.value.Giove === '0' ||
    IdSegno.value.Saturno === '0' ||
    IdSegno.value.Urano === '0' ||
    IdSegno.value.Nettuno === '0' ||
    IdSegno.value.Plutone === '0'
  ) {
    //test = false
  }
  //console.log(test)
  return test
})
const FaseAggiungi = () => {
  ;(NuovaPersona.value = true),
    (IdSegno.value = {
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
          Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === 'Sole')[0]?.Id,
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
          Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === 'Luna')[0]?.Id,
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
          Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === 'Mercurio')[0]?.Id,
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
          Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === 'Venere')[0]?.Id,
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
          Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === 'Marte')[0]?.Id,
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
          Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === 'Giove')[0]?.Id,
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
          Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === 'Saturno')[0]?.Id,
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
          Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === 'Urano')[0]?.Id,
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
          Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === 'Nettuno')[0]?.Id,
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
          Id: Pinia.TemaNatalePianeti().getElenco.filter((item) => item.Nome === 'Plutone')[0]?.Id,
          IdSegno: '0',
          Retrogrado: false
        },
        Casa: {
          Id: '0',
          IdSegno: '0'
        }
      }
    })
  Nome.value = ''
  Nikname.value = ''
  Password.value = ''
  DataNascita.value = ''
  LuogoNascita.value = ''
}

const CaricaDaDb = (Id: string) => {
  const dati = Pinia.TemaNataleUtenti().getElenco.find((item) => item.Id === Id)
  if (dati) {
    IdUtente.value = dati.Id!
    Nome.value = dati.Nome
    Sesso.value = dati.Sesso
    Nikname.value = dati.Nikname
    Password.value = dati.Password
    DataNascita.value = dati.DataNascita
    OraNascita.value = dati.OraNascita
    LuogoNascita.value = dati.LuogoNascita
    IdSegno.value = dati.Segni
    NuovaPersona.value = false
  }
}
/*
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
}*/

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
    Sesso: Sesso.value,
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
    const Elemento = Pinia.TemaNataleElementi().getElenco.find(
      (item) => item.Id === DatiSegni.Elemento
    )
    const NomeElemento = Elemento?.Nome
    const NomeSegno = DatiSegni.Nome
    const Pianeta: any = Pinia.TemaNatalePianeti().getElenco.find(
      (item) => item.Nome === NomePianeta
    )
    const SegniPianeta: any = Pianeta?.Segno
    const ElementiPianeta: any = Pianeta?.Elemento
    if (SegniPianeta) {
      if (NomePianeta === 'Sole') {
        const Polarità = Pinia.TemaNatalePolaritàSegni().getElenco.find(
          (item) => item.Id === DatiSegni.Polarità
        )
        const Governatore = Pinia.TemaNataleGovernatoriSegni().getElenco.find(
          (item) => item.Id === DatiSegni.Governatore && item.Segno === NomeSegno
        )
        const Opposto = Pinia.TemaNataleOppostoSegni().getElenco.find(
          (item) => item.Id === DatiSegni.Opposto
        )
        const Quadruplicità = Pinia.TemaNataleQuadruplicitàSegni().getElenco.find(
          (item) => item.Id === DatiSegni.Quadruplicità
        )
        const Stagione = Pinia.TemaNataleStagioni().getElenco.find(
          (itemst) => Quadruplicità?.IdStagione === itemst.Id
        )
        const Natura = Pinia.TemaNataleNatura().getElenco.find(
          (itemn) => Quadruplicità?.IdNatura === itemn.Id
        )
        Spiegazione =
          '<div class="text-left bg-white w-[1200px] m-auto">' +
          'Tema natale di ' +
          Nome.value +
          ' (' +
          DataNascita.value +
          ', ' +
          LuogoNascita.value +
          ')<br />' +
          '<b>' +
          DatiSegni.Nome +
          '</b>' +
          '<br />' +
          Polarità?.Significato +
          '<br />' +
          'Stagione: ' +
          Stagione?.Nome +
          ' - ' +
          Stagione?.Significato +
          '<br />' +
          'Natura: ' +
          Natura?.Nome +
          ' - ' +
          Natura?.Significato +
          '<br />' +
          Quadruplicità?.Significato +
          '<br />' +
          Elemento?.Significato +
          '<br />' +
          Governatore?.Significato +
          '<br />' +
          'Le tue parole chiave sono: ' +
          DatiSegni.ParoleChiavi +
          '<br />' +
          Opposto?.Significato +
          '<br />' +
          DatiSegni.Significato +
          '<br /><br />' +
          '<b>Punti di forza sono</b>:<br /><div class="ml-5">' +
          DatiSegni.Forza +
          '</div>' +
          '<br />' +
          '<b>Punti di debolezza sono</b>:<br /><div class="ml-5">' +
          DatiSegni.Debolezza +
          '</div><br />'
        /*Spiegazione += '<table class="border border-[1px] border-blue-900 mt-5"><tr><td colspan=2 class="border border-[1px] border-blue-900">' + DatiSegni?.Nome + ' (' + DatiSegni.Periodo + ')</td></tr>' +
                    '<tr><td class="border border-[1px] border-blue-900">Polarità:</td><td class="border border-[1px] border-blue-900 text-left">' + Polarità?.Nome + '<br />' + Polarità?.Significato + '</td></tr>' +
                    '<tr><td class="border border-[1px] border-blue-900">Quadruplicità:</td><td class="border border-[1px] border-blue-900 text-left">' + Natura + ' ' + Stagione + '<br />' + Quadruplicità?.Significato + '</td></tr>' +
                    '<tr><td class="border border-[1px] border-blue-900">Elemento:</td><td class="border border-[1px] border-blue-900 text-left">' + Elemento?.Nome + '<br />' + Elemento?.Significato + '</td></tr>' +
                    '<tr><td class="border border-[1px] border-blue-900">Governatore:</td><td class="border border-[1px] border-blue-900 text-left">' + Governatore?.Pianeta + '<br />' + Governatore?.Significato + '</td></tr>' +
                    '<tr><td class="border border-[1px] border-blue-900">Parole chiave:</td><td class="border border-[1px] border-blue-900 text-left">' + DatiSegni.Parolechiave + '</td></tr>' +
                    '<tr><td class="border border-[1px] border-blue-900">Significato:</td><td class="border border-[1px] border-blue-900 text-left">' + DatiSegni.Significato + '</td></tr>' +
                    '<tr><td class="border border-[1px] border-blue-900">Opposto:</td><td class="border border-[1px] border-blue-900 text-left">' + Opposto?.Opposto + '<br />' + Opposto?.Significato + '</td></tr>' +
                    '<tr><td colspan=2 class="border border-[1px] border-blue-900 text-left">Punti di forza:</td></tr><td></td><td class="border border-[1px] border-blue-900 text-left">' + DatiSegni?.Forza + '</td></tr>' +
                    '<tr><td colspan=2 class="border border-[1px] border-blue-900  text-left">Punti di debolezza:</td></tr><tr><td></td><td class="border border-[1px] border-blue-900 text-left">' + DatiSegni?.Debolezza +
                    '</td></tr></table>'*/
      }
      const elemento = Object.keys(ElementiPianeta).find((item) => item === NomeElemento)
      const segno = Object.keys(SegniPianeta).find((item) => item === NomeSegno)
      //console.log('Elemento:', elemento, 'Segno:', segno, ElementiPianeta, NomeElemento);

      if (elemento) {
        //console.log(Pianeta, elemento, ElementiPianeta[elemento])
        Spiegazione +=
          '<div class="text-left bg-white w-[1200px] m-auto"><b>' +
          NomePianeta +
          '</b>:' +
          '<br />' +
          Pianeta.Significato +
          '<br />' +
          'Le sue parole chiave sono ' +
          Pianeta.Parolechiave +
          '<br /> Le parole chiave del pianeta ' +
          NomePianeta +
          " nell'elemento " +
          elemento +
          ' sono: ' +
          ElementiPianeta[elemento] +
          '</div>'
      }
      if (segno) {
        //console.log(Pianeta, segno, SegniPianeta[segno])
        Spiegazione +=
          '<div class="text-left bg-white w-[1200px] m-auto">' +
          'Le parole chiave del ' +
          NomePianeta +
          ' in ' +
          NomeSegno +
          ' sono: ' +
          SegniPianeta[segno].Parolechiave +
          '<br />' +
          SegniPianeta[segno].Significato +
          '</div>'
      }
    }
  }
  return Spiegazione
}

const Test = (DatiPianeta: any, _riga: number) => {
  // pianeta significato + parole chiave
  ObjPianeta.value = DatiPianeta
  const Retrogrado = DatiPianeta.Pianeta.Retrogrado
  riga.value = _riga
  const Pianeta = Pinia.TemaNatalePianeti().getElenco.find(
    (item) => item.Id === DatiPianeta.Pianeta.Id
  ) as { [key: string]: any } | undefined
  const NomeSegnoPianeta = Pinia.TemaNataleSegni().getElenco.find(
    (item) => item.Id === DatiPianeta.Pianeta.IdSegno
  )?.Nome
  // Add type assertion for Segno property
  const pianetaSegno = NomeSegnoPianeta
    ? ((Pianeta?.Segno ?? {})[NomeSegnoPianeta] as Record<string, any>)
    : {}
  //console.log('Pianeta:', DatiPianeta)
  if (Pianeta) {
    //console.log(DatiPianeta.Pianeta.Retrogrado)
    SegnoPianeta.value = NomeSegnoPianeta ?? ''
    const PianetaSignificato = DatiPianeta.Pianeta.Retrogrado
      ? Pianeta.SignificatoRetrogrado
      : Pianeta.Significato
    const PianetaParolechiave = DatiPianeta.Pianeta.Retrogrado
      ? Pianeta.ParolechiaveRetrogrado
      : Pianeta.Parolechiave

    DatiTest.value = '<div class="text-left '
    if (DatiPianeta.Pianeta.Retrogrado) {
      DatiTest.value += 'bg-red-100'
    } else {
      DatiTest.value += 'bg-white'
    }
    DatiTest.value +=
      ' w-[1200px] m-auto"><div>' +
      '<b>' +
      Pianeta.Nome +
      '</b>:' +
      '<br /><span class="bg-green-300">Significato</span> '
    if (Retrogrado) {
      DatiTest.value += '<span class="bg-green-300">Retrogrado</span> '
    }
    DatiTest.value +=
      ': ' +
      PianetaSignificato +
      '<br />' +
      '<span class="bg-green-300">Le sue parole chiave</span> '
    //console.log(Pianeta)
    if (Retrogrado) {
      DatiTest.value +=
        '<span class="bg-green-300">Retrogrado</span> ' + Pianeta.ParolechiaveRetrogrado
    }
    DatiTest.value += 'sono: ' + Pianeta.ParoleChiavi + '</div>'
  }
  /*
  const PianetaSegnoSignificato = DatiPianeta.Pianeta.Retrogrado
    ? pianetaSegno.SignificatoRetrogrado
    : pianetaSegno.Significato
  const PianetaSegnoParolechiave = DatiPianeta.Pianeta.Retrogrado
    ? pianetaSegno.ParolechiaveRetrogrado
    : pianetaSegno.Parolechiave*/
  if (pianetaSegno) {
    DatiTest.value +=
      '<div class="text-left w-[1200px] m-auto"><b>' +
      Pianeta?.Nome +
      ' in ' +
      NomeSegnoPianeta +
      "</b><br /><span class='bg-green-300'>Significato</span> "
    if (Retrogrado) {
      DatiTest.value +=
        '<span class="bg-green-300">Retrogrado</span>: ' + pianetaSegno.SignificatoRetrogrado
    } else {
      DatiTest.value += ': ' + pianetaSegno.Significato
    }
    DatiTest.value += "<br /><span class='bg-green-300'>Parole chiave</span> "
    if (Retrogrado) {
      DatiTest.value +=
        '<span class="bg-green-300">Retrogrado</span>: ' + pianetaSegno.ParolechiaveRetrogrado
    } else {
      DatiTest.value += ': ' + pianetaSegno.ParoleChiavi
    }

    //PianetaSegnoParolechiave + '<br />Significato: ' + PianetaSegnoSignificato + '</div>'
  }
  const Casa = Pinia.TemaNataleCase().getElenco.find((item) => item.Id === DatiPianeta.Casa.Id)
  if (Casa) {
    const SegnoCasa = Pinia.TemaNataleSegni().getElenco.find(
      (item) => item.Id === DatiPianeta.Casa.IdSegno
    )
    if (SegnoCasa) {
      DatiTest.value +=
        '<div class="text-left w-[1200px] m-auto"><b>Casa ' +
        Casa.Sigla +
        '</b><br />' +
        '<span class="bg-green-300">Significato</span> '
      if (Retrogrado) {
        DatiTest.value += '<span class="bg-green-300">Retrogrado</span> '
      }
      DatiTest.value +=
        ': ' + Casa.Significato + '<br /><span class="bg-green-300">Le parole chiave</span> '
      if (Retrogrado) {
        DatiTest.value += '<span class="bg-green-300">Retrogrado</span> '
      }
      DatiTest.value +=
        'del segno ' +
        SegnoCasa.Nome +
        ' in casa ' +
        Casa.Sigla +
        ' sono: ' +
        SegnoCasa.ParoleChiavi +
        '</div>'
    }

    const PianetaCasaSegno = Pinia.TemaNatalePianetiCaseSegni().getElenco.find(
      (item) =>
        item.IdPianeta === DatiPianeta.Pianeta.Id &&
        item.IdSegnoPianeta === DatiPianeta.Pianeta.IdSegno &&
        item.Casa === DatiPianeta.Casa.Id &&
        item.IdSegnoCasa === DatiPianeta.Casa.IdSegno &&
        item.Retrogrado === DatiPianeta.Pianeta.Retrogrado
    )
    //console.log('PianetaCasaSegno:', PianetaCasaSegno)
    if (PianetaCasaSegno) {
      DatiTest.value +=
        '<div class="text-left w-[1200px] m-auto"><b>Pianeta nel segno nella casa nel segno</b><br />'
      if (Retrogrado) {
        DatiTest.value +=
          '<span class="bg-green-300">Significato Retrogrado</span>: ' +
          PianetaCasaSegno.Significato
      } else {
        DatiTest.value +=
          '<span class="bg-green-300">Significato</span>: ' + PianetaCasaSegno.Significato
      }
      DatiTest.value += '<br />' + '<span class="bg-green-300">Le parole chiave </span>'
      if (Retrogrado) {
        DatiTest.value += '<span class="bg-green-300">Retrogrado</span>'
      }
      DatiTest.value += 'sono: ' + PianetaCasaSegno.ParoleChiavi + '</div>'
    }
    DatiTest.value += '</div>'
  }
  //console.log('DatiTest:', DatiTest.value)
}

const Aggiorna = (campo: string) => {
  //console.log(Pinia.TemaNatalePianeti().getElenco)
  const DatiPianeta = Pinia.TemaNatalePianeti().getElenco.find(
    (item) => item.Id === ObjPianeta.value['Pianeta'].Id
  ) as { [key: string]: any } | undefined
  //console.log('DatiPianeta:', DatiPianeta, ObjPianeta.value['Pianeta'].Id)
  let DatiSegnoPianeta
  if (DatiPianeta) {
    //console.log(DatiPianeta['Segno']['Gemelli'], ObjPianeta.value, ObjPianeta.value['Pianeta']['IdSegno'])

    DatiDaAggiornare.value.Significato = ''
    DatiDaAggiornare.value.Parolechiave = ''
    DatiDaAggiornare.value.SignificatoRetrogrado = ''
    DatiDaAggiornare.value.ParolechiaveRetrogrado = ''
    const NomeSegnoPianeta =
      Pinia.TemaNataleSegni().getElenco.find(
        (item) => item.Id === ObjPianeta.value['Pianeta']['IdSegno']
      )?.Nome ?? ''
    if (NomeSegnoPianeta && DatiPianeta.Segno) {
      DatiSegnoPianeta = DatiPianeta.Segno[NomeSegnoPianeta as string] || {}
      //console.log('DatiSegnoPianeta:', DatiPianeta)
    }
    switch (campo) {
      case 'Pianeta':
        DatiDaAggiornare.value.riguadro = 'Pianeta'
        if (DatiPianeta) {
          DatiDaAggiornare.value.Significato = DatiPianeta.Significato
          DatiDaAggiornare.value.SignificatoRetrogrado = DatiPianeta.SignificatoRetrogrado
          DatiDaAggiornare.value.ParolechiaveRetrogrado = DatiPianeta.ParoleChiaviRetrogrado
          DatiDaAggiornare.value.Parolechiave = DatiPianeta.ParoleChiavi
        }
        break
      case 'PianetaSegno':
        DatiDaAggiornare.value.riguadro = 'PianetaSegno'
        //console.log('NomeSegnoPianeta:', NomeSegnoPianeta)
        //console.log('DatiSegnoPianeta:', DatiSegnoPianeta)
        if (NomeSegnoPianeta && DatiSegnoPianeta) {
          DatiDaAggiornare.value.Significato = DatiSegnoPianeta.Significato
          DatiDaAggiornare.value.SignificatoRetrogrado = DatiSegnoPianeta.SignificatoRetrogrado
          DatiDaAggiornare.value.ParolechiaveRetrogrado = DatiSegnoPianeta.ParoleChiaviRetrogrado
          DatiDaAggiornare.value.Parolechiave = DatiSegnoPianeta.ParoleChiavi
        }
        break
      case 'Casa':
        DatiDaAggiornare.value.riguadro = 'Casa'
        const Casa = Pinia.TemaNataleCase().getElenco.find(
          (item) => item.Id === ObjPianeta.value['Casa']['Id']
        )
        if (Casa) {
          DatiDaAggiornare.value.Significato = Casa.Significato
          DatiDaAggiornare.value.Parolechiave = Casa.ParoleChiavi
        }
        break
      case 'PianetaSegnoCasaSegno':
        const IdPianeta = ObjPianeta.value['Pianeta']['Id']
        const PianetaRetrogrado = ObjPianeta.value['Pianeta']['Retrogrado']
        const IdSegnoPianeta = ObjPianeta.value['Pianeta']['IdSegno']
        const IdCasa = ObjPianeta.value['Casa']['Id']
        const IdSegnoCasa = ObjPianeta.value['Casa']['IdSegno']
        /*
      console.log('pianeta id: ', IdPianeta)
      console.log('Retrogrado:', PianetaRetrogrado)
      console.log('pianeta segno id:', IdSegnoPianeta)     
      
      console.log('casa id:', IdCasa)
      console.log('casa segno id:', IdSegnoCasa)*/
        const PianetaCasaSegno = Pinia.TemaNatalePianetiCaseSegni().getElenco.find(
          (item) =>
            item.IdPianeta === IdPianeta &&
            item.IdSegnoPianeta === IdSegnoPianeta &&
            item.Casa === IdCasa &&
            item.IdSegnoCasa === IdSegnoCasa &&
            item.Retrogrado === PianetaRetrogrado
        )
        DatiDaAggiornare.value.riguadro = 'PianetaSegnoCasaSegno'
        if (PianetaCasaSegno) {
          DatiDaAggiornare.value.Significato = PianetaCasaSegno.Significato
          DatiDaAggiornare.value.Parolechiave = PianetaCasaSegno.ParoleChiavi
        }
        break
      default:
        DatiDaAggiornare.value.riguadro = ''
        break
    }
  }
}
const Salva = (campo: string) => {
  //console.log('Salva campo:', campo)
  let Pianeta = Pinia.TemaNatalePianeti().getElenco.find(
    (item) => item.Id === ObjPianeta.value['Pianeta'].Id
  )
  if (Pianeta) {
    // Add index signature to Segno property for type safety
    type PianetaWithSegnoIndex = typeof Pianeta & { Segno: { [key: string]: any } }
    const PianetaWithIndex = Pianeta as PianetaWithSegnoIndex

    let nuovopianeta = { ...Pianeta, IdPianeta: Pianeta.Id }
    // Add index signature to Segno for type safety
    type NuovoPianetaWithSegnoIndex = typeof nuovopianeta & { Segno: { [key: string]: any } }
    const nuovopianetaWithIndex = nuovopianeta as NuovoPianetaWithSegnoIndex
    delete nuovopianetaWithIndex.Id
    //console.log('nuovopianetaWithIndex:', nuovopianetaWithIndex)
    switch (campo) {
      case 'Pianeta':
        //console.log('Pianeta:', nuovopianetaWithIndex)
        nuovopianetaWithIndex.Significato = DatiDaAggiornare.value.Significato ?? ''
        nuovopianetaWithIndex.SignificatoRetrogrado =
          DatiDaAggiornare.value.SignificatoRetrogrado ?? ''
        nuovopianetaWithIndex.ParoleChiavi = DatiDaAggiornare.value.Parolechiave ?? ''
        nuovopianetaWithIndex.ParoleChiaviRetrogrado =
          DatiDaAggiornare.value.ParolechiaveRetrogrado ?? ''
        //console.log('Pianeta aggiornato:', nuovopianetaWithIndex)
        Pinia.TemaNatalePianeti()
          .Aggiorna(nuovopianetaWithIndex)
          .then(() => {
            Salvato.value = true
            setTimeout(() => {
              Salvato.value = false
            }, 2000)
          })
          .catch((error) => {
            console.error("Errore durante l'aggiornamento del pianeta:", error)
            Salvato.value = false
          })
        break
      case 'PianetaSegno':
        console.log('pianetasegno')
        console.log(nuovopianetaWithIndex.Segno, ObjPianeta.value['Pianeta']['IdSegno'])
        const NomeSegnoPianeta = Pinia.TemaNataleSegni().getElenco.find(
          (item) => item.Id === ObjPianeta.value['Pianeta']['IdSegno']
        )?.Nome
        if (NomeSegnoPianeta) {
          nuovopianetaWithIndex.Segno[NomeSegnoPianeta]['Significato'] =
            DatiDaAggiornare.value.Significato ?? ''
          nuovopianetaWithIndex.Segno[NomeSegnoPianeta]['ParoleChiavi'] =
            DatiDaAggiornare.value.Parolechiave ?? ''
          nuovopianetaWithIndex.Segno[NomeSegnoPianeta]['SignificatoRetrogrado'] =
            DatiDaAggiornare.value.SignificatoRetrogrado ?? ''
          nuovopianetaWithIndex.Segno[NomeSegnoPianeta]['ParoleChiaviRetrogrado'] =
            DatiDaAggiornare.value.ParolechiaveRetrogrado ?? ''
          //console.log('Pianeta aggiornato:', nuovopianetaWithIndex)
          Pinia.TemaNatalePianeti()
            .Aggiorna(nuovopianetaWithIndex)
            .then(() => {
              Salvato.value = true
              setTimeout(() => {
                Salvato.value = false
              }, 2000)
            })
            .catch((error) => {
              console.error("Errore durante l'aggiornamento del pianeta:", error)
              Salvato.value = false
            })
        }
        break
      case 'Casa':
        console.log('casa')
        let Casa = Pinia.TemaNataleCase().getElenco.find(
          (item) => item.Id === ObjPianeta.value['Casa']['Id']
        )
        if (Casa) {
          Casa = { ...Casa, Id: ObjPianeta.value['Casa']['Id'] }
          Casa.Significato = DatiDaAggiornare.value.Significato ?? ''
          Casa.ParoleChiavi = DatiDaAggiornare.value.Parolechiave ?? ''
          Pinia.TemaNataleCase()
            .Aggiorna(Casa)
            .then(() => {
              Salvato.value = true
              setTimeout(() => {
                Salvato.value = false
              }, 2000)
            })
            .catch((error) => {
              console.error("Errore durante l'aggiornamento della casa:", error)
              Salvato.value = false
            })
        }
        break

      case 'PianetaSegnoCasaSegno':
        const IdPianeta = ObjPianeta.value['Pianeta']['Id']
        const PianetaRetrogrado = ObjPianeta.value['Pianeta']['Retrogrado']
        const IdSegnoPianeta = ObjPianeta.value['Pianeta']['IdSegno']
        const IdCasa = ObjPianeta.value['Casa']['Id']
        const IdSegnoCasa = ObjPianeta.value['Casa']['IdSegno']
        let PianetaCasaSegno = Pinia.TemaNatalePianetiCaseSegni().getElenco.find(
          (item) =>
            item.IdPianeta === IdPianeta &&
            item.IdSegnoPianeta === IdSegnoPianeta &&
            item.Casa === IdCasa &&
            item.IdSegnoCasa === IdSegnoCasa &&
            item.Retrogrado === PianetaRetrogrado
        )
        if (PianetaCasaSegno) {
          PianetaCasaSegno.Significato = DatiDaAggiornare.value.Significato ?? ''
          PianetaCasaSegno.ParoleChiavi = DatiDaAggiornare.value.Parolechiave ?? ''
          Pinia.TemaNatalePianetiCaseSegni()
            .Aggiorna(PianetaCasaSegno)
            .then(() => {
              Salvato.value = true
              setTimeout(() => {
                Salvato.value = false
              }, 2000)
            })
            .catch((error) => {
              console.error("Errore durante l'aggiornamento della casa:", error)
              Salvato.value = false
            })
        }
    }
  }
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
.StoSalvando {
  @apply bg-blue-300 p-2 m-2 text-black rounded rounded-[45px] cursor-not-allowed;
}
</style>
