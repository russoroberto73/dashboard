<template>
  <div class="relative top-[120px]">
    <h1 class="text-center text-[30px]">Gestione Patrimonio Titoli Date</h1>
    <div class="flex justify-center my-5">
      <div class="flex flex-col space-y-4">
        <div class="mb-5">
          <select v-model="Data">
            <option value="0" disabled>Seleziona una data</option>
            <option v-for="date in ComboDate" :key="date.value" :value="date.value">
              {{ date.text }}
            </option>
            <option value="999">Aggiungi nuova data</option>
          </select>
        </div>
        <div v-if="Data === '999'" class="text-center">
          <input type="date" v-model="NuovaData" placeholder="Inserisci nuova data" /><br />
          <button @click="AggiungiData" class="bg-Bottone rounded-[45px] p-3 mt-5">Aggiungi</button>
        </div>
      </div>
    </div>
    <span class="hidden">{{ objTitoli }}</span>
    <div class="w-[1500px] m-auto bg-white p-5 mt-5">
      <div class="text-center bg-red-100 text-[25px]">{{Dataggmmaaaa(Data)}}</div>
      <button @click="AttivaInput = ''" class="bg-Bottone rounded-[45px] p-1 mt-1">Sola lettura</button><br />
      <p class="flex-col justify-end flex float-right w-[830px]">
        <div class="text-center text-white">{{Dataggmmaaaa(Data)}}</div>
        <div>
          <div class="mx-5 text-center float-left bg-blue-200">Controvalore<br />iniziale</div>
          <div class="mx-7 text-center float-left">Prelievo</div>
          <div class="ml-7 text-center float-left">Incremento</div>
        <div class="ml-9 text-center float-left">Controvalore<br />attuale</div>
        <div class="ml-9 text-center float-left">Percentuale</div>
        <div class="ml-10 text-center float-left">Variazione</div>
        <div class="ml-14 text-center float-left">Cedole</div>
        </div>
      </p><br />
      <div v-for="(item, indexbanche) in ElencoBanche" :key="indexbanche" class="mb-5">
        <h2 class="text-lg font-bold">{{ item.Nome }}</h2>
        <div v-for="(gruppo, indexgruppi) in Gruppi(item.Id ?? '')" :key="indexgruppi" class="ml-5">
          <h3 class="text-md font-semibold">{{ gruppo.Nome }}</h3>
          <ul>
            <li
              v-for="(titolo, indextitoli) in Titoli(gruppo.Id ?? '')"
              :key="indextitoli"
              class="ml-5 flex justify-between"
            >
              <span>{{ titolo.Nome }}</span>
              <span class="ml-3 font-mono text-gray-500 text-center">
                <table class="w-full" v-if="titolo.Id">
                  <tr>                    
                    <td class="pb-2 bg-blue-200">
                      <p class="bg-blue-200">
                      {{formatEuro(objTitoli[titolo.Id]?.Iniziale || 0)}}                      
                      </p>
                    </td>
                    <td class="pb-2">
                      <p @click="AttivaInput = 'prelievo'+ indexbanche+ indexgruppi + indextitoli">
                      {{formatEuro(objTitoli[titolo.Id]?.Prelievo || 0)}}<br />
                      <span v-if="titolo.Nome === 'Importo'"></span>
                      <input :class="AttivaInput !== 'prelievo'+ indexbanche+ indexgruppi + indextitoli ? 'hidden' : ''" 
                        v-else-if="objTitoli[titolo.Id]"
                        type="number"
                        v-model="objTitoli[titolo.Id].Prelievo"                        
                        placeholder="0"                        
                      />
                      </p>
                    </td>
                    <td class="pb-2">
                      <p @click="AttivaInput = 'incremento'+ indexbanche+ indexgruppi + indextitoli">
                      {{formatEuro(objTitoli[titolo.Id]?.Incremento || 0)}}<br />
                      <input :class="AttivaInput !== 'incremento'+ indexbanche+ indexgruppi + indextitoli ? 'hidden' : ''"
                        v-if="objTitoli[titolo.Id]"
                        type="number"
                        v-model="objTitoli[titolo.Id].Incremento"
                        placeholder="0"
                      />
                      </p>
                    </td>
                    <td class="pb-2">
                      <p @click="AttivaInput = 'controvaloreattuale'+ indexbanche+ indexgruppi + indextitoli">                        
                      {{formatEuro(objTitoli[titolo.Id]?.Controvalore || 0)}}<br />
                      <span v-if="titolo.Nome === 'Importo'"></span>
                      <input :class="AttivaInput !== 'controvaloreattuale'+ indexbanche+ indexgruppi + indextitoli ? 'hidden' : ''"
                    v-else-if="objTitoli[titolo.Id]"
                    type="number"
                    v-model="objTitoli[titolo.Id].Controvalore"                    
                    placeholder="0"
                  />
                      </p></td>
                    <td class="pb-2">
                      <p @click="AttivaInput = 'percentuale'+ indexbanche+ indexgruppi + indextitoli" :class="(objTitoli[titolo.Id]?.Percentuale>0)?'bg-green-100': (objTitoli[titolo.Id]?.Percentuale<0?'bg-red-100':'')">
                      {{formatEuro(objTitoli[titolo.Id]?.Percentuale || 0)}}%<br />
                      <input :class="AttivaInput !== 'percentuale'+ indexbanche+ indexgruppi + indextitoli ? 'hidden' : ''"
                    v-if="objTitoli[titolo.Id]"
                    type="number"
                    v-model="objTitoli[titolo.Id].Percentuale"
                    placeholder="0"
                  />
                      </p></td>
                    <td class="pb-2">
                      <p @click="AttivaInput = 'variazione'+ indexbanche+ indexgruppi + indextitoli" :class="(objTitoli[titolo.Id]?.Variazione>0)?'bg-green-100': (objTitoli[titolo.Id]?.Variazione<0?'bg-red-100':'')">
                      {{formatEuro(objTitoli[titolo.Id]?.Variazione || 0)}}<br />
                      <input :class="AttivaInput !== 'variazione'+ indexbanche+ indexgruppi + indextitoli ? 'hidden' : ''"
                    v-if="objTitoli[titolo.Id]"
                    type="number"
                    v-model="objTitoli[titolo.Id].Variazione"
                    placeholder="0"
                  />
                      </p>
                    </td>
                    <td class="pb-2">
                      <p @click="AttivaInput = 'cedole'+ indexbanche+ indexgruppi + indextitoli" :class="(objTitoli[titolo.Id]?.Cedole>0)?'bg-green-100': (objTitoli[titolo.Id]?.Cedole<0?'bg-red-100':'')">
                      {{formatEuro(objTitoli[titolo.Id]?.Cedole || 0)}}<br />
                      <input :class="AttivaInput !== 'cedole'+ indexbanche+ indexgruppi + indextitoli ? 'hidden' : ''"
                    v-if="objTitoli[titolo.Id]"
                    type="number"
                    v-model="objTitoli[titolo.Id].Cedole"
                    placeholder="0"
                  />
                      </p>
                    </td>
                  </tr>
                </table>
              </span>
            </li>
          </ul>
        </div>
        <span class="font-bold hidden">Totale: {{formatEuro(TotaleBanca)}}</span>
      </div>
      <div class="font-bold text-center text-4xl">Totale super complessivo: {{formatEuro(TotaleComplessivo)}}</div>
    </div>
    <div class="flex justify-center mt-5" v-if="Data !== '999' && Data !== '0'">
      <button class="bg-Bottone rounded-[45px] p-3" @click="AggiornaData">Aggiorna</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { ref, computed, onMounted, watch } from 'vue'
import { Data_aaaammgg_ggmmaaaa, formatEuro } from '@/assets/helpers/MyMixin'
const ElencoDate = Pinia.PatrimonioDate().getElenco
const ElencoBanche = Pinia.PatrimonioBanche().getElenco
const Data = ref('0')
const NuovaData = ref('')
  const AttivaInput = ref('')
const TotaleComplessivo: any = ref('')
  type Titolo = {
  Iniziale?: number
    Prelievo?: number
  Incremento?: number
  Controvalore: number
  Percentuale: number
    Variazione: number
  Cedole: number
}

const objTitoli = ref<Record<string, Titolo>>({})
const Gruppi = computed(() => {
  return (IdBanca: string) => {
    const ElencoGruppi = Pinia.PatrimonioGruppi().getElenco.filter(
      (item) => item.IdBanca === IdBanca
    )
    return ElencoGruppi.sort((a, b) => {
      if (parseInt(a.Posizione) < parseInt(b.Posizione)) {
        return -1
      } else if (parseInt(a.Posizione) > parseInt(b.Posizione)) {
        return 1
      }
      return 0
    })
  }
})
const Titoli = computed(() => {
  return (IdGruppo: string) => {
    const ElencoTitoli = Pinia.PatrimonioTitoli().getElenco.filter(
      (item) => item.IdGruppo === IdGruppo
    )
    const Titoli = ElencoTitoli.sort((a, b) => {
      if (parseInt(a.Posizione) < parseInt(b.Posizione)) {
        return -1
      } else if (parseInt(a.Posizione) > parseInt(b.Posizione)) {
        return 1
      }
      return 0
    })
    return Titoli
  }
})

const ComboDate = computed(() => {
  return ElencoDate.map((item: any) => {
    return {
      text: item.Data,
      value: item.Id
    }
  })
})

const AggiungiData = () => {
  Pinia.PatrimonioDate().Aggiungi({ Data: NuovaData.value }).then(() => {
    //console.log('Nuova data aggiunta:', NuovaData.value)
    NuovaData.value = ''
    Data.value = '0'
  }).catch((error) => {
    console.error('Errore durante l\'aggiunta della data:', error)
  })
}
  const AggiornaData = () => {
  console.log(objTitoli.value)  
    let NewObj: any[] = []
    Object.keys(objTitoli.value).forEach(element => {
    if (Pinia.PatrimonioTitoli().getElenco.find((titolo) => titolo.Id === element)?.Nome !== 'Importo') {
      NewObj.push(objTitoli.value[element])
    }
  })
  console.log('objTitoli:', NewObj)  
  Pinia.PatrimonioDate().Aggiorna({ Id: Data.value, Titoli: objTitoli.value })
    .then(() => {
      console.log('Data aggiornata con successo')
    })
    .catch((error) => {
      console.error('Errore durante l\'aggiornamento della data:', error)
    })
}

const Dataggmmaaaa = (iddata: string) => {
  return Data_aaaammgg_ggmmaaaa(ElencoDate.find((item) => item.Id === iddata)?.Data || '')
}

  const reformat = computed(() => { 
    return (element: any) => {
      console.log(element);
      
      let number = element.toString();
   number = number.replace ('.', ',');
   let intpart = number.substring(0, number.indexOf (','));
      let res = number.substring(number.indexOf(','));
      console.log(intpart, res)
      
   /*
   while (intpart.length () > 3)
   {
      res = '.' + intpart.substring (intpart.length () - 3) + res;
      intpart = intpart.substring (intpart.length () - 3);
   }
   res = intpart + res;
      element = res;*/
   return element +'0'
       }
   }) 
{
  /*
   let number = element.value;
   number = number.replace ('.', ',');
   let intpart = number.substring(0, number.indexOf (','));
   let res = number.substring(number.indexOf (','));
   while (intpart.length () > 3)
   {
      res = '.' + intpart.substring (intpart.length () - 3) + res;
      intpart = intpart.substring (intpart.length () - 3);
   }
   res = intpart + res;
   element.value = res;*/
}

const TotaleBanca = computed(() => {
  return Object.values(objTitoli.value).reduce((acc, titolo) => {
    return acc + titolo.Controvalore
  }, 0)
})

onMounted(() => {
  //console.log('Mounted Patrimoni  o Date')
  setTimeout(() => {
    Pinia.PatrimonioTitoli().getElenco.forEach((titolo: any) => {
      //console.log(titolo.Id)
      objTitoli.value[titolo.Id] = {
        Iniziale: 0,
        Prelievo: 0,
        Incremento: 0,
        Controvalore: 0,
        Percentuale: 0,
        Variazione: 0,
        Cedole: 0
      }
    })
  }, 5000)
})
watch(Data, (newVal) => {
  if (newVal !== '999' && newVal !== '0') {
    // Carica i dati dei titoli per la data selezionata
    //console.log('Data selezionata:', newVal)
    // 15.35 ora nascita papà
    let ArrayControvalori: any[] = []
    let DataSelezionata = ElencoDate.find((date) => date.Id === newVal)
    Pinia.PatrimonioDate().getElenco.forEach((date: { Id: string, Titoli: Record<string, any> }) => {
      if (date.Id === newVal) {
        // Reset objTitoli
        if (date.Titoli) { 
        Object.keys(date.Titoli).forEach((IdTitolo: any) => {
          const Titolo = Pinia.PatrimonioTitoli().getElenco.find((titolo) => titolo.Id === IdTitolo)
          const Gruppo = Pinia.PatrimonioGruppi().getElenco.find((gruppo) => gruppo.Id === Titolo?.IdGruppo)
          const Banca = Pinia.PatrimonioBanche().getElenco.find((banca) => banca.Id === Gruppo?.IdBanca)          
          ArrayControvalori.push({
            IdBanca: Gruppo?.IdBanca,
            Banca: Banca?.Nome,
            IdGruppo: Titolo?.IdGruppo,
            IdTitolo: IdTitolo,
            Controvalore: Titolo?.Nome==='Importo' ? 0 : date.Titoli[IdTitolo].Controvalore
          })          
        })
        }
        //console.log('ArrayControvalori:', ArrayControvalori);


        // Somma gli importi per IdBanca e conta il numero degli elementi sommati per ciascuna banca
        /*const SommaPerBanca = ArrayControvalori.reduce((acc, curr) => {
          if (!curr.IdBanca) return acc
          if (!acc[curr.IdBanca]) {
            acc[curr.IdBanca] = { somma: 0, count: 0 }
          }
          acc[curr.IdBanca].somma += curr.Controvalore || 0
          acc[curr.IdBanca].count += 1
          return acc
        }, {} as Record<string, { somma: number, count: number }>)
        console.log('Somma e count per banca:', SommaPerBanca)        **/
        const ControvalorePerBanca = ArrayControvalori.reduce((acc, curr) => {
          if (!curr.IdBanca) return acc
          acc[curr.IdBanca] = (acc[curr.IdBanca] || 0) + (curr.Controvalore || 0)
          return acc
        }, {} as Record<string, number>)
          const abc = Pinia.PatrimonioTitoli().getElenco.map((titolo) => {
          if (titolo.Nome === 'Importo') {
            const IdBanca = Pinia.PatrimonioGruppi().getElenco.find((gruppo) => gruppo.Id === titolo.IdGruppo)?.IdBanca
            const Importo = IdBanca ? ControvalorePerBanca[IdBanca] || 0 : 0
            return { IdTitolo: titolo.Id, IdGruppo: titolo.IdGruppo, IdBanca, Importo }
          }
        }).filter((titolo) => titolo !== undefined)
        const ArrayDate = Pinia.PatrimonioDate().getElenco.map((date) => {
          return date.Data
        })        
        const indexDataSelezionata = ArrayDate.indexOf(DataSelezionata?.Data || '')
        let dataPrecedente: any = null
        let datiprecedenti: any = null
        if (indexDataSelezionata > 0) {
          dataPrecedente = ArrayDate[indexDataSelezionata - 1]
          // Puoi usare dataPrecedente come necessario
          //console.log('Data precedente:', dataPrecedente)
          if (dataPrecedente) {
            datiprecedenti = Pinia.PatrimonioDate().getElenco.find((date) => date.Data === dataPrecedente)?.Titoli
          }
        }
        
        Object.keys(objTitoli.value).forEach((id) => {
          const Iniziale = Pinia.PatrimonioTitoli().getElenco.find((titolo) => titolo.Id === id)?.ControvaloreIniziale || 0
          let Prelievo = date.Titoli[id]?.Prelievo || 0
          let Incremento = date.Titoli[id]?.Incremento || 0
          if (datiprecedenti) {
            if (Prelievo === 0) {
              Prelievo = datiprecedenti[id]?.Prelievo || 0
            }            
            if (Incremento === 0) {
              Incremento = datiprecedenti[id]?.Incremento || 0
            }
          }
          objTitoli.value[id] = {
            Iniziale: parseFloat(parseFloat(Iniziale as string).toFixed(2)),
            Prelievo: Prelievo || 0,
            Incremento: Incremento || 0,
            Controvalore: date.Titoli[id]?.Controvalore || 0,
            Percentuale: date.Titoli[id]?.Percentuale || 0,
            Variazione: date.Titoli[id]?.Variazione || 0,
            Cedole: date.Titoli[id]?.Cedole || 0,
          }
          if (abc.some((t: any) => t && t.IdTitolo === id)) {
            const importo = abc.find((t: any) => t && t.IdTitolo === id)
            objTitoli.value[id].Controvalore = importo ? importo.Importo : 0
          }
        })
        TotaleComplessivo.value = abc.reduce((acc, curr: any) => {
          return acc + (curr.Importo || 0)
        }, 0)
        //console.log(TotaleComplessivo)
      }
    })
  } else {
    // Reset titoli se si seleziona "Aggiungi nuova data" o nessuna data
    Object.keys(objTitoli.value).forEach((id) => {
      objTitoli.value[id] = {
        Iniziale: 0,
        Prelievo: 0,
        Controvalore: 0,
        Percentuale: 0,
        Variazione: 0,
        Cedole: 0
      }
    })
  }
})
</script>
<style lang="scss">
input {
  @apply w-full text-center bg-gray-200;
}
td p {
  @apply mx-2 w-[100px] bg-gray-200;
}
</style>
