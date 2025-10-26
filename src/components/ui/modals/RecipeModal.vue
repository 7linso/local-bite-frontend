<script setup lang="ts">
import { computed } from 'vue'
import type { RecipeCardPreview } from '@/lib/types'

const props = defineProps<{
    recipe: RecipeCardPreview
    x: number
    y: number
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const MODAL_W = 220
const MODAL_H = 200
const PADDING = 8

const left = computed(() => {
    if (typeof window === 'undefined') 
        return props.x

    const vw = window.innerWidth
    return Math.min(Math.max(props.x, PADDING), vw - MODAL_W - PADDING)
})

const top = computed(() => {
    if (typeof window === 'undefined') 
        return props.y
    const vh = window.innerHeight
    return Math.min(Math.max(props.y, PADDING), vh - MODAL_H - PADDING)
})
</script>

<template>
    <div @click="emit('close')"
        class="fixed inset-0 pointer-events-auto z-50"
    >
        <div @click.stop
            class="absolute bg-white rounded-xl shadow-xl border border-gray-300 p-4 w-[220px] pointer-events-auto"
            :style="{ left: `${left}px`, top: `${top}px` }"
        >
            <button
                class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xs"
                @click="emit('close')"
            >
                ✕
            </button>

            <div class="flex gap-3">
                <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 border border-gray-300 flex-shrink-0">
                    <img
                        v-if="recipe.recipePic"
                        :src="recipe.recipePic"
                        :alt="recipe.title"
                        class="w-full h-full object-cover"
                    />
                    <div
                        v-else
                        class="w-full h-full flex items-center justify-center text-[10px] text-gray-500"
                    >
                        no image
                    </div>
                </div>

                <div class="flex-1 min-w-0">
                    <h2 class="text-sm font-semibold text-gray-900 truncate">
                        {{ recipe.title }}
                    </h2>
                    <p class="text-[10px] text-gray-500 mt-2 truncate">
                        {{ recipe.locationSnapshot.locality }},
                        {{ recipe.locationSnapshot.area }},
                        {{ recipe.locationSnapshot.country }}
                    </p>
                </div>
            </div>

            <button
                class="mt-3 w-full text-xs font-medium text-white bg-gray-900 rounded-lg py-1.5 hover:bg-gray-800"
                @click="emit('close')"
            >
                View details
            </button>
        </div>
    </div>
</template>
