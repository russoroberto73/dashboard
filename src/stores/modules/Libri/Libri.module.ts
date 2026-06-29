import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { Data_aaaammgg_ggmmaaaa } from '@/assets/helpers/MyMixin'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'libri')

type TypeElemento = {
  Id?: string
  Aquirente: string
  Data: string
  NumLibri: number
  Incasso: number
  MetodoPagamento: string
}

type TypeCollezione = Array<TypeElemento>

export const Libri = defineStore('Libri', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'Libri'
    },
    getElenco: (state) => {
      return state.Collezione
    },
    getProssimoElemento: (state) => {
      return {
        Id: '0',
        Aquirente: '',
        Data: '',
        NumLibri: 0,
        Incasso: 0,
        MetodoPagamento: ''
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
          const Aquirente = obj.Aquirente
          const Data = obj.Data
          const NumLibri = obj.NumLibri
          const Incasso = obj.Incasso
          const MetodoPagamento = obj.MetodoPagamento
          const Payload: TypeElemento = {
            Id,
            Aquirente,
            Data,
            NumLibri,
            Incasso,
            MetodoPagamento
          }
          this.Collezione.push(Payload)
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Frase: any) {
      delete Frase.Id
      Frase.Data = Data_aaaammgg_ggmmaaaa(Frase.Data)
      //console.log(Frase)
      try {
        await push(TabellaRef, Frase)
          .then((response: { key: any }) => {
            const snapshot = get(child(TabellaRef, response.key))
            const Id = response.key
            snapshot.then((res: any) => {
              const Payload = {
                Id,
                Aquirente: res.val().Aquirente,
                Data: res.val().Data,
                NumLibri: res.val().NumLibri,
                Incasso: res.val().Incasso,
                MetodoPagamento: res.val().MetodoPagamento
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
              this.Collezione[index].Aquirente = res.val().Aquirente
              this.Collezione[index].Data = res.val().Data
              this.Collezione[index].NumLibri = res.val().NumLibri
              this.Collezione[index].Incasso = res.val().Incasso
              this.Collezione[index].MetodoPagamento = res.val().MetodoPagamento
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
