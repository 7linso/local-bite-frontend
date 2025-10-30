<script lang="ts" setup>
import { useRecipeListStore } from '@/stores/useRecipeListStore';
import { storeToRefs } from 'pinia';
import { watch, onUnmounted } from 'vue'
import RecipesList from '../recipe/RecipesList.vue';

const recipeStore = useRecipeListStore()
const {
    pointError,
    pointLoading,
    pointOpen,
    pointRecipes
} = storeToRefs(recipeStore)

const emit = defineEmits<{
    (e: 'openRecipe', id: string): void;
}>()

watch(pointOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onUnmounted(() => { document.body.style.overflow = '' })

</script>
         
<template>
    <div v-if="pointOpen"
        class="fixed inset-0 z-30 shadow-2xl"  
        @click="pointOpen = false"         
    >
        <Transition
            appear
            enter-active-class="transform transition-transform duration-300 ease-out"
            enter-from-class="translate-y-full"
            enter-to-class="translate-y-0"
            leave-active-class="transform transition-transform duration-300 ease-in"
            leave-from-class="translate-y-0"
            leave-to-class="translate-y-full"
        >
            <aside class="fixed bottom-0 left-0 right-0 z-40 h-1/2 bg-white border border-gray-200 rounded-t-4xl shadow-2xl flex flex-col overflow-hidden"
                @click.stop                                  
            >
                <div class="min-h-0 grow overflow-y-auto overscroll-contain p-4 [--webkit-overflow-scrolling:touch]"
                >
                    <RecipesList 
                        :recipes="pointRecipes"
                        :errors="pointError"
                        :loading="pointLoading"
                        @openRecipe="(id: string) => emit('openRecipe', id)"
                    />
                </div>
            </aside>
        </Transition>
    </div>
</template>
