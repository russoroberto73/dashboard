import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'temanatalecase')

type TypeElemento = {
  Id?: string
  Sigla: string
  Elemento: string
  Segno: string
  Significato: string
}

type TypeCollezione = Array<TypeElemento>

export const TemaNataleCase = defineStore('TemaNataleCase', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'TemaNataleCase'
    },
    getElenco: (state) => {
      return state.Collezione
    },
    getProssimoElemento: (state) => {
      return {
        Id: '0',
        Sigla: '',
        Elemento: '',
        Segno: '',
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
          const Sigla = obj.Sigla
          const Elemento = obj.Elemento
          const Segno = obj.Segno
          const Significato = obj.Significato
          const Payload: TypeElemento = {
            Id,
            Sigla,
            Elemento,
            Segno,
            Significato
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
                Sigla: res.val().Sigla,
                Segno: res.val().Segno,
                Elemento: res.val().Elemento,
                Significato: res.val().Significato                
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
              this.Collezione[index].Sigla = res.val().Sigla
              this.Collezione[index].Segno = res.val().Segno
              this.Collezione[index].Elemento = res.val().Elemento
              this.Collezione[index].Significato = res.val().Significato
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
