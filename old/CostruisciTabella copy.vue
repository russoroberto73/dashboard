<template>
    {{piniainterna.ItemsInterno}}
    <p class="w-full hidden">
        {{ Obj }}
    </p>
    <div class="FormTabella" :id="pinia.getNomeTabella">
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
                <tr v-if="parseInt(index) < items.length" :class="ClassRiga(item.Id.Value)"> <!-- Escuode Id-->
                    <td v-for="n in Object.keys(item).length - 1" :key="n" :class="item[Object.keys(item)[n]].Class">
                        <span v-if="IdAggiungiModificaElimina === item.Id.Value"> <!-- Crea Colonne form-->
                            <span v-if="item[Object.keys(item)[n]].Visibile != 'hidden'">
                                <span v-if="!item[Object.keys(item)[n]].ReadOnly">
                                    <span
                                        v-if="VerificaCampoModifica([item[Object.keys(item)[n]].AbilitataModifica], parseInt(index))">
                                        <textarea :disabled="TestModificaElimina === 'E'"
                                            v-if="item[Object.keys(item)[n]].Type === 'textarea'"
                                            v-model="Obj[Object.keys(items[0])[n]]"
                                            :class="item[Object.keys(item)[n]].Class" />
                                        <select v-else-if="item[Object.keys(item)[n]].Type === 'select'"
                                            :value="Obj[Object.keys(items[0])[n]]"
                                            @change="AssegnaValoreCombo($event, Object.keys(items[0])[n])"
                                            :class="item[Object.keys(item)[n]].Class">
                                            <option v-for="(option, index) in item[Object.keys(item)[n]].Array"
                                                :key="index" :value="option.value">
                                                {{ option.text }}
                                            </option>
                                        </select>
                                        <div v-else-if="item[Object.keys(item)[n]].Type === 'boolean'">
                                            <label class="inline-flex items-center cursor-pointer">
                                                <input type="checkbox" v-model="Obj[Object.keys(items[0])[n]]"
                                                    class="sr-only peer">
                                                <div
                                                    class="relative w-11 h-6 bg-red-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                                </div>
                                            </label>
                                        </div>
                                        <input :Type="item[Object.keys(item)[n]].Type"
                                            :disabled="TestModificaElimina === 'E'" v-else
                                            v-model="Obj[Object.keys(items[0])[n]]"
                                            :class="item[Object.keys(item)[n]].Class" />
                                    </span>
                                </span>
                                <span v-else>
                                    <span v-if="item[Object.keys(item)[n]].Type === 'date'">
                                        <span
                                            v-if="!item[Object.keys(item)[n]].Visibile || item[Object.keys(item)[n]].Visibile === 'visible'">
                                            {{ ConvertiDataInglese(item[Object.keys(item)[n]].Value) }}
                                        </span>
                                    </span>
                                    <span v-else>
                                        {{ item[Object.keys(item)[n]].Value }}
                                    </span>
                                </span>
                            </span>
                            <span v-else-if="TestModificaElimina === 'M'">
                                <button class="BTNAzione" style="width: fit-content;"
                                    @click="AbilitaCampo(item, n)">Abilita</button>
                            </span>
                        </span>
                        <div v-else :class="item[Object.keys(item)[n]].Class"> <!-- lettura-->
                            <div v-if="item[Object.keys(item)[n]].ForzaModifica">
                                <!--rimpopongo tutti i casi del campo form-->
                                {{ IdComboNome(item[Object.keys(item)[n]].Value) }}
                                <span v-if="item[Object.keys(item)[n]].Value === ''">
                                    <textarea v-if="item[Object.keys(item)[n]].Type === 'textarea'"
                                        class="FaseDiModifica" />
                                    <select v-else-if="item[Object.keys(item)[n]].Type === 'select'" class="BTNSalva" v-model="select[parseInt(index)]">
                                        <option v-for="(option, index) in item[Object.keys(item)[n]].Array" :value="{Etichetta: 'ok'}"
                                            :key="index">
                                            {{ option.text }}
                                        </option>
                                    </select>
                                    <div v-else-if="item[Object.keys(item)[n]].Type === 'boolean'">

                                    </div>
                                    <input class="w-full FaseDiModifica" v-else />
                                </span>
                                <!---->
                            </div>
                            <span v-if="item[Object.keys(item)[n]].Type === 'date'">
                                <span
                                    v-if="!item[Object.keys(item)[n]].Visibile || item[Object.keys(item)[n]].Visibile === 'visible'">
                                    {{ ConvertiDataInglese(item[Object.keys(item)[n]].Value) }}
                                </span>
                            </span>
                            <span v-else>
                                <span v-if="item[Object.keys(item)[n]].Type === 'number'">
                                    {{ Round(item[Object.keys(item)[n]].Value, 2) }}
                                </span>
                                <span v-else-if="item[Object.keys(item)[n]].Type === 'select'">
                                    {{ IdComboNome(item[Object.keys(item)[n]]) }}
                                </span>
                                <span v-else-if="item[Object.keys(item)[n]].Type === 'boolean'">
                                    <label class="inline-flex items-center cursor-not-allowed">
                                        <input type="checkbox" :checked="item[Object.keys(item)[n]].Value"
                                            class="sr-only peer" disabled>
                                        <div
                                            class="relative w-11 h-6 bg-red-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-300">
                                        </div>
                                    </label>
                                </span>
                                <span v-else>
                                    {{ item[Object.keys(item)[n]].Value }}
                                </span>
                            </span>
                        </div>
                    </td>
                    <td style="width: 150px;">
                        <span v-if="items[0].Id.Value === 'soloinserimento'">
                            <button @click="AggiungiRecord(item, parseInt(index))">                                
                                <BTNSalva class="BTNAzione BTNSalva" :disabled="!select[parseInt(index)]" :class="!select[parseInt(index)] ? 'BTNDisabilitato': 'BTNSalva'" v-if="!item[Object.keys(item)[6]].Value" />
                                <BTNSalva class="BTNAzione" v-else :class="VerificaEsiste(item, items, pinia.getElenco)" />
                            </button>
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
                <td v-for="n in Object.keys(items[0]).length - 1" :key="n" v-if="TestModificaElimina === 'I'">
                    <span v-if="!Obj['Nessuno']">
                        <span v-if="items[0][Object.keys(items[0])[n]].Visibile != 'hidden'">
                            <textarea v-if="items[0][Object.keys(items[0])[n]].Type === 'textarea'"
                                v-model="Obj[Object.keys(items[0])[n]]"
                                :class="items[0][Object.keys(items[0])[n]].Class" style="width: 100%;" />
                            <select v-else-if="items[0][Object.keys(items[0])[n]].Type === 'select'"
                                :value="Obj[Object.keys(items[0])[n]]"
                                @change="AssegnaValoreCombo($event, Object.keys(items[0])[n])"
                                :class="items[0][Object.keys(items[0])[n]].Class">
                                <option v-for="(supercategoria, index) in items[0][Object.keys(items[0])[n]].Array"
                                    :key="index" :value="supercategoria.value">
                                    {{ supercategoria.text }}
                                </option>
                            </select>
                            <div v-else-if="items[0][Object.keys(items[0])[n]].Type === 'boolean'">
                                <label class="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="Obj[Object.keys(items[0])[n]]" class="sr-only peer">
                                    <div
                                        class="relative w-11 h-6 bg-red-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                                    </div>
                                </label>
                            </div>
                            <input :Type="items[0][Object.keys(items[0])[n]].Type" v-else
                                v-model="Obj[Object.keys(items[0])[n]]"
                                :class="items[0][Object.keys(items[0])[n]].Type === 'date' ? 'text-center' : ''" />
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
import { onMounted, watch } from 'vue';
import { mymixin } from './Script'
import BTNAggiungi from './IconeSvg/Aggiungi.vue'
import BTNModifica from './IconeSvg/Modifica.vue'
import BTNCestino from './IconeSvg/Cestino.vue'
import BTNSalva from './IconeSvg/Salva.vue'
import BTNIndietro from './IconeSvg/Indietro.vue'
import BTNConferma from './IconeSvg/Conferma.vue'
import { Round } from '@/assets/helpers/MyMixin';
import { useCounterStore } from '@/stores/modules/CostruisciTabella.module';

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
const { select, Intestazione, IdAggiungiModificaElimina, TestModificaElimina, Obj, ConvertiDataInglese, BTNAzione, ClassRiga, ValidareCampi, AbilitaCampo, VerificaCampoModifica, VerificaEliminazione, AssegnaValoreCombo, IdComboNome, AggiungiRecord, VerificaEsiste } = mymixin(props)
const piniainterna = useCounterStore()
watch(() => props.items, () => {
    if (props.items.length > 0) {
        Intestazione.value = Object.keys(props.items[0])
    }
})
onMounted(() => {
    setTimeout(() => {
        Intestazione.value = Object.keys(props.items[0])
        piniainterna.ItemsInterno = props.items
    }, 300)
})
</script>
