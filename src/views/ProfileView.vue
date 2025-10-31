<script setup lang="ts">
import { ref, watch} from 'vue'
import { useToast } from 'vue-toast-notification'
import { useAuthStore } from '@/stores/useAuthStore'
import ProfileEditForm from '@/components/ui/profile/ProfileEditForm.vue'
import ProfilePicForm from '@/components/ui/profile/ProfilePicForm.vue'
import DeleteModal from '@/components/ui/modals/DeleteModal.vue'
import { useProfileForm } from '@/composables/profile/useProfileForm'
import { Check, Pencil, Trash, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import RecipesList from '@/components/ui/recipe/RecipesList.vue'
import { useRecipeListStore } from '@/stores/useRecipeListStore'
import { useRouter } from 'vue-router'
import { recipes } from '@/lib/api/recipes'

const auth = useAuthStore()
const { user } = storeToRefs(auth)
const toast = useToast()
const router = useRouter()

const isEditing = ref(false)

const {
  form, 
  errors, 
  setAllFromUser, 
  validate, 
  submitUpdate,
  isUploading, 
  tempPreview, 
  onPickProfilePic,
  updateField,
  deleteOpen,
  deleteAccount
} = useProfileForm(auth, toast, () => { isEditing.value = false })

const recipeStore = useRecipeListStore()
const { fetchUsersRecipes } = recipeStore
const { usersRecipes, errors: userRecipesErrors, loading } = storeToRefs(recipeStore)

const applyLikeLocal = (id: string, next: boolean) => {
    const likeOne = (arr: any[]) => {
        const it = arr.find(x => x._id === id)
        if (it) {
            const delta = next ? 1 : -1
            it.isLiked = next
            it.likeCount = Math.max(0, (it.likeCount ?? 0) + delta)
        }
    }
    likeOne(usersRecipes.value)
}

const onToggleLike = async({ id, next }: { id: string; next: boolean }) => {
    const prev = usersRecipes.value.find(x => x._id === id)
    const prevState = prev ? { isLiked: prev.isLiked, likeCount: prev.likeCount } : null

    applyLikeLocal(id, next)

    try {
        await (next ? recipes.likeRecipe(id) : recipes.dislikeRecipe(id))
    } catch (e) {
        if (prev && prevState) {
            prev.isLiked = prevState.isLiked
            prev.likeCount = prevState.likeCount
        }
    }
}

watch(user, (u) => {
  if (u) {
    setAllFromUser()
    fetchUsersRecipes()
  }
}, { immediate: true })

</script>

<template>
  <section class="flex items-center justify-center mt-10">
    <form
      @submit.prevent="submitUpdate(validate)"
      class="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px] bg-white rounded-2xl shadow-sm overflow-hidden border border-amber-900 p-5"
    >
      <div class="relative mb-5 flex justify-center">
        <button
          v-if="!isEditing"
          type="button"
          @click="isEditing = true"
          class="absolute right-0 top-0 text-gray-500 hover:text-gray-700 z-10"
        >
          <Pencil/>
        </button>
        <div 
          v-else 
          class="absolute right-0 top-0 flex items-center gap-2 z-10"
        >
          <button 
            type="button" 
            @click="() => { 
              setAllFromUser(); 
              isEditing = false; 
            }"
            class="text-red-400 hover:text-red-600"
          >
            <X/>
          </button>

          <button 
            type="submit" 
            class="text-green-400 hover:text-green-600"
          >
            <Check/>
          </button>
        </div>

        <ProfilePicForm
          :src="auth.user?.profilePic || null"
          :is-editing="isEditing"
          :is-uploading="isUploading"
          :temp-preview="tempPreview"
          @pick="onPickProfilePic"
        />
      </div>

      <ProfileEditForm
        v-model:form="form"
        :errors="errors"
        :disabled="!isEditing"
        :update="updateField"
      />

      <div class="mt-5">
        <button
          type="button"
          @click="deleteOpen = true"
          class="flex items-center justify-center gap-1 text-red-300 hover:text-red-500 mx-auto"
        >
          <Trash :size="14"/> delete account
        </button>
      </div>
    </form>
  </section>

  <section class="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px]
          bg-white rounded-2xl shadow-sm overflow-hidden border border-amber-900 p-5 my-10 mx-auto"
  >
    <RecipesList
      :recipes="usersRecipes"
      :loading="loading"
      :errors="userRecipesErrors"
      @openRecipe="(id: string) => router.push(`/recipes/${id}`)"
      @toggle-like="onToggleLike"
    />
  </section>

  <DeleteModal 
    :open="deleteOpen" 
    @cancel="deleteOpen = false" 
    @confirm="deleteAccount" 
  />
</template>
