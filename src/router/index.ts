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
      path: '/vitaindipendente/assistenti',
      name: 'Assistenti',
      component: () => import('@/views/VitaIndipendente/Assistenti.vue')
    },
    {
      path: '/vitaindipendente/bustepaga',
      name: 'BustePaga',
      component: () => import('@/views/VitaIndipendente/BustePaga.vue')
    },    
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
      path: '/handiphone',
      name: 'Handiphone',
      component: () => import('@/views/HandiphoneCodiciFrasi.vue')
    },    
    {
      path: '/password/gruppi',
      name: 'GruppiPassword',
      component: () => import('@/views/Password/GruppiPassword.vue')
    },     
    {
      path: '/password/account',
      name: 'AccountPassword',
      component: () => import('@/views/Password/AccountPassword.vue')
    },            
    {
      path: '/botulino/distretti',
      name: 'BotulinoDistretti',
      component: () => import('@/views/Botulino/Distretti.vue')
    },
    {
      path: '/botulino/muscoli',
      name: 'BotulinoMuscoli',
      component: () => import('@/views/Botulino/Muscoli.vue')
    },
    {
      path: '/botulino/qtydate',
      name: 'BotulinoQtyDate',
      component: () => import('@/views/Botulino/QtyDate.vue')
    },
    {
      path: '/botulino/tabellone',
      name: 'BotulinoTabellone',
      component: () => import('@/views/Botulino/Tabellone.vue')
    },
    {
      path: '/temanatale/elementi',
      name: 'TemaNataleElementi',
      component: () => import('@/views/TemaNatale/Elementi.vue')
    },    
    {
      path: '/temanatale/case',
      name: 'TemaNataleCase',
      component: () => import('@/views/TemaNatale/Case.vue')
    },   
    {
      path: '/temanatale/gruppicase',
      name: 'TemaNataleGruppiCase',
      component: () => import('@/views/TemaNatale/GruppiCase.vue')
    },     
    {
      path: '/temanatale/governatorisegni',
      name: 'TemaNataleGovernatoriSegni',
      component: () => import('@/views/TemaNatale/GovernatoriSegni.vue')
    },         
    {
      path: '/temanatale/oppostosegni',
      name: 'TemaNataleOppostoSegni',
      component: () => import('@/views/TemaNatale/OppostoSegni.vue')
    },     
    {
      path: '/temanatale/segni',
      name: 'TemaNataleSegni',
      component: () => import('@/views/TemaNatale/Segni.vue')
    },
    {
      path: '/temanatale/stagioni',
      name: 'TemaNataleStagioni',
      component: () => import('@/views/TemaNatale/Stagioni.vue')
    },
    {
      path: '/temanatale/polaritasegni',
      name: 'TemaNatalePolaritàSegni',
      component: () => import('@/views/TemaNatale/PolaritàSegni.vue')
    },  
    {
      path: '/temanatale/quadruplicitasegni',
      name: 'TemaNataleQuadruplicitàSegni',
      component: () => import('@/views/TemaNatale/QuadruplicitàSegni.vue')
    },         
    {
      path: '/temanatale/tipologiapianeti',
      name: 'TemaNataleTipologiaPianeti',
      component: () => import('@/views/TemaNatale/TipologiaPianeti.vue')
    },          
    {
      path: '/temanatale/natura',
      name: 'TemaNataleNatura',
      component: () => import('@/views/TemaNatale/Natura.vue')
    },              
    {
      path: '/temanatale/pianeti',
      name: 'TemaNatalePianeti',
      component: () => import('@/views/TemaNatale/Pianeti.vue')
    },                      
    {
      path: '/temanatale/pianeti/elementi',
      name: 'TemaNatalePianetiElementi',
      component: () => import('@/views/TemaNatale/PianetiElementi.vue')
    },                                 
    {
      path: '/temanatale/pianeti/segni',
      name: 'TemaNatalePianetiSegni',
      component: () => import('@/views/TemaNatale/PianetiSegni.vue')
    },     
    {
      path: '/temanatale/letturatemanatale',
      name: 'TemaNataleLetturaTemaNatale',
      component: () => import('@/views/TemaNatale/LetturaTemaNatale.vue')
    },     
    {
      path: '/word',
      name: 'Word',
      component: () => import('@/views/Word.vue')
    },     
    {
      path: '/copydb',
      name: 'CopyDb',
      component: () => import('@/views/CopiareDatabase.vue')
    }
  ]
})

export default router
