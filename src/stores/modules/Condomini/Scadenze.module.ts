import { ref, get, update, remove, child, DataSnapshot } from 'firebase/database'

import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaCaseRef = ref(db, 'casecondominio')
const TabellaTipologieRef = ref(db, 'tipologiecondominio')
const TabellaScadenzeRef = ref(db, 'scadenzecondominio')

type TypeElemento = {
  Id?: string
  Data: string
  Casa: string
  Tipologia: string
  Importo: string
  Pagato?: boolean
}

type TypeCollezione = Array<TypeElemento>

export const Scadenze = defineStore('Scadenze', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getElenco: (state) => {
      return (opz: string) => {
        if (opz === 'futuri') {
          const Oggi = new Date()
          const Ieri = new Date(Oggi.setDate(Oggi.getDate() - 1)).getTime()
          return state.Collezione.filter((item) => {
            if (new Date(item.Data).getTime() > Ieri) {
              return item
            }
          }).sort((a, b) => {
            return new Date(a.Data).getTime() - new Date(b.Data).getTime()
          })
        } else {
          return state.Collezione.sort((a, b) => {
            return new Date(a.Data).getTime() - new Date(b.Data).getTime()
          })
        }
      }
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
          Case.push({ Id: doc.key, ...doc.val() })
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
            Id: doc.key ? doc.key : '0',
            Data: doc.val()['Data'],
            Casa: Casa.Nome,
            Tipologia: Tipologia.Nome,
            Importo: doc.val()['Importo'],
            Pagato: doc.val().Pagato ? doc.val()['Pagato'] : false
          }
          this.Collezione.push(Payload)
        })
      } catch (e) {
        console.log(e)
      }
    },
    Aggiungi(Scadenza: any) {
      delete Scadenza.Id
    },
    async Aggiorna(Scadenza: any) {
      const Id = Scadenza.Id
      delete Scadenza.Id
      try {
        await update(child(TabellaScadenzeRef, Id), Scadenza).then(() => {
          get(child(TabellaScadenzeRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            console.log(index)
            /*this.Collezione[index].Nome = res.val().Nome
            this.Collezione[index].IdSuperCategoria = res.val().IdSuperCategoria
            this.Collezione[index].TestoDaAssociareCategoria = res.val().TestoDaAssociareCategoria
              ? res.val().TestoDaAssociareCategoria
              : ''
            this.Collezione[index].Visibile = res.val().Visibile*/
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Elimina(Id: string) {
      const index = this.Collezione.findIndex((item) => item.Id === Id)
      await remove(child(TabellaScadenzeRef, Id)).then(() => {
        this.Collezione.splice(index, 1)
      })
    }
  }
})
