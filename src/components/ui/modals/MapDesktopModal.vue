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
        class="fixed inset-0 z-30 "
        @click="pointOpen = false"
    >
        <aside class="hidden md:block fixed top-0 right-0 h-full w-full max-w-[360px] bg-white shadow-xl border-l border-gray-200 z-40 transition-transform duration-300"
            :class="pointOpen ? 'translate-x-0' : 'translate-x-full'"
        >
            <div class="overflow-y-auto p-4 h-[calc(100%-56px)]">
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