import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { Data_aaaammgg_ggmmaaaa } from '@/assets/helpers/MyMixin'
import { defineStore } from 'pinia'
import db from '../Conn'
const TabellaRef = ref(db, 'calendariofilosofico')

type TypeElemento = {
  Id?: string
  Data: string
  Anno: string
  Mese: string
  Giorno: string
  Frase: string
  Firma: string
}

type TypeCollezione = Array<TypeElemento>

export const CalendarioFilosofico = defineStore('CalendarioFilosofico', {
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
      const UltimaFrase = state.Collezione[state.Collezione.length - 1]
      if (UltimaFrase) {
        const UltimaData = new Date(
          UltimaFrase.Data.substring(6, 10) +
            '-' +
            UltimaFrase.Data.substring(3, 5) +
            '-' +
            UltimaFrase.Data.substring(0, 2)
        )
        const ProssimaData = new Date(UltimaData.setDate(UltimaData.getDate() + 1))
        const aaaa = ProssimaData.getFullYear()
        let mm: string | number = ProssimaData.getMonth() + 1
        let gg: string | number = ProssimaData.getDate()
        if (mm < 10) {
          mm = "0" + mm
        }
        if (gg < 10) {
          gg = "0" + gg
        }
        return {
          Id: '0',
          Data: aaaa + '-' + mm + '-' + gg,
          Frase: '',
          Firma: ''
        }
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
          const Giorno = obj.Data.substring(0, 2)
          const Mese = obj.Data.substring(3, 5)
          const Anno = obj.Data.substring(6, 10)
          const Data = Giorno + '/' + Mese + '/' + Anno
          const Payload: TypeElemento = {
            Id,
            Data,
            Giorno,
            Mese,
            Anno,
            Frase: obj.Frase,
            Firma: obj.Firma
          }
          // 1036 770
          this.Collezione.push(Payload)
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Frase: any) {
      delete Frase.value.Id
      Frase.value.Data = Data_aaaammgg_ggmmaaaa(Frase.value.Data)
      //console.log(Frase)            
      try {
        await push(TabellaRef, Frase.value)
          .then((response: { key: any }) => {
            const snapshot = get(child(TabellaRef, response.key))
            const Id = response.key
            snapshot.then((res: any) => {
              const Payload = {
                Id,
                Data: res.val().Data,
                Anno: res.val().Data.substring(6, 10),
                Mese: res.val().Data.substring(3, 5),
                Giorno: res.val().Data.substring(0, 2),
                Frase: res.val().Frase,
                Firma: res.val().Firma
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
      const Id = Frase.value.Id
      delete Frase.value.Id
      Frase.value.Data = Data_aaaammgg_ggmmaaaa(Frase.value.Data)
      try {
        await update(child(TabellaRef, Id), Frase.value)
          .then(() => {
            get(child(TabellaRef, Id)).then((res) => {
              const index = this.Collezione.findIndex((item) => item.Id === res.key)
              this.Collezione[index].Data = res.val().Data
              this.Collezione[index].Frase = res.val().Frase
              this.Collezione[index].Firma = res.val().Firma
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
