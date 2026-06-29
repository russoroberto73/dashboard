import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { Data_aaaammgg_ggmmaaaa, DataOggiInglese } from '@/assets/helpers/MyMixin'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'assistentiorarinero')

type TypeElemento = {
  Id?: string
    IdAssistente: string,
    Giorni: string,
  Orario: string,
  PagaOraria: string,
    NumeroOre: string,
}

type TypeCollezione = Array<TypeElemento>

export const AssistentiOrariNero = defineStore('AssistentiOrariNero', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'AssistentiOrariNero'
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
        IdAssistente: '',
        Giorni: '',
        Orario: '',
        PagaOraria: '',
        NumeroOre: ''
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
        //console.log(this.Collezione)
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Assistente: any) {
      //delete Assistente.value.Licenziamento
      delete Assistente.Id
      try {
        await push(TabellaRef, Assistente).then((response: { key: any }) => {
          const snapshot = get(child(TabellaRef, response.key))
          const Id = response.key
          snapshot.then((res: any) => {
            console.log(res.val(), Id)
            this.Collezione.push({ Id, ...res.val() })
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(Assistente: any) {
      console.log('Aggiorna')
      const Id = Assistente.Id
      try {
        await update(child(TabellaRef, Id), Assistente).then(() => {
          get(child(TabellaRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            this.Collezione[index].IdAssistente = res.val().IdAssistente
            this.Collezione[index].Giorni = res.val().Giorni
            this.Collezione[index].Orario = res.val().Orario
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
    }
  }
})
