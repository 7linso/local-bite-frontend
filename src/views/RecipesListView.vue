<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue'
import MapView from '@/components/ui/MapView.vue'
import { useRecipeListStore } from '@/stores/useRecipeListStore'
import SearchRecipesForm from '@/components/ui/recipe/SearchRecipesForm.vue'
import { useRouter } from 'vue-router'
import RecipeModal from '@/components/ui/modals/RecipeModal.vue'
import RecipesList from '@/components/ui/recipe/RecipesList.vue'
import { storeToRefs } from 'pinia'

const router=useRouter()

const recipeStore = useRecipeListStore()
const { 
    errors, 
    loading, 
    currentFilters, 
    list, 
    geojson, 
    hasNextPage 
} = storeToRefs(recipeStore)
const { fetchFirstPage, fetchNextPage } = recipeStore

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

const debounceTimer = ref<number | null>(null)

watch(currentFilters, () => {
        if (debounceTimer.value !== null) 
            clearTimeout(debounceTimer.value)
        debounceTimer.value = window.setTimeout(() => {
            fetchFirstPage()
        }, 400)
    }, { deep: true }
)

onMounted(()=>{
    fetchFirstPage()
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
            @openRecipe="router.push(`/recipes/${selectedRecipe._id}`)"
        />
    </div>

    <!-- search + add -->
    <section class="mx-auto mt-4 mb-10 w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px]">
        <SearchRecipesForm/>

        <RecipesList
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

