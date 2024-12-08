import { createRouter, createWebHistory } from 'vue-router'
import PublicPageView from '@/views/PublicPage.vue'
import LoginFormView from '@/views/LoginForm.vue'
import AdminPageView from '@/views/AdminPage.vue'
import UserPageView from '@/views/UserPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: "public-page",
      component: PublicPageView
    },
    {
      path: '/signin',
      name: "logirm-form",
      component: LoginFormView
    },
    {
      path: '/admin',
      name: "admin-sayfasi",
      component: AdminPageView
    },
    {
      path: '/user',
      name: "user-page",
      component: UserPageView
    }
  ]
})

export default router
