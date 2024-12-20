<template>
    <p class="w-full hidden">
        {{ Use().ObjStore }}
    </p>
    <div class="FormTabella" :id="pinia.getNomeTabella">
        <table cellspacing="0" cellpadding="0">
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
                <tr v-if="parseInt(index) < items.length" :class="ClassRiga(item.Id.Value)"> <!-- Escuode Id-->
                    <TabellaForm :item="item" :Check="VerificaEsiste(item)" :n="n" :index="parseInt(index)"
                        :IdAggiungiModificaElimina="IdAggiungiModificaElimina" v-for="n in Object.keys(item).length - 1"
                        :key="n" :class="item[Object.keys(item)[n]].Class" />
                    <td style="width: 150px;">
                        <span v-if="item.Id.Value === 'soloinserimento'">
                            <!-- <SoloInserimento :item="item" :index="parseInt(index)" :SelectIndex="!select[parseInt(index)]" /> -->
                            <span v-if="VerificaEsiste(item) === 'BTNSalva'">
                                <BTNSalva class="BTNAzione BTNSalva" :disabled="!Use().IdCategoriaNuovoMovimento"
                                    @click="AggiungiRecord(item, parseInt(index))"
                                    :class="!Use().IdCategoriaNuovoMovimento[index] ? 'BTNDisabilitato' : 'BTNSalva'"
                                    v-if="ControllaCampoSoloInserimento(item)" />
                                <BTNSalva class="BTNAzione" v-else :class="VerificaEsiste(item)"
                                    @click="AggiungiRecord(item, parseInt(index))" />
                            </span>
                            <span v-else>Movimento esistente</span>
                        </span>
                        <span v-else>
                            <span v-if="IdAggiungiModificaElimina === item.Id.Value" class="Centra">
                                <BTNConferma class="BTNAzione BTNEliminaDefinitivamente"
                                    v-if="TestModificaElimina === 'E'"
                                    @click="BTNAzione({ Tipo: 'EliminaDefinitivamente', Id: item.Id.Value })" />
                                <BTNSalva class="BTNAzione" :disabled="ValidareCampi"
                                    :class="ValidareCampi ? 'BTNDisabilitato' : 'BTNSalva'" v-else
                                    @click="BTNAzione({ Tipo: 'Salva', Id: item.Id.Value })" />
                                <BTNIndietro class="BTNAzione BTNIndietro" @click="BTNAzione({
                                    Tipo: 'Annulla',
                                    Id: undefined
                                })" />
                            </span>
                            <span v-else class="Centra">
                                <BTNModifica class="BTNAzione"
                                    @click="BTNAzione({ Tipo: 'AbilitaModifica', Id: item.Id.Value })" />
                                <BTNCestino
                                    :class="VerificaEliminazione(item[Object.keys(item)[0]].Value) ? 'BTNAzione BTNDisabilitato' : 'BTNAzione'"
                                    @click="BTNAzione({
                                        Tipo: 'AbilitaElimina', Id: item.Id.Value
                                    })" :disabled="VerificaEliminazione(item[Object.keys(item)[0]].Value)" />
                            </span>
                        </span>
                    </td>
                </tr>
            </template>
            <tr :class="ClassRiga('0')">
                <td v-for="n in Object.keys(Use().ItemsStore[0]).length - 1" :key="n"
                    v-if="TestModificaElimina === 'I'">
                    <span v-if="!Use().ObjStore['Nessuno']">
                        <span v-if="Use().ItemsStore[0][Object.keys(Use().ItemsStore[0])[n]].Visibile != 'hidden'">
                            <textarea
                                v-if="Use().ItemsStore[0][Object.keys(Use().ItemsStore[0])[n]].Type === 'textarea'"
                                v-model="Use().ObjStore[Object.keys(Use().ItemsStore[0])[n]]"
                                :class="Use().ItemsStore[0][Object.keys(Use().ItemsStore[0])[n]].Class"
                                style="width: 100%;" />
                            <select v-else-if="items[0][Object.keys(Use().ItemsStore[0])[n]].Type === 'select'"
                                :value="Use().ObjStore[Object.keys(Use().ItemsStore[0])[n]]"
                                @change="AssegnaValoreCombo($event, '', index)"
                                :class="Use().ItemsStore[0][Object.keys(Use().ItemsStore[0])[n]].Class">
                                <option
                                    v-for="(item, index) in Use().ItemsStore[0][Object.keys(Use().ItemsStore[0])[n]].Array"
                                    :key="index" :value="item.value">
                                    {{ item.text }}
                                </option>
                            </select>
                            <div
                                v-else-if="Use().ItemsStore[0][Object.keys(Use().ItemsStore[0])[n]].Type === 'boolean'">
                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="Use().ObjStore[Object.keys(Use().ItemsStore[0])[n]]"
                                        class="sr-only peer">
                                    <div
                                        class="relative w-11 h-6 bg-red-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                    </div>
                                </label>
                            </div>
                            <input :Type="Use().ItemsStore[0][Object.keys(Use().ItemsStore[0])[n]].Type" v-else
                                v-model="Use().ObjStore[Object.keys(Use().ItemsStore[0])[n]]"
                                :class="Use().ItemsStore[0][Object.keys(Use().ItemsStore[0])[n]].Type === 'date' ? 'text-center' : ''" />
                        </span>
                    </span>
                </td>
                <td class="Centra">
                    <BTNAggiungi class="BTNAzione" @click="BTNAzione({ Tipo: 'AbilitaAggiungi', Id: '0' })"
                        v-if="TestModificaElimina != 'I'" />
                    <span v-else class="Centra">
                        <BTNSalva class="BTNAzione BTNSalva" @click="BTNAzione({ Tipo: 'Salva', Id: '0' })"
                            :disabled="ValidareCampi" :class="ValidareCampi ? 'BTNDisabilitato' : 'BTNSalva'" />
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

<script setup lang="ts">
import { onBeforeMount, computed, watch } from 'vue'

import { mymixin } from './Script'
import BTNAggiungi from './IconeSvg/Aggiungi.vue'
import BTNModifica from './IconeSvg/Modifica.vue'
import BTNCestino from './IconeSvg/Cestino.vue'
import BTNSalva from './IconeSvg/Salva.vue'
import BTNIndietro from './IconeSvg/Indietro.vue'
import BTNConferma from './IconeSvg/Conferma.vue'
import { Use } from '@/stores/modules/CostruisciTabella.module'
import TabellaForm from './TabellaForm.vue'
import SoloInserimento from './SoloInserimento.vue'

const props = defineProps(
    {
        items: {
            type: Object,
            required: true
        },
        pinia: {
            type: null,
            required: true
        },
        piniaverifica: {
            type: null,
            required: false
        }
    }
)

const { Obj, select, Intestazione, IdAggiungiModificaElimina, TestModificaElimina, ConvertiDataInglese, BTNAzione, ClassRiga, ValidareCampi, AbilitaCampo, VerificaCampoModifica, VerificaEliminazione, AssegnaValoreCombo, IdComboNome, AggiungiRecord, VerificaEsiste, ControllaCampoSoloInserimento } = mymixin(props)

watch(() => props.items, () => {
    if (props.items.length > 0) {
        Use().ItemsStore = props.items
    }
})
onBeforeMount(async () => {
    Use().ItemsStore = props.items

})
</script>