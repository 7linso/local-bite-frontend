<script lang="ts" setup>
import RecipeForm from '@/components/ui/recipe/RecipeForm.vue';
import { useRecipe } from '@/composables/recipe/useRecipe';
import { useToast } from 'vue-toast-notification';
import { useAuthStore } from '@/stores/useAuthStore';

const toast = useToast()
const auth = useAuthStore()

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
    createRecipe
} = useRecipe(auth, toast)

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
        @submit="createRecipe"
    />
</template>