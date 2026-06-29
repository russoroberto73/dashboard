<template>
  <div class="calendar mt-4" id="Turni">
    <h1 class="text-center text-[30px]">Turni assistenti</h1>
    <router-link
      :to="{ name: 'TurniDettaglio', params: { id: 'dettaglio' } }"
      v-if="route.params.id !== 'dettaglio'"
    >
      <button class="BTNAzione !w-[150px]">Dettaglio</button>
    </router-link>
    <router-link :to="{ name: 'TurniCalendario' }" v-else>
      <button class="BTNAzione !w-[150px]">Calendario</button>
    </router-link>
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
      <div v-else-if="state === 1">
        <h1 class="text-[25px] text-center">1 - Distribuzione nomi turni</h1>
        <Rtable
          :items="ItemsDistribuzioneNomiTurni"
          :pinia="Pinia.DistribuzioneTurniAssistenti()"
        />
      </div>
      <div v-else-if="state === 2" class="text-center">
        <h1 class="text-[25px]">2 - Sabati non lavorati</h1>
        <Rtable :items="ItemsTurniSabati" :pinia="Pinia.AssistentiSabati()" />
      </div>
      <div v-else-if="state === 3" class="text-center">
        <h1 class="text-[25px]">3 - Ferie assistenti</h1>
        <Rtable :items="ItemAssistentiFerie" :pinia="Pinia.AssistentiFerie()" />
      </div>
      <div v-else-if="state === 4" class="text-center">
        <h1 class="text-[25px]">4 - Giorni Festivi</h1>
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
    </div>
    <div class="text-center">
      <h2>{{ nomeMese }} {{ anno }}</h2>
      <button @click="mesePrecedente">◀</button>
      <button @click="meseSuccessivo">▶</button>
    </div>
    <div class="w-[1800px] m-auto">
      <span v-if="TestMeseBloccato">
        <button class="BTNAzione !w-[180px]" @click="CompilaTabelleFuoriBusta">Compila tabella fuori busta</button>
      </span>
      <span v-else-if="TestMese">
        <button class="BTNAzione !w-[180px]" @click="BloccaMese">Blocca mese</button>
      </span>
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
                    <div v-if="ComponiData(giorno) === Turni.Data">
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
                            <span v-if="element.Ferie === true">
                              {{
                                TestFerieAssente(element.IdAssistente, giorno, element.Orario)
                                  ? 'Assente'
                                  : 'Ferie'
                              }}
                            </span>
                            <span v-if="false">({{ element.Ordine }})</span>
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
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Pinia } from '@/stores'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import BTNSalva from '@/assets/IconeSvg/Salva.vue'
import { Data_aaaammgg_ggmmaaaa } from '@/assets/helpers/MyMixin'

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
        }
      }
    }
  }).filter((item) => item !== undefined)
})
const ItemsTurniSabati = computed(() => {
  return ElencoTurniSabati.map((item) => {
    return {
      Id: {
        Type: 'string',
        Value: item.Id,
        Class: 'text-left'
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
  })
})
const ItemGiorniFestivi = computed(() => {
  return Pinia.AssistentiGiorniFestivi().getElenco.map((item) => {
    return {
      Id: {
        Type: 'string',
        Value: item.Id,
        Class: 'text-left'
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
      }
    }
  })
})
const ItemAssistentiFerie = computed(() => {
  return Pinia.AssistentiFerie().getElenco.map((item) => {
    return {
      Id: {
        Type: 'string',
        Value: item.Id,
        Class: 'text-left'
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
        Data: curr.Data
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
          return { Id: a.Id, Nome: a.Nome, Colore: a.Colore }
        }
      })
      .filter((a) => a !== undefined)
  ]
  return tmp
})
const oggi = new Date()
const anno = ref(oggi.getFullYear())
const mese = ref(oggi.getMonth() - 1)

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

const state = ref(0)

const nextState = () => {
  state.value = (state.value + 1) % 7
  if (state.value === 6) {
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
  console.log('TurniGiorno', Data)
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
                  Ferie: false
                }
              })
            } else {
              Orario = g.Orario
              Payload = {
                IdAssistente: g.IdAssistente,
                Data: g.Data,
                Orario: Orario,
                Ordine: g.Ordine,
                Ferie: false
              }
            }
            const TestFerie = Pinia.AssistentiFerie().getElenco.find((f) => {
              if (f.IdAssistente === Payload.IdAssistente && f.Data === Payload.Data) {
                return f
              }
            })

            if (TestFerie !== undefined) {
              Payload.Ferie = true
            }
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
  return Test !== undefined
}

  const CompilaTabelleFuoriBusta = () => { 
    const lastDay = new Date(anno.value, mese.value + 1, 0).getDate()
    for (let day = 1; day <= lastDay; day++) {
      const data = ComponiData(day)
      //console.log('CompilaTabelleFuoriBusta giorno', data)      
      //const AssistentiDelGiono =
        Pinia.CalendarioTurni().getElenco.forEach((t) => {
        if (t.Data === data && t.Ferie === false) {
          const GetNomeGiorno = NomeGiorno(data)
          //console.log('AssistentiDelGiono', GetNomeGiorno, t.Orario, t.IdAssistente)
          const TestNero = Pinia.AssistentiOrariNero().getElenco.find((n) => {
            if (n.IdAssistente === t.IdAssistente && n.Giorni === GetNomeGiorno && n.Orario === t.Orario) {
              return true
            }
          })
          //console.log('TestNero', TestNero)
          if (TestNero !== undefined) {
            const Payload = {
              IdAssistente: t.IdAssistente,
              //NomeAssistente: As.value.filter((p) => p.Id === t.IdAssistente)[0].Nome,
              Data: Data_aaaammgg_ggmmaaaa(t.Data).replace(/-/g, '/'),
              //Orario: t.Orario,
              PagaOraria: TestNero.PagaOraria,
              Ore: TestNero.NumeroOre
            }
            console.log('Aggiungo fuori busta', Payload)
          }
        }
      })
    }
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
