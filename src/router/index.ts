import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('@/views/HomeView.vue')
const About = () => import('@/views/AboutView.vue')
const SignUp = () => import('@/views/SignUpView.vue')
const SignIn = () => import('@/views/SignInView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/Shell.vue'),
      children: [
        { path: '', name: 'home', component: Home },
        { path: 'about', name: 'about', component: About },
        { path: 'signup', name: 'signup', component: SignUp },
        { path: 'signin', name: 'signin', component: SignIn },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

export default router
