<script lang="ts" setup>
import { useRecipeListStore } from '@/stores/useRecipeListStore';
import { storeToRefs } from 'pinia';
import RecipesList from '../recipe/RecipesList.vue';

const recipeStore = useRecipeListStore()
const {
    pointCoords,
    pointError,
    pointLoading,
    pointOpen,
    pointRecipes
} = storeToRefs(recipeStore)

const emit = defineEmits<{
    (e: 'openRecipe', id: string): void;
}>()

</script>

<template>
    <aside class="hidden md:block fixed top-0 right-0 h-full w-full max-w-[360px] bg-white shadow-xl border-l border-gray-200 z-40 transition-transform duration-300"
        :class="pointOpen ? 'translate-x-0' : 'translate-x-full'"
    >
        <div class="p-4 border-b flex items-start justify-between">
            <div>
                <div v-if="pointCoords"
                    class="text-xs text-gray-500" 
                >
                {{ pointCoords.lat.toFixed(4) }}, {{ pointCoords.lng.toFixed(4) }}
                </div>
                <h2 class="text-base font-semibold text-gray-900">
                    Recipes here
                </h2>
            </div>
            <button
                class="text-gray-400 hover:text-gray-600 text-sm"
                @click="pointOpen = false"
            >
                ✕
            </button>
            </div>

            <!-- body -->
            <div class="overflow-y-auto p-4 h-[calc(100%-56px)]">
                <RecipesList 
                    :recipes="pointRecipes"
                    :errors="pointError"
                    :loading="pointLoading"
                    @openRecipe="(id: string) => emit('openRecipe', id)"
                />
            </div>
    </aside>
</template>