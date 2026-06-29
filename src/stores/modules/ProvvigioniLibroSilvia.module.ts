import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { Data_aaaammgg_ggmmaaaa } from '@/assets/helpers/MyMixin'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'provvigionilibrosilvia')

type TypeElemento = {
  Id?: string
  Data: string
  Importo: number
}

type TypeCollezione = Array<TypeElemento>

export const ProvvigioniLibroSilvia = defineStore('ProvvigioniLibroSilvia', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'ProvvigioniLibroSilvia'
    },
    getElenco: (state) => {
      return state.Collezione
    },
    getProssimoElemento: (state) => {
      return {
        Id: '0',
        Data: '',
        Importo: 0
      }
    }
  },
  actions: {
    async Elenco() {
console.log('p');
      
      const snapshot = get(TabellaRef)
      try {
        const res: DataSnapshot = await snapshot
        let index = 0
        res.forEach((doc: DataSnapshot) => {
          index++
          const Id: string = doc.key ? doc.key : '0'
          const obj: TypeElemento = doc.val()
          const Data = obj.Data
          const Importo = obj.Importo
          const Payload: TypeElemento = {
            Id,
            Data,
            Importo
          }
          this.Collezione.push(Payload)
        })
        console.log(this.Collezione);
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
                Importo: res.val().Importo
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
              this.Collezione[index].Importo = res.val().Importo
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
