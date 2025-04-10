import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { defineStore } from 'pinia'
import { SuperCategorie } from './SuperCategorie.module'
import { db } from '@/stores/Conn'
const TabellaRef = ref(db, 'categorie')

type TypeElemento = {
  Id?: string
  IdSuperCategoria: string
  Nome: string
  TestoDaAssociareCategoria: string
  Visibile: boolean
}

type TypeCollezione = Array<TypeElemento>

export const Categorie = defineStore('Categorie', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getElenco: (state) => {
      return state.Collezione
    },
    getProssimoElemento: () => {
      //console.log(SuperCategorie().getElenco[0].Id)
      return {
        Id: '0',
        Nome: '',
        IdSuperCategoria: SuperCategorie().getElenco[0].Id,
        TestoDaAssociareCategoria: '',
        Visibile: true
      }
    },
    getVerifica: (state) => {
      return (IdSuperCategoria: string) => {
        const tmp = state.Collezione.find((item) => item.IdSuperCategoria == IdSuperCategoria)
        return tmp
      }
    },
    getCercaCategoria: (state) => {
      return (DescrizioneEstesa: string) => {
        //console.log(DescrizioneEstesa)
        
        let tmp: any = ''
        let Cerca
        state.Collezione.forEach((item) => {
            if (item.TestoDaAssociareCategoria != "") {
                if (item.TestoDaAssociareCategoria) {
                Cerca = item.TestoDaAssociareCategoria.split(", ")
                Cerca.forEach((el) => {
                  if (DescrizioneEstesa.includes(el)) {
                    if (item) {
                      tmp = item.Id
                    }
                  }
                })
                }
              }  
        })
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
        this.Collezione.sort((a: { Nome: string }, b: { Nome: string }) => {
          //console.log(a,b)
          if (a.Nome < b.Nome) {
            return -1
          } else if (a.Nome > b.Nome) {
            return 1
          }
          return 0
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Categoria: any) {
      delete Categoria.Id
      //console.log(Categoria)
      try {
        await push(TabellaRef, Categoria).then((response: { key: any }) => {
          const snapshot = get(child(TabellaRef, response.key))
          const Id = response.key
          snapshot.then((res: any) => {
            const Payload = {
              Id,
              Nome: res.val().Nome,
              IdSuperCategoria: res.val().IdSuperCategoria,
              TestoDaAssociareCategoria: res.val().TestoDaAssociareCategoria,
              Visibile: res.val().Visibile
            }
            this.Collezione.push(Payload)
          })
        })
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiorna(Categoria: any) {
      const Id = Categoria.Id
      delete Categoria.Id
      try {
        await update(child(TabellaRef, Id), Categoria).then(() => {
          get(child(TabellaRef, Id)).then((res) => {
            const index = this.Collezione.findIndex((item) => item.Id === res.key)
            this.Collezione[index].Nome = res.val().Nome
            this.Collezione[index].IdSuperCategoria = res.val().IdSuperCategoria
            this.Collezione[index].TestoDaAssociareCategoria = res.val().TestoDaAssociareCategoria
              ? res.val().TestoDaAssociareCategoria
              : ''
            this.Collezione[index].Visibile = res.val().Visibile
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
