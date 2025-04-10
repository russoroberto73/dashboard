<template>
    <table>
        <tr>
            <th v-for="(etichetta, index) in Intestazione" :key="index">{{ etichetta }}</th>
            <th>Azione</th>
        </tr>
        <tr v-for="(frase, index) in Collezione" :key="index" :class="ClassRiga(frase.Id)">
            <CampiTabella :IdAggiungiModificaElimina="IdAggiungiModificaElimina" :Obj="frase"
                            :TestModificaElimina="TestModificaElimina" @update="Update"  />
            <slot name="data" :item="frase"></slot>
            <td class="w-[150px] text-center">
                <div class="hidden">
                    {{ ProssimaData }}
                    IdAggiungiModificaElimina: {{ IdAggiungiModificaElimina }}<br />
                    FraseId: {{ frase.Id }}<br />
                    Frase: {{ frase }}<br />
                    Test: {{ TestModificaElimina }}<br />
                    TestAggiungi: {{ TestAggiungi }}<br />
                </div>
                <div v-if="frase.Id === IdAggiungiModificaElimina && TestModificaElimina === 'M'">
                    <BTNSalva :class="Salva(ObjNuovo, 'c')" @click="$emit('BTN', { Tipo: 'Salva' })"
                        :disabled="Salva(ObjNuovo, 'd')" />
                    <BTNIndietro class="Indietro" @click="$emit('BTN', { Tipo: 'Annulla' })" />
                </div>
                <div v-else-if="(
                    (IdAggiungiModificaElimina.length === 0 && frase.Id === '0') ||
                    (IdAggiungiModificaElimina.length > 0 && frase.Id === '0')
                )">
                    <BTNAggiungi class="BTNId0" @click="$emit('BTN', { Tipo: 'Aggiungi' })" />
                </div>
                <div v-else-if="frase.Id === IdAggiungiModificaElimina && TestModificaElimina === 'E'">
                    <BTNConferma class="Conferma"
                        @click="$emit('BTN', { Tipo: 'EliminaDefinitivamente', Id: frase.Id })" />
                    <BTNIndietro class="Indietro" @click="$emit('BTN', { Tipo: 'Annulla' })" />
                </div>
                <div v-else-if="TestModificaElimina != 'I'">
                    <BTNModifica class="BTNId0" @click="$emit('BTN', { Tipo: 'Modifica', Id: frase.Id })" />
                    <BTNCestino class="BTNId0" @click="$emit('BTN', { Tipo: 'Elimina', Id: frase.Id })" />
                </div>
            </td>
        </tr>
        <tr :class="TestAggiungi ? 'FaseDiModifica' : ''">
            <CampiTabella v-if="TestAggiungi" IdAggiungiModificaElimina="0" :Obj="ObjNuovo" @update="Update" />
            <td v-if="!TestAggiungi" class="text-center">
                <BTNAggiungi class="BTNId0" @click="AbilitaAggiungi" />
            </td>
            <td class="w-[150px] text-center" v-if="TestAggiungi">
                <BTNSalva :class="Salva(ObjNuovo, 'c')" @click="$emit('BTN', { Tipo: 'Salva' })"
                    :disabled="Salva(ObjNuovo, 'd')" />
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
import { Data_aaaammgg_ggmmaaaa, Data_ggmmaaaa_aaaammgg, Data_NewDate_ggmmaaaa, TestAzioneSalva } from '@/assets/helpers/MyMixin'

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
        const Update = (frase: { Id: string, Data_aaaammgg: string, Frase: string, Firma: string }) => {
            ObjNuovo.value = {
                Id: frase.Id,
                Data: Data_aaaammgg_ggmmaaaa(frase.Data_aaaammgg),
                Frase: frase.Frase,
                Firma: frase.Firma
            }
            emit('update', ObjNuovo)
        }
        const Salva = computed(() => {
            return (obj: { Data: string, Frase: string }, Tipo: string) => {
                return TestAzioneSalva(obj.Data === '' || obj.Frase === '', Tipo)
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
            Update,
            Salva,
            ProssimaData,
            ClassRiga
        }
    }
})
</script>