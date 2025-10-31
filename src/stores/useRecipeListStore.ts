import { defineStore } from "pinia";
import { ref, unref, reactive } from 'vue'
import { recipes } from "@/lib/api/recipes";
import type { FeatureCollection, Feature, Point } from 'geojson'
import type { RecipeCardPreview, SearchRecipesFilters } from "@/lib/types";
import { useAuthStore } from "./useAuthStore";

export const useRecipeListStore = defineStore('recipes', () => {
    const auth = useAuthStore()

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
        nearLat: null,
        nearLng: null,
        maxKm: null
    })

    const pointRecipes = ref<RecipeCardPreview[]>([])
    const pointLoading = ref(false)
    const pointError = reactive<Record<string, string>>({})
    const pointCoords = ref<{ lat: number; lng: number } | null>(null)
    const pointOpen = ref(false)

    const usersRecipes = ref<RecipeCardPreview[]>([])

    const resetErrors = () => {
        for (const k of Object.keys(errors)) delete errors[k]
    }

    const resetPointError = () => {
        for (const k of Object.keys(pointError)) delete pointError[k]
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

    const fetchFirstPage = async () => {
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

    const fetchPointRecipes = async (lat: number, lng: number) => {
        try {
            pointLoading.value = true
            resetPointError()
            pointCoords.value = { lat, lng }

            const res = await recipes.getAllRecipes({
                limit: 10,
                q: currentFilters.value.q,
                country: currentFilters.value.country === 'All' ? '' : currentFilters.value.country,
                dishTypes: [...currentFilters.value.dishTypes].join(','),
                nearLat: lat,
                nearLng: lng,
                maxKm: 1
            })

            pointRecipes.value = res.items
            pointOpen.value = true
        } catch (e: any) {
            pointError.list = e?.data?.message ?? e.message ?? 'Failed to load recipes for this location'
            pointRecipes.value = []
            pointOpen.value = true
        } finally {
            pointLoading.value = false
        }
    }

    const fetchUsersRecipes = async () => {
        try {
            loading.value = true
            resetErrors()

            const u = unref(auth.user)
            const userId = u?._id
            if (!userId) return

            const res = await recipes.getAllRecipes({
                limit: 20,
                authorId: userId
            })

            usersRecipes.value = res.items
            nextCursor.value = res.nextCursor
            hasNextPage.value = !!res.hasNextPage

        } catch (e: any) {
            errors.usersRecipes = e?.data?.message ?? e.message ?? 'Failed to load recipes'
            usersRecipes.value = []
            nextCursor.value = null
            hasNextPage.value = false
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
        updateFilterField,
        fetchPointRecipes,
        pointCoords,
        pointError,
        pointLoading,
        pointOpen,
        pointRecipes,
        usersRecipes,
        fetchUsersRecipes
    }
})