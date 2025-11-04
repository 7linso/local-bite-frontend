import { defineStore } from 'pinia'
import { ref, reactive, unref } from 'vue'
import type { FeatureCollection, Feature, Point } from 'geojson'
import type { RecipeCardPreview, SearchRecipesFilters } from '@/lib/types'
import { recipes } from '@/lib/api/recipes'
import { useAuthStore } from './useAuthStore'

export const useRecipeListStore = defineStore('recipes', () => {
    const auth = useAuthStore()

    const currentFilters = ref<SearchRecipesFilters>({
        q: '',
        country: 'All',
        dishTypes: new Set(),
        nearLat: null,
        nearLng: null,
        maxKm: null,
    })
    const updateFilterField = <K extends keyof SearchRecipesFilters>(
        key: K,
        value: SearchRecipesFilters[K]
    ) => {
        currentFilters.value = { ...currentFilters.value, [key]: value }
    }

    const main = {
        loading: ref(false),
        error: ref<string | null>(null),
        list: ref<RecipeCardPreview[]>([]),
        nextCursor: ref<string | null>(null),
        hasNextPage: ref(false),
        geojson: ref<FeatureCollection<Point>>({ type: 'FeatureCollection', features: [] }),
    }

    const point = {
        loading: ref(false),
        error: ref<string | null>(null),
        recipes: ref<RecipeCardPreview[]>([]),
        coords: ref<{ lat: number; lng: number } | null>(null),
        open: ref(false),
    }

    const users = {
        loading: ref(false),
        error: ref<string | null>(null),
        list: ref<RecipeCardPreview[]>([]),
        nextCursor: ref<string | null>(null),
        hasNextPage: ref(false),
    }

    const liked = {
        loading: ref(false),
        error: ref<string | null>(null),
        list: ref<RecipeCardPreview[]>([]),
        nextCursor: ref<string | null>(null),
        hasNextPage: ref(false),
    }

    type AuthorBucket = {
        loading: boolean
        error: string | null
        list: RecipeCardPreview[]
        nextCursor: string | null
        hasNextPage: boolean
    }

    const authors = reactive<Record<string, AuthorBucket>>({})

    const buildParams = (extra: Record<string, any> = {}) => ({
        limit: 20,
        q: currentFilters.value.q,
        country: currentFilters.value.country === 'All' ? '' : currentFilters.value.country,
        dishTypes: [...currentFilters.value.dishTypes].join(','),
        ...extra,
    })

    const toGeoJSON = (items: RecipeCardPreview[]): FeatureCollection<Point> => ({
        type: 'FeatureCollection',
        features: items.map(
            (r): Feature<Point> => ({
                type: 'Feature',
                properties: { id: r._id, title: r.title },
                geometry: { type: 'Point', coordinates: r.point.coordinates },
            })
        ),
    })

    const ensureAuthor = (authorId: string) => {
        if (!authors[authorId]) {
            authors[authorId] = {
                loading: false,
                error: null,
                list: [],
                nextCursor: null,
                hasNextPage: false,
            }
        }
    }

    const fetchFirstPage = async () => {
        main.loading.value = true
        main.error.value = null
        try {
            const res = await recipes.getAllRecipes(buildParams({ cursor: undefined }))
            main.list.value = res.items
            main.nextCursor.value = res.nextCursor
            main.hasNextPage.value = !!res.hasNextPage
            main.geojson.value = toGeoJSON(main.list.value)
        } catch (e: any) {
            main.error.value = e?.data?.message ?? e?.message ?? 'Failed to load recipes'
            main.list.value = []
            main.nextCursor.value = null
            main.hasNextPage.value = false
            main.geojson.value = { type: 'FeatureCollection', features: [] }
        } finally {
            main.loading.value = false
        }
    }

    const fetchNextPage = async () => {
        if (!main.nextCursor.value) return
        main.loading.value = true
        main.error.value = null
        try {
            const res = await recipes.getAllRecipes(buildParams({ cursor: main.nextCursor.value }))
            main.list.value.push(...res.items)
            main.nextCursor.value = res.nextCursor
            main.hasNextPage.value = !!res.hasNextPage
            main.geojson.value = toGeoJSON(main.list.value)
        } catch (e: any) {
            main.error.value = e?.data?.message ?? e?.message ?? 'Failed to load more recipes'
        } finally {
            main.loading.value = false
        }
    }

    const fetchPointRecipes = async (lat: number, lng: number) => {
        point.loading.value = true
        point.error.value = null
        point.coords.value = { lat, lng }
        try {
            const res = await recipes.getAllRecipes({
                limit: 10,
                q: currentFilters.value.q,
                country: currentFilters.value.country === 'All' ? '' : currentFilters.value.country,
                dishTypes: [...currentFilters.value.dishTypes].join(','),
                nearLat: lat,
                nearLng: lng,
                maxKm: 1,
            })
            point.recipes.value = res.items
            point.open.value = true
        } catch (e: any) {
            point.error.value =
                e?.data?.message ?? e?.message ?? 'Failed to load recipes for this location'
            point.recipes.value = []
            point.open.value = true
        } finally {
            point.loading.value = false
        }
    }

    const fetchUsersRecipes = async () => {
        users.loading.value = true
        users.error.value = null
        try {
            const u = unref(auth.user)
            const userId = u?._id
            if (!userId) {
                users.list.value = []
                users.nextCursor.value = null
                users.hasNextPage.value = false
                return
            }
            const res = await recipes.getAllRecipes({
                limit: 20,
                authorId: userId,
            })
            users.list.value = res.items
            users.nextCursor.value = res.nextCursor ?? null
            users.hasNextPage.value = !!res.hasNextPage
        } catch (e: any) {
            users.error.value = e?.data?.message ?? e?.message ?? 'Failed to load user recipes'
            users.list.value = []
            users.nextCursor.value = null
            users.hasNextPage.value = false
        } finally {
            users.loading.value = false
        }
    }

    const fetchNextUsersRecipes = async () => {
        if (!users.nextCursor.value) return
        users.loading.value = true
        users.error.value = null
        try {
            const u = unref(auth.user)
            const userId = u?._id
            const res = await recipes.getAllRecipes({
                limit: 20,
                cursor: users.nextCursor.value,
                authorId: userId,
            })
            users.list.value.push(...res.items)
            users.nextCursor.value = res.nextCursor ?? null
            users.hasNextPage.value = !!res.hasNextPage
        } catch (e: any) {
            users.error.value = e?.data?.message ?? e?.message ?? 'Failed to load more liked recipes'
        } finally {
            users.loading.value = false
        }
    }

    const fetchUsersLikedRecipes = async () => {
        liked.loading.value = true
        liked.error.value = null
        try {
            const u = unref(auth.user)
            const userId = u?._id
            if (!userId) {
                liked.list.value = []
                liked.nextCursor.value = null
                liked.hasNextPage.value = false
                return
            }
            const res = await recipes.getLikedRecipes({ limit: 20 })
            liked.list.value = res.items
            liked.nextCursor.value = res.nextCursor ?? null
            liked.hasNextPage.value = !!res.hasNextPage
        } catch (e: any) {
            liked.error.value = e?.data?.message ?? e?.message ?? 'Failed to load liked recipes'
            liked.list.value = []
            liked.nextCursor.value = null
            liked.hasNextPage.value = false
        } finally {
            liked.loading.value = false
        }
    }

    const fetchNextUsersLikedRecipes = async () => {
        if (!liked.nextCursor.value) return
        liked.loading.value = true
        liked.error.value = null
        try {
            const res = await recipes.getLikedRecipes({ limit: 20, cursor: liked.nextCursor.value })
            liked.list.value.push(...res.items)
            liked.nextCursor.value = res.nextCursor ?? null
            liked.hasNextPage.value = !!res.hasNextPage
        } catch (e: any) {
            liked.error.value = e?.data?.message ?? e?.message ?? 'Failed to load more liked recipes'
        } finally {
            liked.loading.value = false
        }
    }

    async function fetchAuthorFirstPage(authorId: string) {
        ensureAuthor(authorId)
        const s = authors[authorId]
        if (!s) return

        s.loading = true; s.error = null
        try {
            const res = await recipes.getAllRecipes({ limit: 20, authorId })
            s.list = res.items
            s.nextCursor = res.nextCursor ?? null
            s.hasNextPage = !!res.hasNextPage
        } catch (e: any) {
            s.error = e?.data?.message ?? e?.message ?? 'Failed to load recipes'
            s.list = []; s.nextCursor = null; s.hasNextPage = false
        } finally { s.loading = false }
    }

    async function fetchAuthorNextPage(authorId: string) {
        ensureAuthor(authorId)
        const s = authors[authorId]
        if (!s) return

        if (!s.nextCursor) return
        s.loading = true; s.error = null
        try {
            const res = await recipes.getAllRecipes({ limit: 20, cursor: s.nextCursor, authorId })
            s.list.push(...res.items)
            s.nextCursor = res.nextCursor ?? null
            s.hasNextPage = !!res.hasNextPage
        } catch (e: any) {
            s.error = e?.data?.message ?? e?.message ?? 'Failed to load more recipes'
        } finally { s.loading = false }
    }


    return {
        // filters
        currentFilters,
        updateFilterField,

        // list + map
        loading: main.loading,
        errors: reactive({ list: '' as any }),
        list: main.list,
        nextCursor: main.nextCursor,
        hasNextPage: main.hasNextPage,
        geojson: main.geojson,

        // point 
        pointCoords: point.coords,
        pointError: reactive({ list: '' as any }),
        pointLoading: point.loading,
        pointOpen: point.open,
        pointRecipes: point.recipes,

        // users 
        usersRecipes: users.list,
        usersLoading: users.loading,
        usersError: users.error,
        usersHasNextPage: users.hasNextPage,
        usersNextCursor: users.nextCursor,

        //liked
        usersLikedRecipes: liked.list,
        likedLoading: liked.loading,
        likedError: liked.error,
        likedHasNextPage: liked.hasNextPage,
        likedNextCursor: liked.nextCursor,

        authors,

        // methods
        fetchFirstPage,
        fetchNextPage,
        fetchPointRecipes,
        fetchUsersRecipes,
        fetchNextUsersRecipes,
        fetchUsersLikedRecipes,
        fetchNextUsersLikedRecipes,
        fetchAuthorFirstPage,
        fetchAuthorNextPage,
    }
})
