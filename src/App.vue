<template>
  <header v-if="!hideAside">
    <div class="fixed right-[1000px] top-[50px]">
      Ultimo backup: {{ UltimoBackup }}
      <div style="position: fixed; left: 200px; top: 20px; font-size: 30px; font-weight: bold">
        <span v-if="DatabaseFirebase === 'produzione'">Produzione</span>
        <span v-else class="text-red-600">Sviluppo</span>
      </div>
      <router-link :to="{ name: 'CopyDb' }">
        <button class="bg-Bottone p-2 rounded-[45px]">Esegui backup</button>
      </router-link>
    </div>
    <div class="fixed flex right-0 top-0">
      <div class="h-[100px] overflow-y-auto bg-red-100">
        <table class="w-[500px]">
          <tr>
            <th>Casa</th>
            <th>Tipologia</th>
            <th>Importo</th>
            <th>Data</th>
            <th>Pagato</th>
          </tr>
          <tr
            v-for="(Scadenza, index) in Scadenze"
            :key="index"
            :class="TestScadenza(Scadenza.Data)"
          >
            <td>{{ Scadenza.Casa }}</td>
            <td>{{ Scadenza.Tipologia }}</td>
            <td>{{ Scadenza.Importo }}</td>
            <td>{{ Data_aaaammgg_ggmmaaaa(Scadenza.Data) }}</td>
            <td>{{ Scadenza.Pagato ? 'X' : '' }}</td>
          </tr>
        </table>
      </div>
      <div class="h-[100px] w-[300px] overflow-y-auto bg-red-100">
        <table class="mx-2">
          <tr>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Data di nascita</th>
          </tr>
          <template v-for="Compleanno in Compleanni">
            <tr :class="Compleanno.Test ? 'giornocompleanno' : ''">
              <td>
                {{ Compleanno.Nome }}
              </td>
              <td>
                {{ Compleanno.Cognome }}
              </td>
              <td>
                {{ Compleanno.Giorno }} {{ MeseDaNumeroANome(Compleanno.Mese) }}
                {{ Compleanno.Anno }}
              </td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </header>
  <aside v-if="!hideAside">
    <div class="w-[fit-content] m-auto text-[16px] py-1 px-2 my-2 border border-[4px] border-black">
      Menu
    </div>
    <router-link :to="{ name: 'CalendarioFilosofico' }">
      <h2>Calendario Filosofico</h2>
    </router-link>
    <!--
    <router-link :to="{ name: 'SituazioneMamma' }">
      <h2>Situazione Mamma</h2>
    </router-link>
    -->
    <router-link :to="{ name: 'Compleanni' }">
      <h2>Compleanni</h2>
    </router-link>
    <div class="grid grid-cols-2">
      <div class="border border-[0px] border-blue-900 p-3 m-3 Bordo">
        <div class="bg-gray-300">Vita indipedente</div>
        <router-link :to="{ name: 'Assistenti' }">
          <h2>Assistenti</h2>
        </router-link>
        <router-link :to="{ name: 'BustePaga' }">
          <h2>Buste paga</h2>
        </router-link>
        <router-link :to="{ name: 'AssistentiNero' }">
          <h2>Assistenti in nero</h2>
        </router-link>
        <router-link :to="{ name: 'BustePagaNero' }">
          <h2>Buste paga in nero</h2>
        </router-link>
        <router-link :to="{ name: 'TurniCalendario' }">
          <h2>Turni Calendario</h2>
        </router-link>
      </div>
      <div class="border border-[0px] border-blue-900 p-3 m-3 Bordo">
        <div class="bg-gray-300">Banca</div>
        <router-link :to="{ name: 'SuperCategorie' }">
          <h2>SuperCategorie</h2>
        </router-link>
        <router-link :to="{ name: 'Categorie' }">
          <h2>Categorie</h2>
        </router-link>
        <router-link :to="{ name: 'Movimenti' }">
          <h2>Movimenti</h2>
        </router-link>
        <router-link :to="{ name: 'Tabellone' }">
          <h2>Tabellone</h2>
        </router-link>
        <router-link :to="{ name: 'Confronto' }">
          <h2>Confronto</h2>
        </router-link>
        <router-link :to="{ name: '730' }">
          <h2>Rimborso 730</h2>
        </router-link>
        <router-link :to="{ name: 'Banche' }">
          <h2>Banche</h2>
        </router-link>
        <router-link :to="{ name: 'GruppiPrimoLivello' }">
          <h2>Gruppi primo livello</h2>
        </router-link>
        <router-link :to="{ name: 'Titoli' }">
          <h2>Titoli</h2>
        </router-link>
        <router-link :to="{ name: 'PatrimonioDate' }">
          <h2>Date</h2>
        </router-link>
        <router-link :to="{ name: 'SituazioneFideuram' }">
          <h2>Situazione Fideuram</h2>
        </router-link>
      </div>
      <div class="border border-[0px] border-blue-900 p-3 m-3 Bordo">
        <div class="bg-gray-300">Botulino</div>
        <router-link :to="{ name: 'BotulinoDistretti' }">
          <h2>Distretti</h2>
        </router-link>
        <router-link :to="{ name: 'BotulinoMuscoli' }">
          <h2>Muscoli</h2>
        </router-link>
        <router-link :to="{ name: 'BotulinoQtyDate' }">
          <h2>Quantità date</h2>
        </router-link>
        <router-link :to="{ name: 'BotulinoTabellone' }">
          <h2>Tabellone</h2>
        </router-link>
      </div>
      <div class="border border-[0px] border-blue-900 p-3 m-3 Bordo">
        <div class="bg-gray-300">Tema natale</div>
        <router-link :to="{ name: 'TemaNataleElementi' }">
          <h2>Gli elementi</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNatalePolaritàSegni' }">
          <h2>Le polarità dei segni zodiacali</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNataleStagioni' }">
          <h2>Le stagioni</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNataleNatura' }">
          <h2>La natura dei segni zodiacali</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNataleQuadruplicitàSegni' }">
          <h2>Quadruplicità segni zodiacali</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNataleGovernatoriSegni' }">
          <h2>Governatori segni</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNataleOppostoSegni' }">
          <h2>Opposti segni</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNataleSegni' }">
          <h2>I segni zodiacali</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNataleGruppiCase' }">
          <h2>I gruppi delle case</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNataleCase' }">
          <h2>Le case</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNataleTipologiaPianeti' }">
          <h2>Tipologia pianeti</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNatalePianeti' }" class="hidden">
          <h2>Pianeti</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNatalePianetiSegni' }">
          <h2>Pianeti Segni</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNatalePianetiElementi' }">
          <h2>Pianeti Elementi</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNataleLetturaTemaNatale' }">
          <h2>Lettura tema natale</h2>
        </router-link>
        <router-link :to="{ name: 'TemaNatalePianetiCaseSegni' }">
          <h2>PianetiCaseSegni</h2>
        </router-link>
      </div>
      <div class="border border-[0px] border-blue-900 p-3 m-3 Bordo">
        <div class="bg-gray-300">Password</div>
        <router-link :to="{ name: 'GruppiPassword' }">
          <h2>Gruppi password</h2>
        </router-link>
        <router-link :to="{ name: 'AccountPassword' }">
          <h2>Account password</h2>
        </router-link>
      </div>
      <div class="border border-[0px] border-blue-900 p-3 m-3 Bordo">
        <div class="bg-gray-300">Libri</div>
        <router-link :to="{ name: 'Libri' }">
          <h2>Libri</h2>
        </router-link>
        <router-link :to="{ name: 'Recensioni' }">
          <h2>Recensioni</h2>
        </router-link>
      </div>
    </div>
    <router-link :to="{ name: 'Home' }">
      <h2>Scadenze</h2>
    </router-link>
    <router-link :to="{ name: 'Handiphone' }">
      <h2>Handiphone</h2>
    </router-link>
  </aside>
  <div class="mt-[100px]">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { Pinia } from '@/stores/index'
import { DatabaseFirebase } from './stores/Conn'
import { onMounted, computed, watch } from 'vue'
import { MeseDaNumeroANome, Data_aaaammgg_ggmmaaaa } from './assets/helpers/MyMixin'
const FirebaseLogin = Pinia.Login()

const FirebaseAssistenti = Pinia.Assistenti()
const FirebaseAssistentiNero = Pinia.AssistentiNero()
const FirebasePagaAssistentiNero = Pinia.PagaAssistentiNero()
const FirebaseAssistentiFerie = Pinia.AssistentiFerie()
const FirebaseCalendarioTurni = Pinia.CalendarioTurni()
const FirebaseAssistentiSabati = Pinia.AssistentiSabati()
const FirebaseDistribuzioneTurniAssistenti = Pinia.DistribuzioneTurniAssistenti()
const FirebaseGiorniFestivi = Pinia.AssistentiGiorniFestivi()
const FirebaseBuste = Pinia.Buste()
const FirebaseBloccaMeseCalendario = Pinia.BloccaMeseCalendario()
  const FirebaseAssistentiOrariNero = Pinia.AssistentiOrariNero()

const FirebaseCompleanni = Pinia.Compleanni()

const FirebaseScadenze = Pinia.Scadenze()
const FirebaseCalendarioFilosofico = Pinia.CalendarioFilosofico()
const FirebaseSuperCategorie = Pinia.SuperCategorie()
const FirebaseCategorie = Pinia.Categorie()
const FirebaseMovimenti = Pinia.Movimenti()
const FirebaseRimborsi730 = Pinia.Rimborsi730()
const FirebasePatrimonioBanche = Pinia.PatrimonioBanche()
const FirebasePatrimonioGruppi = Pinia.PatrimonioGruppi()
const FirebasePatrimonioDate = Pinia.PatrimonioDate()
const FirebasePatrimonioTitoli = Pinia.PatrimonioTitoli()
const FirebaseSituazioneFideuram = Pinia.SituazioneFideuram()
const FirebaseHandiphoneCategorie = Pinia.HandiphoneCategorie()
const FirebaseHandiphoneCodiciFrasi = Pinia.HandiphoneParoleFrasi()
const FirebaseGruppiPassword = Pinia.GruppiPassword()
const FirebaseAccountPassword = Pinia.AccountPassword()
const FirebaseBotulinoDistretti = Pinia.BotulinoDistretti()
const FirebaseBotulinoMuscoli = Pinia.BotulinoMuscoli()
const FirebaseBotulinoQtyDate = Pinia.BotulinoQtyDate()
const FirebaseTemaNataleUtenti = Pinia.TemaNataleUtenti()
const FirebaseTemaNataleElementi = Pinia.TemaNataleElementi()
const FirebaseTemaNatalePolaritàSegni = Pinia.TemaNatalePolaritàSegni()
const FirebaseTemaNataleGovernatoriSegni = Pinia.TemaNataleGovernatoriSegni()
const FirebaseTemaNataleOppostoSegni = Pinia.TemaNataleOppostoSegni()
const FirebaseTemaNataleSegni = Pinia.TemaNataleSegni()
const FirebaseTemaNataleGruppiCase = Pinia.TemaNataleGruppiCase()
const FirebaseTemaNataleCase = Pinia.TemaNataleCase()
const FirebaseTipologiaPianeti = Pinia.TemaNataleTipologiaPianeti()
const FirebaseTemaNatalePianeti = Pinia.TemaNatalePianeti()
const FirebaseTemaNataleStagioni = Pinia.TemaNataleStagioni()
const FirebaseTemaNataleNatura = Pinia.TemaNataleNatura()
const FirebaseTemaNataleQuadrupliitàSegni = Pinia.TemaNataleQuadruplicitàSegni()
const FirebaseTemaNatalePianetiCaseSegni = Pinia.TemaNatalePianetiCaseSegni()
const FirebaseUltimoBackup = Pinia.UltimoBackup()
const FirebaseDeclinoMamma = Pinia.DeclinoMamma()
const FirebaseLibri = Pinia.Libri()
const FirebaseLibro = Pinia.Libro()
const FirebaseRecensioni = Pinia.Recensioni()
const FirebaseProvvigioniLibroSilvia = Pinia.ProvvigioniLibroSilvia()

import { useRoute } from 'vue-router'
import type router from './router'
const route = useRoute()
const hideAside = computed(() =>
  route.matched.some((r) => {
    if (!route.params.id) {
      return false
    } else {
      return route.matched[route.matched.length - 1]?.meta?.hideAside === route.params.id
    }
  })
)

watch(
  hideAside,
  (val) => {
    console.log(val)

    if (val) {
      document.body.style.backgroundColor = '#dddddd'
    }
  },
  { immediate: true }
)

const Scadenze = computed(() => {
  return FirebaseScadenze.getElenco('futuri')
})
const Compleanni = computed(() => {
  return FirebaseCompleanni.getElenco('futuri')
})

const UltimoBackup = computed(() => {
  return FirebaseUltimoBackup.getElenco[0] ? FirebaseUltimoBackup.getElenco[0]['Data'] : ''
})

const TestScadenza = computed(() => {
  return (datascadenza: string) => {
    //const datatmp = '2025-01-10'
    const DataTimeScadenza = new Date(datascadenza)
    const oggi = new Date()
    let ultimi5giorni = new Date(datascadenza)
    ultimi5giorni.setDate(ultimi5giorni.getDate() - 5)
    //console.log(ultimi5giorni, ultimi5giorni.getTime(), DataTimeScadenza, DataTimeScadenza.getTime(), oggi, oggi.getTime())
    let tmp = ''

    if (new Date(DataTimeScadenza).getTime() < oggi.getTime()) {
      tmp = 'bg-green-400'
    } else if (
      oggi.getTime() > ultimi5giorni.getTime() &&
      oggi.getTime() < DataTimeScadenza.getTime()
    ) {
      tmp = 'bg-yellow-500'
    }

    return tmp
  }
})

onMounted(() => {
  if (DatabaseFirebase === 'sviluppo')
    document.documentElement.style.setProperty('--produzione', '#e88686')
  //if (!localStorage.getItem('Token'))
  //{
  FirebaseLogin.Login()
  //}

  FirebaseAssistenti.Elenco()
  FirebaseAssistentiNero.Elenco()
  FirebasePagaAssistentiNero.Elenco()
  FirebaseCalendarioTurni.Elenco()
  FirebaseAssistentiSabati.Elenco()
  FirebaseAssistentiFerie.Elenco()
  FirebaseDistribuzioneTurniAssistenti.Elenco()
  FirebaseGiorniFestivi.Elenco()
  FirebaseBuste.Elenco()
  FirebaseBloccaMeseCalendario.Elenco()
  FirebaseAssistentiOrariNero.Elenco()
  /*
  FirebaseLibro.Elenco()
  FirebaseLibri.Elenco()
  FirebaseRecensioni.Elenco()
  FirebaseProvvigioniLibroSilvia.Elenco()

  FirebaseCompleanni.Elenco()
  FirebaseScadenze.Elenco()
  FirebaseCalendarioFilosofico.Elenco()

  FirebaseSuperCategorie.Elenco()
  FirebaseCategorie.Elenco()
  FirebaseMovimenti.Elenco()
  FirebaseRimborsi730.Elenco()

  FirebasePatrimonioBanche.Elenco()
  FirebasePatrimonioGruppi.Elenco()
  FirebasePatrimonioTitoli.Elenco()
  FirebasePatrimonioDate.Elenco()

  FirebaseSituazioneFideuram.Elenco()

  FirebaseHandiphoneCategorie.Elenco()
  FirebaseHandiphoneCodiciFrasi.Elenco()
  FirebaseGruppiPassword.Elenco()
  FirebaseAccountPassword.Elenco()

  FirebaseBotulinoDistretti.Elenco()
  FirebaseBotulinoMuscoli.Elenco()
  FirebaseBotulinoQtyDate.Elenco()

  FirebaseTemaNataleUtenti.Elenco()

  FirebaseTemaNataleElementi.Elenco()
  FirebaseTemaNatalePolaritàSegni.Elenco()
  FirebaseTemaNataleGovernatoriSegni.Elenco()
  FirebaseTemaNataleOppostoSegni.Elenco()
  FirebaseTemaNataleSegni.Elenco()
  FirebaseTemaNataleGruppiCase.Elenco()
  FirebaseTemaNataleCase.Elenco()
  FirebaseTipologiaPianeti.Elenco()
  FirebaseTemaNatalePianeti.Elenco()
  FirebaseTemaNataleStagioni.Elenco()
  FirebaseTemaNataleNatura.Elenco()
  FirebaseTemaNataleQuadrupliitàSegni.Elenco()
  FirebaseTemaNatalePianetiCaseSegni.Elenco()
  */
  FirebaseUltimoBackup.Elenco()
  FirebaseDeclinoMamma.Elenco()
  if (DatabaseFirebase != 'produzione') {
    document.documentElement.style.setProperty('--produzione', '#eccc86')
  }
})
</script>

<style lang="scss">
th,
td {
  @apply text-center;
}

th {
  @apply bg-gray-300;
}

.giornocompleanno {
  @apply bg-green-600;
}

aside {
  @apply w-[0px] text-[0px] h-full fixed top-0 pl-2 z-10;

  &:hover {
    @apply w-[400px] text-[16px] bg-blue-300;
    -webkit-transition: width 1s ease-in-out;
    -moz-transition: width 1s ease-in-out;
    -o-transition: width 1s ease-in-out;
    transition: width 1s ease-in-out;
  }

  &:hover .Bordo {
    @apply border-[1px] !important;
  }
}

h2 {
  @apply pl-2;

  &:hover {
    @apply bg-blue-500;
  }
}
</style>
