<script lang="ts" setup>
import DeleteModal from '@/components/ui/modals/DeleteModal.vue';
import { useRecipe } from '@/composables/recipe/useRecipe';
import { useAuthStore } from '@/stores/useAuthStore';
import { Pencil, Trash } from 'lucide-vue-next';
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';

const props = defineProps<{
    id: string
}>()

const router = useRouter()
const auth = useAuthStore()
const toast = useToast()

const { recipe, getRecipe, errors, deleteOpen, deleteRecipe } = useRecipe(auth, toast)

const formatDate = (d: string) => {
  const date = new Date(d)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const editRecipe = () => {
    if (recipe.value?._id) 
        router.push(`/recipes/${recipe.value._id}/edit`)
}

onMounted(() => {
    getRecipe(props.id)
})

watch(() => props.id, (newId) => {
    getRecipe(newId)
})

</script>

<template>
    <section class="flex items-center justify-center my-10">
        <div class="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px]">

            <article v-if="recipe"
                class="bg-white rounded-2xl shadow-sm overflow-hidden border border-amber-900"
            >
                <!-- Image -->
                <div class="relative w-full h-56 bg-gray-100">
                    <img
                        v-if="recipe.recipePic"
                        :src="recipe.recipePic"
                        :alt="recipe.title"
                        class="w-full h-full object-cover"
                    />
                    <div v-else
                        class="w-full h-full flex items-center justify-center text-gray-400 italic"
                    >
                        No Image
                    </div>

                    <div class="absolute bottom-2 right-2 bg-white/80 text-gray-800 text-xs px-2 py-1 rounded-md" 
                        :class="{ 'cursor-pointer': recipe.authorId?.username }"
                    >
                        by {{ recipe.authorId?.username || 'unknown' }}
                    </div>
                </div>

                <!-- content -->
                <div class="p-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold mb-1 line-clamp-1">
                            {{ recipe.title }}
                        </h3>

                        <div v-if="auth.isAuth && recipe?.authorId && recipe.authorId._id === auth.user?._id"
                            class="flex items-center gap-2"
                        >
                            <button @click="editRecipe">
                                <Pencil :size="16" class="cursor-pointer" />
                            </button>
                            <button @click="deleteOpen=true">
                                <Trash :size="16" class="text-red-500 cursor-pointer" />
                        </button>
                        </div >
                    </div>

                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                        {{ recipe.description }}
                    </p>

                    <!-- dish types -->
                    <div v-if="recipe.dishTypes?.length" 
                        class="flex flex-wrap gap-1 mb-3"
                    >
                        <span
                            v-for="type in recipe.dishTypes"
                            :key="type"
                            class="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full"
                        >
                        {{ type }}
                        </span>
                    </div>

                    <!-- ingredients  -->
                    <div class="text-sm text-gray-500 mb-3">
                        <ul>
                            <h3 class="font-medium">Ingredients:</h3>
                        
                            <li v-for="i in recipe.ingredients"
                                class="list-disc ml-5 py-0.5"
                            >
                                {{ i.amount }} {{ i.measure }} of {{ i.ingredient }} 
                            </li>
                        </ul>
                    </div>

                    <!-- instructions  -->
                    <div class="text-sm text-gray-500 mb-3">
                        <ul >
                            <h3 class="font-medium">Instructions:</h3>
                        
                            <li v-for="i in recipe.instructions"
                                class="list-decimal ml-5 py-0.5"
                            >
                                {{ i }} 
                            </li>
                        </ul>
                    </div>

                    <!-- location -->
                    <div class="text-xs text-gray-400 flex items-center justify-between">
                        <span>
                        {{ recipe.locationSnapshot.locality }},
                        {{ recipe.locationSnapshot.country }}
                        </span>
                        <span>{{ formatDate(recipe.createdAt) }}</span>
                    </div>
                </div>
            </article>

            <article v-if="errors.all"
                class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
            >
               <div class="h-60 flex flex-col items-center justify-center text-center space-y-2">
                    <h3 class="font-semibold">
                        Oops! It seems like this recipe does not exist
                    </h3>
                    <p class="text-gray-600">
                        <span
                        @click="router.push('/recipes/create')"
                        class="underline cursor-pointer"
                        >
                        Add some recipes
                        </span> or look for another one
                    </p>
                </div>
            </article>
        </div>
    </section>

    <DeleteModal
        @confirm="recipe && deleteRecipe(recipe._id)"
        @cancel="deleteOpen=false"    
        :open="deleteOpen"
    />
</template>