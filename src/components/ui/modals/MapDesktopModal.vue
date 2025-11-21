<script lang="ts" setup>
import { useRecipeListStore } from "@/stores/useRecipeListStore";
import { storeToRefs } from "pinia";
import RecipesList from "../recipe/RecipesList.vue";

const recipeStore = useRecipeListStore();
const { pointError, pointLoading, pointOpen, pointRecipes } =
  storeToRefs(recipeStore);

const emit = defineEmits<{
  (e: "openRecipe", id: string): void;
  (e: "toggle-like", p: { id: string; next: boolean }): void;
}>();
</script>
<template>
  <Transition name="overlay-fade">
    <div v-if="pointOpen" class="fixed inset-0 z-30" @click="pointOpen = false">
      <Transition name="panel-slide">
        <aside
          class="hidden md:block fixed top-0 right-0 h-full w-full max-w-[360px] shadow-xl bg-[#ffeedd] z-40"
          @click.stop
        >
          <h2 class="px-4 mt-4 font-semibold text-4xl text-gray-900">
            Explore
          </h2>
          <div class="overflow-y-auto px-4 h-[calc(100%-56px)] mb-10">
            <RecipesList
              :recipes="pointRecipes"
              :errors="pointError"
              :loading="pointLoading"
              @toggle-like="emit('toggle-like', $event)"
              @openRecipe="(id: string) => emit('openRecipe', id)"
            />
          </div>
        </aside>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.2s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: transform 0.25s ease-out, opacity 0.25s ease-out;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
