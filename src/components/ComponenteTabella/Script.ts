import { Data_ggmmaaaa_aaaammgg, formatEuro } from '@/assets/helpers/MyMixin'
import { Use } from '@/stores/modules/CostruisciTabella.module'
import { ref, computed } from 'vue'

export function mymixin(props: any) {
  const IdAggiungiModificaElimina = ref('')
  const TestModificaElimina = ref('M')
  const Obj = ref()
  const select = ref([])

  const ConvertiDataInglese = (Data: string) => {
    let tmp = ''
    if (Data) {
      const gg = Data.substring(8, 10)
      const mm = Data.substring(5, 7)
      const aaaa = Data.substring(0, 4)
      tmp = gg + '-' + mm + '-' + aaaa
    }
    return tmp
  }

  const Intestazione = computed(() => {
    let tmp: string[] = []
    Object.keys(props.items).forEach((item) => {
      if (parseInt(item) === 0) {
        Object.keys(props.items[item]).forEach((iteminterno) => {
          tmp.push(iteminterno)
        })
      }
    })
    return tmp
  })
  const BTNAzione = (param: { Tipo: string; Id: string | undefined }) => {
    //console.log(param)
    let ObjTrovato: any
    let NuovoObj: { [key: string]: any } = {}
    if (param.Id && param.Id.length > 1) {
      ObjTrovato = props.items.find((item: { Id: { Value: string } }) => item.Id.Value === param.Id)
      Object.keys(ObjTrovato).forEach((item) => {
        //console.log(ObjTrovato[item].Value, ObjTrovato[item].Value != undefined)        
        ;(NuovoObj as any)[item] =
          ObjTrovato[item].Value != undefined ? ObjTrovato[item].Value : ''
      })

      //console.log(NuovoObj)
      if (param.Tipo != 'Salva') {
        Obj.value = NuovoObj
        Use().Assegna(NuovoObj)
      }
    }

    //console.log(Obj.value)
    if (param.Tipo === 'AbilitaAggiungi') {
      Obj.value = JSON.parse(JSON.stringify(props.pinia.getProssimoElemento))
      Use().Assegna(JSON.parse(JSON.stringify(props.pinia.getProssimoElemento)))
    }
    switch (param.Tipo) {
      case 'AbilitaAggiungi':
        //console.log('AbilitaAggiungi')
        TestModificaElimina.value = 'I'
        IdAggiungiModificaElimina.value = '0'
        break
      case 'AbilitaModifica':
        TestModificaElimina.value = 'M'
        IdAggiungiModificaElimina.value = param.Id!
        break
      case 'AbilitaElimina':
        TestModificaElimina.value = 'E'
        IdAggiungiModificaElimina.value = param.Id!
        break
      case 'EliminaDefinitivamente':
        //console.log('eliminadef')
        props.pinia.Elimina(param.Id).then(() => AzzeraAzione())
        break
      case 'Salva':
        //console.log('Salva', ObjTrovato, Obj.value['Nessuno'])
        //console.log(Use().ObjStore)

        if (Use().ObjStore['Nessuno']) {
          //console.log(Obj.value)
          props.pinia.Aggiungi(Use().ObjStore).then(() => AzzeraAzione())
        } else {
          if (Obj.value.Id != '0') {
            Object.keys(ObjTrovato).forEach((item) => {
              if (ObjTrovato[item].Visibile === 'hidden') {
                Obj.value[item] = ''
              }
            })
            //console.log(Obj.value)
            props.pinia.Aggiorna(Use().ObjStore).then(() => {
              //console.log(ObjTrovato.Id.Value, props.items[0])
              AzzeraAzione()
            })
          } else {
            console.log('agg', Use().ObjStore)
            props.pinia.Aggiungi(Use().ObjStore).then(() => AzzeraAzione())
          }
        }
      case 'Annulla':
        AzzeraAzione()
        break
      default:
        break
    }
  }

  const AggiungiRecord = (obj: any, index: number) => {
    //console.log(obj, Use().IdCategoriaNuovoMovimento[index])

    if (select.value[index]) {
      /*console.log(select.value[index]['Obj'])
      console.log(select.value[index]['Etichetta'])
      console.log(select.value[index]['Value'])
      */
      //obj[select.value[index]['Etichetta']].Value = select.value[index]['Value']
      console.log(obj[select.value[index]['Etichetta']])
    }
    //console.log(obj)
    let abc: { [x: string]: { [x: string]: any } } = { Id: '' }
    Object.keys(obj).forEach((item) => {
      console.log(item, obj[item].Value)
      abc[item] = obj[item].Value
    })

    if (Use().IdCategoriaNuovoMovimento[index]) {
      abc['IdCategoria'] = Use().IdCategoriaNuovoMovimento[index]
    }
    //console.log(abc)
    props.pinia.Aggiungi(abc).then(() => AzzeraAzione())
  }
  const VerificaEsiste = (objdainserire: any) => {
    //console.log(objdainserire, itemstabella)
    let Esiste = false
    let CampoDaEscludere = ''
    Object.keys(objdainserire).forEach((item) => {
      if (objdainserire[item].Array) {
        CampoDaEscludere = item
      }
    })
    //console.log(CampoDaEscludere)
    let etichetta = ''
    let DataIniziale: any = 0
    let DataFinale: any = 0
    let Range: any = []
    Object.keys(objdainserire).forEach((item) => {
      if (objdainserire[item].ControllaIntervallo) {
        if (objdainserire[item].Type === 'date') {
          etichetta = item
          const DataMovimentoDaVerificare = new Date(objdainserire[item].Value)
          DataIniziale = new Date(DataMovimentoDaVerificare)
          DataIniziale.setDate(DataIniziale.getDate() - objdainserire[item].ControllaIntervallo)
          DataFinale = new Date(DataMovimentoDaVerificare)
          DataFinale.setDate(DataFinale.getDate() + objdainserire[item].ControllaIntervallo)
        }
        Range = props.pinia.getElenco.filter((itemp: any) => {
          const Data = new Date(Data_ggmmaaaa_aaaammgg(itemp[etichetta])).getTime()
          if (Data > DataIniziale && Data < DataFinale) {
            return true
          }
        })
      }
    })
    Range.forEach((element: any) => {
      let trovato: boolean[] = []
      let n = 0
      Object.keys(objdainserire).forEach((item) => {
        if (item != 'Id' && item != etichetta && item != CampoDaEscludere) {
          n++
          if (element[item] === objdainserire[item].Value) {
            trovato.push(true)
          } else {
            trovato.push(false)
          }
        }
      })
      let conta = 0
      trovato.forEach((it) => {
        if (it) {
          conta++
        }
      })
      if (n === conta) {
        Esiste = true
      }
    })
    return Esiste ? 'BTNDisabilitato' : 'BTNSalva'
  }

  const AzzeraAzione = () => {
    IdAggiungiModificaElimina.value = ''
    TestModificaElimina.value = 'M'
  }
  const ClassRiga = computed(() => {
    return (item: any) => {
      return IdAggiungiModificaElimina.value === item
        ? TestModificaElimina.value === 'E'
          ? 'FaseDiElimina'
          : 'FaseDiModifica'
        : ''
    }
  })

  const ValidareCampi = computed(() => {
    let tmp = false
    let buffer: string[] = []
    Object.keys(props['items'][0]).forEach((item) => {
      if (props['items'][0][item].Valido) {
        if (!Use().ObjStore[item] || Use().ObjStore[item] === '') {
          tmp = true
        }
      }
      if (props['items'][0][item].Controlla2Campi) {
        buffer.push(Use().ObjStore[item] ? Use().ObjStore[item] : '0')
      }
    })
    if (buffer.length > 0) {
      if (!tmp) {
        if (
          (parseInt(buffer[0]) === 0 && parseInt(buffer[1]) != 0) ||
          (parseInt(buffer[0]) != 0 && parseInt(buffer[1]) === 0)
        ) {
        } else {
          tmp = true
        }
      }
    }
    return tmp
  })

  const AbilitaCampo = (item: any, n: number) => {
    item[Object.keys(item)[n]].Visibile = true
    IdAggiungiModificaElimina.value = ''
    IdAggiungiModificaElimina.value = item.Id.Value
  }
  /*
  const VerificaCampoModifica = computed(() => {
    return (Campo: any, n: number) => {
      console.log(Campo, n)      
      let tmp = true
      if (Campo) {
        Campo.forEach((item: any) => {
          if (item) {
            console.log(item.includes(n))
            tmp = item.includes(n)
          }
        })
      }
      return tmp
    }
  })
*/
  const VerificaEliminazione = computed(() => {
    return (Id: any) => {
      let tmp = false
      if (props.piniaverifica) {
        tmp = props.piniaverifica.getVerifica(Id)
      }
      return tmp
    }
  })

  const AssegnaValoreCombo = (event: any, nonso: any, index: any) => {
    console.log(event, nonso, index)    
    Use().IdCategoriaNuovoMovimento[index] = event.target.value
    //console.log('p', event.target.value, etichetta, Use().IdCategoriaNuovoMovimento, index)
  }

  const IdComboNome = (obj: any) => {
    let elemento
    if (obj.Array) {
      elemento = obj.Array.find((item: any) => {
        if (item.value === obj.Value) {
          return item
        }
      })
    }
    return elemento ? elemento.text : ''
  }

  const ControllaCampoSoloInserimento = (item: any) => {
    return !item[Object.keys(item)[6]].Value
  }

  return {
    select,
    Intestazione,
    IdAggiungiModificaElimina,
    TestModificaElimina,
    Obj,
    ConvertiDataInglese,
    BTNAzione,
    ClassRiga,
    ValidareCampi,
    AbilitaCampo,
    //VerificaCampoModifica,
    VerificaEliminazione,
    VerificaEsiste,
    AssegnaValoreCombo,
    IdComboNome,
    AggiungiRecord,
    ControllaCampoSoloInserimento
  }
}
