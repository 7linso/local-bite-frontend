<script lang="ts" setup>
import { onUnmounted, ref, onActivated, watch, defineOptions } from "vue";
import MapView from "@/components/ui/MapView.vue";
import { useRecipeListStore } from "@/stores/useRecipeListStore";
import SearchRecipesForm from "@/components/ui/recipe/SearchRecipesForm.vue";
import { useRouter } from "vue-router";
import MapDesktopModal from "@/components/ui/modals/MapDesktopModal.vue";
import MapMobileModal from "@/components/ui/modals/MapMobileModal.vue";
import RecipesList from "@/components/ui/recipe/RecipesList.vue";
import { storeToRefs } from "pinia";
import { recipes } from "@/lib/api/recipes";
import { useDebounce } from "@/composables/recipe/useDebounce";

defineOptions({
  name: "RecipesListPage",
});

const router = useRouter();

const recipeStore = useRecipeListStore();
const {
  currentFilters,
  geojson,
  hasNextPage,
  list,
  errors,
  loading,
  pointRecipes,
} = storeToRefs(recipeStore);
const { fetchFirstPage, fetchNextPage, fetchPointRecipes } = recipeStore;

const isMdPlusScreen = ref<boolean>(false);

const checkScreen = () => {
  isMdPlusScreen.value = window.innerWidth >= 768;
};

const mapRef = ref<InstanceType<typeof MapView> | null>(null);

const openRecipesByLocationModal = (data: { lat: number; lng: number }) => {
  mapRef.value?.centerOnPoint(data.lat, data.lng);

  fetchPointRecipes(data.lat, data.lng);
};

const applyLikeLocal = (id: string, next: boolean) => {
  const likeOne = (arr: any[]) => {
    const it = arr.find((x) => x._id === id);
    if (it) {
      const delta = next ? 1 : -1;
      it.isLiked = next;
      it.likeCount = Math.max(0, (it.likeCount ?? 0) + delta);
    }
  };
  likeOne(list.value);
  likeOne(pointRecipes.value);
};

const onToggleLike = async ({ id, next }: { id: string; next: boolean }) => {
  const prev = list.value.find((x) => x._id === id);
  const prevState = prev
    ? { isLiked: prev.isLiked, likeCount: prev.likeCount }
    : null;

  applyLikeLocal(id, next);

  try {
    await (next ? recipes.likeRecipe(id) : recipes.dislikeRecipe(id));
  } catch (e) {
    if (prev && prevState) {
      prev.isLiked = prevState.isLiked;
      prev.likeCount = prevState.likeCount;
    }
  }
};

const debouncedFilters = useDebounce(currentFilters, 500);

watch(
  debouncedFilters,
  () => {
    fetchFirstPage();
  },
  { deep: true }
);

onActivated(() => {
  if (!list.value.length) {
    fetchFirstPage();
  }
  checkScreen();
  window.addEventListener("resize", checkScreen);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreen);
});
</script>

<template>
  <div class="relative h-[60vh] w-full">
    <MapView
      ref="mapRef"
      :points="geojson"
      @pointClick="openRecipesByLocationModal"
    />

    <MapDesktopModal
      v-if="isMdPlusScreen"
      @openRecipe="(id: string) => router.push(`/recipes/${id}`)"
      @toggle-like="onToggleLike"
    />

    <MapMobileModal
      v-else
      @openRecipe="(id: string) => router.push(`/recipes/${id}`)"
      @toggle-like="onToggleLike"
    />
  </div>

  <!-- search + add -->
  <section
    class="mx-auto mt-4 mb-10 w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px]"
  >
    <SearchRecipesForm />

    <RecipesList
      :recipes="list"
      :errors="errors"
      :loading="loading"
      @openRecipe="(id: string) => router.push(`/recipes/${id}`)"
      @create="router.push(`/recipes/create`)"
      @toggle-like="onToggleLike"
    />

    <div
      v-show="hasNextPage"
      class="flex justify-center items-center gap-2 my-6"
    >
      <button
        @click="fetchNextPage"
        class="inline-flex w-full md:w-auto items-center justify-center rounded-xl border border-gray-800 px-4 py-2 font-medium hover:bg-gray-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 transition"
      >
        More
      </button>
    </div>
  </section>
</template>

<style scoped>
:deep(.no-scrollbar) {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
:deep(.no-scrollbar::-webkit-scrollbar) {
  display: none;
}
</style>
