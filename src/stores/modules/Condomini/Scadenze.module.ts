import { ref, get, DataSnapshot } from 'firebase/database'

import { defineStore } from 'pinia'
import db from '../../Conn'
const TabellaCaseRef = ref(db, 'casecondominio')
const TabellaTipologieRef = ref(db, 'tipologiecondominio')
const TabellaScadenzeRef = ref(db, 'scadenzecondominio')

type TypeElemento = {
  Id?: string
  Data: string
  Casa: string
  Tipologia: string
  Importo: string
}

type TypeCollezione = Array<TypeElemento>

export const Scadenze = defineStore('Scadenze', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getElenco: (state) => {
      return state.Collezione
    }
  },
  actions: {
    async Elenco() {
      const snapshotCase = get(TabellaCaseRef)
      const snapshotTipologie = get(TabellaTipologieRef)
      const snapshotScadenze = get(TabellaScadenzeRef)
      let Case = [] as Array<object>
      let Tipologie = [] as Array<object>
      try {
        const resCase: DataSnapshot = await snapshotCase
        resCase.forEach((doc: DataSnapshot) => {
          Case.push({Id: doc.key, ...doc.val()})
        })
      } catch (e) {
        console.log(e)
      }
      try {
        const resTipologie: DataSnapshot = await snapshotTipologie
        resTipologie.forEach((doc: DataSnapshot) => {
          Tipologie.push({ Id: doc.key, ...doc.val() })
        })
      } catch (e) {
        console.log(e)
      }
      try {
        const resScadenze: DataSnapshot = await snapshotScadenze
        resScadenze.forEach((doc: DataSnapshot) => {
           const Casa: any = Case.find((item: any) => item.Id === doc.val()['IdCasa'])            
            const Tipologia: any = Tipologie.find((item: any) => item.Id === doc.val()['IdTipologia'])
            const Payload = {
                Id: doc.key ? doc.key : "0",
                Data: doc.val()['Data'],
                Casa: Casa.Nome,
                Tipologia: Tipologia.Nome,
                Importo: doc.val()['Importo']                
            }
            this.Collezione.push(Payload)
          })
      } catch (e) {
        console.log(e)
      }
    }
  }
})
