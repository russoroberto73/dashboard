<template>
    <div id="FormTabella">
        <table>
            <tr>
                <template v-for="(etichetta, index) in Intestazione">
                    <th v-if="index > 0">
                        {{ etichetta }}
                    </th>
                </template>
                <th>
                    Azione
                </th>
            </tr>
            <template v-for="(item, index) in items" :key="index">
                <tr v-if="parseInt(index) < items.length" :class="ClassRiga(item.Id.Value)">
                    <td v-for="n in Object.keys(item).length - 1" :key="n" :class="item[Object.keys(item)[n]].Class">
                        <span v-if="IdAggiungiModificaElimina === item.Id.Value">
                            <textarea :disabled="TestModificaElimina === 'E'"
                                v-if="item[Object.keys(item)[n]].Type === 'textarea'" v-model="Obj[n]"
                                :class="item[Object.keys(item)[n]].Class" />
                            <input :Type="item[Object.keys(item)[n]].Type" :disabled="TestModificaElimina === 'E'"
                                v-else v-model="Obj[n]" :class="item[Object.keys(item)[n]].Class" />
                        </span>
                        <div v-else :class="item[Object.keys(item)[n]].Class">
                            <span v-if="item[Object.keys(item)[n]].Type === 'date'">
                                {{ ConvertiDataInglese(item[Object.keys(item)[n]].Value) }}
                            </span>
                            <span v-else>
                                {{ item[Object.keys(item)[n]].Value }}
                            </span>
                        </div>
                    </td>
                    <td style="width: 150px;">
                        <span v-if="IdAggiungiModificaElimina === item.Id.Value" class="Centra">
                            <BTNConferma class="BTNAzione BTNEliminaDefinitivamente" v-if="TestModificaElimina === 'E'"
                                @click="BTNAzione({ Tipo: 'EliminaDefinitivamente', Id: item.Id.Value })" />
                            <BTNSalva class="BTNAzione BTNSalva" v-else
                                @click="BTNAzione({ Tipo: 'Salva', Id: item.Id.Value })" />
                            <BTNIndietro class="BTNAzione BTNIndietro" @click="BTNAzione({
                                Tipo: 'Annulla',
                                Id: undefined
                            })" />
                        </span>
                        <span v-else class="Centra">
                            <BTNModifica class="BTNAzione"
                                @click="BTNAzione({ Tipo: 'AbilitaModifica', Id: item.Id.Value })" />
                            <BTNCestino class="BTNAzione" @click="BTNAzione({
                                Tipo: 'AbilitaElimina', Id: item.Id.Value
                            })" />
                        </span>
                    </td>
                </tr>
            </template>
            <tr :class="ClassRiga('0')" class="Centra">
                <td v-for="n in Object.keys(items[0]).length - 1" :key="n" v-if="TestModificaElimina === 'I'">
                    <textarea v-if="items[0][Object.keys(items[0])[n]].Type === 'textarea'" v-model="Obj[n]"
                        :class="items[0][Object.keys(items[0])[n]].Class" />
                    <input :Type="items[0][Object.keys(items[0])[n]].Type" v-else v-model="Obj[n]"
                        :class="items[0][Object.keys(items[0])[n]].Type === 'date' ? 'text-center' : ''" />
                </td>
                <td>
                    <BTNAggiungi class="BTNAzione" @click="BTNAzione({ Tipo: 'AbilitaAggiungi', Id: undefined })"
                        v-if="TestModificaElimina != 'I'" />
                    <span v-else>
                        <BTNSalva class="BTNAzione BTNSalva" @click="BTNAzione({ Tipo: 'Salva', Id: '0' })" />
                        <BTNIndietro class="BTNAzione BTNIndietro" @click="BTNAzione({
                            Tipo: 'Annulla',
                            Id: undefined
                        })" />
                    </span>
                </td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import BTNAggiungi from './IconeSvg/Aggiungi.vue'
import BTNModifica from './IconeSvg/Modifica.vue'
import BTNCestino from './IconeSvg/Cestino.vue'
import BTNSalva from './IconeSvg/Salva.vue'
import BTNIndietro from './IconeSvg/Indietro.vue'
import BTNConferma from './IconeSvg/Conferma.vue'
export default defineComponent({
    components: {
        BTNAggiungi,
        BTNModifica,
        BTNCestino,
        BTNIndietro,
        BTNSalva,
        BTNConferma
    },
    props: {
        items: {
            type: Object,
            required: true
        },
        NuovoElemento: {
            type: Object,
            required: false
        },
        pinia: {
            type: null,
            required: true
        }
    },
    setup(props) {
        const Intestazione = ref()
        const IdAggiungiModificaElimina = ref('')
        const TestModificaElimina = ref('M')
        const Obj = ref()
        const ConvertiDataInglese = (Data: string) => {
            let tmp = ''
            if (Data) {
                const gg = Data.substring(8, 10)
                const mm = Data.substring(5, 7)
                const aaaa = Data.substring(0, 4)
                tmp = gg + '-' + mm + '-' + aaaa
            }
            return tmp
        }
        const BTNAzione = (param: { Tipo: string, Id: string | undefined }) => {
            //console.log(param)
            let ObjTrovato: any
            if (param.Id && param.Id.length > 1) {
                ObjTrovato = props.items.find((item: { Id: { Value: string } }) => item.Id.Value === param.Id)
                Obj.value = []
                Object.keys(ObjTrovato).forEach((item) => {
                    Obj.value.push(ObjTrovato[item].Value)
                })
            }
            switch (param.Tipo) {
                case 'AbilitaAggiungi':
                    //console.log('AbilitaAggiungi')
                    TestModificaElimina.value = "I"
                    IdAggiungiModificaElimina.value = '0'
                    Obj.value = []
                    const ObjRecuperoDaAggiungere = props.NuovoElemento
                    if (ObjRecuperoDaAggiungere) {
                        Object.keys(ObjRecuperoDaAggiungere).forEach((item: any) => {
                            Obj.value.push(ObjRecuperoDaAggiungere[item])
                        })
                    }
                    break
                case 'AbilitaModifica':
                    TestModificaElimina.value = 'M'
                    IdAggiungiModificaElimina.value = param.Id!
                    break;
                case 'AbilitaElimina':
                    TestModificaElimina.value = 'E'
                    IdAggiungiModificaElimina.value = param.Id!
                    break
                case 'EliminaDefinitivamente':
                    //console.log('eliminadef')
                    props.pinia.Elimina(param.Id)
                        .then(() => AzzeraAzione())
                    break
                case 'Salva':
                    let NuovoObj: Array<string> = []
                    Obj.value.forEach((item: string) => {
                        NuovoObj.push(item)
                    })
                    if (NuovoObj[0] === '0') {
                        props.pinia.Aggiungi(NuovoObj)
                            .then(() => AzzeraAzione())
                    } else {
                        props.pinia.Aggiorna(NuovoObj)
                            .then(() => AzzeraAzione())
                    }
                case 'Annulla':
                    AzzeraAzione()
                    break
                default:
                    break;
            }
        }
        const AzzeraAzione = () => {
            IdAggiungiModificaElimina.value = ''
            TestModificaElimina.value = 'M'
        }
        const ClassRiga = computed(() => {
            return (Id: string) => {
                return IdAggiungiModificaElimina.value === Id ? TestModificaElimina.value === 'E' ? 'FaseDiElimina' : 'FaseDiModifica' : ''
            }
        })
        watch(() => props.items, () => {
            Intestazione.value = Object.keys(props.items[0])
        })
        return {
            Intestazione,
            Obj,
            IdAggiungiModificaElimina,
            TestModificaElimina,
            BTNAzione,
            ClassRiga,
            ConvertiDataInglese
        }
    }
})
</script>
-->
