import { api } from '@/services/api'
import type { RecipePayload } from '../types'

export const recipes = {
    createRecipe: (p: RecipePayload) => api.post('/recipes', p),

    getAllRecipes: (params?: Record<string, any>) =>
        api.get<any, any>('/recipes', { params })


}