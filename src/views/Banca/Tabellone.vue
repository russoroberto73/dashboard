<template>
    <div class="relative top-[120px] text-center">
        <h1 class="text-center text-[30px]">Tabellone</h1>
        <span class="text-[20px] m-6 flex justify-center">
            <button class="rounded-[45px] mx-5 w-[50px] h-[30px]" @click="CambiaAnno('-')"
                :class="Anno === parseInt(Anni[0]) ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500'"
                :disabled="Anno === parseInt(Anni[0])">-</button>
            {{ Anno }}
            <button class="rounded-[45px] mx-5 w-[50px] h-[30px]" @click="CambiaAnno('+')"
                :class="Anno === parseInt(Anni[Anni.length - 1]) ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500'"
                :disabled="Anno === parseInt(Anni[Anni.length - 1])">+</button>
        </span>
        <table class="border border-[5px] border-BordoTabella m-auto">
            <tr>
                <th>Anno {{ Anno }}</th>
                <th v-for="(item, index) in SuperCategorie" :key="index" :colspan="item.colspan"
                    class="border border-l-[5px] border-BordoTabella">{{ item.Nome }}</th>
                <th colspan="4">Totali mesi</th>
            </tr>
            <tr>
                <td v-for="(item, index) in Object.keys(Tabellone_Anno['TabellaAnni'][0])" :key="index"
                    :class="CellaClass(item, 13, index)" class="font-bold border border-BordoTabella">
                    {{ item }}
                </td>
                <td class="bg-Accrediti border border-l-[5px] border-BordoTabella font-extrabold px-2">
                    Entrate</td>
                <td class="bg-Addebiti border border-BordoTabella font-extrabold px-2">Uscite</td>
                <td class="bg-Investimenti border border-BordoTabella font-extrabold px-2">Investimenti</td>
                <td class="bg-white border border-BordoTabella font-extrabold px-2">Mesi</td>
            </tr>
            <template v-for="(item, index) in Tabellone_Anno['TabellaAnni']">
                <tr v-if="index < 13">
                    <td v-if="index === 12" class="bg-white font-bold" rowspan="5">
                        Totale
                    </td>
                    <td v-for="(importo, key, index1) in item" :key="index1" v-if="index < 13"
                        :class="CellaClass(key.toString(), index, index === 12 ? index1 + 1 : index1)"
                        class="border border-BordoTabella">
                        <span v-if="key.toString() === 'Mese'" class="font-bold">
                            {{ importo }}
                        </span>
                        <span v-else
                            :class="index < 12 ? 'cursor-pointer' : index === 12 ? 'font-medium cursor-pointer' : ''"
                            @click="DettaglioMovimenti(index, key)">
                            {{ formatEuro(Math.abs(importo)) }}
                        </span>
                    </td>
                    <template v-if="index >= 0" :class="index===12 ? 'font-bold' : ''">
                        <td :rowspan="index === 12 ? 2 : 1" class="bg-Accrediti border border-l-[5px] border-BordoTabella"
                            :class="index === 12 ? 'font-bold' : ''">
                            {{ formatEuro(Math.abs(TotaliMesi[index]['Entrate'])) }}</td>
                        <td :rowspan="index === 12 ? 2 : 1" class="bg-Addebiti border border-BordoTabella"
                            :class="index === 12 ? 'font-bold' : ''">
                            {{ formatEuro(Math.abs(TotaliMesi[index]['Uscite'])) }}</td>
                        <td :rowspan="index === 12 ? 4 : 1" class="border border-BordoTabella"
                            :class="parseFloat(TotaliMesi[index]['Investimenti'], 2) > 0 ? 'bg-Accrediti' + (index == 12 ? ' font-bold' : '') : 'bg-Investimenti' + (index == 12 ? ' font-bold' : '')">
                            {{ formatEuro(Math.abs(TotaliMesi[index]['Investimenti'])) }}</td>
                        <td :rowspan="index === 12 ? 2 : 1" class="bg-white border border-BordoTabella font-bold"
                            v-if="index < 12">{{ MeseDaNumeroANome((index + 1).toString()) }}</td>
                        <td v-else :rowspan="index === 12 ? 5 : 1" class="bg-white border border-BordoTabella font-bold">
                            Totole</td>
                    </template>
                </tr>
            </template>
            <tr>
                <td v-for="(item, index) in SommeParziali" :colspan="item.colspan" :key="index" class="font-bold"
                    :class="Checkclasstotaliparziali(item)">
                    {{ formatEuro(Math.abs(item.Somma)) }}
                </td>
            </tr>
            <tr>
                <td v-for="(item, index) in SommeSuperCategorie" :key="index" :colspan="item.colspan"
                    :rowspan="item.IdSuperCategoria === '-NgUdXdH-WwkXPhYa_O8' ? 2 : 1"
                    :class="Checkclasstotaliparziali(item)" class="border border-l-[5px] border-BordoTabella font-bold">
                    {{ formatEuro(Math.abs(item.Somma)) }}
                </td>
                <td colspan="2" rowspan="2" class="font-bold border border-l-[5px] border-BordoTabella"
                    :class="(TotaliMesi[12].Entrate + TotaliMesi[12].Uscite < 0) ? 'bg-Addebiti' : 'bg-Accrediti'">
                    {{ formatEuro(Math.abs(TotaliMesi[12].Entrate + TotaliMesi[12].Uscite)) }}</td>
            </tr>
            <tr>
                <td v-for="(somma, index) in SommeTotali" :key="index" :class="somma.Class"
                    class="border border-[5px] border-BordoTabella font-bold" :colspan="somma.colspan">
                    {{ formatEuro(Math.abs(somma.Somma)) }}
                </td>
            </tr>
            <tr>
                <td class="border border-[5px] border-BordoTabella font-bold text-[30px]" :class="TotaleAnno.Class"
                    :colspan="TotaleAnno.colspan">
                    {{ formatEuro(Math.abs(TotaleAnno.Somma)) }}
                </td>
                <td colspan="3" class="font-bold" :class="TotaliMesiFinale > 0 ? 'bg-Accrediti' : 'bg-Addebiti'">
                    {{ formatEuro(Math.abs(TotaliMesiFinale)) }}</td>
            </tr>
        </table>
        <div v-if="MovimentiDettaglio.length > 0" class="bg-white w-[fit-content] m-auto text-right">
            <button @click="MovimentiDettaglio = []">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>

            </button>
            <RTable :items="MovimentiDettaglio" :pinia="Pinia.Movimenti()" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { Pinia } from '@/stores'
import { ref, computed, onMounted } from 'vue'
import { Data_ggmmaaaa_aaaammgg, MeseDaNumeroANome, formatEuro } from '@/assets/helpers/MyMixin'
import RTable from '@/components/ComponenteTabella/CostruisciTabella.vue'

type TypeMovimentiCategoria = {
    IdCategoria: string
    NomeCategoria: string
    IdSuperCategoria: string
    NomeSuperCategoria: string
    PosizioneSuperCategoria: number
    SommaAlgebrica: number
}
type ArrayMovimentiCategoria = Array<TypeMovimentiCategoria>

type TypeMovimento = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any
    Id?: string
    IdCategoria?: string
    IdSuperCategoria?: string
    NomeSuperCategoria?: string
    nomecategoria?: string
    Accrediti?: number
    Addebiti?: number
    Descrizione?: string
    DescrizioneEstesa?: string
    sommaalgebrica?: number
}

const ElencoSuperCategorie = Pinia.SuperCategorie().getElenco
const ElencoCategorie = Pinia.Categorie().getElenco
const ElencoMovimenti = Pinia.Movimenti().getElenco
const SeparatoreTabella: any = ref([])
const SommeParziali: any = ref([])
const SommeSuperCategorie: any = ref([])
const SommeTotali: any = ref([])
const Anno = ref(new Date().getFullYear())
const Anni: any = ref([])
const MovimentiDettaglio: any = ref([])
const TotaleAnno: any = ref('')
const TotaliMesi: any = ref([])
const TotaliMesiFinale: any = ref([])

const MovimentiAnno = computed(() => {
    Anni.value = [...new Set(ElencoMovimenti.map((item) => item.Data.substring(6, 10)))].sort()

    return ElencoMovimenti.map((item: any) => {
        SeparatoreTabella.valore = []
        SommeParziali.value = []
        SommeSuperCategorie.value = []
        SommeTotali.value = []
        TotaleAnno.value = []
        TotaliMesi.value = []
        TotaliMesiFinale.value = []

        let Categoria
        let IdSuperCategoria
        if (new Date(Data_ggmmaaaa_aaaammgg(item.Data)).getFullYear() === Anno.value) {
            //console.log(item.IdCategoria)
            Categoria = ElencoCategorie.find((c) => c.Id === item.IdCategoria)
            IdSuperCategoria = Categoria?.IdSuperCategoria
            //console.log({ ...item, IdSuperCategoria })            
            return { ...item, IdSuperCategoria }
        }
    }).filter((item) => item != null)
})

const Tabellone_Anno: any = computed(() => {
    /**
          * Dall'elenco di tutti i movimenti filta i movimenti dell'anno scelto: FILTER
          * Al risultato vengono aggiunti
          * - IdCategorie
          * - NomeCategoria
          * - IdSuperCategoria
          * - NomeSuperCategoria
          * - PosizioneSuperCategoria
          */
    //const TuttiMovimentiAnno =

    //console.log(ElencoSuperCategorie)    
    const ArrayReturn = MovimentiAnno.value.map((item: any) => {
        const Categoria = ElencoCategorie.find((itemc: any) => itemc.Id === item.IdCategoria)
        if (Categoria) {
            const SuperCategoria: any = ElencoSuperCategorie.find(
                (itemsc: any) => itemsc.Id === Categoria.IdSuperCategoria
            )
            if (SuperCategoria) {
                const Payload = {
                    Id: item.Id,
                    Data: item.Data,
                    Anno: new Date(Data_ggmmaaaa_aaaammgg(item.Data)).getFullYear(),
                    Mese: new Date(Data_ggmmaaaa_aaaammgg(item.Data)).getMonth() + 1,
                    Accrediti: item.Accrediti ? item.Accrediti.toString() : "0",
                    Addebiti: item.Addebiti ? item.Addebiti.toString() : "0",
                    Descrizione: item.Descrizione,
                    DescrizioneEstesa: item.DescrizioneEstesa,
                    IdCategoria: Categoria.Id,
                    NomeCategoria: Categoria.Nome,
                    IdSuperCategoria: SuperCategoria.Id,
                    NomeSuperCategoria: SuperCategoria.Nome,
                    PosizioneSuperCategoria: SuperCategoria.Posizione
                }
                return Payload
            }
        }
    })
    //console.log(ArrayReturn)


    /**
 * Dall'array di oggetti this.Tabellone_GetMovimenti
 * -Id
 * Data
 + Anno
 * Mese
 * Accrediti
 * Addebiti
 * Descrizione
 * DescrizioneEstesa
 * IdCategoria
 * NomeCategoria"
 * IdSuperCategoria
 * NomeSuperCategoria
 * PosizioneSuperCategoria
 *
 * Ottengo un oggetto di array: GruppoSommaCategorie
 * - IdCategoria
 *   - Id
 *   - Data
 *   - Anno
 *   - Mese
 *   - Accrediti
 *   - Addebiti
 *   - Descrizione
 *   - DescrizioneEstesa
 *   - NomeCategoria
 *   - IdSuperCategoria
 *   - NomeSuperCategoria
 *   - PosizioneSupeCategoria
 *
 * Ciclo GruppoSommaCategorie e ottengo l'array: SommeMesiCategoria
 * - IdCategoria
 * - NomeCategoria
 * - IdSuperCategoria
 * - NomeSuperCategoria
 * - PosizioneSuperCategoria
 * - SommaAlgebrica
 * Sempre nel ciclo GruppoSommaCategorie costruisco l'array di oggetti GruppoSommaMese
 * - NomeMese con 2 cifre
 *   - Id
 *   - Data
 *   - Anno
 *   - Mese
 *   - Accrediti
 *   - Addebiti
 *   - Descrizione
 *   - DescrizioneEstesa
 *   - NomeCategoria
 *   - IdSuperCategoria
 *   - NomeSuperCategoria
 *   - PosizioneSupeCategoria
 * A questo punto ciclo GruppoSommaMese per calcola la somma algebrica dei rispettivi mesi: GruppoCategorie
 * - NomeCategoria
 * - Mese in numero
 * - Somma non in valore assoluto
 * - Ordino SommaAnnoCategoria per somma algebrica e posizione super categoria
 * - Ordino GruppoCategorie per mese
 * Dopo di che Ciclo GruppoCategorie ottengo un'array di oggetti mettendo
 * tutte le somme e relativa nome categoria dello stesso mese in un unico oggetto
 * Aggiunge gli oggetti dei mesi non ancora inseriti ottenendo l'array finale: ArrayMovimenti
 *  - Mese
 *  - NomeMese
 *  - [NomeCategoria]
 *  - somma
 * A questo punto ciclo SommeMesiCategorie e mi costrusco l'oggetto di array: TabellaIntestazionePieDiPagina
 * - Totale
 * - IdSuperCategoria
 * - NomeSuperCategoria
 * - PosizioneSuperCategoria
 * - IdCategoria
 * - NomeCategoria
 * Ciclo SommaMesiCategorie e riempio TabellaIntestazionePieDiPagina
 * - Totale
 * - IdSuperCategoria
 * - NomeSuperCategoria
 * - IdCategoria
 * - NomeCategoria
 * - PosizioneSuperCategoria
 * Infine all'array Mesi aggiungo l'array tmp: tutto
 * ritorno un oggetto con
 * - Anno: SommaMesiCategoria
 * - Mesi: Array movimenti
 * - TabelaAnni: tutto
 */

    const GruppoSommeCategorie = ArrayReturn.reduce((acc: any, item: any) => {
        const IdCategoria = item.IdCategoria
        acc[IdCategoria] = acc[IdCategoria] || []
        acc[IdCategoria].push({
            Id: item.Id,
            Data: item.Data,
            Anno: item.Anno,
            Mese: item.Mese,
            Accrediti: item["Accrediti"] ? parseFloat(item["Accrediti"]) : 0,
            Addebiti: item["Addebiti"] ? parseFloat(item["Addebiti"]) : 0,
            Descrizione: item.Descrizione,
            DescrizioneEstesa: item.DescrizioneEstesa,
            NomeCategoria: item.NomeCategoria,
            IdSuperCategoria: item.IdSuperCategoria,
            NomeSuperCategoria: item.NomeSuperCategoria,
            PosizioneSuperCategoria: item.PosizioneSuperCategoria
        })
        return acc
    }, {})
    const SommaMesiCategorie: ArrayMovimentiCategoria = []
    const GruppoCategorie: object[] = []
    let tutto: object[] = []
    const Mesi: any = []
    let objMovimenti: any
    const Calendario = [
        "gennaio",
        "febbraio",
        "marzo",
        "aprile",
        "maggio",
        "giugno",
        "luglio",
        "agosto",
        "settembre",
        "ottobre",
        "novembre",
        "dicembre"
    ]
    let nmesi
    let ObjMovimenti: any = {}
    const ArrayMovimenti: any = []
    let Meset = 1
    //console.log(GruppoSommeCategorie)
    Object.keys(GruppoSommeCategorie).forEach((key) => {
        const result = GruppoSommeCategorie[key].reduce((acc: any, obj: any) => {
            return acc - obj["Accrediti"] + obj["Addebiti"]
        }, 0)

        SommaMesiCategorie.push({
            IdCategoria: key,
            NomeCategoria: GruppoSommeCategorie[key][0].NomeCategoria,
            IdSuperCategoria: GruppoSommeCategorie[key][0].IdSuperCategoria,
            NomeSuperCategoria: GruppoSommeCategorie[key][0].NomeSuperCategoria,
            PosizioneSuperCategoria:
                GruppoSommeCategorie[key][0].PosizioneSuperCategoria,
            SommaAlgebrica: result
        })

        const GruppoSommaMese = GruppoSommeCategorie[key].reduce(
            (acc: any, item: any) => {
                const Mese = item.Mese
                acc[Mese] = acc[Mese] || []
                acc[Mese].push(item)
                return acc
            },
            {}
        )
        Object.keys(GruppoSommaMese).forEach((key) => {
            const result = GruppoSommaMese[key].reduce((acc: any, obj: any) => {
                return acc + obj["Accrediti"] - obj["Addebiti"]
            }, 0)
            GruppoCategorie.push({
                NomeCategoria: GruppoSommaMese[key][0].NomeCategoria,
                Mese: parseInt(GruppoSommaMese[key][0].Mese),
                Somma: result
            })
        })
    })
    SommaMesiCategorie.sort((a, b) => {
        const as = a["SommaAlgebrica"] ? a["SommaAlgebrica"] : 0
        const bs = b["SommaAlgebrica"] ? b["SommaAlgebrica"] : 0
        return (
            a["PosizioneSuperCategoria"] - b["PosizioneSuperCategoria"] || as - bs
        )
    })
    GruppoCategorie.sort((a: any, b: any) => a["Mese"] - b["Mese"])
    GruppoCategorie.forEach((item: any) => {
        if (item["Mese"] != Meset) {
            ObjMovimenti["Mese"] = item["Mese"] - 1;
            ObjMovimenti["NomeMese"] = MeseDaNumeroANome((item["Mese"] - 1).toString())
            ArrayMovimenti.push(ObjMovimenti)
            ObjMovimenti = {}
            ObjMovimenti[item["NomeCategoria"]] = item["Somma"]
        } else {
            ObjMovimenti[item["NomeCategoria"]] = item["Somma"]
        }
        Meset = item["Mese"]
    })
    ObjMovimenti["Mese"] = Meset
    ObjMovimenti["NomeMese"] = MeseDaNumeroANome(Meset.toString())
    ArrayMovimenti.push(ObjMovimenti)
    for (let i = ArrayMovimenti.length; i < 12; i++) {
        ArrayMovimenti.push({
            Mese: i,
            NomeMese: MeseDaNumeroANome((Meset + 1).toString())
        })
    }
    const TabellaIntestazionePieDiPagina: any = {
        Totale: {},
        IdSuperCategoria: {},
        NomeSuperCategoria: {},
        IdCategoria: {},
        NomeCategoria: {},
        PosizioneSuperCategoria: {}
    }
    //console.log(SommaMesiCategorie)    
    SommaMesiCategorie.forEach((item: TypeMovimento) => {
        //console.log(item)
        const NomeCategoria = item.NomeCategoria
        TabellaIntestazionePieDiPagina["Totale"][NomeCategoria] =
            item.SommaAlgebrica
        TabellaIntestazionePieDiPagina["IdSuperCategoria"][NomeCategoria] =
            item.IdSuperCategoria
        TabellaIntestazionePieDiPagina["NomeSuperCategoria"][NomeCategoria] =
            item.NomeSuperCategoria
        TabellaIntestazionePieDiPagina["IdCategoria"][NomeCategoria] =
            item.IdCategoria
        TabellaIntestazionePieDiPagina["NomeCategoria"][NomeCategoria] =
            item.NomeCategoria
        TabellaIntestazionePieDiPagina["PosizioneSuperCategoria"][
            NomeCategoria
        ] = item.PosizioneSuperCategoria
    })
    let n = 0
    for (nmesi = 1; nmesi < 13; nmesi++) {
        objMovimenti = []
        SommaMesiCategorie.forEach((itemsommeanno: TypeMovimento) => {
            objMovimenti = {
                ...objMovimenti,
                [itemsommeanno.NomeCategoria]: ArrayMovimenti[n][itemsommeanno.NomeCategoria],
            }
        })
        n++
        Mesi.push({ Mese: Calendario[nmesi - 1], ...objMovimenti })
    }

    tutto = Mesi
    tutto.push(TabellaIntestazionePieDiPagina["Totale"])
    tutto.push(TabellaIntestazionePieDiPagina["IdSuperCategoria"])
    tutto.push(TabellaIntestazionePieDiPagina["NomeSuperCategoria"])
    tutto.push(TabellaIntestazionePieDiPagina["IdCategoria"])
    tutto.push(TabellaIntestazionePieDiPagina["NomeCategoria"])
    tutto.push(TabellaIntestazionePieDiPagina["PosizioneSuperCategoria"])
    /*console.log({
        Anno: SommaMesiCategorie,
        Mesi: ArrayMovimenti,
        TabellaAnni: tutto
    })*/
    let SommaInvestimenti = 0
    let SommaEntrate = 0
    let SommaUscite = 0
    let SommmeAnnoEntrate = 0
    let SommmeAnnoUscite = 0
    let SommmeAnnoInvestimenti = 0

    const abc = []
    for (let m = 0; m < 12; m++) {
        SommaInvestimenti = 0
        SommaEntrate = 0
        SommaUscite = 0

        Object.keys(Mesi[m]).forEach((key) => {
            const importo = parseFloat(Mesi[m][key]) ? Mesi[m][key] : 0
            const IdSuperCategoria = ElencoCategorie.find((item) => item.Nome === key)?.IdSuperCategoria
            if (IdSuperCategoria === '-NgUdXdH-WwkXPhYa_O8') {
                SommaInvestimenti += importo
            } else if (importo < 0) {
                SommaUscite += importo
            } else {
                SommaEntrate += importo
            }
        })
        abc.push({ Mese: m, Entrate: SommaEntrate, Uscite: SommaUscite, Investimenti: SommaInvestimenti })
    }
    TotaliMesi.value = []
    abc.forEach((item) => {
        SommmeAnnoEntrate += item.Entrate
        SommmeAnnoUscite += item.Uscite
        SommmeAnnoInvestimenti += item.Investimenti
        TotaliMesi.value.push(item)
    })
    TotaliMesi.value.push({ Mese: 13, Entrate: SommmeAnnoEntrate, Uscite: SommmeAnnoUscite, Investimenti: SommmeAnnoInvestimenti })
    if (TotaliMesi.value[12].Investimenti < 0) {
        TotaliMesiFinale.value = TotaliMesi.value[12].Entrate + TotaliMesi.value[12].Uscite - TotaliMesi.value[12].Investimenti
    } else {
        TotaliMesiFinale.value = TotaliMesi.value[12].Entrate + TotaliMesi.value[12].Uscite + TotaliMesi.value[12].Investimenti
    }

    return {
        Anno: SommaMesiCategorie,
        Mesi: ArrayMovimenti,
        TabellaAnni: tutto
    }
})

const SuperCategorie = computed(() => {
    //console.log(Tabellone_Anno.value['Anno'])  
    const sc = new Set(Tabellone_Anno.value['Anno'].map((item: any) => {
        return item.IdSuperCategoria
    }))
    const tmp: any = []
    let n: any = 0
    SeparatoreTabella.value[n++] = 1
    sc.forEach((item) => {
        const colspan = Tabellone_Anno.value['Anno'].filter((abc: any) => abc.IdSuperCategoria === item).length
        tmp.push({ ...ElencoSuperCategorie.find((itemsc) => itemsc.Id === item), colspan })
        SeparatoreTabella.value[n] = parseInt(colspan) + parseInt(SeparatoreTabella.value[n - 1])
        n++
    })
    const PrimonomeCategoria = Object.keys(Tabellone_Anno.value['TabellaAnni'][12])[0]
    let IdSuperCategoria: string | undefined = ElencoCategorie.find((sc) => sc.Nome === PrimonomeCategoria)?.IdSuperCategoria
    let ArraySomme: any = []
    let ArraySommeTot: any = []
    Object.keys(Tabellone_Anno.value['TabellaAnni'][12]).forEach((item) => {
        if (IdSuperCategoria != ElencoCategorie.find((sc) => sc.Nome === item)?.IdSuperCategoria) {
            ArraySommeTot.push({ Valore: ArraySomme, IdSuperCategoria })
            ArraySomme = []
        }
        ArraySomme.push(Tabellone_Anno.value['TabellaAnni'][12][item])
        IdSuperCategoria = ElencoCategorie.find((sc) => sc.Nome === item)?.IdSuperCategoria
    })
    ArraySommeTot.push({ Valore: ArraySomme, IdSuperCategoria })
    let VecchioIdSuperCategoria = ''
    ArraySommeTot.forEach((item: any) => {
        let Bordo = false
        const positiveNumbers = item.Valore.filter(num => num >= 0)
        const negativeNumbers = item.Valore.filter(num => num < 0)
        const positiveSum = positiveNumbers.reduce((sum, num) => sum + num, 0)
        const negativeSum = negativeNumbers.reduce((sum, num) => sum + num, 0)
        if (item.Valore.length > 0) {
            SommeSuperCategorie.value.push({ Somma: item.Valore.reduce((acc, valore) => acc + valore, 0), colspan: item.Valore.length, IdSuperCategoria: item.IdSuperCategoria })
        }
        if (negativeNumbers.length > 0) {
            Bordo = true
            SommeParziali.value.push({ Somma: negativeSum, colspan: negativeNumbers.length, IdSuperCategoria: item.IdSuperCategoria, Bordo })
        }
        if (positiveNumbers.length > 0) {
            if (Bordo) {
                Bordo = false
            }
            if (negativeNumbers.length === 0 && positiveNumbers.length > 0) {
                Bordo = true
            }
            SommeParziali.value.push({ Somma: positiveSum, colspan: positiveNumbers.length, IdSuperCategoria: item.IdSuperCategoria, Bordo })
        }
        VecchioIdSuperCategoria = item.IdSuperCategoria
    })
    const ElementoInvestimenti = ArraySommeTot.find((item) => item.IdSuperCategoria === '-NgUdXdH-WwkXPhYa_O8')
    const InvestimentiIndex = SommeSuperCategorie.value.findIndex((item: any) => item.IdSuperCategoria === "-NgUdXdH-WwkXPhYa_O8")
    const Investimenti = SommeSuperCategorie.value[InvestimentiIndex]
    if (Investimenti) {
        const AccreditiAddebiti = SommeParziali.value.map((sm) => sm.Somma).reduce((sum, num) => sum + num, 0)
        //**
        // accreditiaddebiti p  -100   investimenti p -90   -100 + -90 = -190
        // accreditiaddebiti p  -100   investimenti n 90    -100 + 90 = -10
        // accreditiaddebiti n  100    investimenti p -90    100  + -90 = 10
        // accreditiaddebiti n  100    investimenti n 90     100 + -90 = 10 */
        SommeTotali.value.push({ Somma: AccreditiAddebiti - Investimenti.Somma, Class: AccreditiAddebiti - Investimenti.Somma < 0 ? 'bg-Accrediti' : 'bg-Addebiti', colspan: Object.keys(Tabellone_Anno.value['TabellaAnni'][12]).length - ElementoInvestimenti.Valore.length })
        //console.log(AccreditiAddebiti, Investimenti.Somma)
        let SommaAlgebrica
        if (Investimenti.Somma > 0) {
            SommaAlgebrica = (AccreditiAddebiti - Investimenti.Somma) - Investimenti.Somma
        } else {
            SommaAlgebrica = (AccreditiAddebiti - Investimenti.Somma) + Investimenti.Somma
        }
        TotaleAnno.value = { Somma: SommaAlgebrica, colspan: Object.keys(Tabellone_Anno.value['TabellaAnni'][12]).length, Class: SommaAlgebrica < 0 ? 'bg-Accrediti' : 'bg-Addebiti' }
    }
    //console.log(Tabellone_Anno.value['TabellaAnni'][12], Tabellone_Anno.value['TabellaAnni'][15])
    //console.log(ElencoCategorie)
    /*for (let m = 1; m < 13; m++) {
        TotaliMesi.value.push({ Entrate: 10, Uscite: 20, Investimenti: 30 })
    }*/
    //console.log(tmp)   
    return tmp
})

const CellaClass = (NomeCategoria: string, index, index1: number) => {
    let Class = ''
    let segno = 1
    if (NomeCategoria === "Mese") {
        return 'bg-white'
    } else {
        const checkinvestimenti = ElencoCategorie.find((item) => item.Nome === NomeCategoria)?.IdSuperCategoria === '-NgUdXdH-WwkXPhYa_O8'
        let bordo = ""
        if (SeparatoreTabella.value.includes(index1)) {
            bordo = "border-l-[5px] border-BordoTabella"
        }
        //console.log(index)        
        if (index === 12) {
            segno = -1
        }
        if (index === 13) {
            index = 12
            segno = -1
        }
        if (Tabellone_Anno.value['TabellaAnni'][12]) {
            if (Tabellone_Anno.value['TabellaAnni'][12][NomeCategoria] < 0) {
                Class = 'bg-Accrediti ' + bordo
            } else {
                if (checkinvestimenti) {
                    Class = 'bg-Investimenti ' + bordo
                } else {
                    Class = 'bg-Addebiti ' + bordo
                }
            }
        }
        if (index < 12)
            if (Tabellone_Anno.value['TabellaAnni'][index]) {
                if (Tabellone_Anno.value['TabellaAnni'][12][NomeCategoria] < 0) {
                    if (Tabellone_Anno.value['TabellaAnni'][index][NomeCategoria] < 0) {
                        Class += ' text-red-900 font-extrabold bg-red-400'
                    }
                } else {
                    if (Tabellone_Anno.value['TabellaAnni'][index][NomeCategoria] > 0) {
                        Class += ' text-green-900 font-extrabold bg-green-500'
                    }
                }
            }
        return Class
    }
}
const Checkclasstotaliparziali = (item: any) => {
    //console.log(item)

    if (item.IdSuperCategoria === "-NgUdXdH-WwkXPhYa_O8" && item.Somma > 0) {
        if (item.Bordo) {
            return 'border border-l-[10px] border-BordoTabella bg-Investimenti'
        } else {
            return 'bg-Investimenti'
        }
    } else {
        return item.Somma < 0 ? item.Bordo ? 'border border-l-[5px] border-BordoTabella bg-Accrediti' : 'bg-Accrediti' : item.Bordo ? 'border border-l-[5px] border-BordoTabella bg-Addebiti' : 'bg-Addebiti'
    }
}

const CambiaAnno = (direzione: string) => {
    if (direzione === "-") {
        Anno.value--
    } else {
        Anno.value++
    }
}

const DettaglioMovimenti = (mese: number, categoria: string) => {
    const IdCategoria = ElencoCategorie.find((item) => item.Nome === categoria)?.Id
    //console.log(mese, IdCategoria)    
    let movimenti = []
    if (mese === 12) {
        // totale categoria
        movimenti = MovimentiAnno.value.filter((item) => item.IdCategoria === IdCategoria)
    } else {
        movimenti = MovimentiAnno.value.filter((item) => item.IdCategoria === IdCategoria && parseInt(item.Data.substring(3, 5)) === mese + 1)
    }
    //console.log(movimenti)
    MovimentiDettaglio.value = movimenti.map((item) => {
        return {
            Id: {
                Type: 'string',
                Value: item.Id,
                Class: 'text-center',
            },
            Data: {
                Type: 'date',
                Value: Data_ggmmaaaa_aaaammgg(item.Data),
                Class: 'text-center',
                Valido: 'p'
            },
            Accrediti: {
                Type: 'number',
                Value: item.Accrediti,
                Class: 'text-center',
                Controlla2Campi: '0'
            },
            Addebiti: {
                Type: 'number',
                Value: item.Addebiti,
                Class: 'text-center',
                Controlla2Campi: '0'
            },
            Descrizione: {
                Type: 'string',
                Value: item.Descrizione,
                Class: 'text-left',
                Valido: 'p'
            },
            DescrizioneEstesa: {
                Type: 'string',
                Value: item.DescrizioneEstesa,
                Class: 'text-left w-full',
                Valido: 'p'
            },
            IdCategoria: {
                Type: 'select',
                Value: item.IdCategoria,
                Array: DatiCombo(),
                Class: 'text-left',
                Valido: 'p'
            }
        }
    })
}
const DatiCombo = () => {
    const tmp = Pinia.Categorie().getElenco.sort((a, b) => {
        if (a.Nome < b.Nome) {
            return -1
        } else if (a.Nome > b.Nome) {
            return 1
        }
        return 0
    })
    return tmp.map((item) => {
        return {
            text: item.Nome,
            value: item.Id
        }
    })
}

onMounted(() => {
    /*for (let m = 1; m < 13; m++) {
        TotaliMesi.value.push({ Entrate: 10, Uscite: 20, Investimenti: 30 })
    }*/
})

</script>
<style>
th {
    @apply bg-gray-300;
}
</style>