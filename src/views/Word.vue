<template >
    <div>
        <div
    style="
      position: fixed;
      top: 0;
      left: 500px;
      color: var(--Testo);
      font-size: 30px;
      width: 90%;
    "
  >
    {{ Predizione }}
  </div>
  <div style="text-align: left; margin-top: 110px; margin-left: 200px;">
    <textarea
      @keyup="Onkeyup"
      v-model="Testo"
      style="width: 90%; height: 1400px; float: left; font-size: 40px"
    />
    <button
      style="background-color: red"
      @click=";(Backup = Testo), (Testo = ''), (Contatore = Max)"
      >Cacella</button
    >
    <button style="background-color: green" @click="Testo = Backup"
      >Ripristina</button
    ><br />
    <span id="Contatore">{{ Contatore }}</span>
  </div>    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { onMounted, ref } from 'vue';
const FirebaseFrasi = Pinia.HandiphoneParoleFrasi()
const Frasi = FirebaseFrasi.getElenco
const Testo = ref('')
const Predizione = ref('')
const Backup = ref('')
const Max = ref(50)
const Contatore = ref(0)
const Contatore_ = () => {
    setTimeout(() => {
        if (Testo.value.length > 0) {
            Contatore.value--
        }
        if (Contatore.value === 0) {
            Backup.value = Testo.value
            Testo.value = ''
            Contatore.value = Max.value
        }
        Contatore_()
    }, 1000)
}

const Onkeyup = () => {
    Contatore.value = Max.value
    const ArrayParole = Testo.value.split(" ")
      const UltimoCarattere = Testo.value.substring(
        Testo.value.length - 1,
        Testo.value.length
      )
      const UltimaParola = ArrayParole[ArrayParole.length - 1]
      //console.log(UltimaParola, UltimoCarattere)
      const CodiceFrase = Frasi.find(
        (item) => item.Codice === UltimaParola
      )
      if (UltimoCarattere === " " && Predizione.value != "") {
        let Nuovo = ""
        ArrayParole.forEach((item, index) => {
          if (index < ArrayParole.length - 2) {
            Nuovo += item + " "
          }
        })
        Testo.value = Nuovo + Predizione.value + " "
        Predizione.value = ""
      }
      if (CodiceFrase) {
        Predizione.value = CodiceFrase["Frase"]
      } else {
        Predizione.value = ""
      }
}

onMounted(() => {
    Contatore.value = Max.value
    Contatore_()
})
</script>
<style lang="scss" scoped>
button {
    @apply text-[25px] p-1 m-3;
}
#Contatore {
    @apply text-[90px] flex justify-center;
}
</style>