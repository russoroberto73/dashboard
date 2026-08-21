import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'assistenticalendarioturni')

type TypeElemento = {
  Id?: string
  Ordine?: string
  Data: string
  IdAssistente: string
  NomeAssistente: string
  Orario: string
  Nero?: boolean,
  Ferie?: boolean,
  PagaOraria?: number,
  NumeroOre?: number,
  Festivo?: boolean
}

type TypeCollezione = Array<TypeElemento>

export const CalendarioTurni = defineStore('CalendarioTurni ', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'AssistentiNero'
    },
    getElenco: (state) => {
      return state.Collezione
    },
    getPrimoIdAssistente: (state) => {
      return state.Collezione.find((item, index) => index === 1)?.Id
    },
    getProssimoElemento: () => {
      return {
        Id: '0',
        Data: '',
        NomeAssistente: '',
        Orario: '',
        Ordine: '0',
        IdAssistente: '',
        Nero: false,
        Ferie: false,
        PagaOraria: 0,
        NumeroOre: 0,
        Festivo: false
      }
    }
  },
  actions: {
    async Elenco() {
      //console.log('AssistentiCalendarioTurni');      
      const snapshot = get(TabellaRef)
      try {
        const res: DataSnapshot = await snapshot
        res.forEach((doc: DataSnapshot) => {
          const Id: string = doc.key ? doc.key : '0'
          const obj: TypeElemento = doc.val()
          const Payload: TypeElemento = { Id, ...obj }
          this.Collezione.push(Payload)
        })
        //console.log(this.Collezione)
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Assistente: any) {
      //console.log('calendrioturni aggiungi', Assistente);      
      delete Assistente.Id
  
      try {
        await push(TabellaRef, Assistente).then((response: { key: any }) => {
          const snapshot = get(child(TabellaRef, response.key))
          const Id = response.key
          snapshot.then((res: any) => {
            //console.log(res.val(), Id)
            this.Collezione.push({ Id, ...res.val() })
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(Assistente: any) {
      //console.log('Aggiorna')
      const Id = Assistente.Id
      delete Assistente.Id
      //console.log(Assistente, Id)          
      try {
        await update(child(TabellaRef, Id), Assistente).then(() => {
          get(child(TabellaRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            this.Collezione[index].Data = res.val().Data
            this.Collezione[index].IdAssistente = res.val().IdAssistente
            this.Collezione[index].NomeAssistente = res.val().NomeAssistente
            this.Collezione[index].Orario = res.val().Orario
            this.Collezione[index].Nero = res.val().Nero
            this.Collezione[index].Ferie = res.val().Ferie
            this.Collezione[index].Festivo = res.val().Festivo
            this.Collezione[index].Ordine = res.val().Ordine
            this.Collezione[index].PagaOraria = res.val().PagaOraria
            this.Collezione[index].NumeroOre = res.val().NumeroOre
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
      console.log('p')
    },
    async EliminaGiorno(Data: string) {
      const Filtro = this.Collezione.filter((item) => item.Data === Data)
      let ArrayId: any[] = []
      Filtro.forEach((f) => {
        const index = this.Collezione.findIndex((item) => item.Id === f.Id)
        if (f.Id) {
          remove(child(TabellaRef, f.Id))
          this.Collezione.splice(index, 1)
        }
      })
    }
  }
})
