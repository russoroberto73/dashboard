<template>
    <td>
        <span v-if="Obj.Id === '0'">
            <input type="text" v-model="Assistenteinterno.Nome" class="text-center"
                @input="$emit('update', Assistenteinterno)" />
        </span>
        <span v-else>
            <input type="text" v-if="IdAggiungiModificaElimina === Obj.Id" v-model="Assistenteinterno.Nome"
                @input="$emit('update', Assistenteinterno)" />
            <span v-else>{{ Assistenteinterno.Nome }}</span>
        </span>
    </td>
    <td>
        <input v-if="IdAggiungiModificaElimina === Obj.Id" v-model="Assistenteinterno.Cognome" class="w-full"
            @input="$emit('update', Assistenteinterno)" />
        <span v-else>{{ Assistenteinterno.Cognome }}</span>
    </td>
    <td>
        <input type="date" v-if="IdAggiungiModificaElimina === Obj.Id" v-model="Assistenteinterno.Assunzione_aaaammgg"
            @input="$emit('update', Assistenteinterno)" />
        <span v-else>{{ Assistenteinterno.Assunzione_ggmmaaaa }}</span>
    </td>
    <td>
        <input type="text" v-if="IdAggiungiModificaElimina === Obj.Id" v-model="Assistenteinterno.Livello"
            @input="$emit('update', Assistenteinterno)" />
        <span v-else>{{ Assistenteinterno.Livello }}</span>
    </td>
    <td>
        <span v-if="IdAggiungiModificaElimina === Obj.Id">
            <input type="date" v-model="Assistenteinterno.Licenziamento_aaaammgg"
                @input="$emit('update', Assistenteinterno)" v-if="Obj.Id != 0 " />
        </span>
        <span v-else>{{ Assistenteinterno.Licenziamento_ggmmaaaa }}</span>
    </td>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { Data_ggmmaaaa_aaaammgg } from '@/assets/helpers/MyMixin';

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
        //console.log(props.Obj.Id)        
        const DataOggi = new Date()
        const aaaa = DataOggi.getFullYear()
        let mm: number | string = DataOggi.getMonth() + 1
        let gg: number | string = DataOggi.getDate()
        if (mm < 10) {
            mm ="0" + mm
        }
        if (gg < 10) {
            gg = "0" + gg
        }
        //console.log(aaaa, mm, gg)        
        const Assistenteinterno = ref({
            Id: props.Obj.Id,
            Nome: props.Obj.Nome,
            Cognome: props.Obj.Cognome,
            Assunzione_aaaammgg: props.Obj.Id === '0' ? aaaa + '-'+ mm + '-' + gg : Data_ggmmaaaa_aaaammgg(props.Obj.Assunzione),
            Assunzione_ggmmaaaa: props.Obj.Assunzione,
            Livello: props.Obj.Livello,
            Licenziamento_aaaammgg: props.Obj.Licenziamento === 'vuoto' ? '' : Data_ggmmaaaa_aaaammgg(props.Obj.Licenziamento),
            Licenziamento_ggmmaaaa: props.Obj.Licenziamento === 'vuoto' ? '' : props.Obj.Licenziamento,
        })
        onMounted(() => {
            // Assistenti
            //console.log(Assistenteinterno.value)

        })
        return {
            Assistenteinterno
        }
    }
})        
</script>
<style lang="scss" scoped>
</style>