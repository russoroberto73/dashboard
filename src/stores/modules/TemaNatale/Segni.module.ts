import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'temanatalesegni')

type TypeElemento = {
  Id?: string
  Nome: string,
  Quadruplicità: string,
  Governatore: string,
  Opposto: string,
  Elemento: string,
  Polarità: string
  Significato: string,
  ParoleChiavi: string
}

type TypeCollezione = Array<TypeElemento>

export const TemaNataleSegni = defineStore('TemaNataleSegni', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'TemaNataleSegni'
    },
    getElenco: (state) => {
      return state.Collezione
    },
    getProssimoElemento: (state) => {
      return {
        Id: '0',
        Nome: '',
        Quadruplicità: '',
        Governatore: '',
        Opposto: '',
        Elemento: '',
        Polarità: '',
        Significato: '',
        ParoleChiavi: ''
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
          const Quadruplicità = obj.Quadruplicità
          const Governatore = obj.Governatore
          const Opposto = obj.Opposto
          const Elemento = obj.Elemento
          const Polarità = obj.Polarità
          const Significato = obj.Significato
          const ParoleChiavi = obj.ParoleChiavi
          const Payload: TypeElemento = {
            Id,
            Nome,
            Quadruplicità,
            Governatore,
            Opposto,
            Elemento,
            Polarità,
            Significato,
            ParoleChiavi
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
                Quadruplicità: res.val().Quadruplicità,              
                Governatore: res.val().Governtore,
                Opposto: res.val().Opposto,               
                Elemento: res.val().Elemento,
                Polarità: res.val().Polarità,
                Significato: res.val().Significato,                
                ParoleChiavi: res.val().ParoleChiavi
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
              this.Collezione[index].Quadruplicità = res.val().Quadruplicità
              this.Collezione[index].Governatore = res.val().Governatore
              this.Collezione[index].Opposto = res.val().Opposto
              this.Collezione[index].Elemento = res.val().Elemento
              this.Collezione[index].Polarità = res.val().Polarità
              this.Collezione[index].Significato = res.val().Significato
              this.Collezione[index].ParoleChiavi = res.val().ParoleChiavi
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
