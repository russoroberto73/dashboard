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
import { ref, computed, onBeforeMount } from 'vue'
import { Pinia } from '@/stores'
import Rtable from '@/components/ComponenteTabella/CostruisciTabella.vue'
import { MeseDaNumeroANome } from '@/assets/helpers/MyMixin';
const ElencoAssistenti = ref(Pinia.Assistenti().getElenco)
const Anno = ref((new Date()).getFullYear())
const IdAssistente = ref('-NebD03dXnKdotbirMos')
const Elenco = Pinia.Buste().getElenco

const Anni = computed(() => {
    return [
        ...new Set(
          Pinia.Buste().getElenco.map((item) => {
            return parseInt(item.Anno)
          }).sort()
        )
      ]
})

const Items = computed(() => {
    let PrimaBusta = true
    let FerieAp = 0

    return Elenco.map((item) => {
        if (parseInt(Anno.value) === parseInt(item.Anno) && IdAssistente.value === item.IdAssistente) {            
            if (PrimaBusta) {
                PrimaBusta = false
                FerieAp = Elenco.find((fa) => parseInt(Anno.value) === parseInt(fa.Anno) && IdAssistente.value === fa.IdAssistente).FerieAp
                console.log(FerieAp)                
            }
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
                    Value: FerieAp,
                    Class: "text-center",
                    AbilitataModifica: [0]
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
                FerieResidue: {
                    Type: 'number',
                    Value: FerieAp + item.FerieMat - item.FerieGod,
                    Class: "text-center",
                    ReadOnly: true
                },
                Mav: {
                    Type: 'number',
                    Value: item.Mav,
                    Class: "text-center",
                    AbilitataModifica: [0, 3, 6, 9]
                }
            }
        }
    }).filter((item) => item != undefined)
})
/*
watch(Anno, (newValue) => {
    Elenco.value = Pinia.Buste().getElenco({ Anno: newValue, IdAssistente: IdAssistente.value })
})
watch(IdAssistente, (newValue) => {
    Elenco.value = Pinia.Buste().getElenco({ Anno: Anno.value, IdAssistente: newValue })
})
watch(Pinia.Buste().getElenco({ Anno: Anno.value, IdAssistente: IdAssistente }), (newValue) => {
    console.log(newValue)
    //IdAssistente.value = Pinia.Assistenti().getPrimoIdAssistente
    Anni.value = Pinia.Buste().getAnni
    //Anno.value = Anni.value[Anni.value.length - 1]
})
*/
onBeforeMount(() => {
    setTimeout(() => {
        //IdAssistente.value = Pinia.Assistenti().getPrimoIdAssistente
        //Anni.value = Pinia.Buste().getAnni
        //Anno.value = Anni.value[Anni.value.length - 1]
        //Elenco.value = Pinia.Buste().getElenco({ Anno: Anno.value, IdAssistente: IdAssistente.value })
    }, 600)
})
</script>