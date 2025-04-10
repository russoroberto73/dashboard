<template>
    <table>
        <tr>
            <th v-for="(etichetta, index) in Intestazione" :key="index">{{ etichetta }}</th>
            <th>Azione</th>
        </tr>
        <tr v-for="(item, index) in Collezione" :key="index" :class="ClassRiga(item.Id)">
            <slot name="data" :item="item"></slot>
            <td class="w-[150px] text-center">
                <div class="hidden">
                    {{ ProssimaData }}
                    IdAggiungiModificaElimina: {{ IdAggiungiModificaElimina }}<br />
                    FraseId: {{ item.Id }}<br />
                    Frase: {{ item }}<br />
                    Test: {{ TestModificaElimina }}<br />
                    TestAggiungi: {{ TestAggiungi }}<br />
                </div>
                <div v-if="item.Id === IdAggiungiModificaElimina && TestModificaElimina === 'M'">
                    <BTNSalva :class="ControllaCampiVuoti('c')" @click="$emit('BTN', { Tipo: 'Salva' })"
                        :disabled="ControllaCampiVuoti('d')" />
                    <BTNIndietro class="Indietro" @click="$emit('BTN', { Tipo: 'Annulla' })" />
                </div>
                <div v-else-if="(
                    (IdAggiungiModificaElimina.length === 0 && item.Id === '0') ||
                    (IdAggiungiModificaElimina.length > 0 && item.Id === '0')
                )">
                    <BTNAggiungi class="BTNId0" @click="$emit('BTN', { Tipo: 'Aggiungi' })" />
                </div>
                <div v-else-if="item.Id === IdAggiungiModificaElimina && TestModificaElimina === 'E'">
                    <BTNConferma class="Conferma"
                        @click="$emit('BTN', { Tipo: 'EliminaDefinitivamente', Id: item.Id })" />
                    <BTNIndietro class="Indietro" @click="$emit('BTN', { Tipo: 'Annulla' })" />
                </div>
                <div v-else-if="TestModificaElimina != 'I'">
                    <BTNModifica class="BTNId0" @click="$emit('BTN', { Tipo: 'Modifica', Id: item.Id })" />
                    <BTNCestino class="BTNId0" @click="$emit('BTN', { Tipo: 'Elimina', Id: item.Id })" />
                </div>
            </td>
        </tr>
        <tr :class="TestAggiungi ? 'FaseDiModifica' : ''">
            <slot name="aggiungi" :ElementoVuoto="{ Id: '0', Data: ProssimaData, Frase: '', Firma: ''}" v-if="TestAggiungi" />
            <td v-if="!TestAggiungi" class="text-center">
                <BTNAggiungi class="BTNId0" @click="AbilitaAggiungi" />
            </td>
            <td class="w-[150px] text-center" v-if="TestAggiungi">
                <BTNSalva :class="ControllaCampiVuoti('c')" @click="$emit('BTN', { Tipo: 'Salva' })"
                    :disabled="ControllaCampiVuoti('d')" />
                <BTNIndietro class="Indietro" @click="$emit('BTN', { Tipo: 'Annulla' })" />
            </td>
        </tr>        
    </table>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import BTNModifica from '@/components/BTNModifica.vue'
import BTNCestino from '@/components/BTNCestino.vue'
import BTNSalva from '@/components/BTNSalva.vue'
import BTNIndietro from '@/components/BTNIndietro.vue'
import BTNConferma from '@/components/BTNConferma.vue'
import BTNAggiungi from '@/components/BTNAggiungi.vue'
import CampiTabella from '@/components/CalendarioFilosofico/CampiTabella.vue'
import { Data_ggmmaaaa_aaaammgg, Data_NewDate_ggmmaaaa, TestAzioneSalva } from '@/assets/helpers/MyMixin'

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
        },
        ObjNuovo0: {
            type: Object,
            required: true
        }
    },
    emits: ['BTN', 'update'],
    setup(props, { emit }) {
        const ProssimaData = computed(() => {
            const UltimaFrase = props.Collezione[props.Collezione.length - 1]
            if (UltimaFrase) {
                const UltimaData = new Date(Data_ggmmaaaa_aaaammgg(UltimaFrase.Data))
                const ProssimaData = new Date(UltimaData.setDate(UltimaData.getDate() + 1))
                return (Data_NewDate_ggmmaaaa(new Date(ProssimaData)))
            } else {
                return ''
            }
        })
        let ObjNuovo = ref({ Id: '0', Data: '', Frase: '', Firma: '' })
        const AbilitaAggiungi = () => {
            ObjNuovo.value = { Id: '0', Data: ProssimaData.value, Frase: '', Firma: '' }
            emit('BTN', { Tipo: 'AbilitaAggiungi' })
        }
        const ControllaCampiVuoti = computed(() => {
            return (Tipo: string) => {
                const Condizione = props.ObjNuovo0.Data === '' || props.ObjNuovo0.Frase === ''
                return TestAzioneSalva(Condizione, Tipo)                
            }
        })
        const ClassRiga = computed(() => {
            return (Id: string) => {
                return props.IdAggiungiModificaElimina === Id ? props.TestModificaElimina === 'E' ? 'FaseDiElimina' : 'FaseDiModifica' : ''
            }
        })
        return {
            ObjNuovo,
            AbilitaAggiungi,
            ControllaCampiVuoti,
            ProssimaData,
            ClassRiga
        }
    }
})
</script>