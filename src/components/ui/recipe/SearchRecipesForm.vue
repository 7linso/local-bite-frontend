<script lang="ts" setup>
import {ref} from 'vue'
import { Search } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const props = defineProps<{
    searchParams: {
        q: string
        country: string
        dishTypes: Set<string>
    }
}>()

const emit = defineEmits<{
    (e: 'update:searchParams', v: {
        q: string
        country: string
        dishTypes: Set<string>
    }): void
    (e: 'search', payload: {
        q: string
        country: string
        dishTypes: string[]
    }): void
}>()

const updateField = <K extends keyof typeof props.searchParams>(
    key: K, 
    value: typeof props.searchParams[K]
) => {
    emit('update:searchParams', {...props.searchParams, [key]: value})
}

const chips = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'BBQ', 'Soup', 'Salad', 'Drink']
const countries = ['All', 'Italy', 'France', 'Japan', 'Mexico', 'India', 'Canada', 'USA']

const toggleChip = (t: string) => {
    const nextSet = new Set(props.searchParams.dishTypes)

    if (nextSet.has(t)) {
        nextSet.delete(t)
    } else {
        nextSet.add(t)
    }

    emit('update:searchParams', {
        ...props.searchParams,
        dishTypes: nextSet,
    })
}

const submitSearch = () => {
    emit('search', {
        q: props.searchParams.q,
        country: props.searchParams.country,
        dishTypes: [...props.searchParams.dishTypes],
    })
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
                        :value="props.searchParams.q"
                        type="text"
                        placeholder="Search by name…"
                        class="w-full rounded-xl border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-gray-500 focus:outline-none"
                        @input="updateField('q', ($event.target as HTMLInputElement).value)"
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
                    @change="updateField('country', ($event.target as HTMLSelectElement).value)"
                        id="country"
                        :value="props.searchParams.country"
                        class="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-gray-500 focus:outline-none"
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
                        class="inline-flex w-full md:w-auto items-center justify-center
                            rounded-xl border border-gray-800 px-4 py-2 font-medium
                            hover:bg-gray-900 hover:text-white
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800
                            transition"
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
                    class="rounded-full border px-3 py-1 text-sm transition"
                    :class="props.searchParams.dishTypes.has(t)
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 bg-white text-gray-800 hover:border-gray-500'"
                >
                    {{ t }}
                </button>
            </div>
        </div>
        
</template>