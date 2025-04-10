import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '../../Conn'
import { GruppiPassword  } from './GruppiPassword.module'

const TabellaRef = ref(db, 'accountpassword')

type TypeElemento = {
  Id?: string
  IdGruppo: string  
  Nome: string
  Password: string
  Utente: string
  Varie: string
}

type TypeCollezione = Array<TypeElemento>

export const AccountPassword = defineStore('AccountPassword', {
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
        IdGruppo: GruppiPassword().getElenco[0].Id,
        Nome: '',
        Password: '',
        Utente: '',
        Varie: ''
      }
    },
    getVerifica: (state) => {
      return (IdGrppoPassword: string) => {
        const tmp = state.Collezione.find((item) => item.IdGruppo === IdGrppoPassword)
        return tmp
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
        this.Collezione.sort((a: {Nome: string}, b: {Nome: string}) => {
         // console.log(a,b)        
          if (a.Nome < b.Nome) {
            return -1
          } else if (a.Nome > b.Nome) {
            return 1
          }
          return 0
        })
        //console.log(this.Collezione)        
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(AccountPassword: any) {
      console.log(AccountPassword)      
      delete AccountPassword.Id
      try {
        await push(TabellaRef, AccountPassword).then((response: { key: any }) => {
          const snapshot = get(child(TabellaRef, response.key))
          const Id = response.key
          snapshot.then((res: any) => {
            const Payload = {
              Id,
              IdGruppo: res.val().IdGruppo,
              Nome: res.val().Nome,
              Password: res.val().Password,
              Utente: res.val().Utente,
              Varie: res.val().Varie
            }
            this.Collezione.push(Payload)
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(AccountPassword: any) {
      const Id = AccountPassword.Id
      delete AccountPassword.Id
      console.log(AccountPassword)      
      try {
        await update(child(TabellaRef, Id), AccountPassword).then(() => {
          get(child(TabellaRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            this.Collezione[index].Nome = res.val().Nome
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
