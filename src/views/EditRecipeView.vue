<script lang="ts" setup>
import RecipeForm from '@/components/ui/recipe/RecipeForm.vue';
import { useRecipe } from '@/composables/recipe/useRecipe';
import { useToast } from 'vue-toast-notification';
import { useAuthStore } from '@/stores/useAuthStore';
import { onMounted, watch } from 'vue';

const toast = useToast()
const auth = useAuthStore()

const props = defineProps<{
    id: string
}>()

const { 
    loading,
    errors,
    form,
    addIngredientAfter,
    removeIngredient,
    addInstructionAfter,
    removeInstruction,
    preview,
    handleImageSelect,
    getRecipe,
    editRecipe
} = useRecipe(auth, toast)

onMounted(() => {
    getRecipe(props.id)
})

watch(() => props.id, (newId) => {
    getRecipe(newId)
})

</script>

<template>
    <RecipeForm
        :form="form"
        :loading="loading"
        :errors="errors"
        :addIngredientAfter="addIngredientAfter"
        :removeIngredient="removeIngredient"
        :addInstructionAfter="addInstructionAfter"
        :removeInstruction="removeInstruction"
        :preview="preview"
        :handleImageSelect="handleImageSelect"
        @submit="editRecipe(props.id)"
    />
</template>