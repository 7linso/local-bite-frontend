<script lang="ts" setup>
import CreateRecipeForm from '@/components/ui/forms/recipe/CreateRecipeForm.vue';
import { useRecipe } from '@/composables/recipe/useRecipe';

const { errors, loading, form, onCreateRecipe } = useRecipe()

</script>

<template>
    <CreateRecipeForm
    :form="form"
    :loading="loading"
    :errors="errors"
    @submit="onCreateRecipe"
    />
</template>