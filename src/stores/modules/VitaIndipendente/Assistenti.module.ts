import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { Data_aaaammgg_ggmmaaaa, DataOggiInglese } from '@/assets/helpers/MyMixin'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'assistenti')

type TypeElemento = {
  Id?: string
  Nome: string
  Cognome: string
  Assunzione: string
  Livello: string
  Licenziamento?: string
}

type TypeCollezione = Array<TypeElemento>

export const Assistenti = defineStore('Assistenti', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'Assistenti'
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
        Cognome: '',
        Assunzione: DataOggiInglese(),
        Livello: '',
        Licenziamento: '2024-09-09'
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
      delete Assistente.value.Id
      Assistente.value.Assunzione = Data_aaaammgg_ggmmaaaa(Assistente.value.Assunzione)
      Assistente.value.Licenziamento = ''
      try {
        await push(TabellaRef, Assistente.value).then((response: { key: any }) => {
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
      const Id = Assistente.value.Id
      delete Assistente.value.Id
      Assistente.value.Assunzione = Data_aaaammgg_ggmmaaaa(Assistente.value.Assunzione)
      if (Assistente.value.Licenziamento != 'vuoto' || Assistente.value.Licenziamento != '') {
        Assistente.value.Licenziamento = Data_aaaammgg_ggmmaaaa(Assistente.value.Licenziamento)
      }
      try {
        await update(child(TabellaRef, Id), Assistente.value).then(() => {
          get(child(TabellaRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            this.Collezione[index].Nome = res.val().Nome
            this.Collezione[index].Cognome = res.val().Cognome
            this.Collezione[index].Assunzione = res.val().Assunzione 
            this.Collezione[index].Livello = res.val().Livello 
            this.Collezione[index].Licenziamento = res.val().Licenziamento
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
