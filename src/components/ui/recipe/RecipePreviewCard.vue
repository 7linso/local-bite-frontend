<script setup lang="ts">
import type { RecipeCardPreview } from '@/lib/types'

const props = defineProps<{
  recipe?: RecipeCardPreview,
}>()
</script>

<template>
    <article @click="$emit('click')"
        class="cursor-pointer w-full shadow-lg  flex bg-white text-gray-900 overflow-hidden rounded-xl border border-amber-800"
    >
        <!-- image -->
        <div
            class="bg-white border-r border-none flex"
            style="width: 8rem; min-height: 6rem;"
        >   
            <img v-if="recipe && recipe.recipePic"
                :src="recipe.recipePic"
                :alt="recipe.title"
                class="w-full h-full object-cover"
            />
            <div v-else
                class="w-full h-full flex items-center justify-center text-gray-500"
                v-text="recipe && 'no image'"
                :class="{ 'animate-pulse': !recipe }"
            ></div>
        </div>

        <div class="flex-1 min-w-0 p-3">
            <h2 class="font-semibold text-base text-gray-900 truncate"
                :class="{ 'h-4 w-24 bg-white rounded animate-pulse': !recipe }"
            >
                {{ recipe ? recipe.title : '' }}
            </h2>

            <p class="text-sm text-gray-600 line-clamp-2 mt-1 truncate"
                :class="{ 'h-4 w-36 bg-white rounded animate-pulse': !recipe }"
            >
                {{ recipe ? recipe.description || 'No description' : '' }}
            </p>

            <div class="flex flex-col gap-2 mt-2 text-xs text-gray-500">
                <div>
                    <template v-if="recipe">
                        <span v-for="t in recipe.dishTypes"
                            :key="t"
                            class="rounded-full border border-gray-400 px-2 py-0.5 leading-none mr-1"
                        >
                            {{ t }}
                        </span>
                    </template>

                    <div v-else
                        class="flex gap-2"
                    >
                        <div class="h-3 w-10 bg-white rounded animate-pulse"></div>
                        <div class="h-3 w-12 bg-white rounded animate-pulse"></div>
                        <div class="h-3 w-8 bg-white rounded animate-pulse"></div>
                    </div>
                </div>

                <p v-if="recipe"
                    class="truncate"
                >
                    {{ recipe.locationSnapshot.locality }},
                    {{ recipe.locationSnapshot.area }},
                    {{ recipe.locationSnapshot.country }}
                </p>

                <div v-else
                    class="h-3 w-40 bg-white rounded animate-pulse"
                ></div>
            </div>
        </div>
    </article>
</template>
