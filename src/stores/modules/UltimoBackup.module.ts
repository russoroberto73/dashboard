import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { Data_NewDate_ggmmaaaa } from '@/assets/helpers/MyMixin'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'ultimobackup')

type TypeElemento = {
  Id?: string
  Data: string
}

type TypeCollezione = Array<TypeElemento>

export const UltimoBackup = defineStore('UltimoBckup', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getElenco: (state) => {
      return state.Collezione
    }
  },
  actions: {
    async Elenco() {
      const snapshot = get(TabellaRef)
      try {
        const res: DataSnapshot = await snapshot
        let index = 0
        res.forEach((doc: DataSnapshot) => {
          index++
          const Id: string = doc.key ? doc.key : '0'
          const Data = doc.val().Data
          const Payload: TypeElemento = {
            Id,
            Data,
          }
          this.Collezione.push(Payload)
        })
      } catch (e) {
        console.log(e)
      }
    }, /*
    async Aggiungi(Data: any) {
      try {
        await push(TabellaRef, Data)
          .then((response: { key: any }) => {
            const snapshot = get(child(TabellaRef, response.key))
            const Id = response.key
            snapshot.then((res: any) => {
              const Payload = {
                Id,
                Data: res.val().Data
              }
              this.Collezione.push(Payload)
            })
          })
          .catch((e) => {
            console.log(e)
          })
      } catch (e) {
        console.log(e)
      }
    },*/
    async Aggiorna(Data: any) {
        console.log(Data)        
      const Id = '-OGGbUuNWIn3gvFlfXer'
      try {
        await update(child(TabellaRef, Id), {Data: Data_NewDate_ggmmaaaa(Data)})
          .then(() => {
            get(child(TabellaRef, Id)).then((res) => {
              const index = this.Collezione.findIndex((item) => item.Id === res.key)
              this.Collezione[index].Data = res.val().Data
            })
          })
          .catch((e) => {
            console.log(e)
          })
      } catch (e) {
        console.log(e)
      }
    } /*,
    async Elimina(Id: string) {
      const index = this.Collezione.findIndex((item) => item.Id === Id)
      await remove(child(TabellaRef, Id)).then(() => {
        this.Collezione.splice(index, 1)
      })
    }*/
  }
})
