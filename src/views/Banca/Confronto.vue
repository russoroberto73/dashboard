<template>
    <div class="relative top-[120px]">
        <h1 class="text-center text-[30px]">Confronto</h1>
        <div class="grid grid-cols-2 w-[1400px] bg-white m-auto p-3">
            <div class="flex m-auto">
                <div
                    class="h-[400px] grid grid-cols-1 overflow-y-auto w-[fit-content] m-6 p-5 border border-[5px] border-BordoTabella">
                    <span v-for="(categoria, index) in Categorie" :key="index">
                        <input type="checkbox" :value="categoria.Id" v-model="CercaCategoria"
                            class="w-[20px] h-[20px] mr-4" />{{ categoria.Nome }}
                    </span>
                </div>
            </div>
            <div class="flex m-auto">
                <div>
                    <div
                        class="h-[400px] grid grid-cols-1 w-[fit-content] float-left m-6 p-5 border border-[5px] border-BordoTabella">
                        <span v-for="(anno, index) in Anni" :key="index">
                            <input type="checkbox" :value="anno" v-model="CercaAnni" class="w-[20px] h-[20px] mr-4" />{{
                                anno }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-span-2">
                <div class="border border-[5px] border-BordoTabella p-5 w-[fit-content] flex m-auto">
                    <table>
                        <tr>
                            <td></td>
                            <template v-for="(categoria, index) in CercaCategoria">
                                <td :colspan="CercaAnni.length">
                                    {{ IdCategoriaNome(categoria) }}
                                </td>
                                <td rowspan="15" class="w-[25px]" style="border: none"></td>
                            </template>
                        </tr>
                        <tr>
                            <td></td>
                            <template v-for="(categoria, index) in CercaCategoria">
                                <td v-for="(anno, index) in CercaAnni.sort()" :key="index">
                                    {{ anno }}
                                </td>
                            </template>
                        </tr>
                        <tr v-for="n in 13" :key="n">
                            <td v-if="n === 13" class="font-bold">
                                Totale
                            </td>
                            <td v-else>
                                {{ MeseDaNumeroANome(n) }}
                            </td>
                            <template v-for="(categoria, index) in CercaCategoria">
                                <td v-for="(anno, index) in CercaAnni.sort()" :key="index"
                                    :class="CercaImporto(anno, categoria, n).Class">
                                    <span v-if="CercaImporto(anno, categoria, n).Somma != 0" :class="n===13 ? 'font-bold' : ''">
                                        {{ formatEuro(Math.abs(CercaImporto(anno, categoria, n).Somma)) }}
                                    </span>
                                </td>
                            </template>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <!--
        <div
            class="h-[400px] grid grid-cols-1 overflow-y-auto w-[fit-content] float-left m-6 p-5 border border-[5px] border-BordoTabella">
            <span v-for="(categoria, index) in Categorie" :key="index">
                <input type="checkbox" :value="categoria.Id" v-model="CercaCategoria" class="w-[20px] h-[20px] mr-4" />{{ categoria.Nome }}
            </span>
        </div>
        <div class="float-left">
            <div
                class="h-[400px] grid grid-cols-1 w-[fit-content] float-left m-6 p-5 border border-[5px] border-BordoTabella">
                <span v-for="(anno, index) in Anni" :key="index">
                    <input type="checkbox" :value="anno" v-model="CercaAnni" class="w-[20px] h-[20px] mr-4" />{{ anno }}
                </span>
            </div>
        </div>
        <div  class="border border-[5px] border-BordoTabella p-5 w-[fit-content]">
        <table>
            <tr>
                <td></td>
                <template v-for="(categoria, index) in CercaCategoria">
                    <td :colspan="CercaAnni.length">
                        {{ IdCategoriaNome(categoria) }}
                    </td>
                    <td rowspan="14" class="w-[25px]" style="border: none"></td>
                </template>
</tr>
<tr>
    <td></td>
    <template v-for="(categoria, index) in CercaCategoria">
                    <td v-for="(anno, index) in CercaAnni.sort()" :key="index">
                        {{ anno }}
                    </td>
                </template>
</tr>
<tr v-for="n in 12" :key="n">
    <td>
        {{ MeseDaNumeroANome(n) }}
    </td>
    <template v-for="(categoria, index) in CercaCategoria">
                    <td v-for="(anno, index) in CercaAnni.sort()" :key="index" :class="CercaImporto(anno, categoria, n).Class">
                        <span v-if="CercaImporto(anno, categoria, n).Somma != 0">
                        {{ formatEuro(Math.abs(CercaImporto(anno, categoria, n).Somma)) }}
                        </span>
                    </td>
                </template>
</tr>
</table>
</div>
-->
    </div>
</template>
<script setup lang="ts">
import { formatEuro, MeseDaNumeroANome } from '@/assets/helpers/MyMixin';
import { Pinia } from '@/stores'
import { ref, computed } from 'vue'

const ElencoCategorie = Pinia.Categorie().getElenco
const ElencoMovimenti = Pinia.Movimenti().getElenco
const CercaCategoria = ref([])
const CercaAnni = ref([])
const Categorie = computed(() => {
    return new Set(ElencoCategorie.map((item) => {
        return { Id: item.Id, Nome: item.Nome }
    }))
})
const Anni = computed(() => {
    return new Set(ElencoMovimenti.map((item) => {
        return item.Data.substring(6, 10)
    }))
})

const IdCategoriaNome = computed(() => {
    return (Cat: any) => {
        return ElencoCategorie.find((item) => item.Id === Cat)?.Nome
    }
})

const CercaImporto = computed(() => {
    return (anno: string, IdCategoria: string, mese: string) => {
        let Somma = 0
        let Sommatot = 0
        let Class = ''
        const tmp = ElencoMovimenti.map((item: any) => {
            if (item.Data) {
                if (item.Data.substring(6, 10) === anno && item.IdCategoria === IdCategoria && parseInt(item.Data.substring(3, 5)) === parseInt(mese)) {
                    return item.Accrediti - item.Addebiti
                }
            }
        }).filter((item) => item != undefined)
        if (tmp.length > 0) {
            Somma = tmp.reduce((acc, num) => acc += num)
        }
        const tmptot = ElencoMovimenti.map((item: any) => {
            if (item.Data) {
                if (item.Data.substring(6, 10) === anno && item.IdCategoria === IdCategoria) {
                    return item.Accrediti - item.Addebiti
                }
            }
        }).filter((item) => item != undefined)
        if (tmptot.length > 0) {
            Sommatot = tmptot.reduce((acc, num) => acc += num)
        }
        if (parseInt(mese) === 13) {
            Somma = Sommatot
            Class = "font-bold "
        }
        if (Somma === 0) {
            Class += "bg-white"
        }
        else if (Somma > 0) {
            Class += 'bg-Accrediti'
        } else {
            Class += 'bg-Addebiti'
        }
        return { Somma, Class }
    }
})
</script>
<style lang="scss" scoped>
td {
    @apply border border-[2px] border-BordoTabella text-center;
}
</style>