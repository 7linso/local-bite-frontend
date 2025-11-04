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
  deleteAccount,
} = useProfileForm(auth, toast, () => { isEditing.value = false })

const recipeStore = useRecipeListStore()
const { 
  fetchUsersRecipes,
  fetchNextUsersRecipes,
  fetchUsersLikedRecipes,
  fetchNextUsersLikedRecipes
} = recipeStore

const { 
  usersRecipes, 
  usersError,
  usersLoading,
  usersHasNextPage,

  usersLikedRecipes,
  likedLoading,
  likedError,
  likedHasNextPage,
} = storeToRefs(recipeStore)

const applyLikeLocal = (id: string, next: boolean) => {
  const touch = (arr: any[]) => {
    const it = arr.find(x => x._id === id)
    if (it) {
      const delta = next ? 1 : -1
      it.isLiked = next
      it.likeCount = Math.max(0, (it.likeCount ?? 0) + delta)
    }
  }
  touch(usersRecipes.value)

  if (!next) {
    const idx = usersLikedRecipes.value.findIndex(x => x._id === id)
    if (idx !== -1) usersLikedRecipes.value.splice(idx, 1)
  } else {
    touch(usersLikedRecipes.value)
  }
}

const onToggleLike = async ({ id, next }: { id: string; next: boolean }) => {
  const pool = activeTab.value === 'favs' ? usersLikedRecipes.value : usersRecipes.value
  const prev = pool.find(x => x._id === id)
  const prevState = prev ? { isLiked: prev.isLiked, likeCount: prev.likeCount } : null

  applyLikeLocal(id, next)

  try {
    await (next ? recipes.likeRecipe(id) : recipes.dislikeRecipe(id))
  } catch {
    const rollback = (arr: any[]) => {
      const it = arr.find(x => x._id === id)
      if (it && prevState) {
        it.isLiked = prevState.isLiked
        it.likeCount = prevState.likeCount
      }
    }
    rollback(usersRecipes.value)
    if (activeTab.value === 'favs' && !next && prev) {
      const exists = usersLikedRecipes.value.some(x => x._id === id)
      if (!exists) usersLikedRecipes.value.unshift(prev as any)
    } else {
      rollback(usersLikedRecipes.value)
    }
  }
}

const activeTab = ref<'collection' | 'favs'>('collection')

watch(user, (u) => {
  if (u) {
    setAllFromUser()
    fetchUsersRecipes()
  }
}, { immediate: true })

watch(activeTab, (t) => {
  if (t === 'collection') 
    return

  if (usersLikedRecipes.value.length === 0 && !likedLoading.value) 
    fetchUsersLikedRecipes() 
})

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

  <section
    class="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px]
          bg-white rounded-2xl shadow-sm overflow-hidden border border-amber-900 p-5 my-10 mx-auto"
  >
    <div class="flex items-center justify-center gap-2 mb-4">
      <button
        :class="[
          'px-4 py-1.5 rounded-full border transition',
          activeTab === 'collection'
            ? 'bg-amber-900 text-white border-amber-900'
            : 'bg-white text-amber-900 border-amber-900 hover:bg-amber-50'
        ]"
        @click="activeTab = 'collection'"
      >
        My collection
      </button>

      <button
        :class="[
          'px-4 py-1.5 rounded-full border transition',
          activeTab === 'favs'
            ? 'bg-amber-900 text-white border-amber-900'
            : 'bg-white text-amber-900 border-amber-900 hover:bg-amber-50'
        ]"
        @click="activeTab = 'favs'"
      >
        Favourites
      </button>
    </div>

    <div v-if="activeTab === 'collection'">
      <RecipesList
        :recipes="usersRecipes"
        :loading="usersLoading"
        :errors="{ list: usersError || '' }"
        @openRecipe="(id: string) => router.push(`/recipes/${id}`)"
        @toggle-like="onToggleLike"
      />

      <div v-if="usersHasNextPage" class="flex justify-center items-center gap-2 mt-4">
        <button
          @click="fetchNextUsersRecipes"
          class="inline-flex w-full md:w-auto items-center justify-center rounded-xl border border-gray-800 px-4 py-2 font-medium hover:bg-gray-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 transition"
        >
          More
        </button>
      </div>
    </div>

    <div v-else>
      <RecipesList
        :recipes="usersLikedRecipes"
        :loading="likedLoading"
        :errors="{ list: likedError || '' }"
        @openRecipe="(id: string) => router.push(`/recipes/${id}`)"
        @toggle-like="onToggleLike"
      />

      <div v-if="likedHasNextPage" class="flex justify-center items-center gap-2 mt-4">
        <button
          @click="fetchNextUsersLikedRecipes"
          class="inline-flex w-full md:w-auto items-center justify-center rounded-xl border border-gray-800 px-4 py-2 font-medium hover:bg-gray-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-800 transition"
        >
          More
        </button>
      </div>
    </div>
  </section>

  <DeleteModal 
    :open="deleteOpen" 
    @cancel="deleteOpen = false" 
    @confirm="deleteAccount" 
  />
</template>
