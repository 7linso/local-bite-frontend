<script lang="ts" setup>
import type { RecipePayload } from '@/lib/types';
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'
import {ref} from 'vue'

const props = defineProps<{
  form: RecipePayload
  errors: Record<string, string>
  loading: boolean
  addIngredientAfter: (i: number) => void
  removeIngredient: (i: number) => void
  addInstructionAfter: (i: number) => void
  removeInstruction: (i: number) => void
  preview: string | null
  handleImageSelect: (e: Event) => void
}>()

const emit = defineEmits<{ (e: 'submit'): void }>()

const fileInput = ref<HTMLInputElement | null>(null)
const openPicker = () => fileInput.value?.click()

const dishOptions = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'BBQ', 'Soup', 'Salad', 'Drink']
const measureOptions = ['g', 'kg', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'pcs']

</script>
<template>
  <section class="flex items-center justify-center my-10">

    <div class="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px]">
      <div class="border rounded-md border-gray-900 bg-white shadow-sm overflow-hidden">

        <!-- recipe pic -->
        <div class="relative w-full bg-gray-200 aspect-[16/9]">
          <button
            type="button"
            @click="openPicker"
            class="absolute inset-0 w-full h-full"
            aria-label="Upload recipe image"
          >
            <img
              v-if="preview"
              :src="preview"
              alt="Recipe preview"
              class="object-cover w-full h-full"
            />
            <div v-else class="flex items-center justify-center w-full h-full text-gray-500 text-sm">
              <div class="text-center">
                <p>No image selected</p>
                <p class="text-xs">(Click to upload)</p>
              </div>
            </div>
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="hidden"
            @change="handleImageSelect"
          />
        </div>

        <form 
          @submit.prevent="emit('submit')" 
          class="p-5 text-sm"
        >
          <p v-if="errors.form" class="text-xs text-red-600 mb-2">{{ errors.form }}</p>

          <div class="grid gap-y-1 md:gap-y-3 gap-x-4 grid-cols-1 md:[grid-template-columns:150px_minmax(0,1fr)]">

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
              <p v-if="errors.title" class="text-xs text-red-600">{{ errors.title }}</p>
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
            <label class="md:text-right md:self-start md:pt-1">
              ingredients
            </label>
            <div>
              <div 
                v-for="(ing, i) in form.ingredients" 
                :key="i" 
                class="space-y-1"
              >
                <!-- sm ≈ 55/20/20/5, sm+ ≈ 65/15/15/5 -->
                <div class="grid items-center gap-2 grid-cols-[11fr_4fr_4fr_1fr] md:grid-cols-[13fr_3fr_3fr_1fr]">
                  <div class="min-w-0">
                    <input 
                      v-model="ing.ingredient" 
                      type="text" 
                      placeholder="e.g., Tomatoes"
                      class="h-10 w-full px-2 rounded-md border border-gray-800 bg-gray-100" 
                    />
                  </div>
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
                  <div class="min-w-0">
                    <Multiselect 
                      v-model="ing.measure" 
                      :options="measureOptions" 
                      placeholder="lb"
                      class="multiselect-theme h-9 w-full rounded-md border border-gray-800 bg-gray-100" 
                    />
                  </div>
                  <button 
                    type="button" 
                    @click="removeIngredient(i)" 
                    :disabled="form.ingredients.length === 1"
                    class="inline-flex h-9 w-full items-center justify-center rounded disabled:opacity-40"
                    title="Remove"
                  >
                    <span class="text-red-500 text-lg leading-none">×</span>
                  </button>
                </div>

                <div 
                  v-if="i === form.ingredients.length - 1" 
                  class="mt-1 text-right"
                >
                  <button 
                    type="button" 
                    @click="addIngredientAfter(i)"
                    class="text-blue-600 hover:underline text-sm">
                    + add ingredient
                  </button>
                </div>
              </div>
            </div>

            <!-- instructions -->
            <label class="md:text-right md:self-start md:pt-1">
              instructions
            </label>
            <div class="space-y-1">
              <div 
                v-for="(step, i) in form.instructions" 
                :key="i"
                class="grid grid-cols-[1fr_40px] gap-2 items-center"
              >
                <textarea 
                  v-model="form.instructions[i]" 
                  placeholder="e.g., Mix ingredients together"
                  class="w-full px-3 py-1 rounded-md border border-gray-600 bg-gray-100"
                ></textarea>
                <button 
                  type="button" 
                  @click="removeInstruction(i)"
                  :disabled="form.instructions.length === 1"
                  class="inline-flex h-9 w-full items-center justify-center rounded disabled:opacity-40"
                  title="Remove instruction"
                >
                  <span class="text-red-500 text-lg leading-none">×</span>
                </button>
              </div>
              <div class="mt-1 text-right">
                <button 
                  type="button" 
                  @click="addInstructionAfter(form.instructions.length - 1)"
                  class="text-blue-600 hover:underline text-sm"
                >
                  + add instruction
                </button>
              </div>
            </div>

            <label 
              for="locality" 
              class="md:text-right md:self-start md:pt-1"
            >
              locality
            </label>
            <div>
              <p v-if="errors.location" class="text-xs text-red-600">{{ errors.location }}</p>
              <input
                v-model="form.location.locality" 
                id="locality" 
                type="text" 
                placeholder="Winnipeg" 
                class="w-full px-3 py-1 rounded-md border border-gray-600 bg-gray-100"
              />
            </div>

            <label 
              for="area" 
              class="md:text-right md:self-start md:pt-1"
            >
              area
            </label>
            <input
              v-model="form.location.area" 
              id="area" 
              type="text" 
              placeholder="MB" 
              class="w-full px-3 py-1 rounded-md border border-gray-600 bg-gray-100"
            />

            <label 
              for="country" 
              class="md:text-right md:self-start md:pt-1"
            >
              country
            </label>
            <input
              v-model="form.location.country" 
              id="country" 
              type="text" 
              placeholder="Canada" 
              class="w-full px-3 py-1 rounded-md border border-gray-600 bg-gray-100"
            />
          </div>

          <div class="flex flex-col items-center justify-center mt-4 gap-2">
            <button :disabled="loading" type="submit"
                    class="px-4 py-1.5 rounded-md border border-gray-800 hover:bg-gray-100 transition-colors">
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
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

