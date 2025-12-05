import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'rimborsi730')

type TypeElemento = {
  Id?: string
  Anno: string
  Importo: string
}

type TypeCollezione = Array<TypeElemento>

export const Rimborsi730 = defineStore('Rimborsi730', {
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
    },
    async Aggiungi(NuovoRimborso: any) {
      delete NuovoRimborso.Id
      //console.log(NuovoRimborso.value)
      try {
        await push(TabellaRef, NuovoRimborso).then((response: { key: any }) => {
          const snapshot = get(child(TabellaRef, response.key))
          const Id = response.key
          snapshot.then((res: any) => {
            const Payload = {
              Id,
              Anno: res.val().Anno,
              Importo: res.val().Importo
            }
            this.Collezione.push(Payload)
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(NuovoRimborso: any) {
      const Id = NuovoRimborso.value.Id
      delete NuovoRimborso.value.Id
      try {
        await update(child(TabellaRef, Id), NuovoRimborso.value).then(() => {
          get(child(TabellaRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            this.Collezione[index].Anno = res.val().Anno
            this.Collezione[index].Importo = res.val().Importo
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
