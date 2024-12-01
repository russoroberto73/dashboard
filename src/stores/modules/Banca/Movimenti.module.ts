import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { Data_aaaammgg_ggmmaaaa, DataOggiInglese } from '@/assets/helpers/MyMixin'
import { defineStore } from 'pinia'
import { Categorie } from './Categorie.module'
import db from '../../Conn'
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
          const Payload: TypeElemento = { Id, ...obj }
          this.Collezione.push(Payload)
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Movimento: any) {
      delete Movimento.value.Id
      Movimento.value.Data = Data_aaaammgg_ggmmaaaa(Movimento.value.Data)
      //console.log(Movimento)
      try {
        await push(TabellaRef, Movimento.value).then((response: { key: any }) => {
          const snapshot = get(child(TabellaRef, response.key))
          const Id = response.key
          snapshot.then((res: any) => {
            console.log(res.val())            
            /*const Payload = {
              Id,
              Nome: res.val().Nome,
              IdSuperCategoria: res.val().IdSuperCategoria,
              TestoDaAssociareCategoria: res.val().TestoDaAssociareCategoria,
              Visibile: res.val().Visibile
            }
            this.Collezione.push(Payload)*/
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(Movimento: any) {
      const Id = Movimento.value.Id
      delete Movimento.value.Id
      Movimento.value.Data = Data_aaaammgg_ggmmaaaa(Movimento.value.Data)
      console.log(Movimento.value, Id)
      try {
        await update(child(TabellaRef, Id), Movimento.value).then(() => {
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
      console.log('p')
    }
  }
})
