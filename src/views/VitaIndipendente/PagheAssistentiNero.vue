<template>
  <div class="text-center">
    <h1 class="text-center text-[30px]">Gestione Paghe Assistenti Nero</h1>
    <select v-model="IdAssistente" class="p-3 m-3 rounded-[45px]">
      <template v-for="(assistente, index) in ElencoAssistentiNero" :key="index">
        <option :value="assistente.Id">
          {{ assistente.Nome }}
        </option>
      </template>
    </select>
    <div>
      <input v-model="mese" />
    </div>
    <rtable :items="Items" :pinia="Pinia.PagaAssistentiNero()" />
    <table class="text-center m-auto w-[470px] border border-black mt-5">
      <tr>
        <th>Anno</th>
        <th>Mese</th>
        <th>Totale Paga</th>
        <th class="w-[290px]">Check Assistente</th>
        <th class="w-[290px]">Check Prelievo</th>
        <th class="w-[290px]">Compila tabella</th>
      </tr>
      <tr v-for="(item, key) in RaggruppaPerMesi()" :key="key">
        <td>{{ key.toString().substring(0, 4) }}</td>
        <td>{{ MeseDaNumeroANome(key.toString().substring(4, 6)) }}</td>
        <td>{{ Number(item).toFixed(2) }}</td>
        <td
          v-if="
            CheckAssistente({
              anno: key.toString().substring(0, 4),
              mese: key.toString().substring(4, 6)
            }) === Number(item).toFixed(2)
          "
          class="flex justify-center"
        >
          <BTNConferma class="BTNAzione BTNSalva" style="cursor: none" />
        </td>
        <td v-else class="left-[40px] relative">
          <BTNConferma class="BTNAzione BTNSalva" style="cursor: none; background-color: red" />
        </td>
        <td
          v-if="
            CheckBancomat({
              anno: key.toString().substring(0, 4),
              mese: key.toString().substring(4, 6)
            }) === Number(item).toFixed(2)
          "
          class="left-[40px] relative"
        >
          <BTNConferma class="BTNAzione BTNSalva" style="cursor: none" />
        </td>
        <td v-else class="left-[40px] relative">
          <BTNConferma class="BTNAzione BTNSalva" style="cursor: none; background-color: red" />
        </td>
        <td
          v-if="
            CheckAssistente({
              anno: key.toString().substring(0, 4),
              mese: key.toString().substring(4, 6)
            }) != undefined &&
            CheckBancomat({
              anno: key.toString().substring(0, 4),
              mese: key.toString().substring(4, 6)
            }) != undefined
          "
          class="left-[40px] relative"
        >
          <BTNConferma class="BTNAzione BTNSalva" style="cursor: none" />
        </td>
        <td v-else class="w-[200px]">
          <BTNSalva
            class="BTNAzione BTNSalva"
            @click="
              AggiungiMovimento({
                anno: key.toString().substring(0, 4),
                mese: key.toString().substring(4, 6),
                importo: item
              })
            "
          />
        </td>
      </tr>
    </table>
  </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { ref, computed } from 'vue'
import { MeseDaNumeroANome } from '@/assets/helpers/MyMixin'

import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import BTNSalva from '@/components/ComponenteTabella/IconeSvg/Salva.vue'
import BTNConferma from '@/components/ComponenteTabella/IconeSvg/Conferma.vue'
const ElencoAssistentiNero = Pinia.AssistentiNero().getElenco
const ElencoPagaAssistentiNero = Pinia.PagaAssistentiNero().getElenco

const IdAssistente = ref('-OnBmJgWDPUL2OJPp63r')
  const IdAssistenteCategoriaBanca = ref('')
const mese = ref('')
const Items = computed(() => {
  const tmp = ElencoPagaAssistentiNero.filter(
    (item) => item.IdAssistenteNero === IdAssistente.value
  ).map((item) => {
    return {
      Id: {
        Type: 'string',
        Value: item.Id,
        Class: 'text-left',
        VerificaEliminazione: true
      },
      IdAssistenteNero: {
        Type: 'select',
        Value: item.IdAssistenteNero,
        Class: 'text-center',
        Array: DatiCombo()
      },
      Data: {
        Type: 'string',
        Value: item.Data,
        Class: 'text-center',
        Valido: 'p'
      },
      PagaOraria: {
        Type: 'string',
        Value: item.PagaOraria,
        Class: 'text-center',
        Valido: 'p'
      },
      Ore: {
        Type: 'string',
        Value: item.Ore, // +' ' + item.Data.split('-').length*Number(item.PagaOraria),
        Class: 'text-center',
        Valido: 'p'
      },
      Importo: {
        Type: 'string',
        Value: Number(item.PagaOraria) * Number(item.Ore),
        Class: 'text-center'
      }
    }
  }).filter(item => {
    if (mese.value === '') {
      return true
    }
    return item.Data.Value.split('/')[1] === mese.value
  }).sort((a, b) => {
    if (a.Data.Value.split('/')[1] < b.Data.Value.split('/')[1]) {
      return -1
    } else if (a.Data.Value.split('/')[1] > b.Data.Value.split('/')[1]) {
      return 1
    }
    return 0
  })
  return tmp
})
const DatiCombo = () => {
  const tmp = Pinia.AssistentiNero().getElenco.sort((a, b) => {
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
const RaggruppaPerMesi = () => {
  const paghe = Pinia.PagaAssistentiNero().getElenco.filter((item) => {
    return item.IdAssistenteNero === IdAssistente.value
  })

  return paghe.reduce((acc: any, item) => {
    const key = item.Data.split('/')[2] + item.Data.split('/')[1] // Extract MM
    acc[key] = (acc[key] || 0) + Number(item.Ore) * Number(item.PagaOraria) // Sum the Importo
    return acc
  }, {})
}
const CheckAssistente = (item: any) => {
  IdAssistenteCategoriaBanca.value = Pinia.AssistentiNero().getElenco.filter(
    (item) => item.Id === IdAssistente.value
  )[0].IdCategoriaBanca
  const UltimoGiornoDelMese = new Date(Number(item.anno), Number(item.mese), 0).getDate()
  //console.log(`${item.anno}-${item.mese}-${UltimoGiornoDelMese}`)
  const Movimenti = Pinia.Movimenti()
    .getElenco.map((movimento) => {
      //console.log(movimento.Data, `${item.anno}-${item.mese}-${UltimoGiornoDelMese}`)
      if (
        movimento.IdCategoria === IdAssistenteCategoriaBanca.value &&
        movimento.Data === `${UltimoGiornoDelMese}-${item.mese}-${item.anno}`
      ) {
        return {
          IdCategoria: movimento.IdCategoria,
          Data: movimento.Data,
          Accrediti: movimento.Accrediti,
          Addebiti: movimento.Addebiti
        }
      }
      return null
    })
    .filter((item) => item !== null)
  //console.log(Movimenti[0]?.Addebiti);

  return Movimenti[0]?.Addebiti
}
const CheckBancomat = (item: any) => {
  IdAssistenteCategoriaBanca.value = Pinia.AssistentiNero().getElenco.filter(
    (item) => item.Id === IdAssistente.value
  )[0].IdCategoriaBanca
  const IdPrelievoBancomat = Pinia.Categorie().getElenco.filter((categoria) => {
    //console.log(categoria.Nome)
    if (categoria.Nome.substring(0, 8) === 'Prelievo') {
      //console.log('trovato')
      return categoria.Id
    }
  })[0]?.Id

  const UltimoGiornoDelMese = new Date(Number(item.anno), Number(item.mese), 0).getDate()
  const NomeAssistente = Pinia.AssistentiNero().getElenco.filter(
    (assistente) => assistente.Id === IdAssistente.value
  )[0].Nome
  const Movimenti = Pinia.Movimenti()
    .getElenco.map((movimento) => {
      //console.log(movimento.Data, `${UltimoGiornoDelMese}-${item.mese}-${item.anno}`)
      if (
        movimento.IdCategoria === IdPrelievoBancomat &&
        movimento.Data === `${UltimoGiornoDelMese}-${item.mese}-${item.anno}` &&
        movimento.Descrizione === NomeAssistente
      ) {
        return {
          IdCategoria: movimento.IdCategoria,
          Data: movimento.Data,
          Accrediti: movimento.Accrediti,
          Addebiti: movimento.Addebiti
        }
      }
      return null
    })
    .filter((item) => item !== null)
  return Movimenti[0]?.Accrediti
}

const AggiungiMovimento = (item: any) => {
  //console.log(Pinia.Categorie().getElenco);

  const IdPrelievoBancomat = Pinia.Categorie().getElenco.filter((categoria) => {
    //console.log(categoria.Nome)
    if (categoria.Nome.substring(0, 8) === 'Prelievo') {
      console.log('trovato')
      return categoria.Id
    }
  })[0].Id
  console.log(item, IdAssistenteCategoriaBanca.value, IdPrelievoBancomat)
  const NomeAssistente = Pinia.AssistentiNero().getElenco.filter(
    (assistente) => assistente.Id === IdAssistente.value
  )[0].Nome
  const UltimoGiornoDelMese = new Date(Number(item.anno), Number(item.mese), 0).getDate()
  const PlayloadAssistente = {
    IdCategoria: IdAssistenteCategoriaBanca.value,
    Data: `${item.anno}-${item.mese}-${UltimoGiornoDelMese}`,
    Accrediti: 0,
    Addebiti: item.importo,
    Descrizione: `Prelievo bancomat ${NomeAssistente}`
  }

  const PlayloadBancomat = {
    IdCategoria: IdPrelievoBancomat,
    Data: `${item.anno}-${item.mese}-${UltimoGiornoDelMese}`,
    Accrediti: item.importo,
    Addebiti: 0,
    Descrizione: `${NomeAssistente}`
  }
  console.log(PlayloadAssistente, PlayloadBancomat)
  Pinia.Movimenti().Aggiungi(PlayloadAssistente)
  Pinia.Movimenti().Aggiungi(PlayloadBancomat)
}
</script>

<style lang="scss" scoped>
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
</style>
