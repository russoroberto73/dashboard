<template>
    <td v-for="n in Object.keys(item).length - 1" :key="n">
        <span v-if="IdAggiungiModificaElimina.Id === item.Id.Value">
            <textarea :disabled="IdAggiungiModificaElimina.Tipo === 'E'"
                v-if="item[Object.keys(item)[n]].type === 'textarea'" v-model="Obj[n - 1]" />
            <input :type="item[Object.keys(item)[n]].type" :disabled="IdAggiungiModificaElimina.Tipo === 'E'" v-else
                v-model="Obj[n - 1]" />
        </span>
        <span v-else>
            {{ item[Object.keys(item)[n]].Value }}
        </span>
    </td>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
    components: {
    },
    props: {
        item: {
            type: Object,
            required: true
        },
        IdAggiungiModificaElimina: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const Obj = ref()
        onMounted(() => {
            const tmp = []
            Object.keys(props.item).forEach((item: string, index: number) => {
                if (index > 0) {
                    tmp.push(props.item[item].Value)
                }
            })            
            tmp.push('')
            Obj.value = tmp
        })
        return {
            Obj
        }
    }
})
</script>
