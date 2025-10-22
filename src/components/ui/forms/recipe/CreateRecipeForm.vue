<script lang="ts" setup>
import type { RecipePayload } from '@/lib/types';
import { Trash } from 'lucide-vue-next';
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

const props = defineProps<{
  form: RecipePayload
  errors: Record<string, string>
  loading: boolean
}>()

const emit = defineEmits<{ (e: 'submit'): void }>()

const dishOptions = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'BBQ', 'Soup', 'Salad', 'Drink']
const measureOptions = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'pcs']

function addIngredientAfter(i: number) {
  props.form.ingredients.splice(i + 1, 0, { ingredient: '', amount: 0, measure: '' })
}
function removeIngredient(i: number) {
  if (props.form.ingredients.length > 1) props.form.ingredients.splice(i, 1)
}

</script>

<template>
  <section class="flex items-center justify-center mt-10">
    <form
      @submit.prevent="emit('submit')"
      class="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px]
             border rounded-md border-gray-900 p-5 bg-white shadow-sm text-sm"
    >
      <p v-if="errors.form" class="text-xs text-red-600">{{ errors.form }}</p>

      <div
        class="grid gap-y-1 md:gap-y-3 gap-x-4
               grid-cols-1 md:[grid-template-columns:150px_minmax(0,1fr)]"
      >
        <!-- title -->
        <label for="title" class="md:text-right md:self-start md:pt-1">
          title
        </label>
        <div>
          <input
            v-model="form.title"
            id="title"
            type="text"
            placeholder="Terracotta pie"
            class="w-full px-3 py-1 rounded-md border border-gray-800 bg-gray-100"
          />
          <p v-if="errors.title" class="text-xs text-red-600">
            {{ errors.title }}
          </p>
        </div>

        <!-- description -->
        <label for="description" class="md:text-right md:self-start md:pt-1">
          description
        </label>
        <textarea
          v-model="form.description"
          id="description" 
          placeholder="Banana terracotta terracotta pie" 
          class="w-full px-3 py-1 rounded-md border border-gray-600 bg-gray-100"
        ></textarea>
        <p v-if="errors.title" class="text-xs text-red-600">
          {{ errors.title }}
        </p>

        <!-- dish types -->
        <label for="dishTypes" class="md:text-right md:self-start md:pt-1">
            dish type(s)
          </label>

          <Multiselect
            v-model="form.dishTypes"
            :options="dishOptions"
            :multiple="true"
            placeholder="Select dish types"
            class="multiselect-theme w-full rounded-md border border-gray-600 bg-gray-100"
          />

        <!-- ingredients -->
        <label class="md:text-right md:self-start md:pt-1">ingredients</label>

        <div v-for="(ing, i) in form.ingredients" :key="i" class="space-y-1">
          <div class="grid items-center gap-2 grid-cols-[11fr_4fr_4fr_1fr] md:grid-cols-[13fr_3fr_3fr_1fr]">
            <!-- NAME -->
            <div class="min-w-0">
              <input
                v-model="ing.ingredient"
                type="text"
                placeholder="e.g., Tomatoes"
                class="h-10 w-full px-2 rounded-md border border-gray-800 bg-gray-100"
              />
            </div>

            <!-- AMOUNT -->
            <div class="min-w-0">
              <input
                v-model.number="ing.amount"
                type="number"
                min="0"
                step="any"
                placeholder="0"
                class="h-10 w-full px-2 rounded-md border border-gray-800 bg-gray-100 text-center"
              />
            </div>

            <!-- MEASURE -->
            <div class="min-w-0">
              <Multiselect
                v-model="ing.measure"
                :options="measureOptions"
                placeholder="lb"
                class="multiselect-theme h-9 w-full rounded-md border border-gray-800 bg-gray-100"
              />
            </div>

            <!-- REMOVE -->
            <button
              type="button"
              @click="removeIngredient(i)"
              :disabled="form.ingredients.length === 1"
              class="inline-flex h-9 w-full items-center justify-center rounded hover:bg-red-50 disabled:opacity-40"
              title="Remove"
            >
              <span class="text-red-500 text-lg leading-none">×</span>
            </button>
          </div>

          <!-- show only for last row -->
          <div v-if="i === form.ingredients.length - 1" class="mt-1 text-right">
            <button type="button" @click="addIngredientAfter(i)" class="text-blue-600 hover:underline text-sm">
              + add ingredient
            </button>
          </div>
        </div>

      </div>

      <div class="flex flex-col items-center justify-center mt-4 gap-2">
        <button
          :disabled="loading"
          type="submit"
          class="px-4 py-1.5 rounded-md border border-gray-800 hover:bg-gray-100 transition-colors"
        >
          Share 
        </button>
      </div>
    </form>
  </section>
</template>


<style scoped>
@reference "tailwindcss";

/* Make the multiselect control a true 36px/2.25rem tall input */
:deep(.multiselect) { @apply h-9; }
:deep(.multiselect__tags) {
  @apply h-9 bg-gray-100 text-gray-800 px-3 rounded-md flex items-center;
  min-height: 2.25rem; /* h-9 */
  border: none; /* we use outer border class */
}
:deep(.multiselect__select) { @apply h-9; } /* caret button */
:deep(.multiselect__input) { @apply bg-gray-100 text-gray-800; }
:deep(.multiselect__single) { @apply bg-gray-100 text-gray-800; }

/* Dropdown options: white with blue accents */
:deep(.multiselect__option) { @apply bg-white text-gray-800; }
:deep(.multiselect__option--highlight) { @apply bg-white text-blue-600; }
:deep(.multiselect__option--selected) { @apply bg-blue-50 text-blue-600; }
:deep(.multiselect__option--selected.multiselect__option--highlight) { @apply bg-blue-100 text-blue-700; }
/* Remove the “Press enter to select” tag */
:deep(.multiselect__option--highlight::after) { content: none; }

/* Chips (if ever used in multiple mode elsewhere) */
:deep(.multiselect__tag) { @apply bg-blue-100 text-blue-700 border border-blue-300; }
:deep(.multiselect__tag-icon:hover) { @apply bg-blue-200 text-blue-800; }
</style>

