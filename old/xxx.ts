import { ref, onMounted } from 'vue'

export function mymixin() {
  const Id = ref('')
  const TestModificaElimina = ref('M')
  const TestAggiungi = ref(false)
  const TabellaRef = ref()
  const PiniaAggiungi = (Payload: any) => {
    if (Payload.Id === '0') {
      TabellaRef.value
        .Aggiungi(Payload)
        .then(() => Reset())
        .catch((e) => console.log(e))
    } else {
      PiniaAggiorna(Payload)
    }
  }
  const PiniaAggiorna = (Payload: any) => {
    TabellaRef.value
    .Aggiorna(Payload)
      .then(() => Reset())
      .catch((e) => console.log(e))
  }
  const PiniaElimina = (Id: string) => {
    TabellaRef.value
    .Elimina(Id)
      .then(() => Reset())
      .catch((e) => console.log(e))
  }
  const Reset = () => {
    Id.value = ''
    TestModificaElimina.value = 'M'
    TestAggiungi.value = false
  }
  onMounted(() => {
  })
  return {
    Id,
    TestModificaElimina,
    TestAggiungi,
    PiniaAggiungi,
    PiniaElimina,
    TabellaRef   
  }
}
