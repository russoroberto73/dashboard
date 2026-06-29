<template >

<div class="relative top-[120px] left-[200px]">
    <h1>Tabellone</h1>        
    <Rtable :items="Items" :pinia="Pinia.Assistenti()" :piniaverifica="Pinia.Buste()" />
    <table
          style="
            background-color: #fff;
            border: 3px red solid;
            left: 0px;
          "
        >
          <tr style="background-color: var(--Bottoni)">
            <td
              v-for="(distretto, index) in Distretti"
              :key="index"
              :colspan="distretto.col"
            >
              {{ distretto.Sigla + " " + distretto.Descrizione }}
            </td>
            <td>Azione</td>
          </tr>
          <tr>
            <td style="width: 150px"></td>
            <td
              v-for="(muscolo, index) in Muscoli"
              :key="index"
              v-html="muscolo.Sigla"
              :style="{ backgroundColor: muscolo.colore }"
              :title="muscolo.title"
            ></td>
            <td>
              <template v-if="AbilitaElimina">
                <button @click="EliminaQtyData(DataModificaElimina)">
                  <i class="fa fa-check p-1"></i>
                </button>
                <button>
                  <i class="fa fa-undo p-1" @click="AbilitaElimina = false"></i>
                </button>
              </template>
              <template v-else>
                <span
                  v-if="DataModificaElimina != 0"
                  style="display: flex; width: 100px"
                >
                  {{ DataModificaElimina }}
                </span>
                <button :disabled="DataModificaElimina === 0">
                  <i class="fa fa-pencil"></i>
                </button>
                <button
                  @click="AbilitaElimina = true"
                  :disabled="DataModificaElimina === 0"
                >
                  <i class="fa fa-trash"></i>
                </button>
                <button
                  v-if="DataModificaElimina != 0"
                  @click="DataModificaElimina = 0"
                  style="background-color: var(--Bottoni)"
                  >Deselezione</button
                >
              </template>
            </td>
          </tr>
          <tr v-for="(data, index) in DateDistinte" :key="index">
            <td style="width: 86px; display: flex; border: 0">
              {{ Data_aaaammgg_ggmmaaaa(data) }}
            </td>
            <td
              v-for="(muscolo, index) in Muscoli"
              :key="index"
            >
              <span v-if="DataModificaElimina === data">
                <input
                  type="number"
                  :value="TrovaQty(data, muscolo.Id, muscolo.Parte)"
                  style="border: 1px black solid; padding: 2px"
                  @change="
                    AggiornaQtyData(muscolo.Id, muscolo.Parte, data, $event)
                  "
                />
              </span>
              <span v-else style="display: flex; justify-content: center">
                {{ TrovaQty(data, muscolo.Id, muscolo.Parte) }}
              </span>
            </td>
            <td>
              <input
                type="radio"
                v-model="DataModificaElimina"
                name="IdMuscolo"
                :value="data"
              />
            </td>
          </tr>
          <tr>
            <td style="width: 150px">
              <input type="date" v-if="NuovaData" v-model="ValueData" />
              <button v-else class="btn p-3" @click="NuovaData = true">
                <i class="fa fa-plus-circle p-2" aria-hidden="true"></i>
              </button>
            </td>
            <td v-for="(muscolo, index) in Muscoli" :key="index">
              <div v-if="NuovaData">
                <input
                  type="number"
                  style="width: 80px; border: 1px black solid; padding: 2px"
                  @change="
                    AggiornaQtyData(
                      muscolo.Id,
                      muscolo.Parte,
                      ValueData,
                      $event
                    )
                  "
                />
              </div>
              <div v-else style="width: 80px"></div>
            </td>
          </tr>
        </table>

</div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { ref, computed } from 'vue'
import { Data_aaaammgg_ggmmaaaa } from '@/assets/helpers/MyMixin'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'

const NuovaData = ref(false)
const ValueData = ref('2000-12-13')
const AbilitaElimina = ref(false)
const DataModificaElimina: any = ref(0)
const Dettaglio = ref(false)
const IntestazioneQtyDate = ref(["Distretto", "Muscolo", "Data", "Qty", "Azione"])
const IdQtyDate = ref('0')

const ElencoDistretti = Pinia.BotulinoDistretti().getElenco
const ElencoMuscoli = Pinia.BotulinoMuscoli().getElenco
const ElencoQtyDate = Pinia.BotulinoQtyDate().getElenco

type TypeDistretti = {
  Sigla: string
  Descrizione: string
  col: number
}
type ArrayDistretti = Array<TypeDistretti>

type TypeMuscoli = {
  Id?: string
  IdDistretto?: string
  Sigla: string
  Descrizione: string
  title?: string
  colore?: string
  Parte?: string
}
type ArrayMuscoli = Array<TypeMuscoli>

type TypeQtyDate = {
  Id?: string
  Distretto: string
  Muscolo: string
  Data: string
  Qty: number
}

type ArrayQtyDate = Array<TypeQtyDate>


  const Items = computed(() => {
    return ElencoQtyDate.map((item) => {
      return {
        Id: {
          Type: "string",
          Value: item.Id,
          Class: "text-left",
          VerificaEliminazione: true
        },
        Parte: {
          Type: "string",
          Value: item.Parte,
          Class: "text-left ml-5",
          Valido: 'p'
        },
        Distretto: {
          Type: "string",
          Value: item.Qty,
          Class: "text-left ml-5",
          Valido: 'p'
        },
        Muscolo: {
          Type: "string",
          Value: item.IdMuscolo,
          Class: "text-left ml-5",
          Valido: 'p'
        },
        Data: {
          Type: "date",
          Value: item.Data,
          Class: "text-center",
          Valido: 'p'
        },
        Qty: {
          Type: "number",
          Value: item.Qty,
          Class: "text-center",
          Valido: 'p'
        }
      }
    })
  })
const EliminaQtyData=(p: any) => {
    console.log('o0p')    
}

const AggiornaQtyData =(Id: any, Parte: any, data: any, event:any) => {
  //console.log('p')  
  //console.log(Id, Parte, data, event);
  const Payload = {
    IdMuscolo: Id,
    Parte: Parte,
    Data: data,
    Qty: event.target.value
  }
  console.log(Payload)
  const IdQtyDate = ElencoQtyDate.findIndex(
    (item) =>
      item.Data === data && item.IdMuscolo === Id && item.Parte === Parte
  )
  if (IdQtyDate != -1) {
    Pinia.BotulinoQtyDate().Aggiorna({Id: ElencoQtyDate[IdQtyDate].Id, ...Payload})
  } else {
    Pinia.BotulinoQtyDate().Aggiungi(Payload)  
  }
}

const Distretti = computed(() => {
    let tmp = [] as ArrayDistretti
    let col = 1
    tmp.push({Sigla: 'Data', Descrizione: '', col})
    ElencoDistretti.forEach((item) => {
        if (item.Id != '0') {
            if (item.Sigla === 'AI') {
                item.Sigla += 'sn'
                item.Descrizione += ' sinistro'
            }
            col = ElencoMuscoli.filter((itemd) => itemd.IdDistretto === item.Id).length - 1
            tmp.push({Sigla: item.Sigla, Descrizione: item.Descrizione, col})
        }
    })
    tmp.push({Sigla: 'AIdx', Descrizione: "Arto inferiore destro", col})
    return tmp
})
const Muscoli = computed(() => {
    let gruppimuscoli = [] as ArrayMuscoli
    let AIdx = [] as ArrayMuscoli
    let tmp = [] as ArrayMuscoli
    ElencoDistretti.forEach((item: TypeMuscoli) => {
        gruppimuscoli = [] as ArrayMuscoli
        ElencoMuscoli.forEach((itemd: TypeMuscoli) => {
            if (itemd.IdDistretto === item.Id) {
                gruppimuscoli.push({
                    Id: itemd.Id,
                    Sigla: itemd.Sigla,
                    Descrizione: itemd.Descrizione
                })
            }
        })
        gruppimuscoli.sort((a, b) => {
          if (a.Descrizione < b.Descrizione) {
            return -1
          } else if (a.Descrizione > b.Descrizione) {
            return 1
          } else {
            return 0
          }
        })
        gruppimuscoli.splice(0, 1)
        gruppimuscoli.forEach((itemd) => {
          tmp.push({
            Sigla: itemd.Sigla,
            title: itemd.Descrizione,
            colore: item.Sigla != "ASdx" ? "#abcdef" : "#bbddaa",
            Id: itemd.Id,
            Descrizione: itemd.Descrizione,
            Parte: "xxx"
          })
          if (item.Sigla === "AIsn") {
            AIdx.push({
              Sigla: itemd.Sigla,
              title: itemd.Descrizione,
              colore: "#fedcba",
              Id: itemd.Id,
              Descrizione: itemd.Descrizione,
              Parte: "dx"
            })
          }
        })
      })
      AIdx.forEach((item) => {
        tmp.push(item)
      })
      return tmp    
})
const QtyDate = computed(() => {
    let tmp = [] as ArrayQtyDate
      let IndexMuscolo
      let IdMuscolo
      let IndexDistretto
      let IdDistretto: string | undefined
      ElencoQtyDate.forEach((item) => {
        IndexMuscolo = ElencoMuscoli.findIndex(
          (itemm) => itemm.Id === item.IdMuscolo
        )
        IdMuscolo = ElencoMuscoli[IndexMuscolo].Id
        IdDistretto = ElencoMuscoli[IndexMuscolo].IdDistretto
        IndexDistretto = ElencoDistretti.findIndex(
          (itemd) => itemd.Id === IdDistretto
        )
        console.log(IdMuscolo)
        //console.log("QW", IdDistretto, this.ElencoDistretti[IndexDistretto])
        tmp.push({
          Id: item.Id,
          Distretto:
            ElencoDistretti[IndexDistretto].Sigla +
            ": " +
            ElencoDistretti[IndexDistretto].Descrizione,
          Muscolo:
            ElencoMuscoli[IndexMuscolo].Sigla +
            ": " +
            ElencoMuscoli[IndexMuscolo].Descrizione,
          Data: item.Data,
          Qty: item.Qty
        })
      })
      if (tmp.length > 0) {
        tmp.sort((a, b) => {
          if (a.Distretto < b.Distretto || a.Muscolo < b.Muscolo) {
            return -1
          } else if (a.Distretto > b.Distretto || a.Muscolo > b.Muscolo) {
            return 1
          } else {
            return 0
          }
        })
      }
      return tmp
})
const DateDistinte = computed(() => {
      let date = new Set(
        ElencoQtyDate.map((item: { Data: string }) => {
          return item.Data
        }).filter((item) => item != "")
      )
      let tmp = [""]
      /* eslint-disable */
      date.forEach((item: any) => {
        //console.log(item)
        tmp.push(item)
      })
  tmp.splice(0, 1)
      console.log(tmp);
      
      return tmp
})
const TrovaQty = computed(() => {
    return (data: any, Id: any, Parte: any) => {
        //console.log(Parte)
        const Qty = ElencoQtyDate.find(
          (item) =>
            item.Data === data && item.IdMuscolo === Id && item.Parte === Parte
        )
        return Qty ? (Qty.Qty > 2 ? Qty.Qty : "") : ""
      }
})
</script>
<style lang="scss">
</style>