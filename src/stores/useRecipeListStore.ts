import { defineStore } from "pinia";
import { ref, reactive } from 'vue'
import { recipes } from "@/lib/api/recipes";
import type { FeatureCollection, Feature, Point } from 'geojson'
import type { RecipeCardPreview, SearchRecipesFilters } from "@/lib/types";

export const useRecipeListStore = defineStore('recipes', () => {
    const loading = ref(false)
    const errors = reactive<Record<string, string>>({})
    const list = ref<RecipeCardPreview[]>([])

    const nextCursor = ref<string | null>(null)
    const hasNextPage = ref<boolean>(false)

    const geojson = ref<FeatureCollection<Point>>({
        type: 'FeatureCollection',
        features: []
    })

    const currentFilters = ref<SearchRecipesFilters>({
        q: '',
        country: 'All',
        dishTypes: new Set(),
    })

    const resetErrors = () => {
        for (const k of Object.keys(errors)) delete errors[k]
    }

    const updateFilterField = <K extends keyof SearchRecipesFilters>(
        key: K,
        value: SearchRecipesFilters[K]
    ) => {
        currentFilters.value = { ...currentFilters.value, [key]: value }
    }

    const buildQueryParams = (extra: Record<string, any> = {}) => {
        return {
            limit: 20,
            q: currentFilters.value.q,
            country: currentFilters.value.country === 'All' ? '' : currentFilters.value.country,
            dishTypes: [...currentFilters.value.dishTypes].join(','),
            ...extra,
        }
    }

    const fetchFirstPage = async (params?: Record<string, any>) => {
        try {
            loading.value = true
            resetErrors()

            const res = await recipes.getAllRecipes(buildQueryParams({
                cursor: undefined
            }))

            list.value = res.items
            nextCursor.value = res.nextCursor
            hasNextPage.value = !!res.hasNextPage

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
            errors.list = e?.data?.message ?? e.message ?? 'Failed to load recipes'
            list.value = []
            nextCursor.value = null
            hasNextPage.value = false
        } finally {
            loading.value = false
        }
    }

    const fetchNextPage = async () => {
        if (!nextCursor.value)
            return
        try {
            loading.value = true
            resetErrors()

            const res = await recipes.getAllRecipes(
                buildQueryParams({
                    cursor: nextCursor.value,
                })
            )

            list.value.push(...res.items)
            nextCursor.value = res.nextCursor
            hasNextPage.value = !!res.hasNextPage

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
            errors.list = e?.data?.message ?? e.message ?? 'Failed to load more recipes'
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        errors,
        hasNextPage,
        nextCursor,
        list,
        currentFilters,
        geojson,
        fetchFirstPage,
        fetchNextPage,
        updateFilterField
    }
})