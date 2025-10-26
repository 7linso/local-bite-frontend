import { ref, reactive } from 'vue'
import { recipes } from '@/lib/api/recipes'
import type { RecipeCardPreview } from '@/lib/types'
import type { FeatureCollection, Feature, Point } from 'geojson'

export const useRecipeList = () => {
  const loading = ref(false)
  const errors = reactive<Record<string, string>>({})

  const list = ref<RecipeCardPreview[]>([])
  const nextCursor = ref<string | null>(null)

  const geojson = ref<FeatureCollection<Point>>({
    type: 'FeatureCollection',
    features: []
  })

  const resetErrors = () => {
    for (const k of Object.keys(errors)) delete errors[k]
  }

  const getAllRecipes = async (params?: Record<string, any>) => {
    try {
      loading.value = true
      resetErrors()

      const res = await recipes.getAllRecipes(params)

      list.value = res.items
      nextCursor.value = res.nextCursor

      geojson.value = {
        type: 'FeatureCollection',
        features: list.value.map((r): Feature<Point> => ({
          type: 'Feature',
          properties: {
            id: r._id,
            title: r.title,
          },
          geometry: {
            type: 'Point',
            coordinates: r.point.coordinates,
          },
        })),
      }
    } catch (e: any) {
      errors.all = e?.data?.message ?? e.message
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    errors,
    list,
    nextCursor,
    geojson,
    getAllRecipes,
  }
}
