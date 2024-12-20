import { Login } from "./modules/Login.module"
import { Assistenti } from "./modules/VitaIndipendente/Assistenti.module"
import { Buste } from "./modules/VitaIndipendente/Buste.module"
import { Compleanni } from "./modules/Compleanni.module"
import { Scadenze } from "./modules/Condomini/Scadenze.module"
import { CalendarioFilosofico } from "./modules/CalendarioFilosofico.module"
import { SuperCategorie } from "./modules/Banca/SuperCategorie.module"
import { Categorie } from './modules/Banca/Categorie.module'
import { Movimenti } from "./modules/Banca/Movimenti.module"
import { Rimborsi730 } from "./modules/Banca/Rimborsi730.module"
import { HandiphoneCategorie } from "./modules/Handiphone/Categorie.module"
import { HandiphoneParoleFrasi } from "./modules/Handiphone/ParoleFrasi.module"

export const Pinia = {
    Login,
    Assistenti,
    Buste,
    Compleanni,
    Scadenze,
    CalendarioFilosofico,
    SuperCategorie,
    Categorie,
    Movimenti,
    Rimborsi730,
    HandiphoneCategorie,
    HandiphoneParoleFrasi
}
