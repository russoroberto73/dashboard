<template>
  <div class="calendar" id="Turni" :class="route.params.id === 'stampa' ? 'mt-[-100px]': 'mt-4'">
    <h1 class="text-center text-[30px]">Turni assistenti</h1>
    <template v-if="route.params.id !== 'stampa'">
      <h2 class="text-center text-[25px]">Calendario</h2>
    <template v-if="route.params.id === 'dettaglio'">
      <h2 class="text-center text-[25px]">Gestione turni</h2>
    </template>    
    <router-link
      :to="{ name: 'TurniDettaglio', params: { id: 'dettaglio' } }"
      v-if="route.params.id !== 'dettaglio'"
    >
      <button class="BTNAzione !w-[150px]">Dettaglio</button>
    </router-link>
    <router-link :to="{ name: 'TurniCalendario' }" v-else>
      <button class="BTNAzione !w-[150px]">Calendario</button>
    </router-link>
    </template>
    <div v-if="route.params.id === 'dettaglio'">
      <div class="text-center">
        <select class="m-2" v-model="NomeAssistente">
          <option v-for="assistente in As" :key="assistente.Nome">{{ assistente.Nome }}</option>
        </select>
        <input type="date" class="m-2" v-model="DataTurno" />
        Orario:
        <input type="text" class="m-2" v-model="OrarioTurno" />
        <button
          class="m-2 BTNAzione"
          style="width: 150px"
          @click="AggiungiTurno"
          :disabled="Verifica"
          :class="Verifica ? 'bg-red-300' : 'BTNSalva cursor - pointer'"
        >
          Aggiungi turno
        </button>
      </div>
      <hr />
      <div class="text-center">
        <div @click="nextState" class="inline-flex items-center cursor-pointer">
          <div :class="['relative w-[82px] h-6 rounded-full transition-all', bgColor]">
            <div
              :class="[
                'absolute top-[2px] start-[2px] h-5 w-5 rounded-full bg-white border transition-all',
                knobPosition
              ]"
            ></div>
          </div>
        </div>
      </div>
      <div v-if="state === 0">
        <h1 class="text-[25px] text-center">0 - Turni nel calendario</h1>
        <div class="bg-gray-300 my-4 p-2 rounded-lg w-[250px] m-auto text-center">
          (As.value, FiltroAnnoMese.value, FiltroAssistente.value)
          <div class="text-center font-bold">Filtri</div>
          <div class="text-left flex justify-center grid grid-cols-2">
            <div>MeseAnno:</div>
            <input type="text" class="m-2" v-model="FiltroAnnoMese" />
            <div>Assistenti:</div>
            <select class="m-2" v-model="FiltroAssistente">
              <option value="">Nessuno</option>
              <option v-for="assistente in As" :value="assistente.Id">
                {{ assistente.Nome }}
              </option>
            </select>
          </div>
          <table class="w-[400px] bg-red-200 hidden">
            <tr>
              <td class="text-left">
                MeseAnno:<input type="text" class="m-2" v-model="FiltroAnnoMese" /><br />
                Assistenti:<select class="m-2" v-model="FiltroAssistente">
                  <option value="">Nessuno</option>
                  <option v-for="assistente in As" :value="assistente.Id">
                    {{ assistente.Nome }}
                  </option>
                </select>
              </td>
            </tr>
          </table>
        </div>
        <Rtable :items="Items" :pinia="Pinia.CalendarioTurni()" />
      </div>
      <div v-else-if="state === 1" class="text-center">
        <h1 class="text-[25px] text-center">1 - Distribuzione nomi turni</h1>
        (ItemsDistribuzioneNomiTurni.value, senza filtro)
        <Rtable
          :items="ItemsDistribuzioneNomiTurni"
          :pinia="Pinia.DistribuzioneTurniAssistenti()"
        />
      </div>
      <div v-else-if="state === 2" class="text-center">
        <h1 class="text-[25px]">2 - Sabati non lavorati</h1>
        (ItemsTurniSabati.value, senza filtro)
        <Rtable :items="ItemsTurniSabati" :pinia="Pinia.AssistentiSabati()" />
      </div>
      <div v-else-if="state === 3" class="text-center">
        <h1 class="text-[25px]">3 - Ferie assistenti</h1>
        (ItemAssistentiFerie.value, FiltroAnnoMese.value)<br />
        Anno-Mese:
        <input v-model="FiltroAnnoMese" placeholder="Filtra per mese" class="m-2 p-1 rounded-lg" />
        <Rtable :items="ItemAssistentiFerie" :pinia="Pinia.AssistentiFerie()" />
      </div>
      <div v-else-if="state === 4" class="text-center">
        <h1 class="text-[25px]">4 - Giorni Festivi</h1>
        (ItemGiorniFestivi.value, Filtromesefestivo)<br />
        Anno-Mese:
        <input
          v-model="Filtromesefestivo"
          placeholder="Filtra per mese"
          class="m-2 p-1 rounded-lg"
        /><br />
        Assistenti:<select class="m-2" v-model="FiltroAssistente">
                  <option value="">Nessuno</option>
                  <option v-for="assistente in As" :value="assistente.Id">
                    {{ assistente.Nome }}
                  </option>
                </select>
        <Rtable :items="ItemGiorniFestivi" :pinia="Pinia.AssistentiGiorniFestivi()" />
      </div>
      <div v-else-if="state === 5" class="text-center">
        <h1 class="text-[25px]">5 - Orari neri</h1>
        <Rtable :items="ItemAssistentiOrariNero" :pinia="Pinia.AssistentiOrariNero()" />
      </div>
      <div v-else-if="state === 6" class="text-center">
        <h1 class="text-[25px]">6 - Blocca mese</h1>
        <Rtable :items="ItemsBloccaMese" :pinia="Pinia.BloccaMeseCalendario()" />
      </div>
      <div v-else-if="state === 7" class="text-center">
        <h1 class="text-[25px]">7 - Id Assistenti</h1>
        <table class="w-[500px] h-[200px] m-auto" style="border: 1px solid black !important">
          <thead>
            <tr>
              <th class="!border !border-black border-5">IdAssistenti</th>
              <th class="!border !border-black border-5">IdNero</th>
              <th class="!border !border-black border-5">Nome</th>
              <th class="!border !border-black border-5">Weekend</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="assistente in As" :key="assistente.Id" class="!h-[30px]">
              <td class="!h-[20px] !w-[300px] !border !border-black border-2">
                {{ Pinia.Assistenti().getElenco.find((a) => a.Id === assistente.Id)?.Id }}
              </td>
              <td class="!h-[20px] !border !border-black border-2">
                {{ Pinia.AssistentiNero().getElenco.find((a) => a.Id === assistente.Id)?.Id }}
              </td>
              <td class="!h-[20px] !border !border-black border-2">{{ assistente.Nome }}</td>
              <td class="!h-[20px] !border !border-black border-2">{{ assistente.Weekend }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="text-center">
      <h2>{{ nomeMese }} {{ anno }}</h2>
      <button @click="mesePrecedente">◀</button>
      <button @click="meseSuccessivo">▶</button>
    </div>
    <div class="w-[1800px] m-auto" v-if="route.params.id !== 'stampa'">
      <span v-if="TestMeseBloccato">
        <button class="BTNAzione !w-[180px]" @click="CompilaTabelleFuoriBusta">
          Compila tabella fuori busta
        </button>
      </span>
      <span v-else-if="TestMese">
        <button class="BTNAzione !w-[180px]" @click="BloccaMese">Blocca mese</button>
      </span>
    </div>
    <div v-if="ArrayFuoriBusta.length" class="text-center">
      <table class="m-auto border border-black w-[700px] bg-white">
        <tr>
          <th class="border border-black p-2">IdAssistenteNero</th>
          <th class="border border-black p-2 !w-[300px]">Data</th>
          <th class="border border-black p-2">Ore</th>
          <th class="border border-black p-2">PagaOraria</th>
          <th class="border border-black p-2">Azione</th>
        </tr>
        <tr v-for="(item, index) in ArrayFuoriBusta" :key="index">
          <td class="border border-black" style="height: 50px">
            {{ As.find((a) => a.Id === item.IdAssistenteNero)?.Nome }}
          </td>
          <td class="border border-black" style="height: 50px">{{ item.Data }}</td>
          <td class="border border-black" style="height: 50px">{{ item.Ore }}</td>
          <td class="border border-black" style="height: 50px">{{ item.PagaOraria }}</td>
          <td class="text-center flex justify-center" style="height: 50px">
            <div v-if="TestEsisteBustaPagaNero(item)" class="text-green-600 font-bold">
              Già presente
            </div>
            <BTNSalva
              class="BTNAzione BTNSalva"
              @click="AggiungiBustePagaNero(item)"
              v-else
            ></BTNSalva>
          </td>
        </tr>
      </table>
    </div>
    <table class="w-[1800px]">
      <thead>
        <tr>
          <th>Lun</th>
          <th>Mar</th>
          <th>Mer</th>
          <th>Gio</th>
          <th>Ven</th>
          <th>Sab</th>
          <th>Dom</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(settimana, i) in calendario" :key="i">
          <td v-for="(giorno, j) in settimana" :key="j">
            <span v-if="giorno">
              <div class="font-bold text-[17px] grid grid-rows-[1fr_80px]">
                <div class="grid grid-cols-[30px_1fr]">
                  <button
                    class="rounded-lg h-[30px] w-[30px] p-1 m-1 cursor-pointer"
                    @click="TurniGiorno(ComponiData(giorno))"
                    :disabled="TestMeseBloccato"
                    :class="TestMeseBloccato ? 'bg-red-300' : 'bg-white'"
                  >
                    {{ giorno }}
                  </button>
                </div>
                <div>
                  <template v-for="Turni in TurniDate" :key="Turni.Data">
                    <div v-if="ComponiData(giorno) === Turni.Data" :class="Turni.elementi.some(e => e.Ferie) ? 'bg-blue-900 p-2' : Turni.elementi.some(e => e.Festivo) ? 'bg-orange-400 p-2' : ''">                                          
                      <div
                        v-for="(element, idx) in Turni.elementi.sort((a, b) => a.Ordine - b.Ordine)"
                        :key="idx"
                        class="h-[30px] m-1 rounded-lg"
                        :style="{
                          backgroundColor: As.filter((p) => p.Id === element.IdAssistente)[0].Colore
                        }"
                      >
                        <div
                          v-if="
                            ModiAssistente ===
                              As.filter((p) => p.Id === element.IdAssistente)[0].Nome &&
                            ModiGiorno == giorno &&
                            element.Orario === ModiOrarioVecchio
                          "
                        >
                          <div class="grid grid-cols-[80px_90px_20px_20px_1fr] w-[140px]">
                            <input type="hidden" v-model="ModiId" />
                            <input type="text" v-model="ModiOrario" class="w-[100px]" />
                            <span>{{ ModiAssistente }}</span>
                            <input type="checkbox" v-model="ModiFerie" />F
                            <BTNSalva
                              class="w-[20px] h-[30px] BTNAzione"
                              @click="Aggiorna(giorno)"
                            />
                          </div>
                        </div>
                        <div v-else>
                          <div
                            class="Orario cursor-pointer"
                            @click="Modifica({ ...element, giorno })"
                          >
                            {{ element.Orario }}
                          </div>
                          <div class="Assistente !text-[15px]">
                            {{ As.filter((p) => p.Id === element.IdAssistente)[0].Nome }}
                            <span>{{ element.Nero ? '(N)' : '' }}</span>
                            <span>{{ element.Ferie ? (element.Nero ? ' (A)' : '(F)') : '' }}</span>
                            <span v-if="false">({{ element.Ordine }})</span>
                            <span v-if="false">
                              <span v-if="element.PagaOraria !== undefined">
                                {{ element.PagaOraria }}
                              </span>
                              <span v-if="element.NumeroOre !== undefined && element.NumeroOre > 0">
                                ,{{ element.NumeroOre }}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Pinia } from '@/stores'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import BTNSalva from '@/assets/IconeSvg/Salva.vue'

const route = useRoute()
const Elenco = Pinia.CalendarioTurni().getElenco
const ElencoTurniSabati = Pinia.AssistentiSabati().getElenco
const ElencoDistribuzioneNomiTurni = Pinia.DistribuzioneTurniAssistenti().getElenco
const ElencoAssistentiOrariNero = Pinia.AssistentiOrariNero().getElenco
const ModiOrarioVecchio = ref('')
const ModiOrario = ref('')
const ModiAssistente = ref('')
const ModiId = ref('')
const ModiGiorno = ref('')
const ModiFerie = ref(false)

const Filtromesefestivo = ref('')
const ArrayFuoriBusta = ref([])
const Items = computed(() => {
  return Elenco.map((item) => {
    //console.log('item', item.Data)
    let Filtro = true
    if (FiltroAnnoMese.value !== '') {
      Filtro = Filtro && FiltroAnnoMese.value === item.Data?.substring(0, 7)
    }
    if (FiltroAssistente.value !== '') {
      Filtro = Filtro && FiltroAssistente.value === item.IdAssistente
    }
    if (Filtro) {
      return {
        Id: {
          Type: 'string',
          Value: item.Id,
          Class: 'text-left'
        },
        vIdAssistente: {
          Type: 'text',
          Value: item.IdAssistente,
          Class: 'text-center',
          Readonly: true
        },
        Data: {
          Type: 'Data',
          Value: item.Data,
          Class: 'text-center',
          Valido: 'p'
        },
        IdAssistente: {
          Type: 'select',
          Value: item.IdAssistente,
          Class: 'text-center',
          Array: DatiComboAssistenti(),
          Valido: 'p'
        },
        Orario: {
          Type: 'string',
          Value: item.Orario,
          Class: 'text-center',
          Valido: 'p'
        },
        Ordine: {
          Type: 'string',
          Value: item.Ordine,
          Class: 'text-center',
          Valido: 'p'
        },
        Nero: {
          Type: 'boolean',
          Value: item.Nero,
          Class: 'text-center'
        },
        Ferie: {
          Type: 'boolean',
          Value: item.Ferie,
          Class: 'text-center'
        },
        PagaOraria: {
          Type: 'string',
          Value: item.PagaOraria,
          Class: 'text-center'
        },
        NumeroOre: {
          Type: 'string',
          Value: item.NumeroOre,
          Class: 'text-center'
        },
        Festivo: {
          Type: 'boolean',
          Value: item.Festivo,
          Class: 'text-center'
        }
      }
    }
  })
    .filter((item) => item !== undefined)
    .sort((a, b) => {
      if (a.IdAssistente.Value < b.IdAssistente.Value) return -1
      if (a.IdAssistente.Value > b.IdAssistente.Value) return 1
      return 0
    })
})
const ItemsTurniSabati = computed(() => {
  return ElencoTurniSabati.map((item) => {
    return {
      Id: {
        Type: 'string',
        Value: item.Id,
        Class: 'text-left'
      },
      vIdAssistente: {
        Type: 'text',
        Value: item.IdAssistente,
        Class: 'text-center',
        Readonly: true
      },
      IdAssistente: {
        Type: 'select',
        Value: item.IdAssistente,
        Class: 'text-center',
        Array: DatiComboAssistenti(),
        Valido: 'p'
      },
      Anno: {
        Type: 'string',
        Value: item.Anno,
        Class: 'text-center',
        Valido: 'p'
      },
      Mese: {
        Type: 'string',
        Value: item.Mese,
        Class: 'text-center',
        Valido: 'p'
      },
      GiornoSabato: {
        Type: 'string',
        Value: item.GiornoSabato,
        Class: 'text-center',
        Valido: 'p'
      }
    }
  }).sort((a, b) => {
    if (a.IdAssistente.Value < b.IdAssistente.Value) return -1
    if (a.IdAssistente.Value > b.IdAssistente.Value) return 1
    return 0
  })
})
const ItemGiorniFestivi = computed(() => {
  return Pinia.AssistentiGiorniFestivi()
    .getElenco.map((item) => {
      let Filtro = true
      if (Filtromesefestivo.value !== '') {
        Filtro = Filtro && Filtromesefestivo.value === item.Data?.substring(0, 7)
      }
      if (FiltroAssistente.value !== '') {
        Filtro = Filtro && FiltroAssistente.value === item.IdAssistente
      }
      if (Filtro) {
        return {
          Id: {
            Type: 'string',
            Value: item.Id,
            Class: 'text-left'
          },

          vIdAssistente: {
            Type: 'text',
            Value: item.IdAssistente,
            Class: 'text-center'
          },

          IdAssistente: {
            Type: 'select',
            Value: item.IdAssistente,
            Class: 'text-center',
            Array: DatiComboAssistenti(),
            Valido: 'p'
          },
          Data: {
            Type: 'date',
            Value: item.Data,
            Class: 'text-center',
            Valido: 'p'
          },
          Orario: {
            Type: 'string',
            Value: item.Orario,
            Class: 'text-center',
            Valido: 'p'
          },
          Ordine: {
            Type: 'string',
            Value: item.Ordine,
            Class: 'text-center',
            Valido: 'p'
          },
          PagaOraria: {
            Type: 'string',
            Value: item.PagaOraria,
            Class: 'text-center'
          },
          NumeroOre: {
            Type: 'string',
            Value: item.NumeroOre,
            Class: 'text-center'
          }
        }
      }
    })
    .filter((item) => item !== undefined)
    .sort((a, b) => {
      if (a.IdAssistente.Value < b.IdAssistente.Value) return -1
      if (a.IdAssistente.Value > b.IdAssistente.Value) return 1
      return 0
    })
})
const ItemAssistentiFerie = computed(() => {
  return Pinia.AssistentiFerie()
    .getElenco.map((item) => {
      let Filtro = true
      if (FiltroAnnoMese.value !== '') {
        Filtro = Filtro && FiltroAnnoMese.value === item.Data?.substring(0, 7)
      }
      if (FiltroAssistente.value !== '') {
        Filtro = Filtro && FiltroAssistente.value === item.IdAssistente
      }
      if (Filtro) {
        return {
          Id: {
            Type: 'string',
            Value: item.Id,
            Class: 'text-left'
          },
          vIdAssistente: {
            Type: 'text',
            Value: item.IdAssistente,
            Class: 'text-center',
            Readonly: true
          },
          IdAssistente: {
            Type: 'select',
            Value: item.IdAssistente,
            Class: 'text-center',
            Array: DatiComboAssistenti(),
            Valido: 'p'
          },
          Data: {
            Type: 'date',
            Value: item.Data,
            Class: 'text-center',
            Valido: 'p'
          }
        }
      }
    })
    .filter((item) => item !== undefined)
    .sort((a, b) => {
      if (a.IdAssistente.Value < b.IdAssistente.Value) return -1
      if (a.IdAssistente.Value > b.IdAssistente.Value) return 1
      return 0
    })
})
const ItemsDistribuzioneNomiTurni = computed(() => {
  return ElencoDistribuzioneNomiTurni.map((item) => {
    return {
      Id: {
        Type: 'string',
        Value: item.Id,
        Class: 'text-left'
      },
      vIdAssistente: {
        Type: 'text',
        Value: item.IdAssistente,
        Class: 'text-center',
        Readonly: true
      },
      IdAssistente: {
        Type: 'select',
        Value: item.IdAssistente,
        Class: 'text-center',
        Array: DatiComboAssistenti(),
        Valido: 'p'
      },
      NomeGiorno: {
        Type: 'select',
        Value: item.NomeGiorno,
        Class: 'text-center',
        Array: Settimana(),
        Valido: 'p'
      },
      Orario: {
        Type: 'string',
        Value: item.Orario,
        Class: 'text-center',
        Valido: 'p'
      },
      Ordine: {
        Type: 'string',
        Value: item.Ordine,
        Class: 'text-center',
        Valido: 'p'
      }
    }
  }).sort((a, b) => {
    if (a.IdAssistente.Value < b.IdAssistente.Value) return -1
    if (a.IdAssistente.Value > b.IdAssistente.Value) return 1
    return 0
  })
})
const ItemAssistentiOrariNero = computed(() => {
  return ElencoAssistentiOrariNero.map((item) => {
    return {
      Id: {
        Type: 'string',
        Value: item.Id,
        Class: 'text-left'
      },
      vIdAssistente: {
        Type: 'text',
        Value: item.IdAssistente,
        Class: 'text-center',
        Readonly: true
      },
      IdAssistente: {
        Type: 'select',
        Value: item.IdAssistente,
        Class: 'text-center',
        Array: DatiComboAssistenti(),
        Valido: 'p'
      },
      Giorni: {
        Type: 'select',
        Value: item.Giorni,
        Class: 'text-center',
        Array: Settimana(),
        Valido: 'p'
      },
      Orario: {
        Type: 'string',
        Value: item.Orario,
        Class: 'text-center',
        Valido: 'p'
      },
      PagaOraria: {
        Type: 'string',
        Value: item.PagaOraria,
        Class: 'text-center',
        Valido: 'p'
      },
      NumeroOre: {
        Type: 'string',
        Value: item.NumeroOre,
        Class: 'text-center',
        Valido: 'p'
      }
    }
  }).sort((a, b) => {
    if (a.IdAssistente.Value < b.IdAssistente.Value) return -1
    if (a.IdAssistente.Value > b.IdAssistente.Value) return 1
    return 0
  })
})
const ItemsBloccaMese = computed(() => {
  return Pinia.BloccaMeseCalendario().getElenco.map((item) => {
    return {
      Id: {
        Type: 'string',
        Value: item.Id,
        Class: 'text-left'
      },
      Anno: {
        Type: 'string',
        Value: item.Anno,
        Class: 'text-center',
        Valido: 'p',
        Readonly: true
      },
      Mese: {
        Type: 'string',
        Value: item.Mese,
        Class: 'text-center',
        Valido: 'p'
      }
    }
  }).sort((a, b) => {
    if (a.Anno.Value < b.Anno.Value) return -1
    if (a.Anno.Value > b.Anno.Value) return 1
    if (a.Mese.Value < b.Mese.Value) return -1
    if (a.Mese.Value > b.Mese.Value) return 1
    return 0
  })
})

const ItemBustePagaNero = computed(() => {
  return ArrayFuoriBusta.value.map((item) => {
    return {
      Id: {
        Type: 'string',
        Value: '0',
        Class: 'text-left'
      },
      IdAssistenteNero: {
        Type: 'select',
        Value: item.IdAssistenteNero,
        Class: 'text-center',
        Array: DatiComboAssistenti(),
        Valido: 'p'
      },
      Data: {
        Type: 'string',
        Value: item.Data,
        Class: 'text-center',
        Valido: 'p'
      },
      Ore: {
        Type: 'string',
        Value: item.Ore,
        Class: 'text-center',
        Valido: 'p'
      },
      PagaOraria: {
        Type: 'string',
        Value: item.PagaOraria,
        Class: 'text-center',
        Valido: 'p'
      }
    }
  })
})
const NomeAssistente = ref('Silvia')
const DataTurno = ref('')
const OrarioTurno = ref('')
const FiltroAnnoMese = ref('')
const FiltroAssistente = ref('')
const TurniDate = computed(() => {
  const arr = Pinia.CalendarioTurni().getElenco
  const result = Object.values(
    arr.reduce((acc, curr) => {
      if (!acc[curr.Data]) {
        acc[curr.Data] = {
          Data: curr.Data,
          elementi: []
        }
      }
      acc[curr.Data].elementi.push({
        Id: curr.Id,
        IdAssistente: curr.IdAssistente,
        Orario: curr.Orario,
        Ordine: curr.Ordine,
        Ferie: curr.Ferie,
        Nero: curr.Nero,
        Data: curr.Data,
        PagaOraria: curr.PagaOraria,
        NumeroOre: curr.NumeroOre,
        Festivo: curr.Festivo
      })

      return acc
    }, {})
  )
  return result
})
const As = computed(() => {
  let tmp
  tmp = [
    ...Pinia.Assistenti()
      .getElenco.map((a) => {
        if (a.Colore !== undefined) {
          return { Id: a.Id, Nome: a.Nome, Colore: a.Colore }
        }
      })
      .filter((a) => a !== undefined),
    ...Pinia.AssistentiNero()
      .getElenco.map((a) => {
        if (a.Colore !== undefined) {
          return { Id: a.Id, Nome: a.Nome, Colore: a.Colore, Weekend: a.Weekend }
        }
      })
      .filter((a) => a !== undefined)
  ]
  return tmp
})
const oggi = new Date()
const anno = ref(oggi.getFullYear())
const mese = ref(oggi.getMonth())

const nomeMese = computed(() => {
  return new Date(anno.value, mese.value).toLocaleDateString('it-IT', { month: 'long' })
})
const calendario = computed(() => {
  const primoGiorno = (new Date(anno.value, mese.value, 1).getDay() + 6) % 7
  const giorniNelMese = new Date(anno.value, mese.value + 1, 0).getDate()
  const settimane = []
  let settimana = new Array(7).fill(null)
  let giorno = 1

  // Prima settimana
  for (let i = primoGiorno; i < 7; i++) {
    settimana[i] = giorno++
  }
  settimane.push(settimana)

  // Settimane successive
  while (giorno <= giorniNelMese) {
    settimana = new Array(7).fill(null)
    for (let i = 0; i < 7 && giorno <= giorniNelMese; i++) {
      settimana[i] = giorno++
    }
    settimane.push(settimana)
  }

  return settimane
})

const mesePrecedente = () => {
  if (mese.value === 0) {
    mese.value = 11
    anno.value--
  } else {
    mese.value--
  }
}

const meseSuccessivo = () => {
  if (mese.value === 11) {
    mese.value = 0
    anno.value++
  } else {
    mese.value++
  }
}
const Aggiorna = (giorno) => {
  //console.log('Aggiorna turno', ModiId.value, anno.value, mese.value + 1, giorno)
  const Payload = {
    Id: ModiId.value,
    Orario: ModiOrario.value,
    Ferie: ModiFerie.value
  }
  //console.log(Payload)
  Pinia.CalendarioTurni().Aggiorna(Payload)
  const annoStr = anno.value < 10 ? '0' + anno.value : anno.value
  const meseStr = mese.value < 10 ? '0' + (mese.value + 1) : mese.value + 1
  const giornoStr = giorno < 10 ? '0' + giorno : giorno
  const IdAssistente = As.value.filter((p) => p.Nome === ModiAssistente.value)[0].Id
  if (ModiFerie.value === true) {
    // verifico se esiste già un record ferie per questo assistente e questa data
    const TestFerie = Pinia.AssistentiFerie().getElenco.find((f) => {
      if (f.IdAssistente === IdAssistente && f.Data === annoStr + '-' + meseStr + '-' + giornoStr) {
        return f
      }
    })
    //console.log('TestFerie', TestFerie)
    if (TestFerie === undefined) {
      /*console.log(
        'Aggiungo record ferie per assistente',
        IdAssistente,
        annoStr + '-' + meseStr + '-' + giornoStr
      )*/
      Pinia.AssistentiFerie().Aggiungi({
        IdAssistente: IdAssistente,
        Data: annoStr + '-' + meseStr + '-' + giornoStr
      })
    } else {
      /*console.log(
        'Record ferie già esistente per assistente'
      )*/
    }
  } else {
    // se ferie è false, elimino eventuale record ferie esistente per questo assistente e questa data
    Pinia.AssistentiFerie().getElenco.forEach((f) => {
      if (f.IdAssistente === IdAssistente && f.Data === annoStr + '-' + meseStr + '-' + giornoStr) {
        /*console.log(
          'Elimino record ferie per assistente',
          IdAssistente,
          annoStr + '-' + meseStr + '-' + giornoStr
        )*/
        Pinia.AssistentiFerie().Elimina(f.Id)
      }
    })
  }
  ModiId.value = ''
  //ModiOrario.value = ''
  ModiAssistente.value = ''
  ModiFerie.value = false
}
const Verifica = computed(() => {
  let tmp = false
  if (NomeAssistente.value === '' || DataTurno.value === '' || OrarioTurno.value === '') {
    tmp = true
  }
  return tmp
})

const ComponiData = (giorno) => {
  let mmese = mese.value + 1
  if (mmese < 10) {
    mmese = '0' + mmese
  }
  if (giorno < 10) {
    giorno = '0' + giorno
  }
  return `${anno.value}-${mmese}-${giorno}`
}

const state = ref(7)

const nextState = () => {
  state.value = (state.value + 1) % 9
  if (state.value === 8) {
    state.value = 0
  }
}

// colori dinamici
const bgColor = computed(() => {
  if (state.value === 0) return 'bg-red-600'
  if (state.value === 1) return 'bg-yellow-400'
  if (state.value === 2) return 'bg-blue-600'
  if (state.value === 3) return 'bg-green-600'
  if (state.value === 4) return 'bg-purple-600'
  if (state.value === 5) return 'bg-pink-600'
  if (state.value === 6) return 'bg-gray-600'
  if (state.value === 7) return 'bg-indigo-600'
  if (state.value === 8) return 'bg-teal-600'
})

// posizione pallino
const knobPosition = computed(() => {
  if (state.value === 0) return 'translate-x-0'
  if (state.value === 1) return 'translate-x-[10px]'
  if (state.value === 2) return 'translate-x-[20px]'
  if (state.value === 3) return 'translate-x-[30px]'
  if (state.value === 4) return 'translate-x-[40px]'
  if (state.value === 5) return 'translate-x-[50px]'
  if (state.value === 6) return 'translate-x-[60px]'
  if (state.value === 7) return 'translate-x-[70px]'
  if (state.value === 8) return 'translate-x-[80px]'
})

const DatiComboAssistenti = () => {
  let tmp = Pinia.Assistenti()
    .getElenco.map((a) => {
      if (a.Colore !== undefined) {
        return { Id: a.Id, Nome: a.Nome, Colore: a.Colore }
      }
    })
    .filter((a) => a !== undefined)
  tmp = [
    ...tmp,
    ...Pinia.AssistentiNero()
      .getElenco.map((a) => {
        if (a.Colore !== undefined) {
          return { Id: a.Id, Nome: a.Nome, Colore: a.Colore }
        }
      })
      .filter((a) => a !== undefined)
  ]
  return tmp.map((item) => {
    return {
      text: item.Nome,
      value: item.Id
    }
  })
}
const Settimana = () => {
  const giorni = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']
  return giorni.map((g, i) => ({ text: g, value: g }))
}

const TurniGiorno = (Data) => {
  //console.log('TurniGiorno', Data)
  const giorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']

  const tmp = new Date(Data).getDay()
  let PPayload = []
  Pinia.CalendarioTurni()
    .EliminaGiorno(Data)
    .then(() => {
      const TurniGiorno = Pinia.DistribuzioneTurniAssistenti()
        .getElenco.filter((giorno) => giorno.NomeGiorno === giorni[tmp])
        .sort((a, b) => a.Ordine - b.Ordine)
      let Payload = {}
      const TestGiornoFestivo = Pinia.AssistentiGiorniFestivi().getElenco.find(
        (g) => g.Data === Data
      )
      if (TestGiornoFestivo !== undefined) {
        Pinia.AssistentiGiorniFestivi().getElenco.forEach((g) => {
          if (g.Data === Data) {
            let Orario = g.Orario
            if (g.Orario === '=') {
              Orario = Pinia.DistribuzioneTurniAssistenti().getElenco.filter(
                (d) => d.IdAssistente === g.IdAssistente && d.NomeGiorno === giorni[tmp]
              )
              Orario.forEach((o) => {
                Payload = {
                  IdAssistente: g.IdAssistente,
                  Data: g.Data,
                  Orario: o.Orario,
                  Ordine: g.Ordine,
                  Ferie: false,
                  Festivo: true
                }
              })
            } else {
              Orario = g.Orario
              Payload = {
                IdAssistente: g.IdAssistente,
                Data: g.Data,
                Orario: Orario,
                Ordine: g.Ordine,
                Ferie: false,
                Festivo: true
              }

              /*const TestNero = TestFerieAssente(
                Payload.IdAssistente,
                Payload.Data?.substring(8, 10),
                Payload.Orario
              )
              //console.log('TestNero', Payload.IdAssistente, Payload.Data.substring(8, 10), Payload.Orario, TestNero)
              /*if (TestNero !== undefined) {
                console.log('TestNero', TestNero)
                Payload.NumeroOre = TestNero.NumeroOre
                Payload.PagaOraria = TestNero.PagaOraria
                Payload.Nero = true
              }*/
            }
            const TestFerie = Pinia.AssistentiFerie().getElenco.find((f) => {
              if (f.IdAssistente === Payload.IdAssistente && f.Data === Payload.Data) {
                return f
              }
            })

            if (TestFerie !== undefined) {
              Payload.Ferie = true
            }
            const TestNero = TestFerieAssente(
              Payload.IdAssistente,
              Payload.Data.substring(8, 10),
              Payload.Orario
            ) /*
            console.log(
              'TestNero',
              Payload.IdAssistente,
              Payload.Data.substring(8, 10),
              Payload.Orario,
              TestNero,
              TestFerie
            )*/
            if (TestNero) {
              Payload.Nero = true
              Payload.NumeroOre = TestNero.NumeroOre
              Payload.PagaOraria = TestNero.PagaOraria
            }
            Pinia.AssistentiGiorniFestivi().getElenco.forEach((ferie) => {
              const IdWeekend = As.value.find((a) => a.Weekend === true)?.Id
              /*if (ferie.Data === Payload.Data) {
                console.log('TestNoemi', ferie.NumeroOre, ferie.PagaOraria, IdWeekend)
              }*/
              if (
                ferie.IdAssistente === IdWeekend &&
                ferie.Data === Payload.Data &&
                Payload.IdAssistente === IdWeekend
              ) {
                Payload.Nero = true
                if (ferie.NumeroOre !== undefined && ferie.NumeroOre > 0) {
                  Payload.NumeroOre = ferie.NumeroOre
                  Payload.PagaOraria = ferie.PagaOraria
                }
              }
            })
            //console.log(TestNoemi)
            PPayload.push(Payload)
          }
        })
      } else {
        TurniGiorno.forEach((turno) => {
          if (giorni[tmp] === 'Sabato') {
            Pinia.AssistentiSabati().getElenco.find((s) => {
              const Mese = (s.Mese < 10 ? '0' : '') + s.Mese
              const Giorno = (s.GiornoSabato < 10 ? '0' : '') + s.GiornoSabato
              const ComponiData = s.Anno + '-' + Mese + '-' + Giorno
              if (ComponiData === Data) {
                if (s.IdAssistente !== turno.IdAssistente) {
                  Payload = {
                    IdAssistente: turno.IdAssistente,
                    Data: Data,
                    Orario: turno.Orario,
                    Ordine: turno.Ordine
                  }
                } else {
                  Payload = {}
                }
              }
            })
          } else {
            Payload = {
              IdAssistente: turno.IdAssistente,
              Data: Data,
              Orario: turno.Orario,
              Ordine: turno.Ordine
            }
            //PPayload.push(Payload)
          }
          let Ferie = false
          Pinia.AssistentiFerie().getElenco.forEach((ferie) => {
            if (ferie.IdAssistente === turno.IdAssistente && ferie.Data === Data) {
              Ferie = true
            }
            Payload.Ferie = Ferie
          })
          const TestNero = TestFerieAssente(
            Payload.IdAssistente,
            Payload.Data?.substring(8, 10),
            Payload.Orario
          )
          //console.log('TestNero', Payload.IdAssistente, Payload.Data.substring(8, 10), Payload.Orario, TestNero)
          if (TestNero !== undefined) {
            console.log('TestNero', TestNero)
            Payload.NumeroOre = TestNero.NumeroOre
            Payload.PagaOraria = TestNero.PagaOraria
            Payload.Nero = true
          }
          PPayload.push(Payload)
        })
      }
      //console.log('PPayload', PPayload)
      const ttmp = PPayload.filter((p) => Object.keys(p).length > 1)
      ttmp.forEach((p) => {
        Pinia.CalendarioTurni().Aggiungi(p)
      })
    })
}
const NomeGiorno = (data) => {
  const giorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']
  return giorni[new Date(data).getDay()]
}

const Modifica = (element) => {
  //console.log('Modifica turno', element)
  ModiOrarioVecchio.value = element.Orario
  ModiOrario.value = element.Orario
  ModiAssistente.value = As.value.filter((p) => p.Id === element.IdAssistente)[0].Nome
  ModiId.value = element.Id
  ModiGiorno.value = element.giorno
  ModiFerie.value = element.Ferie
}
/*
const Elimina = () => {
  Pinia.CalendarioTurni().Elimina(ModiId.value)
  ModiId.value = ''
  ModiOrario.value = ''
  ModiAssistente.value = ''
}*/

const TestMese = computed(() => {
  const MeseStr = mese.value + 1 < 10 ? '0' + (mese.value + 1) : mese.value + 1
  const GiorniMese = new Date(anno.value, mese.value + 1, 0).getDate()

  const Test = [
    ...new Set(
      Pinia.CalendarioTurni()
        .getElenco.map((t) => {
          if (t.Data?.substring(0, 7) === anno.value + '-' + MeseStr) {
            return t.Data
          }
        })
        .filter((t) => t !== undefined)
    )
  ]
  //console.log('Test', Test.length, 'GiorniMese', GiorniMese)

  return Test.length === GiorniMese
})

const BloccaMese = () => {
  if (confirm('Vuoi bloccare il mese?')) {
    console.log('Blocca mese', anno.value, mese.value + 1)
    const Payload = {
      Anno: anno.value,
      Mese: mese.value + 1
    }
    Pinia.BloccaMeseCalendario().Aggiungi(Payload)
  }
}
const TestMeseBloccato = computed(() => {
  const Test = Pinia.BloccaMeseCalendario().getElenco.find((t) => {
    if (t.Anno === anno.value && t.Mese === mese.value + 1) {
      return t
    }
  })
  return Test !== undefined
})

const TestFerieAssente = (IdAssistente, giorno, orario) => {
  const MeseStr = mese.value + 1 < 10 ? '0' + (mese.value + 1) : mese.value + 1
  const GiornoStr = giorno < 10 ? '0' + giorno : giorno
  const GiornoData = NomeGiorno(anno.value + '-' + MeseStr + '-' + GiornoStr)
  const Test = Pinia.AssistentiOrariNero().getElenco.find((o) => {
    if (o.IdAssistente === IdAssistente && o.Giorni === GiornoData && o.Orario === orario) {
      return true
    }
  })
  return Test
}

const CompilaTabelleFuoriBusta = () => {
  const lastDay = new Date(anno.value, mese.value + 1, 0).getDate()
  let FuoriBusta = []
  let FuoriBustaWeekEnd = []
  for (let day = 1; day <= lastDay; day++) {
    const data = ComponiData(day)
    const Anno = data.substring(0, 4)
    const Mese = data.substring(5, 7)
    const TurniNero = Pinia.CalendarioTurni().getElenco.filter((t) => {
      if (t.Data === data && t.Nero === true && t.Ferie === false) {
        return true
      }
    })
    if (TurniNero.length > 0) {
      //console.log('TurniNero', TurniNero, TurniNero.length)
      TurniNero.forEach((t) => {
        if (As.value.filter((p) => p.Id === t.IdAssistente)[0].Weekend === true) {
          FuoriBustaWeekEnd.push({
            IdAssistente: t.IdAssistente,
            NomeAssistente: As.value.filter((p) => p.Id === t.IdAssistente)[0].Nome,
            Giorno: data.substring(8, 10),
            PagaOraria: t.PagaOraria,
            Ore: t.NumeroOre,
            GiornoSettimana: NomeGiorno(data)
          })
        } else {
          FuoriBusta.push({
            IdAssistente: t.IdAssistente,
            NomeAssistente: As.value.filter((p) => p.Id === t.IdAssistente)[0].Nome,
            Giorno: data.substring(8, 10),
            PagaOraria: t.PagaOraria,
            Ore: t.NumeroOre,
            GiornoSettimana: NomeGiorno(data)
          })
        }
      })
    }
  }
  //console.log('FuoriBusta', FuoriBusta, 'FuoriBustaWeekEnd', FuoriBustaWeekEnd)
  FuoriBusta = FuoriBusta.reduce((acc, item) => {
    const id = item.IdAssistente
    if (!acc[id]) {
      acc[id] = []
    }
    acc[id].push(item)
    return acc
  }, {})
  //console.log('FuoriBusta', FuoriBusta)

  const GroupbyFuoriBusta = FuoriBusta
  const settimanePerMese = DividiMesePerSettimaneLunedì()
  const TurniPerSettimana = Object.keys(GroupbyFuoriBusta).reduce((acc, assistenteObj) => {
    GroupbyFuoriBusta[assistenteObj].forEach((giornoObj) => {
      const giorno = parseInt(giornoObj.Giorno)
      const settimanaIndex = settimanePerMese.findIndex((settimana) => settimana.includes(giorno))

      if (settimanaIndex !== -1) {
        const key = `${assistenteObj}_${settimanaIndex + 1}`
        if (!acc[key]) {
          acc[key] = {
            IdAssistente: assistenteObj,
            NomeAssistente: GroupbyFuoriBusta[assistenteObj][0].NomeAssistente,
            Settimana: settimanaIndex + 1,
            PagaOraria: giornoObj.PagaOraria,
            Giorni: []
          }
        }
        acc[key].Giorni.push({
          Giorno: giorno < 10 ? '0' + giorno : giorno,
          NumeroOre: giornoObj.Ore,
          PagaOraria: giornoObj.PagaOraria
        })
      }
    })
    return acc
  }, {})

  Object.values(TurniPerSettimana).forEach((settimana, index) => {
    let Giorni = settimana.Giorni.map((g) => g.Giorno).join('-')
    settimana.GiorniStr =
      Giorni +
      '/' +
      (mese.value + 1 < 10 ? '0' + (mese.value + 1) : mese.value + 1) +
      '/' +
      anno.value
    const Payload = {
      IdAssistenteNero: As.value.find((assistente) => assistente.Nome === settimana.NomeAssistente)
        ?.Id,
      Data: settimana.GiorniStr,
      Ore: settimana.Giorni.reduce((sum, g) => sum + parseFloat(g.NumeroOre), 0),
      PagaOraria: settimana.Giorni[0].PagaOraria
    }
    ArrayFuoriBusta.value.push(Payload)
    //Pinia.PagaAssistentiNero().Aggiungi(Payload)
  })
  FuoriBustaWeekEnd.forEach((item) => {
    const DataStr =
      item.Giorno +
      '/' +
      (mese.value + 1 < 10 ? '0' + (mese.value + 1) : mese.value + 1) +
      '/' +
      anno.value
    const Payload = {
      IdAssistenteNero: item.IdAssistente,
      Data: DataStr,
      Ore: item.Ore,
      PagaOraria: item.PagaOraria
    }
    ArrayFuoriBusta.value.push(Payload)
  })
  //console.log('ArrayFuoriBusta', ArrayFuoriBusta.value)
}

const DividiMesePerSettimaneLunedì = () => {
  const lastDay = new Date(anno.value, mese.value + 1, 0).getDate()

  // Lunedì = 0, Martedì = 1, ..., Domenica = 6
  const firstDay = (new Date(anno.value, mese.value, 1).getDay() + 6) % 7

  const settimane = []
  let settimanaCorrente = Array(7).fill(null)
  let indexSettimana = firstDay

  for (let day = 1; day <= lastDay; day++) {
    settimanaCorrente[indexSettimana] = day
    indexSettimana++

    if (indexSettimana === 7) {
      settimane.push(settimanaCorrente)
      settimanaCorrente = Array(7).fill(null)
      indexSettimana = 0
    }
  }

  if (indexSettimana > 0) {
    settimane.push(settimanaCorrente)
  }

  return settimane
}
const AggiungiBustePagaNero = (item) => {
  const Payload = {
    IdAssistenteNero: item.IdAssistenteNero,
    Data: item.Data,
    Ore: item.Ore.toString(),
    PagaOraria: item.PagaOraria
  }
  Pinia.PagaAssistentiNero().Aggiungi(Payload)
}
const TestEsisteBustaPagaNero = (item) => {
  const Test = Pinia.PagaAssistentiNero().getElenco.find((b) => {
    if (
      b.IdAssistenteNero === item.IdAssistenteNero &&
      b.Data === item.Data &&
      b.Ore.toString() === item.Ore.toString() &&
      b.PagaOraria.toString() === item.PagaOraria.toString()
    ) {
      return true
    } else {
      return false
    }
  })
  return Test !== undefined
}
</script>

<style scoped lang="scss">
#Turni {
  position: relative;
  padding: 20px;

  h2 {
    margin: 10px 0;
    font-size: 30px;
  }
  .calendar {
    text-align: center;
    font-family: Arial;
    z-index: 4;
    background-color: #90cc93;
    position: relative;
  }

  table {
    border-collapse: collapse;
    margin: 20px auto;
  }

  th,
  td {
    border: 1px solid #ccc;
    padding: 10px;
    width: 40px;
    height: 40px;
  }

  th {
    background: #f0f0f0;
  }
  td {
    width: 150px;
    height: 250px;
    vertical-align: top;
  }

  button {
    margin: 5px;
    padding: 5px 10px;
  }
  .BTNAzione {
    margin: 2px;
    padding: 6px;
    width: 30px;
    border-radius: 45px;
    background-color: #ffb912;
    cursor: pointer;
  }
  .FaseDiModifica {
    background-color: #22c55e;
  }
  .FaseDiElimina {
    background-color: #f37373;
  }
  .BTNSalva {
    background-color: #86efac;
  }
  .Orario {
    font-size: 13px;
    color: #555;
    padding: 5px;
    float: left;
  }
  .Assistente {
    font-size: 0.9em;
    font-weight: bold;
    color: #333;
    padding: 5px;
    float: left;
  }
}
</style>
