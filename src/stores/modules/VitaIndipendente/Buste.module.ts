import { ref, get, DataSnapshot, update, child, push, remove } from 'firebase/database'
import { Assistenti } from './Assistenti.module'
import { defineStore } from 'pinia'
import { db } from '@/stores/Conn'
import { MeseDaNomeANumero } from '@/assets/helpers/MyMixin'
const TabellaRef = ref(db, 'buste')

type TypeElemento = {
  Id?: string
  IdAssistente: string
  Anno: string
  Mese: string
  Netto: string
  Lordo: string
  FerieAp: string
  FerieMat: string
  FerieResidue: string
  FerieGod: string
  Mav?: string
}

type TypeCollezione = Array<TypeElemento>

export const Buste = defineStore('Buste', {
  state: () => ({
    Collezione: [] as TypeCollezione
  }),
  getters: {
    getNomeTabella: () => {
      return 'BustePaga'
    },
    getElenco: (state) => {
      return state.Collezione
    },
    getProssimoElemento: (state) => {
      const ultimabusta = state.Collezione[state.Collezione.length - 1]
      let UltimoAnno = parseInt(ultimabusta.Anno)
      let UltimoMese = parseInt(ultimabusta.Mese)
      //console.log('p', UltimoAnno, UltimoMese)
      let ProssimoMese = ++UltimoMese
      let ProssimoAnno = UltimoAnno
      if (UltimoMese === 13) {
        ProssimoMese = 1
        ProssimoAnno++
      }
      //console.log('d',ProssimoAnno, ProssimoMese)
      return { Nessuno: true, Anno: ProssimoAnno, Mese: ProssimoMese, Netto: 1, Lordo: 1, FerieAp: 1, FerieMat: 1, FerieGod: 1 }
    },
    getVerifica: (state) => {
      return (IdAssistente: string) => {
       // console.log(IdAssistente)        
        const tmp = state.Collezione.find((item) => item.IdAssistente === IdAssistente)
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
        //console.log(this.Collezione)
      } catch (e) {
        console.log(e)
      }
    },
    async Aggiungi(Busta: any) {
      const ListaAssistenti = Assistenti().getElenco.filter((item) => {
        if (item.Licenziamento === 'vuoto' || item.Licenziamento === '') {
          return item
        }
      })
      let Payload
      await ListaAssistenti.forEach((item) => {
        Payload = {
          IdAssistente: item.Id,
          Anno: Busta.Anno,
          Mese: Busta.Mese
        }
      push(TabellaRef, Payload)
          .then((response: { key: any }) => {
            const snapshot = get(child(TabellaRef, response.key))
            snapshot.then((res: any) => {
              this.Collezione.push({ Id: response.key, ...res.val() })
            })
          })
          .catch((e) => {
            console.log(e)
          })
      })
    },
    async Aggiorna(Busta: any) {
      console.log(Busta)      
      const Id = Busta.Id
      delete Busta.Id      
      delete Busta.FerieResidue
      Busta.Mese = MeseDaNomeANumero(Busta.Mese)
      
      const index = this.Collezione.findIndex((item) => item.Id === Id)
      Busta.Anno = this.Collezione[index].Anno
      //console.log(Busta.value, Id)      
      await update(child(TabellaRef, Id), Busta).then(() => {
        get(child(TabellaRef, Id)).then((res) => {
          const index = this.Collezione.findIndex((item) => item.Id === res.key)
          //console.log(this.Collezione[index])          
          this.Collezione[index].Netto = res.val().Netto
          this.Collezione[index].Lordo = res.val().Lordo
          this.Collezione[index].FerieAp = res.val().FerieAp
          this.Collezione[index].FerieMat = res.val().FerieMat
          this.Collezione[index].FerieGod = res.val().FerieGod
          this.Collezione[index].Mav = res.val().Mav
          })
      })
    },
    async Elimina(Id: any) {
      const Busta = this.Collezione.find((item) => item.Id === Id)
      console.log(Busta?.Anno, Busta?.Mese)
      if (Busta) {
        const IdBusteDaEliminare = this.Collezione.map((item) => {
          if (item.Anno === Busta.Anno && item.Mese === Busta.Mese) {
            return item.Id
          }
        }).filter((item) => item != undefined)
        await IdBusteDaEliminare.forEach((Id: any) => {
          remove(child(TabellaRef, Id)).then(() => {
            const index = this.Collezione.findIndex((item) => {
              if (item.Id === Id) {
                console.log(Id)
                return true
              }
            })
            console.log(index)
            this.Collezione.splice(index, 1)
          })
        })
      }
    }
  }
})
