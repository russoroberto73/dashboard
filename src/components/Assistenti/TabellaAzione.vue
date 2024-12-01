<template>
    <table>
        <tr>
            <th v-for="(etichetta, index) in $props.Intestazione" :key="index">{{ etichetta }}</th>
            <th>Azione</th>
        </tr>
        <tr v-for="(assistente, index) in Collezione" :key="index"
            :class="IdAggiungiModificaElimina === assistente.Id ? TestModificaElimina === 'E' ? 'FaseDiElimina' : 'FaseDiModifica' : ''">
            <CampiTabella :IdAggiungiModificaElimina="IdAggiungiModificaElimina" :Obj="assistente" @update="Update" />

            <td class="w-[150px] text-center">
                <div class="hidden">
                    IdAggiungiModificaElimina: {{ IdAggiungiModificaElimina }}<br />
                    AssisteteId: {{ assistente.Id }}<br />
                    assistente: {{ assistente }}<br />
                    Test: {{ TestModificaElimina }}<br />
                    TestAggiungi: {{ TestAggiungi }}<br />
                </div>
                <div v-if="assistente.Id === IdAggiungiModificaElimina && TestModificaElimina === 'M'">
                    <BTNSalva :class="Salva(assistente, 'c')" @click="$emit('BTN', { Tipo: 'Salva' })"
                        :disabled="Salva(assistente, 'd')" />
                    <BTNIndietro class="Indietro" @click="$emit('BTN', { Tipo: 'Annulla' })" />
                </div>
                <div v-else-if="(
                    (IdAggiungiModificaElimina.length === 0 && assistente.Id === '0') ||
                    (IdAggiungiModificaElimina.length > 0 && assistente.Id === '0')
                )">
                    <BTNAggiungi class="BTNId0" @click="$emit('BTN', { Tipo: 'Aggiungi' })" />
                </div>
                <div v-else-if="assistente.Id === IdAggiungiModificaElimina && TestModificaElimina === 'E'">
                    <BTNConferma class="Conferma"
                        @click="$emit('BTN', { Tipo: 'EliminaDefinitivamente', IdAssistente: assistente.Id })" />
                    <BTNIndietro class="Indietro" @click="$emit('BTN', { Tipo: 'Annulla' })" />
                </div>
                <div v-else-if="TestModificaElimina != 'I'">
                    <BTNModifica class="BTNId0"
                        @click="$emit('BTN', { Tipo: 'Modifica', IdAssistente: assistente.Id })" />
                    <BTNCestino class="BTNId0" @click="$emit('BTN', { Tipo: 'Elimina', IdAssistente: assistente.Id })"
                        :disabled="BusteDellAssistente(assistente.Id)"
                        :class="BusteDellAssistente(assistente.Id) ? 'Disabilitato' : ''" />
                </div>
            </td>
        </tr>
        <tr :class="$props.TestAggiungi ? 'FaseDiModifica' : ''">
            <CampiTabella v-if="$props.TestAggiungi" IdAggiungiModificaElimina="0" :Obj="ObjNuovo" @update="Update" />
            <td v-if="!$props.TestAggiungi" class="text-center">
                <BTNAggiungi class="BTNId0" @click="AbilitaAggiungi" />
            </td>
            <td class="w-[150px] text-center" v-if="$props.TestAggiungi">
                <BTNSalva :class="Salva(ObjNuovo, 'c')" @click="$emit('BTN', { Tipo: 'Salva' })"
                    :disabled="Salva(ObjNuovo, 'd')" />
                <BTNIndietro class="Indietro" @click="$emit('BTN', { Tipo: 'Annulla' })" />
            </td>
        </tr>
    </table>
</template>
<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import BTNModifica from '@/components/BTNModifica.vue'
import BTNCestino from '@/components/BTNCestino.vue'
import BTNSalva from '@/components/BTNSalva.vue'
import BTNIndietro from '@/components/BTNIndietro.vue'
import BTNConferma from '@/components/BTNConferma.vue'
import BTNAggiungi from '@/components/BTNAggiungi.vue'
import CampiTabella from '@/components/Assistenti/CampiTabella.vue'
import { Pinia } from '@/stores'
import { TestAzioneSalva } from '@/assets/helpers/MyMixin'

type TypeObj = {
    Id: string, 
    Nome: string, 
    Cognome: string, 
    Assunzione: string, 
    Livello: string, 
    Licenziamento_aaaammgg: string
}
export default defineComponent({
    components: {
        BTNModifica,
        BTNCestino,
        BTNSalva,
        BTNIndietro,
        BTNConferma,
        BTNAggiungi,
        CampiTabella
    },
    props: {
        Intestazione: {
            type: Array<String>,
            required: true
        },
        Collezione: {
            type: Array<any>,
            required: true
        },
        IdAggiungiModificaElimina: {
            type: String,
            required: true
        },
        TestModificaElimina: {
            type: String,
            required: true
        },
        TestAggiungi: {
            type: Boolean,
            require: true
        }
    },
    emits: ['BTN', 'update'],
    setup(props, { emit }) {
        const FirebaseBuste = Pinia.Buste()
        const Buste = FirebaseBuste.GetElencoTutte
        let ObjNuovo = ref({ Id: '0', Nome: '', Cognome: '', Assunzione: '', Livello: '', Licenziamento: '' })
        const AbilitaAggiungi = () => {
            emit('BTN', { Tipo: 'AbilitaAggiungi' })
        }
        const Update = (assistente: TypeObj) => {
            //console.log(assistente, assistente.Assunzione_aaaammgg)            
            ObjNuovo.value = {
                Id: assistente.Id,
                Nome: assistente.Nome,
                Cognome: assistente.Cognome,
                Assunzione: assistente.Assunzione_aaaammgg,
                Livello: assistente.Livello,
                Licenziamento: assistente.Licenziamento_aaaammgg
            }
            //console.log(ObjNuovo)            
            emit('update', ObjNuovo)
        }
        const Salva = computed(() => {
            return (obj: TypeObj, Tipo: string) => {
                return TestAzioneSalva(obj.Nome === '' || obj.Cognome === '' || obj.Assunzione === '' || obj.Livello === '', Tipo)
            }
        })
        const BusteDellAssistente = computed(() => {
            return (IdAssistente: string) => {
                //console.log(IdAssistente)
                const TrovaBuste = Buste.find((item) => item.IdAssistente === IdAssistente)
                if (TrovaBuste) {
                    return true
                } else {
                    return false
                }
            }
        })
        onMounted(() => {
            //console.log(Buste)            
        })
        return {
            ObjNuovo,
            AbilitaAggiungi,
            Update,
            BusteDellAssistente,
            Salva
        }
    }
})
</script>

<style lang="scss" scoped></style>