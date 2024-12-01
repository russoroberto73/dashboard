<template>
    <table>
        <tr>
            <th v-for="(etichetta, index) in $props.Intestazione" :key="index">{{ etichetta }}</th>
            <th>Azione</th>
        </tr>
        <tr v-for="(frase, index) in Collezione" :key="index"
            :class="IdAggiungiModificaElimina === frase.Id ? 'FaseDiModifica' : ''">
            <CampiTabella :IdAggiungiModificaElimina="IdAggiungiModificaElimina" :Obj="frase" @update="Update" />
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
                    <BTNSalva :class="Salva(frase)" @click="$emit('BTN', { Tipo: 'Salva' })" :disabled="frase == ''" />
                    <BTNIndietro class="bg-red-500" @click="$emit('BTN', { Tipo: 'Annulla' })" />
                </div>
                <div v-else-if="(
                    (IdAggiungiModificaElimina.length === 0 && frase.Id === '0') ||
                    (IdAggiungiModificaElimina.length > 0 && frase.Id === '0')
                )">
                    <BTNAggiungi class="BTNId0" @click="$emit('BTN', { Tipo: 'Aggiungi' })" />
                </div>
                <div v-else-if="frase.Id === IdAggiungiModificaElimina && TestModificaElimina === 'E'">
                    <BTNConferma class="bg-green-300"
                        @click="$emit('BTN', { Tipo: 'EliminaDefinitivamente', IdFrase: frase.Id })" />
                    <BTNIndietro class="bg-white" @click="$emit('BTN', { Tipo: 'Annulla' })" />
                </div>
                <div v-else-if="TestModificaElimina != 'I'">
                    <BTNModifica class="BTNId0" @click="$emit('BTN', { Tipo: 'Modifica', IdFrase: frase.Id })" />
                    <BTNCestino class="BTNId0" @click="$emit('BTN', { Tipo: 'Elimina', IdFrase: frase.Id })" />
                </div>
            </td>
        </tr>
        <tr :class="$props.TestAggiungi ? 'FaseDiModifica' : ''">
            <CampiTabella v-if="$props.TestAggiungi" IdAggiungiModificaElimina="0" :Obj="ObjNuovo" @update="Update" />
            <td v-if="!$props.TestAggiungi" class="text-center">
                <BTNAggiungi class="BTNId0" @click="AbilitaAggiungi" />
            </td>
            <td class="w-[150px] text-center" v-if="$props.TestAggiungi">
                <BTNSalva :class="Salva(ObjNuovo)" @click="$emit('BTN', { Tipo: 'Salva' })"
                    :disabled="ObjNuovo.Frase == ''" />
                <BTNIndietro class="bg-white" @click="$emit('BTN', { Tipo: 'Annulla' })" />
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
import CampiTabella from '@/components/CalendarioFilosofico/CampiTabella.vue'
import { Data_ggmmaaaa_aaaammgg, Data_NewDate_ggmmaaaa } from '@/assets/helpers/MyMixin'

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
            ObjNuovo.value.Data = ProssimaData.value
            emit('BTN', { Tipo: 'AbilitaAggiungi' })
        }
        const Update = (frase: { Id: string, Data_ggmmaaaa: string, Frase: string, Firma: string }) => {
            ObjNuovo.value = {
                Id: frase.Id,
                Data: frase.Data_ggmmaaaa,
                Frase: frase.Frase,
                Firma: frase.Firma
            }
            emit('update', ObjNuovo)
        }
        const Salva: any = computed(() => {
            return (Frase: string) => {
                return Frase === '' ? 'bg-gray-300' : 'bg-green-300'
            }
        })
        onMounted(() => {
        })
        return {
            ObjNuovo,
            AbilitaAggiungi,
            Update,
            Salva,
            ProssimaData
        }
    }
})
</script>

<style lang="scss" scoped>
th {
    @apply px-[50px];
}

button {
    @apply m-2 p-2 rounded-[45px] w-[30px];
}

.BTNId0 {
    @apply bg-yellow-400;
}

.FaseDiModifica {
    @apply bg-green-500;
}
</style>