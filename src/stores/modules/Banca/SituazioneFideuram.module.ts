import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
import { Data_aaaammgg_ggmmaaaa } from '@/assets/helpers/MyMixin'
const TabellaRef = ref(db, 'situazionefideuram')

type TypeElemento = {
  Id?: string
  Data: string
  Movimento: number
  ImportoTotale: number
  Conto: number
}

type TypeCollezione = Array<TypeElemento>

export const SituazioneFideuram = defineStore('SituazioneFideuram', {
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
        Data: '',
        Movimento: '',
        ImportoTotale: 0,
        Conto: 0
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
              Data: res.val().Data,
              Movimento: res.val().Movimento,
              ImportoTotale: res.val().ImportoTotale,
              Conto: res.val().Conto
            }
            this.Collezione.push(Payload)
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(NuovoRimborso: any) {
      console.log(NuovoRimborso)
      const Id = NuovoRimborso.Id
      delete NuovoRimborso.Id
      try {
        await update(child(TabellaRef, Id), NuovoRimborso).then(() => {
          get(child(TabellaRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            this.Collezione[index].Data = res.val().Data
            this.Collezione[index].Movimento = res.val().Movimento
            this.Collezione[index].ImportoTotale = res.val().ImportoTotale
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
