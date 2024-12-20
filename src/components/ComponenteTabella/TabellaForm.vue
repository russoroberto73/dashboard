<template>
    <td>
        <span v-if="item.Id.Value === 'soloinserimento'">
            <span v-if="Check==='BTNSalva'">
                <span v-if="IdAggiungiModificaElimina === item.Id.Value"> <!-- Crea Colonne form-->
                <CampiModifica :item="item" :n="n" :index="index"
                    v-if="item[Object.keys(item)[n]].Visibile != 'hidden'" />
                <BTNAbilitaCampo :item="item" :n="n" v-else-if="TestModificaElimina === 'M'" />
            </span>
            <div v-else :class="item[Object.keys(item)[n]].Class"> <!-- lettura-->
                <CampiForzaModifica :item="item" :n="n" :index="parseInt(index)"
                    v-if="item[Object.keys(item)[n]].ForzaModifica" />
                <Lettura :item="item" :n="n" v-else />
            </div>    
            </span>
            <div v-else-if="n<6" class="bg-green-500 h-[50px]">
                {{item[Object.keys(item)[n]].Value}}
            </div>
        </span>
        <span v-else>
            <span v-if="IdAggiungiModificaElimina === item.Id.Value"> <!-- Crea Colonne form-->
                <CampiModifica :item="item" :n="n" :index="index"
                    v-if="item[Object.keys(item)[n]].Visibile != 'hidden'" />
                <BTNAbilitaCampo :item="item" :n="n" v-else-if="TestModificaElimina === 'M'" />
            </span>
            <div v-else :class="item[Object.keys(item)[n]].Class"> <!-- lettura-->
                <CampiForzaModifica :item="item" :n="n" :index="parseInt(index)"
                    v-if="item[Object.keys(item)[n]].ForzaModifica" />
                <Lettura :item="item" :n="n" v-else />
            </div>
        </span>
    </td>
</template>
<script setup lang="ts">
import { mymixin } from './Script'

import Lettura from './Lettura.vue'
import CampiForzaModifica from './CampiForzaModifica.vue'
import CampiModifica from './CampiModifica.vue'
import BTNAbilitaCampo from './BTNAbilitaCampo.vue'

const props = defineProps(
    {
        item: {
            type: Object,
            required: true
        },
        n: {
            type: Number,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        IdAggiungiModificaElimina: {
            type: String,
            required: true
        },
        Check: {
            type: String,
            required: false
        }
    }
)
const { select, Intestazione, TestModificaElimina, Obj, ConvertiDataInglese, BTNAzione, ClassRiga, ValidareCampi, AbilitaCampo, VerificaCampoModifica, VerificaEliminazione, AssegnaValoreCombo, IdComboNome, AggiungiRecord, VerificaEsiste } = mymixin(props)

</script>

<style lang="scss" scoped>
td {
    @apply p-1;
}
</style>