import { useAuthStore } from '@/stores/useAuthStore'
import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('@/views/HomeView.vue')
const SignUp = () => import('@/views/SignUpView.vue')
const SignIn = () => import('@/views/SignInView.vue')
const Profile = () => import('@/views/ProfileView.vue')
const AnotherProfile = () => import('@/views/AnotherProfile.vue')
const RecipesList = () => import('@/views/RecipesListView.vue')
const Recipe = () => import('@/views/RecipeView.vue')
const CreateRecipe = () => import('@/views/CreateRecipeView.vue')
const EditRecipe = () => import('@/views/EditRecipeView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/components/layout/Shell.vue'),
      children: [
        { path: '', name: 'home', component: Home },

        { path: 'signup', name: 'signup', component: SignUp, meta: { guestOnly: true } },
        { path: 'signin', name: 'signin', component: SignIn, meta: { guestOnly: true } },
        { path: 'profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },
        { path: 'profile/:username', name: 'anotherProfile', component: AnotherProfile},
      ],
    },
    {
      path: '/recipes',
      component: () => import('@/components/layout/Shell.vue'),
      children: [
        { path: '', name: 'recipesList', component: RecipesList },
        { path: ':id', name: 'recipe', component: Recipe, props: true },
        { path: 'create', name: 'recipesCreate', component: CreateRecipe, meta: { requiresAuth: true } },
        { path: ':id/edit', name: 'recipesEdit', component: EditRecipe, props: true, meta: { requiresAuth: true } },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.ensureAuthChecked()

  const authPages = ['signin', 'signup']
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)

  if (auth.isAuth && authPages.includes(to.name as string))
    return { name: 'home' }

  if (requiresAuth && !auth.isAuth)
    return { name: 'signin', query: { redirect: to.fullPath } }
})

export default router
