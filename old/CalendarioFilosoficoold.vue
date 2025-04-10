<template>
    <div class="relative top-[120px]">
        <h1 class="text-center text-[30px]">Calendario filosofico</h1>
        <Rtable :Collezione="Frasi" :Intestazione="Intestazione" :IdAggiungiModificaElimina="Id"
            :TestModificaElimina="TestModificaElimina" :TestAggiungi="TestAggiungi" @BTN="BTNAzione" @update="Update">
        </Rtable>
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores/index'
import { ref, onMounted } from 'vue'
import Rtable from '@/components/CalendarioFilosofico/TabellaAzione.vue'
//import Campi from '@/components/CalendarioFilosofico/Campi.vue'
import { mymixin } from '@/assets/helpers/xxx';
const Frasi = ref(Pinia.CalendarioFilosofico().getElenco)
const Intestazione = ['Data', 'Frase', 'Firma']
const ElementoVuoto = {
    Id: '0',
    Data: '',
    Frase: '',
    Firma: ''
}
const { Id, TestAggiungi, TestModificaElimina, TabellaRef, PiniaAggiungi, PiniaElimina } = mymixin()
onMounted(() => {
    TabellaRef.value = Pinia.CalendarioFilosofico()
})
const ObjInvia = ref(ElementoVuoto)
const BTNAzione = (param: { Tipo: string, Id: string }) => {
    switch (param.Tipo) {
        case 'Annulla':
            Id.value = ''
            TestAggiungi.value = false
            TestModificaElimina.value = "M"
            break;
        case 'Salva':
            let Payload = {
                Id: Id.value,
                Data: ObjInvia.value.Data,
                Frase: ObjInvia.value.Frase,
                Firma: ObjInvia.value.Firma
            }
            PiniaAggiungi(Payload)
            break
        case 'EliminaDefinitivamente':
            PiniaElimina(param.Id)
            break
        case 'AbilitaAggiungi':
            TestAggiungi.value = true
            ObjInvia.value = ElementoVuoto
            Id.value = '0'
            break
        default:
            const FraseTrovata = Frasi.value.find((frase) => frase.Id === param.Id)
            TestModificaElimina.value = param.Tipo === 'Modifica' ? "M" : "E"
            TestAggiungi.value = false
            Id.value = param.Id
            ObjInvia.value = {
                Id: FraseTrovata!.Id ? FraseTrovata!.Id : '0',
                Data: FraseTrovata!.Data,
                Frase: FraseTrovata!.Frase,
                Firma: FraseTrovata!.Firma
            }
            break
    }
}

const Update = (obj: {
    [x: string]:
    any; Id: string, Data: string, Frase: string, Firma: string
}) => {
    ObjInvia.value = {
        Id: obj.value.Id,
        Data: obj.value.Data,
        Frase: obj.value.Frase,
        Firma: obj.value.Firma
    }
}
</script>
