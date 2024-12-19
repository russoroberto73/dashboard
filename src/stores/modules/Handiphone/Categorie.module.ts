import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { defineStore } from 'pinia'
import db from '../../Conn'
const TabellaRef = ref(db, 'handiphonecategorie')

type TypeElemento = {
  Id?: string
  Nome: string  
}

type TypeCollezione = Array<TypeElemento>

export const HandiphoneCategorie = defineStore('HandiphoneCategorie', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getElenco: (state) => {
      return state.Collezione
    },
    getProssimoElemento: () => {
      return {
        Id: '0',
        Anno: 2024,
        Importo: 0
      }
    }
  },
  actions: {
    async Elenco() {        
      const snapshot = get(TabellaRef)
      try {
        const res: DataSnapshot = await snapshot
        let i = 0
        res.forEach((doc: DataSnapshot) => {
          i++
          const Id: string = doc.key ? doc.key : '0'
          const obj: TypeElemento = doc.val()
          const Payload: TypeElemento = { Id, ...obj }
          this.Collezione.push(Payload)
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
})
