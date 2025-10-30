<script lang="ts" setup>
import { useRecipeListStore } from '@/stores/useRecipeListStore';
import { storeToRefs } from 'pinia';
import RecipesList from '../recipe/RecipesList.vue';

const recipeStore = useRecipeListStore()
const {
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
    <div
        v-if="pointOpen"
        class="fixed inset-0 z-30"
        @click="pointOpen = false"
    >
        <aside class="hidden md:block fixed top-0 right-0 h-full w-full max-w-[360px] shadow-xl bg-[#ffeedd]  z-40 transition-transform duration-300"
            :class="pointOpen ? 'translate-x-0' : 'translate-x-full'"
        >
            <h2 class="px-4 mt-4 font-semibold text-4xl text-gray-900">
                Explore
            </h2>
            <div class="overflow-y-auto px-4 h-[calc(100%-56px)] mb-10">
                <RecipesList 
                    :recipes="pointRecipes"
                    :errors="pointError"
                    :loading="pointLoading"
                    @openRecipe="(id: string) => emit('openRecipe', id)"
                />
            </div>
        </aside>
    </div>
</template>
