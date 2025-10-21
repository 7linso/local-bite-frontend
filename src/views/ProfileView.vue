<script setup lang="ts">
import { ref, watch} from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

import { useAuthStore } from '@/stores/useAuthStore'

import ProfileEditForm from '@/components/ui/forms/profile/ProfileEditForm.vue'
import ProfilePicForm from '@/components/ui/forms/profile/ProfilePicForm.vue'
import DeleteModal from '@/components/ui/modals/DeleteModal.vue'

import { useProfileForm } from '@/composables/profile/useProfileForm'
import { useProfilePicture } from '@/composables/profile/useProfilePicture'
import { Check, Pencil, Trash, X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const auth = useAuthStore()
const { user } = storeToRefs(auth)
const router = useRouter()
const $toast = useToast()

const isEditing = ref(false)
const deleteOpen = ref(false)

const {
  form, 
  errors, 
  setAllFromUser, 
  validate, 
  submitUpdate
} = useProfileForm(auth, $toast, () => { isEditing.value = false })

const {
  isUploading, 
  tempPreview, 
  onPickProfilePic
} = useProfilePicture(auth, $toast)

watch(user, (u) => {
  if (u) setAllFromUser()
}, { immediate: true })

const handleDelete = async () => {
  try {
    await auth.deleteProfile()
    await auth.signout()
    $toast.success('Successfully deleted profile!', { position: 'top' })
    router.replace('/signin')
  } catch {
    $toast.error('Failed to delete profile!', { position: 'top' })
  } finally {
    deleteOpen.value = false
  }
}
</script>

<template>
  <section class="flex items-center justify-center mt-10">
    <form
      @submit.prevent="submitUpdate(validate)"
      class="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px] border rounded-lg border-gray-900 p-5 bg-white shadow-sm text-sm"
    >
      <div class="relative mb-5 flex justify-center">
        <button
          v-if="!isEditing"
          type="button"
          @click="isEditing = true"
          class="absolute right-0 top-0 -mt-2 -mr-2 text-gray-500 hover:text-gray-700 z-10"
        >
          <Pencil/>
        </button>
        <div 
          v-else 
          class="absolute right-0 top-0 -mt-2 -mr-2 flex items-center gap-2 z-10"
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

  <DeleteModal 
    :open="deleteOpen" 
    @cancel="deleteOpen = false" 
    @confirm="handleDelete" 
  />
</template>
