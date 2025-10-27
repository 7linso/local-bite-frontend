import { api } from '@/services/api'
import type { Recipe, RecipePayload } from '../types'

export const recipes = {
    createRecipe: (p: RecipePayload) => api.post('/recipes', p),

    getAllRecipes: (params?: Record<string, any>) =>
        api.get<any>('/recipes', { params }),

    getRecipe: (p: string) => api.get<Recipe>(`/recipes/${p}`),

    deleteRecipe: (p: string) => api.delete(`/recipes/${p}`)

}