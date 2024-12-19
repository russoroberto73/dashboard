import { ref } from 'vue'
import { defineStore } from 'pinia'

export const Use = defineStore('counter', () => {
  let ObjStore = ref()
  let IdCategoriaNuovoMovimento: any = ref([])
  let ItemsStore = ref()
  function Assegna(obj: any) {
    ObjStore.value=obj
  }

  return { ObjStore, ItemsStore, IdCategoriaNuovoMovimento, Assegna }
})
