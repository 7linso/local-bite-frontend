<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue'
import MapView from '@/components/ui/MapView.vue'
import { useRecipeList } from '@/composables/recipe/useRecipeList'
import SearchRecipesForm from '@/components/ui/recipe/SearchRecipesForm.vue'
import RecipePreviewCard from '@/components/ui/recipe/RecipePreviewCard.vue'
import { useRouter } from 'vue-router'
import RecipeModal from '@/components/ui/modals/RecipeModal.vue'

const router=useRouter()
const {errors, loading, getAllRecipes, list, geojson} = useRecipeList()

const selectedRecipe = ref<any | null>(null)
const modalX = ref(0)
const modalY = ref(0)

const openPreviewModal = (data: {
    id: string
    screenX: number
    screenY: number
}) => {
    selectedRecipe.value = list.value.find(r => r._id === data.id) || null
    modalX.value = data.screenX
    modalY.value = data.screenY
}

const searchParams = ref({
    q: '',
    country: 'All',
    dishTypes: new Set<string>(),
})

const searchPayload = computed(() => ({
    q: searchParams.value.q,
    country: searchParams.value.country,
    dishTypes: [...searchParams.value.dishTypes]
}))

const debounceTimer = ref<number | null>(null)

const runSearch = (payload?: {
    q: string
    country: string
    dishTypes: string[]
}) => {
    const query = payload ?? searchPayload.value

    getAllRecipes({
        limit: 20,
        q: query.q,
        country: query.country === 'All' ? '' : query.country,
        dishTypes: query.dishTypes.join(',')
    })
}

watch( searchPayload, ()=> {
    if(debounceTimer.value !== null)
        clearTimeout(debounceTimer.value)

    debounceTimer.value = window.setTimeout(() => {
        runSearch()
    }, 400)
}, {deep: true})

onMounted(()=>{
    getAllRecipes({limit: 20})
})
</script>

<template>
    <div class="relative h-[60vh] w-full">
        <MapView 
            :points="geojson"
            @pointClick="openPreviewModal"
        />

        <RecipeModal
            v-if="selectedRecipe"
            :recipe="selectedRecipe"
            :x="modalX"
            :y="modalY"
            @close="selectedRecipe = null"
        />
    </div>

    <!-- search + add -->
    <section class="mx-auto mt-4 w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px]">
        <SearchRecipesForm
            v-model:searchParams="searchParams"
            @search="runSearch"
        />

        <!-- error state -->
        <div v-if="errors.all" class="mt-10 text-center">
            <h3 class="text-lg font-semibold">
                An error occured while fetching results
            </h3>
            <p class="text-gray-600">
                Sorry for inconvinience
            </p>
        </div>

        <!-- loading state -->
        <div
            v-if="loading"
            class="mt-10 text-center text-gray-500 text-sm"
        >
            Loading recipes...
        </div>

        <!-- empty list fallback -->
        <div v-else-if="!loading && list.length === 0" class="mt-10 text-center">
            <h3 class="text-lg font-semibold">
                There are no recipes
            </h3>
            <p class="text-gray-600">
                <span
                @click="router.push('/recipes/create')"
                class="underline cursor-pointer"
                >
                Add some recipes
                </span> or come back later
            </p>
        </div>

        <!-- list -->
        <div v-else class="my-4 space-y-5">
            <div
                v-for="r in list"
                :key="r._id"
                @click="router.push(`/recipes/${r._id}`)"
            >
                <RecipePreviewCard 
                    :recipe="r" 
                />
            </div>
        </div>

    </section>
</template>

<style scoped>
:deep(.no-scrollbar) {
  -ms-overflow-style: none; 
  scrollbar-width: none;       
}
:deep(.no-scrollbar::-webkit-scrollbar) {
  display: none;              
}
</style>

