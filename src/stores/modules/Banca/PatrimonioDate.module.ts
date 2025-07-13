import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '../../Conn'
const TabellaRef = ref(db, 'patrimoniodate')

type TypeElemento = {
  Id: string
  Nome: string
  Data: string
  Titoli: object
}

type TypeCollezione = Array<TypeElemento>

export const PatrimonioDate = defineStore('PatrimonioDate', {
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
        Data: ''
      }
    }
  },
  actions: {
    async Elenco() {
      const snapshot = get(TabellaRef)
      try {
        const res: DataSnapshot = await snapshot
        res.forEach((doc: DataSnapshot) => {
          const Id: string = doc.key ? doc.key : '0'
          const obj: TypeElemento = doc.val()
          const Payload: TypeElemento = { Id, ...obj }
          this.Collezione.push(Payload)
        })
        //console.log(this.Collezione)        
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Record: any) {
      delete Record.Id
      try {
        await push(TabellaRef, Record).then((response: { key: any }) => {
          const snapshot = get(child(TabellaRef, response.key))
          const Id = response.key
          snapshot.then((res: any) => {
            const Payload = {
              Id,
              Nome: res.val().Nome,
              Data: res.val().Data,
              Titoli: res.val().Titoli
            }
            this.Collezione.push(Payload)
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(Record: any) {
      console.log(Record)
      const Id = Record.Id
      delete Record.Id
      try {
        await update(child(TabellaRef, Id), Record).then(() => {
          get(child(TabellaRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            this.Collezione[index].Nome = res.val().Nome
            this.Collezione[index].Data = res.val().Data
            this.Collezione[index].Titoli = res.val().Titoli
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Elimina(Id: string) {
      const index = this.Collezione.findIndex((item) => item.Id === Id)
      await remove(child(TabellaRef, Id)).then(() => {
        this.Collezione.splice(index, 1)
      })
    }
  }
})
