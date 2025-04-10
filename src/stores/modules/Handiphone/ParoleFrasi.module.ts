import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'handiphonefrasi')

type TypeElemento = {
  Id?: string
  Codice: string
  Frase: string
  Posizione: string
}

type TypeCollezione = Array<TypeElemento>

export const HandiphoneParoleFrasi = defineStore('HandiphoneParoleFrasi', {
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
        Posizione: '',
        Codice: '',
        Frase: ''
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
    },
    async Aggiungi(codicefrase: any) {
      delete codicefrase.Id 
      try {
        await push(TabellaRef, codicefrase)
        .then((response: {key: any}) => {
          const snapshot = get(child(TabellaRef, response.key))
          const Id = response.key
          snapshot.then((res: any) => {
            console.log(res)            
          })
        })
      } catch (e) {
          console.log(e);          
      }  
    },
    async Aggiorna(codicefrase: any) {
      const Id = codicefrase.Id 
      delete codicefrase.Id
      console.log(Id, codicefrase)            
      try {
        await update(child(TabellaRef, Id), codicefrase)
        .then(() => {
          console.log('ok')          
        })
      } catch (e) {
        console.log(e)        
      }
    }
  }
})
