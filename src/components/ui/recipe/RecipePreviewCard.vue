<script setup lang="ts">
import type { RecipeCardPreview } from '@/lib/types'

const props = defineProps<{
  recipe: RecipeCardPreview,
}>()
</script>

<template>
    <article @click="$emit('click')"
        class="cursor-pointer w-full border border-none shadow-lg rounded-xl flex bg-white text-gray-900 overflow-hidden"
    >
        <!-- image -->
        <div
            class="bg-gray-200 border-r border-none flex"
            style="width: 8rem; min-height: 6rem;"
        >
            <img
                v-if="recipe.recipePic"
                :src="recipe.recipePic"
                :alt="recipe.title"
                class="w-full h-full object-cover"
            />
            <div
                v-else
                class="w-full h-full flex items-center justify-center  text-gray-500"
            >
                no image
            </div>
        </div>

        <div class="flex-1 min-w-0 p-3">
            <h2 class="font-semibold text-base text-gray-900 truncate">
                {{ recipe.title }}
            </h2>

            <p class="text-sm text-gray-600 line-clamp-2 mt-1">
                {{ recipe.description || 'No description' }}
            </p>

            <div class="flex flex-col gap-2 mt-2 text-xs text-gray-500">
                <div>
                    <span
                        v-for="t in recipe.dishTypes"
                        :key="t"
                        class="rounded-full border border-gray-400 px-2 py-[2px] leading-none mr-1"
                    >
                        {{ t }}
                    </span>
                </div>

                <p class="truncate">
                {{ recipe.locationSnapshot.locality }},
                {{ recipe.locationSnapshot.area }},
                {{ recipe.locationSnapshot.country }}
                </p>
            </div>
        </div>
    </article>
</template>
