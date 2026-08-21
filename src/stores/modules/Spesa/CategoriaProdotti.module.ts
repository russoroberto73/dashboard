import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'spesacategorieprodotti')

type TypeElemento = {
  [key: string]: any
}

type TypeCollezione = Array<TypeElemento>

export const CategorieProdotti = defineStore('CategorieProdotti', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'CategorieProdotti'
    },
    getElenco: (state) => {
      return state.Collezione
    },
    getProssimoElemento: (state) => {
      return {
        Id: '0',
        CategoriaProdotto: '',
        Nome: ''
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
          this.Collezione.push({ Id,...obj })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Elemento: TypeElemento) {
      delete Elemento.Id
      try {
        await push(TabellaRef, Elemento)
          .then((response: { key: any }) => {
            const snapshot = get(child(TabellaRef, response.key))
            const Id = response.key
            snapshot.then((res: any) => {
              this.Collezione.push({ Id, ...res.val() })
            })
          })
          .catch((e) => {
            console.log(e)
          })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(Elemento: TypeElemento) {
      const Id: string = Elemento.Id ?? Elemento.Id
      delete Elemento.Id      
      try {
        await update(child(TabellaRef, Id), Elemento)
          .then(() => {
            get(child(TabellaRef, Id)).then((res) => {
              const index = this.Collezione.findIndex((item) => item.Id === res.key)
              this.Collezione[index] = { Id, ...res.val()}
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
