<script setup lang="ts">
import { ref } from 'vue'
import { CookieIcon } from 'lucide-vue-next'

const props = defineProps<{
  src: string | null
  isEditing: boolean
  isUploading: boolean
  tempPreview: string | null
}>()

const emit = defineEmits<{
  (e: 'pick', ev: Event): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const openPicker = () => fileInput.value?.click()
const onChange = (ev: Event) => emit('pick', ev)
</script>

<template>
  <div class="flex items-center justify-center border rounded-full w-20 h-20 overflow-hidden bg-gray-100">
    <input
      ref="fileInput"
      type="file"
      accept="image/png,image/jpeg,image/webp"
      class="hidden"
      @change="onChange"
    />
    <button
      type="button"
      @click="openPicker"
      class="relative flex items-center justify-center border rounded-full w-20 h-20 overflow-hidden bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/60"
      aria-label="Change profile picture"
      :disabled="isUploading"
    >
      <img
        v-if="tempPreview || src"
        :src="tempPreview || src!"
        alt="Profile picture"
        class="object-cover w-full h-full"
      />
      <span v-else class="text-gray-400 text-xs">
        <CookieIcon :size="30" />
      </span>
    </button>
  </div>
</template>
