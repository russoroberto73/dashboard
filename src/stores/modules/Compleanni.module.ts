import { ref, get, DataSnapshot } from 'firebase/database'

import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'compleanni')

type TypeElemento = {
  Id?: string
  Nome: string
  Cognome: string
  Giorno: string
  Mese: string
  Anno: string
  Data: string
  DataInglese: number
  Test: boolean
  Passato: boolean
  Ieri: number
  Domani: number
}

type TypeCollezione = Array<TypeElemento>

export const Compleanni = defineStore('Compleanni', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getElenco: (state) => {
      return (opz: string) => {
        if (opz === "futuri") {
        const Oggi = new Date()
        const Ieri = new Date(Oggi.setDate(Oggi.getDate() - 1)).getTime()
        return state.Collezione.filter((item) => {
          if (item.DataInglese > Ieri) {
            return item
          }
        })
        } else {
          return state.Collezione
        }
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
          const Cognome = obj.Cognome
          let Giorno: number | string = parseInt(obj.Giorno)
          if (Giorno < 10) {
            Giorno = '0' + Giorno
          }
          Giorno = Giorno.toString()
          let Mese: number | string = parseInt(obj.Mese)
          if (Mese < 10) {
            Mese = '0' + Mese
          }
          Mese = Mese.toString()
          const Anno = obj.Anno
          const Data = Giorno + '/' + Mese + '/' + Anno
          const DataInglese = (new Date()).getFullYear() + '-' + Mese + '-' + Giorno
          const Passato = !(new Date(DataInglese).getTime() <= new Date().getTime())
          const Oggi = new Date()
          const Ieri = new Date(Oggi.setDate(Oggi.getDate() - 1)).getTime()
          const Domani = new Date(Oggi.setDate(Oggi.getDate() + 1)).getTime()
          //console.log(Ieri, Domani)

          const Test =
            new Date(DataInglese).getTime() > Ieri && new Date(DataInglese).getTime() < Domani
          this.Collezione.push({
            Id,
            Nome,
            Cognome,
            Giorno,
            Mese,
            Anno,
            Data,
            DataInglese: new Date(DataInglese).getTime(),
            Test,
            Passato,
            Ieri: Ieri,
            Domani: Domani
          })
        })

        this.Collezione.sort((a, b) => {
          return new Date(a.DataInglese).getTime() - new Date(b.DataInglese).getTime()
        })
        //console.log(this.Collezione)
      } catch (e) {
        console.log(e)
      }
    },
    
  }
})
