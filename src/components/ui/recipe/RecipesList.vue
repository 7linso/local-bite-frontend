<script lang="ts" setup>

import RecipePreviewCard from './RecipePreviewCard.vue';
import { useRecipeListStore } from '@/stores/useRecipeListStore';
import { storeToRefs } from 'pinia';

const recipeStore = useRecipeListStore()
const { 
    errors, 
    loading, 
    list, 
} = storeToRefs(recipeStore)

const emit = defineEmits<{
    (e: 'create'): void
    (e: 'openRecipe', id: string): void
}>()

</script>

<template>
    <section class="mt-4">
        <!-- loading -->
        <div v-if="loading" class="mt-10 space-y-5">
            <RecipePreviewCard />
            <RecipePreviewCard />
            <RecipePreviewCard />
        </div>

        <!-- error -->
        <div v-else-if="errors.list" class="mt-10 text-center">
            <h3 class="text-lg font-semibold">
                An error occured while fetching results
            </h3>
            <p class="text-gray-600">
                {{ errors.list }}
            </p>
        </div>

        <!-- empty -->
        <div v-else-if="list.length === 0" class="mt-10 text-center">
            <h3 class="text-lg font-semibold">
                There are no recipes
            </h3>
            <p class="text-gray-600">
            <span
                @click="emit('create')" 
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
                @click="emit('openRecipe', (r._id))"
                class="cursor-pointer"
            >
                <RecipePreviewCard :recipe="r" />
            </div>
        </div>

    </section>
</template>