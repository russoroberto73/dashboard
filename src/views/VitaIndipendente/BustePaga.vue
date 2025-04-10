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
    let MovimentiAnno = []
    const Assistente = ElencoAssistenti.value.filter((item) => item.Id === IdAssistente.value)
    if (Assistente[0]) {
        const NomeCognome = (Assistente[0].Nome + ' ' + Assistente[0].Cognome).toUpperCase()
        //console.log(NomeCognome)
        //console.log(Assistente[0].Nome);
        if (Assistente[0].Nome==='Irina 1') {
            Assistente[0].Nome = "Irina"
            Assistente[0].Cognome = "Calancea 1"
        }
        const IdCategoriaAssistente = Pinia.Categorie().getElenco.find((item) => item.Nome === Assistente[0].Nome) ?
        Pinia.Categorie().getElenco.find((item) => item.Nome === Assistente[0].Nome).Id : ''
        //if (IdCategoriaAssistente)        
        MovimentiAnno = Pinia.Movimenti().getElenco.map((item) => {
                if (item.Data.substring(6, 10) === Anno.value.toString() && item.IdCategoria === IdCategoriaAssistente) {   
                    return { Data: item.Data, Mese: item.Data.substring(3,5), Addebiti : item.Addebiti}
                }
            
        }).filter((item) => item != undefined)
        //console.log(MovimentiAnno)
    }
    return Elenco.map((item) => {
        if (parseInt(Anno.value) === parseInt(item.Anno) && IdAssistente.value === item.IdAssistente) {
            if (PrimaBusta) {
                PrimaBusta = false
                FerieAp = Elenco.find((fa) => parseInt(Anno.value) === parseInt(fa.Anno) && IdAssistente.value === fa.IdAssistente).FerieAp
            }
            const BonificiMensili = MovimentiAnno.map((ma) => {
                if (parseInt(item.Mese) === parseInt(ma.Mese)) {
                return parseFloat(ma.Addebiti,2)
                }
            }).filter((itemundefined) => itemundefined != undefined)
            const FerieResidue = parseFloat(FerieAp) + parseFloat(item.FerieMat, 2) - parseFloat(item.FerieGod, 2)            
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
                    Value:  FerieResidue,
                    Class: "text-center",
                    ReadOnly: true
                },
                Mav: {
                    Type: 'number',
                    Value: item.Mav,
                    Class: "text-center",
                    AbilitataModifica: [0, 3, 6, 9]
                },
                ImportoBonifico: {
                    Type: 'number',
                    Value: BonificiMensili.reduce((acc, num) => acc+num,0),
                    ReadOnly: true
                }
            }
        }
    }).filter((item) => item != undefined)
})
</script>