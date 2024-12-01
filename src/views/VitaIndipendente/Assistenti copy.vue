<template>
    <div>
        <h1 class="text-center text-[30px]">Assistenti</h1>
        <div class="flex justify-center">
            <RTabella :Collezione="Assistenti" :Intestazione="Intestazione" :IdAggiungiModificaElimina="IdAssistente"
                :TestModificaElimina="TestModificaElimina" :TestAggiungi="TestAggiungi" @BTN="BTNAzione"
                @update="Update" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Pinia } from '@/stores/index'
import RTabella from '@/components/Assistenti/TabellaAzione.vue'
import { Data_aaaammgg_ggmmaaaa } from '@/assets/helpers/MyMixin';
const FirebaseAssistenti = Pinia.Assistenti()
const Assistenti = FirebaseAssistenti.getElenco
const IdAssistente = ref('0')
const Intestazione = ref(["Nome", "Cognome", "Assunzione", "Livello", "Licenziamento"])
const TestModificaElimina = ref('M')
const TestAggiungi = ref(false)
const ObjInvia = ref({
    Id: '',
    Nome: '',
    Cognome: '',
    Assunzione: '',
    Livello: '',
    Licenziamento: ''
})

const BTNAzione = (param: { Tipo: string, IdAssistente: string }) => {
    //console.log(param)   
    switch (param.Tipo) {
        case 'Annulla':
            console.log('annulla')
            IdAssistente.value = ''
            TestModificaElimina.value = 'M'
            TestAggiungi.value = false
            break;
        case 'Salva':
            //console.log('salva', ObjInvia.value.Nome)
            if (ObjInvia.value.Nome) {
                const Payload = {
                    Id: ObjInvia.value.Id,
                    Nome: ObjInvia.value.Nome,
                    Cognome: ObjInvia.value.Cognome,
                    Assunzione: Data_aaaammgg_ggmmaaaa(ObjInvia.value.Assunzione),
                    Livello: ObjInvia.value.Livello,
                    Licenziamento: Data_aaaammgg_ggmmaaaa(ObjInvia.value.Licenziamento)
                }
                if (Payload.Id === '0') {
                    console.log('inserisci')
                    Pinia.Assistenti().Aggiungi(Payload)
                        .then(() => {
                            ObjInvia.value = {
                                Id: '',
                                Nome: '',
                                Cognome: '',
                                Assunzione: '',
                                Livello: '',
                                Licenziamento: ''
                            }
                            IdAssistente.value = ''
                            TestModificaElimina.value = 'M'
                            TestAggiungi.value = false
                        })
                } else {
                    Pinia.Assistenti().Aggiorna(Payload).then(() => {
                        ObjInvia.value = {
                            Id: '',
                            Nome: '',
                            Cognome: '',
                            Assunzione: '',
                            Livello: '',
                            Licenziamento: ''
                        }
                        IdAssistente.value = ''
                        TestModificaElimina.value = 'M'
                        TestAggiungi.value = false
                    })
                }
            } else {
                ObjInvia.value = {
                    Id: '',
                    Nome: '',
                    Cognome: '',
                    Assunzione: '',
                    Livello: '',
                    Licenziamento: ''
                }
                IdAssistente.value = ''
                TestModificaElimina.value = 'M'
                TestAggiungi.value = false
            }

            break;
        case 'EliminaDefinitivamente':
            Pinia.Assistenti().Elimina(param.IdAssistente)
                .then(() => TestModificaElimina.value = "M")
            break;
        case 'AbilitaAggiungi':
            console.log('abilitaaggiungi')
            TestAggiungi.value = true
            TestModificaElimina.value = "M"
            ObjInvia.value = {
                Id: '',
                Nome: '',
                Cognome: '',
                Assunzione: '09-09-2000',
                Livello: '',
                Licenziamento: '09-09-2000'
            }
            IdAssistente.value = "0"
            break;
        default:            
            //console.log('m', param.IdAssistente )            
            //const AssistenteTrovato = Assistenti.find((item) => item.Id === param.IdAssistente)
            //console.log(AssistenteTrovato)            
            TestModificaElimina.value = param.Tipo === 'Modifica' ? "M" : "E"
            TestAggiungi.value = false
            IdAssistente.value = param.IdAssistente
            break;
    }
}

const Update = (Assistente: {
    [x: string]:
    any; Id: string, Nome: string, Cognome: string, Assunzione: string, Livello: string, Licenziamento: string
}) => {
    //console.log(Assistente.value)    
    ObjInvia.value = {
        Id: Assistente.value.Id,
        Nome: Assistente.value.Nome,
        Cognome: Assistente.value.Cognome,
        Assunzione: Assistente.value.Assunzione,
        Livello: Assistente.value.Livello,
        Licenziamento: Assistente.value.Licenziamento
    }
    //console.log(ObjInvia.value)        
}
</script>