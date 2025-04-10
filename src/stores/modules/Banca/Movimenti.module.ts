import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import {
  Data_aaaammgg_ggmmaaaa,
  Data_ggmmaaaa_aaaammgg,
  DataOggiInglese
} from '@/assets/helpers/MyMixin'
import { defineStore } from 'pinia'
import { Categorie } from './Categorie.module'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'movimenti')

type TypeElemento = {
  Id?: string
  Data: string
  Accrediti: string
  Addebiti: string
  Descrizione: string
  DescrizioneEstesa: string
  IdCategoria: string
}

type TypeCollezione = Array<TypeElemento>

export const Movimenti = defineStore('Movimenti', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getElenco: (state) => {
      return state.Collezione
      /*const Data =  new Date()
      return state.Collezione.filter((item) => {
        if (parseInt(item.Data.substring(6,10)) === Data.getFullYear()) {
          return item
        }
      })*/
    },
    getProssimoElemento: () => {
      return {
        Id: '0',
        Data: DataOggiInglese(),
        Accrediti: '0',
        Addebiti: '0',
        Descrizione: '',
        DescrizioneEstesa: '',
        IdCategoria: Categorie().getElenco[0].Id
      }
    },
    getVerifica: (state) => {
      return (IdCategoria: string) => {
        const tmp = state.Collezione.find((item) => item.IdCategoria == IdCategoria)
        return tmp
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

          obj.Accrediti = obj.Accrediti ? obj.Accrediti.toString() : '0.00'
          obj.Addebiti = obj.Addebiti ? obj.Addebiti.toString() : '0.00'

          //if (i === 1) {
          if (!(obj.Accrediti === '0.00')) {
            if (!obj.Accrediti.split('.')[1]) {
              obj.Accrediti = obj.Accrediti + '.00'
            } else if (obj.Accrediti.split('.')[1].length === 1) {
              obj.Accrediti = obj.Accrediti + '0'
            }
          }
          if (!(obj.Addebiti === '0.00')) {
            if (!obj.Addebiti.split('.')[1]) {
              obj.Addebiti = obj.Addebiti + '.00'
            } else if (obj.Addebiti.split('.')[1].length === 1) {
              obj.Addebiti = obj.Addebiti + '0'
            }
          }
          const Payload = {
            Id,
            Accrediti: obj.Accrediti,
            Addebiti: obj.Addebiti ? obj.Addebiti : '0',
            Data: obj.Data,
            Descrizione: obj.Descrizione,
            DescrizioneEstesa: obj.DescrizioneEstesa,
            IdCategoria: obj.IdCategoria
          }
          this.Collezione.push(Payload)
          this.Collezione.sort((a, b) => {
            return (
              new Date(Data_ggmmaaaa_aaaammgg(a.Data)).getTime() -
              new Date(Data_ggmmaaaa_aaaammgg(b.Data)).getTime()
            )
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Movimento: any) {
      console.log(Movimento)
      delete Movimento.Id
      Movimento.Data = Data_aaaammgg_ggmmaaaa(Movimento.Data)
      console.log(Movimento)
      try {
        await push(TabellaRef, Movimento).then((response: { key: any }) => {
          const snapshot = get(child(TabellaRef, response.key))
          const Id = response.key
          snapshot.then((res: any) => {
            //console.log(res.val())
            const Payload = {
              Id,
              Data: res.val().Data,
              Accrediti: res.val().Accrediti,
              Addebiti: res.val().Addebiti,
              Descrizione: res.val().Descrizione,
              DescrizioneEstesa: res.val().DescrizioneEstesa,
              IdCategoria: res.val().IdCategoria
            }
            this.Collezione.push(Payload)
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(Movimento: any) {
      const Id = Movimento.Id
      delete Movimento.Id
      Movimento.Data = Data_aaaammgg_ggmmaaaa(Movimento.Data)
      //console.log(Movimento.value, Id)
      try {
        await update(child(TabellaRef, Id), Movimento).then(() => {
          get(child(TabellaRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            this.Collezione[index].Data = res.val().Data
            this.Collezione[index].Accrediti = res.val().Accrediti ? res.val().Accrediti : '0'
            this.Collezione[index].Addebiti = res.val().Addebiti ? res.val().Addebiti : '0'
            this.Collezione[index].Descrizione = res.val().Descrizione
            this.Collezione[index].DescrizioneEstesa = res.val().DescrizioneEstesa
            this.Collezione[index].IdCategoria = res.val().IdCategoria
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
