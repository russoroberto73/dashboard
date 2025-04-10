/**
 * let app = initializeApp(firebaseConfigsv)
 
 if (DatabaseFirebase === "produzione") {
   app = initializeApp(firebaseConfig)
 }
 
 */

import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'gruppipassword')

type TypeElemento = {
  Id?: string
  Nome: string,
}

type TypeCollezione = Array<TypeElemento>

export const GruppiPassword = defineStore('GruppiPassword', {
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
        Nome: ''
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
        this.Collezione.sort((a: {Nome: string}, b: {Nome: string}) => {
         // console.log(a,b)        
          if (a.Nome < b.Nome) {
            return -1
          } else if (a.Nome > b.Nome) {
            return 1
          }
          return 0
        })
        //console.log(this.Collezione)        
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(GruppoPassword: any) {
      delete GruppoPassword.Id
      try {
        await push(TabellaRef, GruppoPassword).then((response: { key: any }) => {
          const snapshot = get(child(TabellaRef, response.key))
          const Id = response.key
          snapshot.then((res: any) => {
            const Payload = {
              Id,
              Nome: res.val().Nome
            }
            this.Collezione.push(Payload)
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(GruppoPassword: any) {
      const Id = GruppoPassword.Id
      delete GruppoPassword.Id
      try {
        await update(child(TabellaRef, Id), GruppoPassword).then(() => {
          get(child(TabellaRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            this.Collezione[index].Nome = res.val().Nome
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
