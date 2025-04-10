<template>
  <main class="relative top-[120px] p-5">
    <h1 class="text-center text-[30px]">Scadenze</h1>
    <table class="text-center m-auto w-[400px] bg-white hidden">
      <tr>
        <th>Data</th>
        <th>Tipologia</th>
        <th>Casa</th>
        <th>Importo</th>
        <th>Pagato</th>
      </tr>
      <tr v-for="(scadenza, index) in Scadenze" :key="index" :class="ScadenzePassate(scadenza.Data)">
        <td>{{ Data_aaaammgg_ggmmaaaa(scadenza.Data) }}</td>
        <td>{{ scadenza.Tipologia }}</td>
        <td>{{ scadenza.Casa }}</td>
        <td>{{ formatEuro(scadenza.Importo) }}</td>
        <td>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="scadenza.Pagato" class="sr-only peer" @click="">
            <div
              class="relative w-11 h-6 bg-red-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600">
            </div>
          </label>
        </td>
      </tr>
    </table>
    <RTable :items="Items" :pinia="Pinia.Scadenze()" />
  </main>
</template>

<script setup lang="ts">
import { Pinia } from '@/stores'
import { ref, computed, onMounted } from 'vue'
import { Data_aaaammgg_ggmmaaaa, formatEuro } from '@/assets/helpers/MyMixin';
import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'

const FirebaseScadenze = Pinia.Scadenze()

const Scadenze = ref()

const Elenco = Pinia.Scadenze().getElenco('').sort((a, b) => {
            return new Date(a.Data).getTime() - new Date(b.Data).getTime()
          })
const ScadenzePassate = computed(() => {
  return (data: string) => {
    if ((new Date(data)).getTime() < (new Date()).getTime()) {
      return 'BTNSalva'
    }
  }
})

const Items = computed(() => {
  return Elenco.map((item) => {
    return {
      Id: {
        Type: 'string',
        Value: item.Id
      },
      Data: {
        Type: 'date',
        Value: item.Data,
        ControllaDataPassata: true
      },
      Tipologia: {
        Type: 'string',
        Value: item.Tipologia
      },
      Casa: {
        Type: 'String',
        Value: item.Casa
      },
      Importo: {
        Type: 'number',
        Value: item.Importo
      },
      Pagato: {
        Type: 'boolean',
        Value: item.Pagato
      }
    }
  })
})

onMounted(() => {
  setTimeout(() => {
    Scadenze.value = FirebaseScadenze.getElenco('').sort((a, b) => {
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