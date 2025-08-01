import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'temanataleelementi')

type TypeElemento = {
  Id?: string
  Nome: string
  Significato: string
  Discorsivo: string
  Eccesso: string
  Carenza: string
}

type TypeCollezione = Array<TypeElemento>

export const TemaNataleElementi = defineStore('TemaNataleElementi', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'TemaNataleElementi'
    },
    getElenco: (state) => {
      return state.Collezione
    },
    getProssimoElemento: (state) => {
      return {
        Id: '0',
        Nome: '',
        Significato: ''
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
          const Significato = obj.Significato
          const Discorsivo = obj.Discorsivo
          const Eccesso = obj.Eccesso
          const Carenza = obj.Carenza
          const Payload: TypeElemento = {
            Id,
            Nome,
            Eccesso,
            Carenza,
            Significato,
            Discorsivo
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
                Nome: res.val().Nome,              
                Significato: res.val().Significato,
                Discorsivo: res.val().Discorsivo,
                Eccesso: res.val().Eccesso,
                Carenza: res.val().Carenza
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
      const Id = Casa.Id
      delete Casa.Id
      try {
        await update(child(TabellaRef, Id), Casa)
          .then(() => {
            get(child(TabellaRef, Id)).then((res) => {
              const index = this.Collezione.findIndex((item) => item.Id === res.key)
              this.Collezione[index].Nome = res.val().Nome
              this.Collezione[index].Significato = res.val().Significato
              this.Collezione[index].Discorsivo = res.val().Discorsivo
              this.Collezione[index].Eccesso = res.val().Eccesso
              this.Collezione[index].Carenza = res.val().Carenza
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
