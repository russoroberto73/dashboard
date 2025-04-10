import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { Data_aaaammgg_ggmmaaaa } from '@/assets/helpers/MyMixin'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'qtydatebotulino')

type TypeElemento = {
  Id?: string
  Data: string
  IdMuscolo: string
  Qty: number,
  Parte?: string
}

type TypeCollezione = Array<TypeElemento>

export const BotulinoQtyDate = defineStore('BotulinoQtyDate', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'CalendarioFilosofico'
    },
    getElenco: (state) => {
      return state.Collezione
    },
    getProssimoElemento: (state) => {
      return {
        Id: '0',
        Data: '',
        IdMuscolo: '',
        Qty: 0,
        Parte: ''
      }
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
          const obj: TypeElemento = doc.val()
          const Data = obj.Data
          const IdMuscolo = obj.IdMuscolo
          const Qty = obj.Qty
          const Parte = obj.Parte
          const Payload: TypeElemento = {
            Id,
            Data,
            IdMuscolo,
            Qty,
            Parte
          }
          this.Collezione.push(Payload)
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Frase: any) {
      delete Frase.Id
      //console.log(Frase)
      try {
        await push(TabellaRef, Frase)
          .then((response: { key: any }) => {
            const snapshot = get(child(TabellaRef, response.key))
            const Id = response.key
            snapshot.then((res: any) => {
              const Payload = {
                Id,
                Data: res.val().Data,
                IdMuscolo: res.val().IdMuscolo,
                Qty: res.val().Qty,
                Parte: res.val().Parte
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
    },
    async Aggiorna(Frase: any) {
      const Id = Frase.Id
      delete Frase.Id
      Frase.Data = Data_aaaammgg_ggmmaaaa(Frase.Data)
      try {
        await update(child(TabellaRef, Id), Frase)
          .then(() => {
            get(child(TabellaRef, Id)).then((res) => {
              const index = this.Collezione.findIndex((item) => item.Id === res.key)
              this.Collezione[index].Data = res.val().Data
              this.Collezione[index].IdMuscolo = res.val().IdMuscolo
              this.Collezione[index].Qty = res.val().Qty
              this.Collezione[index].Parte = res.val().Parte
            })            
          })
          .catch((e) => {
            console.log(e)
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
