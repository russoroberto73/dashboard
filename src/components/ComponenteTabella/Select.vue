<template>
    <select :value="Use().ObjStore[Object.keys(Use().ItemsStore[0])[n]]"
        @change="AssegnaValoreCombo($event, Object.keys(Use().ItemsStore[0])[n])" :class="item[Object.keys(item)[n]].Class">
        <option v-for="(option, index) in item[Object.keys(item)[n]].Array" :key="index" :value="option.value">
            {{ option.text }}
        </option>
    </select>
</template>
<script setup lang="ts">
import { Use } from '@/stores/modules/CostruisciTabella.module'
import { mymixin } from './Script'

const props = defineProps(
    {
        item: {
            type: Object,
            required: true
        },        
        n: {
            type: Number,
            required: true
        }
    }
)

const { select, Intestazione, IdAggiungiModificaElimina, TestModificaElimina, Obj, ConvertiDataInglese, BTNAzione, ClassRiga, ValidareCampi, AbilitaCampo, VerificaCampoModifica, VerificaEliminazione, AssegnaValoreCombo, IdComboNome, AggiungiRecord, VerificaEsiste } = mymixin(props)

</script>