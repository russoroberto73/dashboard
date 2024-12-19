<template>
    <button @click="AggiungiRecord(item, index)">
        <BTNSalva class="BTNAzione BTNSalva" :disabled="SelectIndex"
            :class="SelectIndex ? 'BTNDisabilitato' : 'BTNSalva'"
            v-if="ControllaCampoSoloInserimento(item)" />
        <BTNSalva class="BTNAzione" v-else :class="VerificaEsiste(item, Use().ItemsStore)" />
    </button>
</template>
<script setup lang="ts">
import { Use } from '@/stores/modules/CostruisciTabella.module'
import { mymixin } from './Script'
import BTNSalva from './IconeSvg/Salva.vue'
const props = defineProps(
    {
        item: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        SelectIndex: {
            type: Boolean,
            required: true
        }
    }
)
const { select, Intestazione, IdAggiungiModificaElimina, TestModificaElimina, Obj, ConvertiDataInglese, BTNAzione, ClassRiga, ValidareCampi, AbilitaCampo, VerificaCampoModifica, VerificaEliminazione, AssegnaValoreCombo, IdComboNome, AggiungiRecord, VerificaEsiste, ControllaCampoSoloInserimento } = mymixin(props)

</script>