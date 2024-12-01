<template>
   <td class="text-center">
        <span v-if="Obj.Id === '0'">
            <input type="date" v-model="FraseInterna.Data_aaaammgg" class="text-center mx-3" @input="$emit('update', FraseInterna)" style="text-align: center;" :disabled="TestModificaElimina ===  'E'" />
        </span>
        <span v-else>
            <input type="date" v-if="IdAggiungiModificaElimina === Obj.Id" class="text-center mx-3" v-model="FraseInterna.Data_aaaammgg" @input="$emit('update', FraseInterna)" :disabled="TestModificaElimina ===  'E'" />
            <span v-else>{{ Data_aaaammgg_ggmmaaaa(FraseInterna.Data_aaaammgg) }}</span>
        </span>
    </td>
    <td class="text-left">
        <textarea v-if="IdAggiungiModificaElimina === Obj.Id" v-model="FraseInterna.Frase" class="w-full" :disabled="TestModificaElimina ===  'E'"
            @input="$emit('update', FraseInterna)" />
        <span v-else>{{ FraseInterna.Frase }}</span>
    </td>
    <td>
        <input type="text" v-if="IdAggiungiModificaElimina === Obj.Id" v-model="FraseInterna.Firma" :disabled="TestModificaElimina ===  'E'"
            @input="$emit('update', FraseInterna)" />
        <span v-else>{{ FraseInterna.Firma }}</span>
    </td>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Data_ggmmaaaa_aaaammgg, Data_aaaammgg_ggmmaaaa } from '@/assets/helpers/MyMixin';
export default defineComponent({
    props: {     
        Obj: {
            type: Object,
            required: true
        },        
        IdAggiungiModificaElimina: {
            type: String,
            required: false,
            default: "0"
        },
        TestModificaElimina: {
            type: String,
            require: true
        }
    },
    emits: ['update'],
    setup(props) {
        const FraseInterna = ref({
            Id: props.Obj.Id,
            Data_aaaammgg: Data_ggmmaaaa_aaaammgg(props.Obj.Data),
            Frase: props.Obj.Frase,
            Firma: props.Obj.Firma
        })

        return {
            FraseInterna,
            Data_aaaammgg_ggmmaaaa
        }
    }
})        
</script>
<style lang="scss">

</style>