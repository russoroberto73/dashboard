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
      path: '/excel',
      name: 'Excel',
      component: () => import('@/views/Banca/Excel.vue')
    }
  ]
})

export default router
