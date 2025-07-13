import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'temanatalepianeti')

type TypeElemento = {
  Id?: string
  Nome: string
  IdTipologia?: string
  Tipologia?: string
  ParoleChiavi: string
  ParoleChiaviRetrogrado: string
  Significato: string
  SignificatoRetrogrado: string
  Elemento: object
  Segno: object
}

type TypeCollezione = Array<TypeElemento>

export const TemaNatalePianeti = defineStore('TemaNatalePianeti', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'TemaNatalePianeti'
    },
    getElenco: (state) => {
      //console.log('getElenco', state.Collezione)      
      return state.Collezione
    },
    getProssimoElemento: (state) => {
      return {
        Id: '0',
        Nome: '',
        IdTipologia: '',
        ParoleChiavi: '',
        ParoleChiaviRetrogrado: '',
        Significato: '',
        SignificatoRetrogrado: ''
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
          const Nome = obj.Nome
          const Tipologia = obj.IdTipologia
          const ParoleChiavi = obj.ParoleChiavi
          const ParoleChiaviRetrogrado = obj.ParoleChiaviRetrogrado
          const Significato = obj.Significato
          const SignificatoRetrogrado = obj.SignificatoRetrogrado
          const Elemento = obj.Elemento
          const Segno = obj.Segno
          const Payload: TypeElemento = {
            Id,
            Nome,
            Tipologia,
            ParoleChiavi,
            ParoleChiaviRetrogrado,
            Significato,
            SignificatoRetrogrado,
            Elemento,
            Segno
          }
          this.Collezione.push(Payload)
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Pianeta: any) {
      //console.log(Pianeta)
      try {
        await push(TabellaRef, Pianeta)
          .then((response: { key: any }) => {
            console.log(response)
          })
          .catch((e) => {
            console.log(e)
          })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(Pianeta: any) {
      const Id = Pianeta.IdPianeta

      delete Pianeta.IdPianeta
      //console.log(Pianeta, Id)
      try {
        await update(child(TabellaRef, Id), Pianeta)
          .then(() => {
            get(child(TabellaRef, Id)).then((res) => {})
          })
          .catch((e) => {
            console.log(e)
          })
      } catch (e) {
        console.log(e, Pianeta)
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
