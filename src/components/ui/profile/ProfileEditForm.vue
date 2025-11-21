<script setup lang="ts">
import type { ProfileForm } from '@/lib/types'
import { computed } from 'vue'

const props = defineProps<{
  form: ProfileForm,
  errors: Record<string, string>,
  disabled?: boolean
  update?: (k: keyof ProfileForm, v: any) => void
  hiddenFields?: string[]
}>()

const emit = defineEmits<{
  (e: 'update:form', value: ProfileForm): void
}>()

const hide = (f: string) => props.hiddenFields?.includes(f) ?? false

const readonly = computed(() => !!props.disabled)

</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 md:gap-y-3">
    
    <div 
      class="md:col-span-3 md:text-right md:self-start md:pt-1" 
      v-if="!hide('fullname')"
    >
      <label for="fullname">full name</label>
    </div>
    <div class="md:col-span-9" v-if="!hide('fullname')">
      <input
        :value="form.fullname"
        @input="update && update('fullname', ($event.target as HTMLInputElement).value)"
        id="fullname" 
        type="text" 
        placeholder="John Doe" 
        :disabled="disabled"
        class="w-full px-3 py-1 rounded-md border border-gray-600 bg-gray-100"
      />
      <p v-if="errors.fullname" class="text-xs text-red-600">{{ errors.fullname }}</p>
    </div>

   <div 
      class="md:col-span-3 md:text-right md:self-start md:pt-1" 
      v-if="!hide('email')"
    >
      <label for="email">email</label>
    </div>
    <div class="md:col-span-9" v-if="!hide('email')">
      <input
        :value="form.email"
        @input="update && update('email', ($event.target as HTMLInputElement).value)"
        id="email" 
        type="email" 
        placeholder="john1doe@gmail.com" 
        :disabled="disabled"
        class="w-full px-3 py-1 rounded-md border border-gray-600 bg-gray-100"
    />
      <p v-if="errors.email" class="text-xs text-red-600">{{ errors.email }}</p>
    </div>

    <div 
      class="md:col-span-3 md:text-right md:self-start md:pt-1" 
      v-if="!hide('username')"
    >
      <label for="username">username</label>
    </div>
    <div class="md:col-span-9" v-if="!hide('username')">
      <input
        :value="form.username"
        @input="update && update('username', ($event.target as HTMLInputElement).value)"
        id="username" 
        type="text" 
        placeholder="john_doe111" 
        :disabled="disabled"
        class="w-full px-3 py-1 rounded-md border border-gray-600 bg-gray-100"
      />
      <p v-if="errors.username" class="text-xs text-red-600">{{ errors.username }}</p>
    </div>

    <div 
      class="md:col-span-3 md:text-right md:self-start md:pt-1" 
      v-if="!hide('bio')"
    >
      <label for="bio">bio</label>
    </div>
    <div class="md:col-span-9" v-if="!hide('bio')">
      <textarea
        :value="form.bio"
        @input="update && update('bio', ($event.target as HTMLTextAreaElement).value)"
        id="bio" 
        placeholder="tell smth about yourself" 
        :disabled="disabled"
        class="w-full px-3 py-1 rounded-md border border-gray-600 bg-gray-100"
      ></textarea>
      <p v-if="errors.bio" class="text-xs text-red-600">{{ errors.bio }}</p>
    </div>

    <div 
      class="md:col-span-3 md:text-right md:self-start md:pt-1" 
      v-if="!hide('location')"
    >
      <label for="locality">locality</label>
    </div>
    <div class="md:col-span-9" v-if="!hide('location')">
      <p 
        v-if="errors?.location" 
        class="text-xs text-red-600"
      >
        {{ errors.location }}
      </p>
      <input
        :value="form.location?.locality ?? ''"
        @input="update && update('location', { ...form.location, locality: ($event.target as HTMLInputElement).value })"
        id="locality"
        type="text"
        placeholder="Winnipeg"
        :readonly="readonly"
        :disabled="false"
        class="w-full px-3 py-1 rounded-md border border-gray-600 bg-gray-100"
      />
    </div>

    <div 
      class="md:col-span-3 md:text-right md:self-start md:pt-1" 
      v-if="!hide('location')"
    >
      <label for="area">area</label>
    </div>
    <div class="md:col-span-9" v-if="!hide('location')">
      <input
        :value="form.location?.area ?? ''"
        @input="update && update('location', { ...form.location, area: ($event.target as HTMLInputElement).value })"
        id="area"
        type="text"
        placeholder="MB"
        :readonly="readonly"
        :disabled="false"
        class="w-full px-3 py-1 rounded-md border border-gray-600 bg-gray-100"
      />
    </div>

    <div 
      class="md:col-span-3 md:text-right md:self-start md:pt-1" 
      v-if="!hide('location')"
    >
      <label for="country">country</label>
    </div>
    <div class="md:col-span-9" v-if="!hide('location')">
      <input
        v-if="!hide('location')"
        :value="form.location?.country ?? ''"
        @input="update && update('location', { ...form.location, country: ($event.target as HTMLInputElement).value })"
        id="country"
        type="text"
        placeholder="Canada"
        :readonly="readonly"
        :disabled="false"
        class="w-full px-3 py-1 rounded-md border border-gray-600 bg-gray-100"
      />
    </div>
  </div>
</template>
