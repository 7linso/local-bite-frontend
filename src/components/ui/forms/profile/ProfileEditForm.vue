<script setup lang="ts">
import type { ProfileForm } from '@/lib/types'

const props = defineProps<{
  form: ProfileForm,
  errors: Record<string, string>,
  disabled?: boolean
}>()
const emit = defineEmits<{ (e:'update:form', v:ProfileForm): void }>()

const update = <K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) => {
  const next = { ...props.form, [k]: v }
  emit('update:form', next)
}
</script>

<template>
  <div class="grid gap-y-1 md:gap-y-3 gap-x-4 grid-cols-1 md:[grid-template-columns:150px_minmax(0,1fr)]">
    <label 
      for="fullname" 
      class="md:text-right md:self-start md:pt-1"
    >
      full name
    </label>
    <div>
      <input
        :value="form.fullname"
        @input="update('fullname', ($event.target as HTMLInputElement).value)"
        id="fullname" 
        type="text" 
        placeholder="John Doe" 
        :disabled="disabled"
        class="w-full px-3 py-1 rounded-lg border border-gray-600 bg-gray-100"
      />
      <p v-if="errors.fullname" class="text-xs text-red-600">{{ errors.fullname }}</p>
    </div>

    <label 
      for="email" 
      class="md:text-right md:self-start md:pt-1" 
    >
      email
    </label>
    <div>
      <input
        :value="form.email"
        @input="update('email', ($event.target as HTMLInputElement).value)"
        id="email" 
        type="email" 
        placeholder="john1doe@gmail.com" 
        :disabled="disabled"
        class="w-full px-3 py-1 rounded-lg border border-gray-600 bg-gray-100"
      />
      <p v-if="errors.email" class="text-xs text-red-600">{{ errors.email }}</p>
    </div>

    <label 
      for="username" 
      class="md:text-right md:self-start md:pt-1"
    >
      username
    </label>
    <div>
      <input
        :value="form.username"
        @input="update('username', ($event.target as HTMLInputElement).value)"
        id="username" 
        type="text" 
        placeholder="john_doe111" 
        :disabled="disabled"
        class="w-full px-3 py-1 rounded-lg border border-gray-600 bg-gray-100"
      />
      <p v-if="errors.username" class="text-xs text-red-600">{{ errors.username }}</p>
    </div>

    <label 
      for="bio" 
      class="md:text-right md:self-start md:pt-1"
    >
      bio
    </label>
    <div>
      <textarea
        :value="form.bio"
        @input="update('bio', ($event.target as HTMLTextAreaElement).value)"
        id="bio" 
        placeholder="tell smth about yourself" 
        :disabled="disabled"
        class="w-full px-3 py-1 rounded-lg border border-gray-600 bg-gray-100"
      ></textarea>
      <p v-if="errors.bio" class="text-xs text-red-600">{{ errors.bio }}</p>
    </div>

    <label 
      for="locality" 
      class="md:text-right md:self-start md:pt-1"
    >
      locality
    </label>
    <div>
      <p v-if="errors.location" class="text-xs text-red-600">{{ errors.location }}</p>
      <input
        :value="form.location.locality"
        @input="update('location', { ...form.location, locality: ($event.target as HTMLInputElement).value })"
        id="locality" 
        type="text" 
        placeholder="Winnipeg" 
        :disabled="disabled"
        class="w-full px-3 py-1 rounded-lg border border-gray-600 bg-gray-100"
      />
    </div>

    <label 
      for="area" 
      class="md:text-right md:self-start md:pt-1"
    >
      area
    </label>
    <input
      :value="form.location.area"
      @input="update('location', { ...form.location, area: ($event.target as HTMLInputElement).value })"
      id="area" 
      type="text" 
      placeholder="MB" 
      :disabled="disabled"
      class="w-full px-3 py-1 rounded-lg border border-gray-600 bg-gray-100"
    />

    <label 
      for="country" 
      class="md:text-right md:self-start md:pt-1"
    >
      country
    </label>
    <input
      :value="form.location.country"
      @input="update('location', { ...form.location, country: ($event.target as HTMLInputElement).value })"
      id="country" 
      type="text" 
      placeholder="Canada" 
      :disabled="disabled"
      class="w-full px-3 py-1 rounded-lg border border-gray-600 bg-gray-100"
    />
  </div>
</template>
