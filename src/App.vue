<template>
  <header>
    <div class="fixed flex right-0 top-0">
      <div class="h-[100px] overflow-y-auto bg-red-100">
        <table class="w-[500px]">
          <tr>
            <th>Casa</th>
            <th>Tipologia</th>
            <th>Importo</th>
            <th>Data</th>
          </tr>
          <tr v-for="(Scadenza, index) in Scadenze" :key="index">
            <td>{{ Scadenza.Casa }}</td>
            <td>{{ Scadenza.Tipologia }}</td>
            <td>{{ Scadenza.Importo }}</td>
            <td>{{ Data_aaaammgg_ggmmaaaa(Scadenza.Data) }}</td>
          </tr>
        </table>
      </div>
      <div class="h-[100px] w-[290px] overflow-y-auto bg-red-100">
        <table class="mx-2">
          <tr>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Data di nascita</th>
          </tr>
          <template v-for="(Compleanno, index) in Compleanni">
            <tr :class="Compleanno.Test ? 'giornocompleanno' : ''">
              <td>
                {{ Compleanno.Nome }}
              </td>
              <td>
                {{ Compleanno.Cognome }}
              </td>
              <td>
                {{ Compleanno.Giorno }} {{ MeseDaNumeroANome(Compleanno.Mese) }} {{ Compleanno.Anno }}
              </td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </header>
  <aside>
    <div class="w-[fit-content] m-auto text-[16px] py-1 px-2 my-2 border border-[4px] border-black">Menu</div>
    <router-link :to="{ name: 'CalendarioFilosofico' }">
      <h2>Calendario Filosofico</h2>
    </router-link>
    <router-link :to="{ name: 'Compleanni' }">
      <h2>Compleanni</h2>
    </router-link>
    <div class="border border-[0px] border-blue-900 p-3 m-3 Bordo">
      <div class="bg-gray-300">Vita indipedente</div>
      <router-link :to="{ name: 'Assistenti' }">
        <h2>Assistenti</h2>
      </router-link>
      <router-link :to="{ name: 'BustePaga' }">
        <h2>Buste paga</h2>
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
      <router-link :to="{ name: '730' }">
        <h2>Rimborso 730</h2>
      </router-link>
    </div>                
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
import { onMounted, computed } from 'vue'
import { MeseDaNumeroANome, Data_aaaammgg_ggmmaaaa } from './assets/helpers/MyMixin';
const FirebaseLogin = Pinia.Login()
const FirebaseAssistenti = Pinia.Assistenti()
const FirebaseCompleanni = Pinia.Compleanni()
const FirebaseBuste = Pinia.Buste()
const FirebaseScadenze = Pinia.Scadenze()
const FirebaseCalendarioFilosofico = Pinia.CalendarioFilosofico()
const FirebaseSuperCategorie = Pinia.SuperCategorie()
const FirebaseCategorie = Pinia.Categorie()
const FirebaseMovimenti = Pinia.Movimenti()
const FirebaseRimborsi730 = Pinia.Rimborsi730()
const FirebaseHandiphoneCategorie = Pinia.HandiphoneCategorie()
const FirebaseHandiphoneCodiciFrasi = Pinia.HandiphoneParoleFrasi()

const Scadenze = computed(() => {
  return FirebaseScadenze.getElenco('futuri')
})
const Compleanni = computed(() => {
  return FirebaseCompleanni.getElenco('futuri')
})


onMounted(() => {
  console.log('app')  
  //if (!localStorage.getItem('Token')) 
  //{
  FirebaseLogin.Login()
  //}

  FirebaseAssistenti.Elenco()
  FirebaseBuste.Elenco()
  FirebaseCompleanni.Elenco()
  FirebaseScadenze.Elenco()
  FirebaseCalendarioFilosofico.Elenco()
  FirebaseSuperCategorie.Elenco()
  FirebaseCategorie.Elenco()
  FirebaseMovimenti.Elenco()
  FirebaseRimborsi730.Elenco()
  FirebaseHandiphoneCategorie.Elenco()
  FirebaseHandiphoneCodiciFrasi.Elenco()
})

</script>

<style scoped>
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
    @apply w-[200px] text-[16px] bg-blue-300;
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
