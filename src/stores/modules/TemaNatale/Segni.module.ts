import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'temanatalesegni')

type TypeElemento = {
  Id?: string
  Nome: string,
  Immagine: string,
  Periodo: string,
  Quadruplicità: string,
  Governatore: string,
  Opposto: string,
  Elemento: string,
  Polarità: string
  Significato: string,
  ParoleChiavi: string,
  Forza: string,
  Debolezza: string
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
        Immagine: '',
        Periodo: '', 
        Quadruplicità: '',
        Governatore: '',
        Opposto: '',
        Elemento: '',
        Polarità: '',
        Significato: '',
        ParoleChiavi: '',
        Forza: '',
        Debolezza: ''
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
          const Immagine = obj.Immagine
          const Periodo = obj.Periodo
          const Quadruplicità = obj.Quadruplicità
          const Governatore = obj.Governatore
          const Opposto = obj.Opposto
          const Elemento = obj.Elemento
          const Polarità = obj.Polarità
          const Significato = obj.Significato
          const ParoleChiavi = obj.ParoleChiavi
          const Forza = obj.Forza
          const Debolezza = obj.Debolezza
          const Payload: TypeElemento = {
            Id,
            Nome,
            Immagine,
            Periodo,
            Quadruplicità,
            Governatore,
            Opposto,
            Elemento,
            Polarità,
            Significato,
            ParoleChiavi,
            Forza,
            Debolezza
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
                Immagine: res.val().Immagine,
                Periodo: res.val().Periodo,
                Quadruplicità: res.val().Quadruplicità,              
                Governatore: res.val().Governtore,
                Opposto: res.val().Opposto,               
                Elemento: res.val().Elemento,
                Polarità: res.val().Polarità,
                Significato: res.val().Significato,                
                ParoleChiavi: res.val().ParoleChiavi,
                Forza: res.val().Forza,
                Debolezza: res.val().Debolezza
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
              this.Collezione[index].Immagine = res.val().Immagine
              this.Collezione[index].Periodo = res.val().Periodo
              this.Collezione[index].Quadruplicità = res.val().Quadruplicità
              this.Collezione[index].Governatore = res.val().Governatore
              this.Collezione[index].Opposto = res.val().Opposto
              this.Collezione[index].Elemento = res.val().Elemento
              this.Collezione[index].Polarità = res.val().Polarità
              this.Collezione[index].Significato = res.val().Significato
              this.Collezione[index].ParoleChiavi = res.val().ParoleChiavi
              this.Collezione[index].Forza = res.val().Forza
              this.Collezione[index].Debolezza = res.val().Debolezza
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
