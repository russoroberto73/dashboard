import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { Data_aaaammgg_ggmmaaaa, DataOggiInglese } from '@/assets/helpers/MyMixin'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'assistentinero')

type TypeElemento = {
  Id?: string
  Nome: string,
  IdCategoriaBanca: string,
  Colore: string,
  Weekend?: boolean,
}

type TypeCollezione = Array<TypeElemento>

export const AssistentiNero = defineStore('AssistentiNero', {
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
        Nome: '',
        IdCategoriaBanca: '',
        Colore: ''

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
            this.Collezione[index].Nome = res.val().Nome
            this.Collezione[index].IdCategoriaBanca = res.val().IdCategoriaBanca
            this.Collezione[index].Colore = res.val().Colore
            this.Collezione[index].Weekend = res.val().Weekend
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
