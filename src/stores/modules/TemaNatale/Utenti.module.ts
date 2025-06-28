import { ref, get, push, update, remove, child, DataSnapshot } from 'firebase/database'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'temanataleutenti') 

type TypeElemento = {
    Id?: string
    Nome: string
    Nikname: string
    Password: string
    DataNascita: string
    LuogoNascita: string
    OraNascita: string
    Segni: object
}

type TypeCollezione = Array<TypeElemento>

export const TemaNataleUtenti = defineStore('TemaNataleUtenti', {
    state: () => ({
        Collezione: [] as TypeCollezione
    }),
    getters: {
        getElenco: (state) => {
            return state.Collezione
        },
    },
    actions: {
        async Elenco() {
            const snapshot = get(TabellaRef)            
            try {
                const res: DataSnapshot = await snapshot
                this.Collezione = [] // Clear the array before populating
                res.forEach((doc: DataSnapshot) => {
                    const Id: string = doc.key ? doc.key : '0'
                    const obj: TypeElemento = doc.val()
                    const Nome = obj.Nome
                    const Nikname = obj.Nikname
                    const Password = obj.Password
                    const DataNascita = obj.DataNascita
                    const OraNascita = obj.OraNascita
                    const LuogoNascita = obj.LuogoNascita
                    const IdSegni = obj.Segni
                    const Payload: TypeElemento = {
                        Id,
                        Nome,
                        Nikname,
                        Password,
                        DataNascita,
                        OraNascita,
                        LuogoNascita,
                        Segni: IdSegni
                    }      
                    //console.log(Payload)                                  
                    this.Collezione.push(Payload)
                })
            } catch (e) {
                console.log(e)
            }
        },        
            async Aggiungi(Utente: any) {
              delete Utente.Id
              delete Utente.IdSegni.Id            
              console.log(Utente)            
              const Payload = {
                Nome: Utente.Nome,
                Nikname: Utente.Nikname,
                Password: Utente.Password,
                DataNascita: Utente.DataNascita,
                OraNascita: Utente.OraNascita,
                LuogoNascita: Utente.LuogoNascita,
                Segni: Utente.IdSegni
              }
              console.log(Payload)              
              
              try {
                await push(TabellaRef, Payload)
                  .then((response: { key: any }) => {
                    const snapshot = get(child(TabellaRef, response.key))
                    const Id = response.key
                    snapshot.then((res: any) => {
                    })
                  })
                  .catch((e) => {
                    console.log(e)
                  })
              } catch (e) {
                console.log(e)
              }
            },
            async Aggiorna(Utente: any) {
              const Id = Utente.Id
              delete Utente.Id
              console.log(Id, Utente)              
              try {
                await update(child(TabellaRef, Id), Utente)
                  .then(() => {
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