<script lang="ts" setup>
import {ref} from 'vue'
import { Search } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { useRecipeListStore } from '@/stores/useRecipeListStore'
import { storeToRefs } from 'pinia'

const recipeStore = useRecipeListStore()
const { currentFilters, } = storeToRefs(recipeStore)
const { updateFilterField } = recipeStore

const chips = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'BBQ', 'Soup', 'Salad', 'Drink']
const countries = ['All', 'Italy', 'France', 'Japan', 'Mexico', 'India', 'Canada', 'USA']

const toggleChip = (t: string) => {
    const nextSet = new Set(currentFilters.value.dishTypes)

    if (nextSet.has(t)) {
        nextSet.delete(t)
    } else {
        nextSet.add(t)
    }

    updateFilterField('dishTypes', nextSet)
}

const chipScroll = ref<HTMLDivElement | null>(null)

const onWheelHorizontal = (e: WheelEvent) => {
    const el = chipScroll.value
    if (!el) 
        return
    el.scrollLeft += e.deltaY || e.deltaX || 0
}

</script>

<template>
    <div class="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
            <div class="flex-1">
                <label for="q" class="sr-only">
                    Search by name
                </label>
                <div class="relative">
                    <input
                        id="q"
                        :value="currentFilters.q"
                        type="text"
                        placeholder="Search by name…"
                        class="w-full rounded-xl bg-white border border-amber-900 px-3 py-2 pr-10 shadow-sm focus:outline-amber-900"
                        @input="updateFilterField('q', ($event.target as HTMLInputElement).value)"
                    />
                    <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search :size="16"/>
                    </span>
                    </div>
                </div>

                <div class="flex-1">
                    <label for="country" class="sr-only">
                        Country
                    </label>
                    <select
                    @change="updateFilterField('country', ($event.target as HTMLSelectElement).value)"
                        id="country"
                        :value="currentFilters.country"
                        class="appearance-none w-full rounded-xl border border-amber-900 bg-white px-3 py-2 shadow-sm focus:outline-amber-900"
                    >
                        <option
                            v-for="c in countries"
                            :key="c"
                            :value="c"
                        >
                            {{ c }}
                        </option>
                    </select>
                </div>

                <!-- add recipe -->
                <div class="md:self-stretch mt-2 md:mt-0">
                    <RouterLink
                        to="/recipes/create"
                        role="button"
                        class="inline-flex w-full md:w-auto items-center justify-center bg-white rounded-xl border border-amber-800 px-4 py-2 font-medium hover:bg-amber-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 transition"
                    >
                        + Add recipe
                    </RouterLink>
                </div>

            </div>
        <div
            ref="chipScroll"
            class="no-scrollbar mt-5 max-w-full overflow-x-auto overflow-y-hidden"
            @wheel.prevent="onWheelHorizontal"
        >
            <div class="inline-flex whitespace-nowrap gap-2 pr-2">
                <button
                    v-for="t in chips"
                    :key="t"
                    @click="toggleChip(t)"
                    class="rounded-full border px-3 py-1 text-sm transition border-amber-900"
                    :class="currentFilters.dishTypes.has(t)
                    ? ' bg-amber-900 text-white'
                    : ' bg-white text-gray-800'"
                >
                    {{ t }}
                </button>
            </div>
        </div>
        
</template>
