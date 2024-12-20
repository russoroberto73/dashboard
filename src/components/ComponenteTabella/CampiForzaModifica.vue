<template>
    <div>
        {{ IdComboNome(item[Object.keys(item)[n]]) }}
        <span v-if="item[Object.keys(item)[n]].Value === ''">poo
            <textarea v-if="item[Object.keys(item)[n]].Type === 'textarea'" class="FaseDiModifica" />
            <select v-else-if="item[Object.keys(item)[n]].Type === 'select'" class="BTNSalva"
                v-model="select[parseInt(index)]" @change="AssegnaValoreCombo($event, 'IdCategoria', index)">
                <option v-for="(option, index) in item[Object.keys(item)[n]].Array" :value="option.value"
                    :key="index">
                    {{ option.text }}
                </option>
            </select>
            <div v-else-if="item[Object.keys(item)[n]].Type === 'boolean'">

            </div>
            <input class="w-full FaseDiModifica" v-else />
        </span>
    </div>
</template>
<script setup lang="ts">
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
        },
        index: {
            type: Number,
            required: true
        }
    }
)
const { select, Intestazione, IdAggiungiModificaElimina, TestModificaElimina, Obj, ConvertiDataInglese, BTNAzione, ClassRiga, ValidareCampi, AbilitaCampo, VerificaCampoModifica, VerificaEliminazione, AssegnaValoreCombo, IdComboNome, AggiungiRecord, VerificaEsiste } = mymixin(props)

</script>