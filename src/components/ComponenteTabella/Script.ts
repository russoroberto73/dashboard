import { ref, computed } from 'vue'

export function mymixin(props: any) {
  const Intestazione = ref()
  const IdAggiungiModificaElimina = ref('')
  const TestModificaElimina = ref('M')
  const Obj = ref()

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
        console.log('Salva', ObjTrovato, Obj.value['Nessuno'])
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

  const AggiungiRecord = (obj) => {
    console.log(obj)    
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
    const elemento = obj.Array.find((item: any) => {
      if (item.value === obj.Value) {
        return item
      }
    })
    return elemento ? elemento.text : ''
  }
  return {
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
    AssegnaValoreCombo,
    IdComboNome,
    AggiungiRecord
  }
}
