<template>
  <div class="ml-[200px] mt-[100px]">
    <p class="mb-5 font-bold">Tabelle copiate da poduzione a sviluppo</p>
    <div v-for="(tabella, index) in TabelleCopiate" ::key="index">{{ tabella }}</div>
  </div>
</template>
<script setup lang="js">

import { reactive } from 'vue'
import { ref, get, set, push } from 'firebase/database'
import { sourceDB, targetDB } from '@/stores/Conn.ts'
import { Pinia } from '@/stores/'
import { onMounted } from 'vue'
const FirebaseUltimoBackup = Pinia.UltimoBackup()

const TabelleCopiate = reactive([])
const Copy = async (tabella) => {
  const sourceRef = ref(sourceDB, tabella) // Legge tutto il database
  const snapshot = await get(sourceRef)

  if (snapshot.exists()) {
    const data = snapshot.val()
    //console.log(data)
    TabelleCopiate.push(tabella)
    const targetRef = ref(targetDB, tabella)
    await set(targetRef, data)
  }
}

onMounted(() => {
  const ArrayTabelle = [
    'accountpassword',
    'articoli',
    'assistenti',
    'buste',
    'calendariofilosofico',
    'casecondominio',
    'categorie',
    'compleanni',
    'distrettibotulino',
    'esami',
    'gruppipassword',
    'handiphonecategorie',
    'handiphonefrasi',
    'hawkingscuole',
    'landingpage',
    'movimenti',
    'muscolibotulino',
    'postlandingpage',
    'qtydatebotulino',
    'recensioni',
    'rimborsi730',
    'scadenzecondominio',
    'supercategorie',
    'tipologiecondominio'
  ]
  ArrayTabelle.forEach((item) => {
    Copy(item)
  })
 console.log('p') 
    FirebaseUltimoBackup.Aggiorna(new Date()).then((res) =>  {
      console.log(res)      
    })
})
</script>
