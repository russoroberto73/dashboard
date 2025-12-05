import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { Data_aaaammgg_ggmmaaaa, DataOggiInglese } from '@/assets/helpers/MyMixin'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'declinomamma')

type TypeElemento = {
  Id?: string
  Data: string
  OrariMedicine: string
  Pressione: string
  Resoconto: string
}

type TypeCollezione = Array<TypeElemento>

export const DeclinoMamma = defineStore('DeclinoMamma', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'Assistenti'
    },
    getElenco: (state) => {
      return state.Collezione
    },
    getPrimoIdAssistente: (state) => {
      return state.Collezione.find((item, index) => index === 1)?.Id
    },
    getProssimoElemento: () => {
      return {
        Id: '0',
        Data: '',
        OrariMedicine: '',
        Pressione: '',
        Resoconto: ''
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
    async Aggiungi(Obj: any) {
      //delete Assistente.value.Licenziamento
      delete Obj.Id
      Obj.Data = Data_aaaammgg_ggmmaaaa(Obj.Data)
      try {
        await push(TabellaRef, Obj).then((response: { key: any }) => {
          const snapshot = get(child(TabellaRef, response.key))
          const Id = response.key
          snapshot.then((res: any) => {
            console.log(res.val(), Id)
            this.Collezione.push({ Id, ...res.val() })
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(Obj: any) {
      console.log('Aggiorna')
      const Id = Obj.Id
      delete Obj.Id
      console.log(Obj)      
      Obj.Data = Data_aaaammgg_ggmmaaaa(Obj.Data)
      try {
        await update(child(TabellaRef, Id), Obj).then(() => {
          get(child(TabellaRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            this.Collezione[index].Data = res.val().Data
            this.Collezione[index].OrariMedicine = res.val().OrariMedicine
            this.Collezione[index].Pressione = res.val().Pressione 
            this.Collezione[index].Resoconto = res.val().Resoconto
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
