import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '../../Conn'
const TabellaRef = ref(db, 'patrimoniotitoli')

type TypeElemento = {
  Id?: string
  Nome: string
  ControvaloreIniziale: string
  Data: string
  IdGruppo: string
  Posizione: string
}

type TypeCollezione = Array<TypeElemento>

export const PatrimonioTitoli = defineStore('PatrimonioTitoli', {
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
        Nome: '',
        IdGruppo: '',
        Posizione: '',
        ControvaloreIniziale: '',
        Data: ''
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
        this.Collezione.sort((a: {Posizione: string}, b: {Posizione: string}) => {
         // console.log(a,b)
          if (parseInt(a.Posizione) < parseInt(b.Posizione)) {
            return -1
          } else if (parseInt(a.Posizione) > parseInt(b.Posizione)) {
            return 1
          }
          return 0
        })
        //console.log(this.Collezione)        
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Record: any) {
      delete Record.Id
      try {
        await push(TabellaRef, Record).then((response: { key: any }) => {
          const snapshot = get(child(TabellaRef, response.key))
          const Id = response.key
          snapshot.then((res: any) => {
            const Payload = {
              Id,
              Nome: res.val().Nome,
              IdGruppo: res.val().IdGruppo,
              Posizione: res.val().Posizione,
              ControvaloreIniziale: res.val().ControvaloreIniziale,
              Data: res.val().Data
            }
            this.Collezione.push(Payload)
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(Record: any) {
      console.log(Record)
      const Id = Record.Id
      delete Record.Id
      try {
        await update(child(TabellaRef, Id), Record).then(() => {
          get(child(TabellaRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            this.Collezione[index].Nome = res.val().Nome
            this.Collezione[index].IdGruppo = res.val().IdGruppo
            this.Collezione[index].Posizione = res.val().Posizione
            this.Collezione[index].ControvaloreIniziale = res.val().ControvaloreIniziale
            this.Collezione[index].Data = res.val().Data
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
