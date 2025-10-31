<script lang="ts" setup>

import type { RecipeCardPreview } from '@/lib/types';
import RecipePreviewCard from './RecipePreviewCard.vue';
import { watchEffect, ref, onUnmounted, compile, computed } from 'vue';

const props = defineProps<{
    recipes: RecipeCardPreview[]
    errors: Record<string, any>
    loading: boolean
}>()

const emit = defineEmits<{
    (e: 'create'): void
    (e: 'openRecipe', id: string): void
    (e: 'toggle-like', p: { id: string; next: boolean }): void
}>()

const showSkeleton = ref<boolean>(false)
let delayTimer: any, minTimer: any

const show = computed<'loading'|'error'|'empty'|'list'>(() => {
    if(props.loading && showSkeleton.value) 
        return 'loading'
    if(props.errors?.list) 
        return 'error'
    if(!props.loading && !props.errors?.list && props.recipes.length === 0)
        return 'empty'

    return 'list'
})

watchEffect(() => {
    clearTimeout(delayTimer)
    if(props.loading){
        delayTimer = setTimeout(()=>{
            showSkeleton.value = true
            clearTimeout(minTimer)
            minTimer = setTimeout(() => {}, 300)
        }, 150)
    } else {
        clearTimeout(delayTimer)
        Promise.resolve().then(() => (showSkeleton.value = false))
    }
})

onUnmounted(() => {
    clearTimeout(delayTimer)
    clearTimeout(minTimer)
})
</script>

<template>
    <section class="mt-4 min-h-[40vh]">
        <Transition name="fade" mode="out-in">
            <!-- loading -->
            <div v-if="show === 'loading'" class="mt-10 space-y-5">
                <RecipePreviewCard />
                <RecipePreviewCard />
                <RecipePreviewCard />
            </div>

            <!-- error -->
            <div v-else-if="show === 'error'" 
                class="p-10 text-center bg-white border border-amber-900 rounded-lg"
            >
                <h3 class="text-lg font-semibold">
                    An error occured while fetching results
                </h3>
                <p class="text-gray-600">
                    {{ errors.list }}
                </p>
            </div>

            <!-- empty -->
            <div v-else-if="show === 'empty'" 
                class="p-10 text-center bg-white border border-amber-900 rounded-lg"
            >
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
            <div v-else-if="show === 'list'" class="my-4 space-y-5">
                <div
                    v-for="r in recipes"
                    :key="r._id"
                    @click="emit('openRecipe', (r._id))"
                    @toggle-like="emit('toggle-like', $event)"
                    class="cursor-pointer"
                >
                    <RecipePreviewCard 
                        :recipe="r"
                        @toggle-like="emit('toggle-like', $event)"
                    />
                </div>
            </div>
        </Transition>
    </section>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity .18s ease, transform .18s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; transform: translateY(4px); }

.list-fade-move { transition: transform .2s ease; }
.list-fade-enter-active, .list-fade-leave-active { transition: opacity .18s ease, transform .18s ease; }
.list-fade-enter-from, .list-fade-leave-to { opacity: 0; transform: translateY(4px); }
</style>