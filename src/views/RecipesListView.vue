<script lang="ts" setup>
import { onMounted, reactive, ref, computed, watch } from 'vue'
import MapView from '@/components/ui/MapView.vue'
import { useRecipe } from '@/composables/recipe/useRecipe'
import { useToast } from 'vue-toast-notification'
import { useAuthStore } from '@/stores/useAuthStore'
import SearchRecipesForm from '@/components/ui/recipe/SearchRecipesForm.vue'
import RecipePreviewCard from '@/components/ui/recipe/RecipePreviewCard.vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const toast = useToast()
const router=useRouter()
const {loading, getAllRecipes, list} = useRecipe(auth, toast)

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
        <MapView />
    </div>

    <!-- search + add -->
    <section class="mx-auto mt-4 w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px]">
        <SearchRecipesForm
            v-model:searchParams="searchParams"
            @search="runSearch"
        />

        <!-- empty list fallback -->
        <div v-if="list.length === 0" class="mt-10 text-center">
            <h3 class="text-lg font-semibold">
                There are no recipes yet or there's an error getting them
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
                <RecipePreviewCard :recipe="r" />
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

