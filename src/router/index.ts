import { child } from 'firebase/database'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/calendariofilosofico',
      name: 'CalendarioFilosofico',
      component: () => import('@/views/CalendarioFilosofico.vue')
    },
    {
      path: '/compleanni',
      name: 'Compleanni',
      component: () => import('@/views/Compleanni.vue')
    },
    {
      path: '/vitaindipendente',
      children: [
        {
          path: 'assistenti',
          name: 'Assistenti',
          component: () => import('@/views/VitaIndipendente/Assistenti.vue')
        },
        {
          path: 'assistentinero',
          name: 'AssistentiNero',
          component: () => import('@/views/VitaIndipendente/AssistentiNero.vue')
        },
        {
          path: 'bustepaga',
          name: 'BustePaga',
          component: () => import('@/views/VitaIndipendente/BustePaga.vue')
        },
        {
          path: 'pagheassistentinero',
          name: 'BustePagaNero',
          component: () => import('@/views/VitaIndipendente/PagheAssistentiNero.vue')
        },
        {
          path: 'turni',
          name: 'TurniCalendario',
          component: () => import('@/views/VitaIndipendente/Turni/Calendario.vue'),
          children: [
            {
              path: ':id',
              name: 'TurniDettaglio',
              component: () => import('@/views/VitaIndipendente/Turni/Calendario.vue'),
              /*meta: {
                hideAside: 'stampa'
              }*/
            }
          ]
        }
      ]
    },
    {
      path: '/banca',
      children: [
        {
          path: '/supercategorie',
          name: 'SuperCategorie',
          component: () => import('@/views/Banca/SuperCategorie.vue')
        },
        {
          path: '/categorie',
          name: 'Categorie',
          component: () => import('@/views/Banca/Categorie.vue')
        },
        {
          path: '/movimenti',
          name: 'Movimenti',
          component: () => import('@/views/Banca/Movimenti.vue')
        },
        {
          path: '/tabellone',
          name: 'Tabellone',
          component: () => import('@/views/Banca/Tabellone.vue')
        },
        {
          path: '/confronto',
          name: 'Confronto',
          component: () => import('@/views/Banca/Confronto.vue')
        },
        {
          path: '/730',
          name: '730',
          component: () => import('@/views/Banca/Rimborso730.vue')
        },
        {
          path: '/patrimonio/banche',
          name: 'Banche',
          component: () => import('@/views/Banca/Patrimonio/Banche.vue')
        },
        {
          path: '/patrimonio/gruppiprimo',
          name: 'GruppiPrimoLivello',
          component: () => import('@/views/Banca/Patrimonio/Gruppi.vue')
        },
        {
          path: '/patrimonio/date',
          name: 'PatrimonioDate',
          component: () => import('@/views/Banca/Patrimonio/Date.vue')
        },
        {
          path: '/patrimonio/titoli',
          name: 'Titoli',
          component: () => import('@/views/Banca/Patrimonio/Titoli.vue')
        },
        {
          path: '/patrimonio/situazionefideuram',
          name: 'SituazioneFideuram',
          component: () => import('@/views/Banca/Patrimonio/SituazioneBanche.vue')
        }
      ]
    },
    {
      path: '/handiphone',
      name: 'Handiphone',
      component: () => import('@/views/HandiphoneCodiciFrasi.vue')
    },
    {
      path: '/password',
      children: [
        {
          path: 'gruppi',
          name: 'GruppiPassword',
          component: () => import('@/views/Password/GruppiPassword.vue')
        },
        {
          path: 'account',
          name: 'AccountPassword',
          component: () => import('@/views/Password/AccountPassword.vue')
        }
      ]
    },
    {
      path: '/butolino',
      children: [
        {
          path: 'distretti',
          name: 'BotulinoDistretti',
          component: () => import('@/views/Botulino/Distretti.vue')
        },
        {
          path: 'muscoli',
          name: 'BotulinoMuscoli',
          component: () => import('@/views/Botulino/Muscoli.vue')
        },
        {
          path: 'qtydate',
          name: 'BotulinoQtyDate',
          component: () => import('@/views/Botulino/QtyDate.vue')
        },
        {
          path: 'tabellone',
          name: 'BotulinoTabellone',
          component: () => import('@/views/Botulino/Tabellone.vue')
        }
      ]
    },
    {
      path: '/temanatale',
      children: [
        {
          path: 'elementi',
          name: 'TemaNataleElementi',
          component: () => import('@/views/TemaNatale/Elementi.vue')
        },
        {
          path: 'case',
          name: 'TemaNataleCase',
          component: () => import('@/views/TemaNatale/Case.vue')
        },
        {
          path: 'gruppicase',
          name: 'TemaNataleGruppiCase',
          component: () => import('@/views/TemaNatale/GruppiCase.vue')
        },
        {
          path: 'governatorisegni',
          name: 'TemaNataleGovernatoriSegni',
          component: () => import('@/views/TemaNatale/GovernatoriSegni.vue')
        },
        {
          path: 'oppostosegni',
          name: 'TemaNataleOppostoSegni',
          component: () => import('@/views/TemaNatale/OppostoSegni.vue')
        },
        {
          path: 'segni',
          name: 'TemaNataleSegni',
          component: () => import('@/views/TemaNatale/Segni.vue')
        },
        {
          path: 'stagioni',
          name: 'TemaNataleStagioni',
          component: () => import('@/views/TemaNatale/Stagioni.vue')
        },
        {
          path: 'polaritasegni',
          name: 'TemaNatalePolaritàSegni',
          component: () => import('@/views/TemaNatale/PolaritàSegni.vue')
        },
        {
          path: 'quadruplicitasegni',
          name: 'TemaNataleQuadruplicitàSegni',
          component: () => import('@/views/TemaNatale/QuadruplicitàSegni.vue')
        },
        {
          path: 'tipologiapianeti',
          name: 'TemaNataleTipologiaPianeti',
          component: () => import('@/views/TemaNatale/TipologiaPianeti.vue')
        },
        {
          path: 'natura',
          name: 'TemaNataleNatura',
          component: () => import('@/views/TemaNatale/Natura.vue')
        },
        {
          path: 'pianeti',
          name: 'TemaNatalePianeti',
          component: () => import('@/views/TemaNatale/Pianeti.vue')
        },
        {
          path: 'pianeti/elementi',
          name: 'TemaNatalePianetiElementi',
          component: () => import('@/views/TemaNatale/PianetiElementi.vue')
        },
        {
          path: 'pianeti/segni',
          name: 'TemaNatalePianetiSegni',
          component: () => import('@/views/TemaNatale/PianetiSegni.vue')
        },
        {
          path: 'letturatemanatale',
          name: 'TemaNataleLetturaTemaNatale',
          component: () => import('@/views/TemaNatale/LetturaTemaNatale.vue')
        },
        {
          path: 'pianeticasesegni',
          name: 'TemaNatalePianetiCaseSegni',
          component: () => import('@/views/TemaNatale/PianetiCaseSegni.vue')
        }
      ]
    },
    {
      path: '/libri',
      name: 'Libri',
      component: () => import('@/views/Libri/Libri.vue')
    },
    {
      path: '/libri/recensioni',
      name: 'Recensioni',
      component: () => import('@/views/Libri/Recensioni.vue')
    },
    {
      path: '/download',
      name: 'Download',
      component: () => import('@/views/Download.vue')
    },
    {
      path: '/copydb',
      name: 'CopyDb',
      component: () => import('@/views/CopiareDatabase.vue')
    },
    {
      path: '/copydb',
      name: 'CopyDb',
      component: () => import('@/views/CopyDb.vue')
    }
  ]
})

export default router
