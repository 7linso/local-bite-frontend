<script lang="ts" setup>
import { onMounted, onUnmounted, ref, onActivated, watch, defineOptions } from 'vue'
import MapView from '@/components/ui/MapView.vue'
import { useRecipeListStore } from '@/stores/useRecipeListStore'
import SearchRecipesForm from '@/components/ui/recipe/SearchRecipesForm.vue'
import { useRouter } from 'vue-router'
import MapDesktopModal from '@/components/ui/modals/MapDesktopModal.vue'
import MapMobileModal from '@/components/ui/modals/MapMobileModal.vue'
import RecipesList from '@/components/ui/recipe/RecipesList.vue'
import { storeToRefs } from 'pinia'

defineOptions({
    name: 'RecipesListPage'
})

const router=useRouter()

const recipeStore = useRecipeListStore()
const {
    currentFilters, 
    geojson, 
    hasNextPage,
    list,
    errors,
    loading,
} = storeToRefs(recipeStore)
const { fetchFirstPage, fetchNextPage, fetchPointRecipes} = recipeStore

const isMdPlusScreen = ref<boolean>(false)

const checkScreen = () => {
    isMdPlusScreen.value = window.innerWidth >= 768
}

const openRecipesByLocationModal = (
    data: { lat: number; lng: number }
) => {
    fetchPointRecipes(data.lat, data.lng)
}

const debounceTimer = ref<number | null>(null)

watch(currentFilters, () => {
        if (debounceTimer.value !== null) 
            clearTimeout(debounceTimer.value)
        debounceTimer.value = window.setTimeout(() => {
            fetchFirstPage()
        }, 400)
    }, { deep: true }
)

// onMounted(() => {
//     fetchFirstPage()
// })

onActivated(() => {
    fetchFirstPage()
    checkScreen()
    window.addEventListener('resize', checkScreen)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkScreen)
})
</script>

<template>
    <div class="relative h-[60vh] w-full">
        <MapView 
            :points="geojson"
            @pointClick="openRecipesByLocationModal"
        />

        <MapDesktopModal v-if="isMdPlusScreen"
            @openRecipe="(id: string) => router.push(`/recipes/${id}`)"
        /> 

        <MapMobileModal v-else
            @openRecipe="(id: string) => router.push(`/recipes/${id}`)"
        /> 
    </div>

    <!-- search + add -->
    <section class="mx-auto mt-4 mb-10 w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px]">
        <SearchRecipesForm/>

        <RecipesList 
            :recipes="list"
            :errors="errors"
            :loading="loading"
            @openRecipe="(id: string) => router.push(`/recipes/${id}`)"
            @create="router.push(`/recipes/create`)"
        />
        
        <div v-show="hasNextPage" class="flex justify-center items-center gap-2 my-6">
            <button @click="fetchNextPage"
                class="inline-flex w-full md:w-auto items-center justify-center rounded-xl border border-gray-800 px-4 py-2 font-medium  hover:bg-gray-900 hover:text-white focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-gray-800 transition" >
                More
            </button>
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

