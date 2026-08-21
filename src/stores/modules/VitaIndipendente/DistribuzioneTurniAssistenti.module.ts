
import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { Data_aaaammgg_ggmmaaaa, DataOggiInglese } from '@/assets/helpers/MyMixin'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'

const TabellaRef = ref(db, 'assistentidistribuzioneorariturni')

type TypeElemento = {
  Id?: string
  IdNomeTurno: string
  NomeGiorno: string
  Orario: string
  Ordine: number
}

type TypeCollezione = Array<TypeElemento>

export const DistribuzioneTurniAssistenti = defineStore('distribuzioneTurniAssistenti', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'NomiTurniAssistenti'
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
        Nome: ''
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
      Assistente.Assunzione = Data_aaaammgg_ggmmaaaa(Assistente.Assunzione)
      Assistente.Licenziamento = ''
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
      //console.log('Aggiorna', Assistente)
      const Id = Assistente.Id
      delete Assistente.Id      
      try {
        await update(child(TabellaRef, Id), Assistente).then(() => {
          get(child(TabellaRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            this.Collezione[index].IdNomeTurno = res.val().IdNomeTurno
            this.Collezione[index].NomeGiorno = res.val().NomeGiorno
            this.Collezione[index].Orario = res.val().Orario
            this.Collezione[index].Ordine = res.val().Ordine
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
