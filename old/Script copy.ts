import { Data_ggmmaaaa_aaaammgg } from '@/assets/helpers/MyMixin'
import { ref, computed } from 'vue'

export function mymixin(props: any) {
  const Intestazione = ref()
  const IdAggiungiModificaElimina = ref('')
  const TestModificaElimina = ref('M')
  //const Obj = ref()
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

  const BTNAzione = (param: { Tipo: string; Id: string | undefined }) => {
    //console.log(param)
    let ObjTrovato: any
    let NuovoObj: { [key: string]: any } = {}
    if (param.Id && param.Id.length > 1) {
      ObjTrovato = props.items.find((item: { Id: { Value: string } }) => item.Id.Value === param.Id)
      Object.keys(ObjTrovato).forEach((item) => {
        ;(NuovoObj as any)[item] =
          ObjTrovato[item].Value != 'understand' ? ObjTrovato[item].Value : ''
      })
      //console.log(ObjTrovato)
      if (param.Tipo != 'Salva') {
        Obj.value = NuovoObj
      }
    }
    //console.log(Obj.value)
    if (param.Tipo === 'AbilitaAggiungi') {
      Obj.value = JSON.parse(JSON.stringify(props.pinia.getProssimoElemento))
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
        if (Obj.value['Nessuno']) {
          //console.log(Obj.value)
          props.pinia.Aggiungi(Obj).then(() => AzzeraAzione())
        } else {
          if (Obj.value.Id != '0') {
            Object.keys(ObjTrovato).forEach((item) => {
              if (ObjTrovato[item].Visibile === 'hidden') {
                Obj.value[item] = ''
              }
            })
            //console.log(Obj.value)
            props.pinia.Aggiorna(Obj).then(() => {
              //console.log(ObjTrovato.Id.Value, props.items[0])
              AzzeraAzione()
            })
          } else {
            console.log('agg', Obj)
            props.pinia.Aggiungi(Obj).then(() => AzzeraAzione())
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
    console.log(obj)
    if (select.value[index]) {
      /*console.log(select.value[index]['Obj'])
      console.log(select.value[index]['Etichetta'])
      console.log(select.value[index]['Value'])
      */
      obj[select.value[index]['Etichetta']].Value = select.value[index]['Value']
      console.log(obj[select.value[index]['Etichetta']])
    }
    //console.log(obj)
    let abc: { [x: string]: { [x: string]: any } } = { value: { Id: '' } }
    Object.keys(obj).forEach((item) => {
      //console.log(item, obj[item].Value)
      abc['value'][item] = obj[item].Value
    })
    //    console.log(abc)
    props.pinia.Aggiungi(abc).then(() => AzzeraAzione())
  }
  const VerificaEsiste = (objdainserire: any, itemstabella: any, itemstotale: any) => {
    let Esiste = false
    let CampoDaEscludere = ''
    Object.keys(objdainserire).forEach((item) => {
      if (objdainserire[item].Etichetta) {
        CampoDaEscludere = item
      }
    })
    let etichetta = ''
    let DataIniziale = 0
    let DataFinale = 0
    let Range: any = []
    Object.keys(itemstabella[0]).forEach((item) => {
      if (itemstabella[0][item].ControllaIntervallo) {
        if (itemstabella[0][item].Type === 'date') {
          etichetta = item
          const DataMovimentoDaVerificare = new Date(objdainserire[item].Value)
          DataIniziale = DataMovimentoDaVerificare.setDate(
            DataMovimentoDaVerificare.getDate() - itemstabella[0][item].ControllaIntervallo * 2
          )
          const DataOggi = new Date()
          DataFinale = DataOggi.setDate(DataOggi.getDate() + 1)
        }

        Range = itemstotale.filter((item: any) => {
          const Data = new Date(Data_ggmmaaaa_aaaammgg(item[etichetta])).getTime()
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
    return (Id: string) => {
      return IdAggiungiModificaElimina.value === Id
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
        //console.log(Obj.value[item], item)
        if (!Obj.value[item] || Obj.value[item] === '') {
          tmp = true
        }
      }
      if (props['items'][0][item].Controlla2Campi) {
        buffer.push(Obj.value[item] ? Obj.value[item] : '0')
      }
    })
    //console.log(tmp)
    if (buffer.length > 0) {
      if (!tmp) {
        //console.log('step2')
        if (
          (parseInt(buffer[0]) === 0 && parseInt(buffer[1]) != 0) ||
          (parseInt(buffer[0]) != 0 && parseInt(buffer[1]) === 0)
        ) {
          //tmp = false
        } else {
          tmp = true
        }
      }
    }
    return tmp
  })

  const AbilitaCampo = (item: any, n: number) => {
    item[Object.keys(item)[n]].Visibile = undefined
    IdAggiungiModificaElimina.value = ''
    console.log(item[Object.keys(item)[n]])
    IdAggiungiModificaElimina.value = item.Id.Value
  }
  const VerificaCampoModifica = computed(() => {
    return (Campo: any, n: number) => {
      let tmp = true
      if (Campo) {
        Campo.forEach((item: any) => {
          if (item) {
            //console.log(item.includes(n))
            tmp = item.includes(n)
          }
        })
      }
      return tmp
    }
  })

  const VerificaEliminazione = computed(() => {
    return (Id: any) => {
      let tmp = false
      if (props.piniaverifica) {
        tmp = props.piniaverifica.getVerifica(Id)
      }
      return tmp
    }
  })

  const AssegnaValoreCombo = (event: any, etichetta: string) => {
    Obj.value[etichetta] = event.target.value
  }

  const IdComboNome = (obj: any) => {
    let elemento
    //console.log(obj)
    if (obj.Array) {
      elemento = obj.Array.find((item: any) => {
        if (item.value === obj.Value) {
          return item
        }
      })
    }
    return elemento ? elemento.text : ''
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
    VerificaCampoModifica,
    VerificaEliminazione,
    VerificaEsiste,
    AssegnaValoreCombo,
    IdComboNome,
    AggiungiRecord
  }
}
