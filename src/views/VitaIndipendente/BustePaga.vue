<template>
    <div class="relative top-[120px] text-center">
        <h1 class="text-center text-[30px]">Gestione Buste</h1>
        <div class="m-5">
            <select v-model="IdAssistente" class="p-3 m-3 rounded-[45px]">
                <option v-for="(assistente, index) in ElencoAssistenti" :key="index" :value="assistente.Id">
                    {{ assistente.Nome + ' ' + assistente.Cognome }}</option>
            </select>
            <select v-model="Anno" class="p-3 m-3 rounded-[45px]">
                <option v-for="(anno, index) in Anni" :key="index" :value="anno">
                    {{ anno }}
                </option>
            </select>
        </div>
        <Rtable :items="Items" :pinia="Pinia.Buste()" />
    </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Pinia } from '@/stores'
import Rtable from '@/components/ComponenteTabella/CostrisciTabella.vue'
import { MeseDaNumeroANome } from '@/assets/helpers/MyMixin';
const ElencoAssistenti = ref(Pinia.Assistenti().getElenco)
const Anno = ref('2024')
const Anni = ref([])
const IdAssistente = ref('')
const Elenco = ref(Pinia.Buste().getElencoTutte)

const Items = computed(() => {
    //console.log('p');    
    return Elenco.value.map((item) => {
        return {
            Id: {
                Type: 'string',
                Value: item.Id,
                Class: "text-center"
            },
            Mese: {
                Type: 'string',
                Value: MeseDaNumeroANome(item.Mese),
                Class: "text-center",
                ReadOnly: true
            },
            Netto: {
                Type: 'number',
                Value: item.Netto,
                Class: "text-center",
                Valido: 'p'
            },
            Lordo: {
                Type: 'number',
                Value: item.Lordo,
                Class: "text-center",
                Valido: 'p'
            },
            FerieAp: {
                Type: 'number',
                Value: item.FerieAp,
                Class: "text-center",
                Valido: 'p'
            },
            FerieMat: {
                Type: 'number',
                Value: item.FerieMat,
                Class: "text-center",
                Valido: 'p'
            },
            FerieGod: {
                Type: 'number',
                Value: item.FerieGod,
                Class: "text-center",
                Valido: 'p'
            },
            Mav: {
                Type: 'number',
                Value: item.Mav,
                Class: "text-center",
                AbilitataModifica: [0, 3, 6, 9]
            }
        }
    })
})

watch(Anno, (newValue) => {
    Elenco.value = Pinia.Buste().getElenco({ Anno: newValue, IdAssistente: IdAssistente.value })
})
watch(IdAssistente, (newValue) => {
    Elenco.value = Pinia.Buste().getElenco({ Anno: Anno.value, IdAssistente: newValue })
})
watch(Pinia.Buste().getElenco({ Anno: Anno.value, IdAssistente: IdAssistente }), (newValue) => {
    console.log(newValue);
})

onMounted(() => {
    setTimeout(() => {
        IdAssistente.value = Pinia.Assistenti().getPrimoIdAssistente
        Anni.value = Pinia.Buste().getAnni
        Anno.value = Anni.value[Anni.value.length - 1]
        Elenco.value = Pinia.Buste().getElenco({ Anno: Anno.value, IdAssistente: IdAssistente.value })
    }, 600)
})
</script>