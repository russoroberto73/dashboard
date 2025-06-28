import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'temanatalepianeticasesegni')

type TypeElemento = {
  Id?: string
  IdPianeta: string
  IdSegnoPianeta: string,
  Retrogrado: boolean,
  Casa: string,
  IdSegnoCasa: string,
  Significato: string,
  ParoleChiavi: string
}

type TypeCollezione = Array<TypeElemento>

export const TemaNatalePianetiCaseSegni = defineStore('TemaNatalePianetiCaseSegni', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'TemaNatalePolaritàSegni'
    },
    getElenco: (state) => {
      return state.Collezione
    },
    getProssimoElemento: (state) => {
      return {
        Id: '0',
        IdPianeta: '0',
        IdSegnoPianeta: '0',
        Retrogrado: false,
        Casa: '',
        IdSegnoCasa: '0',
        Significato: '',
        ParoleChiavi: ''
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
          const IdPianeta = obj.IdPianeta
          const IdSegnoPianeta = obj.IdSegnoPianeta
          const Retrogrado = obj.Retrogrado
          const Casa = obj.Casa
          const IdSegnoCasa = obj.IdSegnoCasa
          const Significato = obj.Significato
          const ParoleChiavi = obj.ParoleChiavi
          const Payload: TypeElemento = {
            Id,
            IdPianeta,
            IdSegnoPianeta,
            Retrogrado,
            Casa,
            IdSegnoCasa,
            Significato,
            ParoleChiavi
          }
          this.Collezione.push(Payload)
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Casa: any) {
      delete Casa.Id
      //console.log(Frase)
      try {
        await push(TabellaRef, Casa)
          .then((response: { key: any }) => {
            const snapshot = get(child(TabellaRef, response.key))
            const Id = response.key
            snapshot.then((res: any) => {
              const Payload = {
                Id,
                IdPianeta: res.val().IdPianeta,
                IdSegnoPianeta: res.val().IdSegnoPianeta,
                Retrogrado: res.val().Retrogrado,
                Casa: res.val().Casa,
                IdSegnoCasa: res.val().IdSegnoCasa,
                Significato: res.val().Significato,
                ParoleChiavi: res.val().ParoleChiavi
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
    async Aggiorna(Casa: any) {
      console.log('p')      
      const Id = Casa.Id
      delete Casa.Id
      try {
        await update(child(TabellaRef, Id), Casa)
          .then(() => {
            get(child(TabellaRef, Id)).then((res) => {
              const index = this.Collezione.findIndex((item) => item.Id === res.key)
              this.Collezione[index].IdPianeta = res.val().IdPianeta
              this.Collezione[index].IdSegnoPianeta = res.val().IdSegnoPianeta
              this.Collezione[index].Retrogrado = res.val().Retrogrado
              this.Collezione[index].Casa = res.val().Casa
              this.Collezione[index].IdSegnoCasa = res.val().IdSegnoCasa
              this.Collezione[index].Significato = res.val().Significato
              this.Collezione[index].ParoleChiavi = res.val().ParoleChiavi
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
