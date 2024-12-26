<template>
  <main>
    <h1 class="text-center text-[30px]">Compleanni</h1>
    <table class="text-center m-auto w-[400px] bg-white">
      <tr>
        <th>Data</th>
        <th>Tipologia</th>
        <th>Casa</th>
        <th>Importo</th>
      </tr>
      <tr v-for="(scadenza, index) in Scadenze" :key="index" :class="ScadenzePassate(scadenza.Data)">
        <td>{{ Data_aaaammgg_ggmmaaaa(scadenza.Data) }}</td>
        <td>{{ scadenza.Tipologia }}</td>
        <td>{{ scadenza.Casa }}</td>
        <td>{{ formatEuro(scadenza.Importo) }}</td>
      </tr>
    </table>
  </main>
</template>

<script setup lang="ts">
import { Pinia } from '@/stores/index'
import { ref, computed, onMounted } from 'vue'
import { Data_aaaammgg_ggmmaaaa, formatEuro } from '@/assets/helpers/MyMixin';
const FirebaseScadenze = Pinia.Scadenze()

const Scadenze = ref()

const ScadenzePassate = computed(() => {
  return (data: string) => {   
    if ((new Date(data)).getTime() < (new Date()).getTime()) {
      return 'BTNSalva'
    }
  }
})

onMounted(() => {
  setTimeout(() => {
    Scadenze.value = FirebaseScadenze.getElenco('').sort((a,b) => {
            return new Date(a.Data).getTime() - new Date(b.Data).getTime()
          })
  }, 500)
})
</script>
<style lang="scss" scoped>
main {
  @apply h-screen w-screen text-center;
}

table {
  width: 800px;
}

th {
  @apply bg-gray-300;
}

.BTNSalva {
  @apply bg-green-300;
}
</style>