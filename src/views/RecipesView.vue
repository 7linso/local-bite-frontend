<script lang="ts" setup>
import { onMounted, reactive, ref, computed, watch } from 'vue'
import MapView from '@/components/ui/MapView.vue'
import { useRecipe } from '@/composables/recipe/useRecipe'
import { useToast } from 'vue-toast-notification'
import { useAuthStore } from '@/stores/useAuthStore'
import SearchRecipesForm from '@/components/ui/forms/recipe/SearchRecipesForm.vue'

const auth = useAuthStore()
const toast = useToast()
const {errors, loading, getAllRecipes, list} = useRecipe(auth, toast)

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


        <div class="mt-4">
            <div class="rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
                {{ list.length }}
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

