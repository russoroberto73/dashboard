import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'temanatalegruppicase')

type TypeElemento = {
  Id?: string
  Nome: string
  ParolaChiave: string
  Significato: string
}

type TypeCollezione = Array<TypeElemento>

export const TemaNataleGruppiCase = defineStore('TemaNataleGruppiCase', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'TemaNataleGruppiCase'
    },
    getElenco: (state) => {
      return state.Collezione
    },
    getProssimoElemento: (state) => {
      return {
        Id: '0',
        Nome: '',
        ParolaChiave: '',
        Segno: ''
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
          const ParolaChiave = obj.ParolaChiave
          const Significato = obj.Significato
          const Payload: TypeElemento = {
            Id,
            Nome,
            ParolaChiave,
            Significato
          }
          this.Collezione.push(Payload)
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(GruppoCasa: any) {
      delete GruppoCasa.Id
      //console.log(Frase)
      try {
        await push(TabellaRef, GruppoCasa)
          .then((response: { key: any }) => {
            const snapshot = get(child(TabellaRef, response.key))
            const Id = response.key
            snapshot.then((res: any) => {
              const Payload = {
                Id,
                Nome: res.val().Nome,
                ParolaChiave: res.val().ParolaChiave,
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
    async Aggiorna(GruppoCasa: any) {
      const Id = GruppoCasa.Id
      delete GruppoCasa.Id
      try {
        await update(child(TabellaRef, Id), GruppoCasa)
          .then(() => {
            get(child(TabellaRef, Id)).then((res) => {
              const index = this.Collezione.findIndex((item) => item.Id === res.key)
              this.Collezione[index].Nome = res.val().Nome
              this.Collezione[index].ParolaChiave = res.val().ParolaChiave
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
