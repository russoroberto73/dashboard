<template>
    
    <td>
        <span>
            {{BustaInterna.Anno}}
        </span>
    </td>
    <td>
        <span v-if="Obj.Id === '0'">
            {{MeseDaNumeroANome(BustaInterna.Mese)}}
        </span>
        <span v-else>
            {{ MeseDaNumeroANome(BustaInterna.Mese) }}
        </span>
    </td>
    <td>
        <input type="number" v-if="IdAggiungiModificaElimina === Obj.Id" v-model="BustaInterna.Netto"
            @input="$emit('update', BustaInterna)" />
        <span v-else>
            {{ BustaInterna.Netto }}
        </span>
    </td>
    <td>
        <input type="number" v-if="IdAggiungiModificaElimina === Obj.Id" v-model="BustaInterna.Lordo"
            @input="$emit('update', BustaInterna)" />
        <span v-else>
            {{ BustaInterna.Lordo }}
        </span>
    </td>
    <td>
        <input type="number" v-if="IdAggiungiModificaElimina === Obj.Id" v-model="BustaInterna.FerieAp"
            @input="$emit('update', BustaInterna)" />
        <span v-else>
            {{ BustaInterna.FerieAp }}
        </span>
    </td>
    <td>
        <input type="number" v-if="IdAggiungiModificaElimina === Obj.Id" v-model="BustaInterna.FerieMat"
            @input="$emit('update', BustaInterna)" />
        <span v-else>
            {{ BustaInterna.FerieMat }}
        </span>
    </td>
    <td>
        <input type="number" v-if="IdAggiungiModificaElimina === Obj.Id" v-model="BustaInterna.FerieGod"
            @input="$emit('update', BustaInterna)" />
        <span v-else>
            {{ BustaInterna.FerieGod }}
        </span>
    </td>
    <td>
        <input type="number" v-if="IdAggiungiModificaElimina === Obj.Id" v-model="BustaInterna.Mav"
            @input="$emit('update', BustaInterna)" />
        <span v-else>
            {{ BustaInterna.Mav }}
        </span>
    </td>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { MeseDaNumeroANome } from '@/assets/helpers/MyMixin';
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
        }
    },
    emits: ['update'],
    setup(props) {
        const BustaInterna = ref({
            Id: props.Obj.Id,
            Anno: props.Obj.Anno,
            Mese: props.Obj.Mese,
            Netto: props.Obj.Netto,
            Lordo: props.Obj.Lordo,
            FerieAp: props.Obj.FerieAp,
            FerieMat: props.Obj.FerieMat,
            FerieGod: props.Obj.FerieGod,
            FerieResidue: props.Obj.FerieResidue,
            Mav: props.Obj.Mav
        })
        onMounted(() => {
            BustaInterna.value = {
                Anno: props.Obj.Anno,
                Id: props.Obj.Id,
                Mese: props.Obj.Mese,
                Netto: props.Obj.Netto,
                Lordo: props.Obj.Lordo,
                FerieAp: props.Obj.FerieAp,
                FerieMat: props.Obj.FerieMat,
                FerieGod: props.Obj.FerieGod,
                FerieResidue: props.Obj.FerieResidue,
                Mav: props.Obj.Mav
            }
        })
        watch(() => props.Obj, (newValue) => {
            BustaInterna.value = {
                Anno: props.Obj.Anno,
                Id: newValue.Id,
                Mese: newValue.Mese,
                Netto: newValue.Netto,
                Lordo: newValue.Lordo,
                FerieAp: newValue.FerieAp,
                FerieMat: newValue.FerieMat,
                FerieGod: newValue.FerieGod,
                FerieResidue: newValue.FerieResidue,
                Mav: newValue.Mav
            }
        })
        return {
            MeseDaNumeroANome,
            BustaInterna
        }
    }
})
</script>
<style lang="">

</style>