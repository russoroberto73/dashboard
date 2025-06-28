import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'temanatalegovernatorisegni')

type TypeElemento = {
  Id?: string
  Pianeta: string
  Segno: string
  Significato: string
  Discorsivo: string
}

type TypeCollezione = Array<TypeElemento>

export const TemaNataleGovernatoriSegni = defineStore('TemaNataleGovernatoriSegni', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'TemaNataleGovernatoriSegni'
    },
    getElenco: (state) => {
      return state.Collezione
    },
    getProssimoElemento: (state) => {
      return {
        Id: '0',
        Pianeta: '',  
        Segno: '',
        Significato: '',
        Discorsivo: ''
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
          const Pianeta = obj.Pianeta
          const Segno = obj.Segno
          const Significato = obj.Significato
          const Discorsivo = obj.Discorsivo
          const Payload: TypeElemento = {
            Id,
            Pianeta,
            Segno,
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
                Pianeta: res.val().Pianeta,
                Elemento: res.val().Elemento,
                Segno: res.val().Segno,
                Significato: res.val().Significato,
                Discorsivo: res.val().Discorsivo
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
              this.Collezione[index].Pianeta = res.val().Pianeta
              this.Collezione[index].Segno = res.val().Segno
              this.Collezione[index].Significato = res.val().Significato
              this.Collezione[index].Discorsivo = res.val().Discorsivo
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
