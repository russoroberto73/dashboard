<template>
    <div>
        <table>
            <tr>
                <th v-for="(etichetta, index) in Intestazione" :key="index">{{ etichetta }}</th>
                <th>Azione</th>
            </tr>
            <tr v-for="(busta, index) in Collezione" :key='index'
                :class="IdAggiungiModificaElimina === busta.Id ? TestModificaElimina === 'E' ? 'FaseDiElimina' : 'FaseDiModifica' : ''">
                <CampiTabella :IdAggiungiModificaElimina="IdAggiungiModificaElimina" :Obj="busta" />
                <td class="w-[150px] text-center">
                    <div class="hidden">
                        IdAggiungiModificaElimina: {{ IdAggiungiModificaElimina }}<br />
                        busta: {{ busta }}<br />
                        Test: {{ TestModificaElimina }}<br />
                        TestAggiungi: {{ TestAggiungi }}<br />
                    </div>
                    <div v-if="busta.Id === IdAggiungiModificaElimina && TestModificaElimina === 'M'">
                        <BTNSalva :class="Salva(busta)" @click="$emit('BTN', { Tipo: 'Salva' })" />
                        <BTNIndietro class="Indietro" @click="$emit('BTN', { Tipo: 'Annulla' })" />
                    </div>
                    <div v-else-if="(
                        (IdAggiungiModificaElimina.length === 0 && busta.Id === '0') ||
                        (IdAggiungiModificaElimina.length > 0 && busta.Id === '0')
                    )">
                        <BTNAggiungi class="BTNId0" @click="$emit('BTN', { Tipo: 'Aggiungi' })" />
                    </div>
                    <div v-else-if="busta.Id === IdAggiungiModificaElimina && TestModificaElimina === 'E'">
                        <BTNConferma class="Conferma"
                            @click="$emit('BTN', { Tipo: 'EliminaDefinitivamente', IdBusta: busta.Id })" />
                        <BTNIndietro class="Indietro" @click="$emit('BTN', { Tipo: 'Annulla' })" />
                    </div>
                    <div v-else-if="TestModificaElimina != 'I'">
                        <BTNModifica class="BTNId0" @click="$emit('BTN', { Tipo: 'Modifica', IdBusta: busta.Id })" />
                        <BTNCestino class="BTNId0" @click="$emit('BTN', { Tipo: 'Elimina', IdBusta: busta.Id })" />
                    </div>
                </td>
            </tr>
            <tr :class="$props.TestAggiungi ? 'FaseDiModifica' : ''">
                <CampiTabella v-if="$props.TestAggiungi" IdAggiungiModificaElimina="0" :Obj="ObjNuovo"
                    @update="Update" />
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
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import BTNModifica from '@/components/BTNModifica.vue'
import BTNCestino from '@/components/BTNCestino.vue'
import BTNSalva from '@/components/BTNSalva.vue'
import BTNIndietro from '@/components/BTNIndietro.vue'
import BTNConferma from '@/components/BTNConferma.vue'
import BTNAggiungi from '@/components/BTNAggiungi.vue'
import CampiTabella from '@/components/BustePaga/CampiTabella.vue'
import { Pinia } from '@/stores'

type TypeObj = { 
    Id: string, 
    Anno: number, 
    Mese: number, 
    Netto: number, 
    Lordo: number, 
    FerieAp: number, 
    FerieMat: number, 
    FerieGod: number, 
    FerieResidue: number, 
    Mav: number 
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
        const ProssimoMese = () => {
            return Pinia.Buste().GetProssimoMese
        }
        let ObjNuovo = ref({
            Id: "0",
            Anno: 0,
            Mese: 0,
            Netto: 0,
            Lordo: 0,
            FerieAp: 0,
            FerieMat: 0,
            FerieGod: 0,
            FerieResidue: 0,
            Mav: 0
        })
        const Update = (busta: TypeObj) => {
            //console.log(busta)
            ObjNuovo.value = {
                Id: busta.Id,
                Anno: busta.Anno,
                Mese: busta.Mese,
                Netto: busta.Netto,
                Lordo: busta.Lordo,
                FerieAp: busta.FerieAp,
                FerieMat: busta.FerieMat,
                FerieGod: busta.FerieGod,
                FerieResidue: busta.FerieResidue,
                Mav: busta.Mav
            }
            emit('update', ObjNuovo)
        }

        const AbilitaAggiungi = () => {
            emit('BTN', { Tipo: 'AbilitaAggiungi' })
        }
        const Salva = computed(() => {
            return (obj: TypeObj, Tipo: string) => {
                if (obj.Netto === '' || obj.Lordo === '' || obj.FerieMat === '' || obj.FerieGod === '') {
                    return Tipo==='d' ? true : 'Disabilitato'
                } else {
                    return Tipo==='d' ? false : 'Salva'
                }
            }
        })
        onMounted(() => {
            setTimeout(() => {
                ObjNuovo.value.Mese = ProssimoMese().ProssimoMese
                ObjNuovo.value.Anno = ProssimoMese().ProssimoAnno
            }, 200)
        })
        return {
            ObjNuovo,
            AbilitaAggiungi,
            Update,
            Salva
        }
    },
})
</script>
<style lang="scss">
th {
    @apply px-[50px];
}

button {
    @apply m-2 p-2 rounded-[45px] w-[30px];
}

.BTNId0 {
    @apply bg-yellow-400;
}
</style>