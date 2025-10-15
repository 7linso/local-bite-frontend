import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('@/views/HomeView.vue')
const About = () => import('@/views/AboutView.vue')
const Login = () => import('@/views/LoginView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/Shell.vue'),
      children: [
        { path: '', name: 'home', component: Home },
        { path: 'about', name: 'about', component: About },
        { path: 'login', name: 'login', component: Login },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

export default router
