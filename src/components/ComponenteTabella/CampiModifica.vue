<template>
    <div>
        <span v-if="!item[Object.keys(item)[n]].ReadOnly">
            <span v-if="abc">
                <Textarea :item="item" :n="n" v-if="item[Object.keys(item)[n]].Type === 'textarea'" />
                <Select :item="item" :n="n" v-else-if="item[Object.keys(item)[n]].Type === 'select'" />
                <Tooltip :n="n" v-else-if="item[Object.keys(item)[n]].Type === 'boolean'" />
                <input :Type="item[Object.keys(item)[n]].Type" :disabled="TestModificaElimina === 'E'" v-else
                    v-model="Use().ObjStore[Object.keys(Use().ItemsStore[0])[n]]"
                    :class="item[Object.keys(item)[n]].Class" />
            </span>            
        <span v-else>
            {{ item[Object.keys(item)[n]].Value }}
        </span>
        </span>
        <span v-else>
            {{ item[Object.keys(item)[n]].Value }}
        </span>
    </div>
</template>
<script setup lang="ts">
import { mymixin } from './Script'
import { Use } from '@/stores/modules/CostruisciTabella.module'
import Textarea from './Textarea.vue'
import Select from './Select.vue'
import Tooltip from './Tooltip.vue'
import { computed } from 'vue'

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
    }
)
const { select, Intestazione, IdAggiungiModificaElimina, TestModificaElimina, Obj, ConvertiDataInglese, BTNAzione, ClassRiga, ValidareCampi, AbilitaCampo, VerificaCampoModifica, VerificaEliminazione, AssegnaValoreCombo, IdComboNome, AggiungiRecord, VerificaEsiste } = mymixin(props)

const abc = computed(() => {
    let tmp = true
    if (props.item[Object.keys(props.item)[props.n]].AbilitataModifica) {
        if (!props.item[Object.keys(props.item)[props.n]].AbilitataModifica.includes(props.index)) {
            tmp = false
        }
    }
    return tmp
})

</script>

<style lang="scss" scoped>
textarea,
input {
    margin: 10px !important;
}
</style>