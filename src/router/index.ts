import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue'),
    },
    {
      path: '/learn',
      name: 'learn',
      component: () => import('@/views/LearnPage.vue'),
    },
    {
      path: '/practice',
      name: 'practice',
      component: () => import('@/views/PracticePage.vue'),
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('@/views/GamePage.vue'),
    },
    {
      path: '/progress',
      name: 'progress',
      component: () => import('@/views/ProgressPage.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
