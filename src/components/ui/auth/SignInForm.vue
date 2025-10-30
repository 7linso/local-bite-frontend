<script lang="ts" setup>
import type { SigninPayload } from '@/lib/types';

const props = defineProps<{
  form: SigninPayload
  errors: Record<string, string>
  loading: boolean
}>()

const emit = defineEmits<{ (e: 'submit'): void }>()
</script>

<template>
  <section class="flex items-center justify-center mt-10">
    <form
      @submit.prevent="emit('submit')"
      class="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px] bg-white rounded-2xl shadow-sm overflow-hidden border border-amber-900 p-5"
    >
      <p v-if="errors.form" class="text-xs text-red-600">{{ errors.form }}</p>

      <div
        class="grid gap-y-1 md:gap-y-3 gap-x-4
               grid-cols-1 md:[grid-template-columns:150px_minmax(0,1fr)]"
      >
        <!-- identifier -->
        <label for="identifier" class="md:text-right md:self-start md:pt-1">
          email / username
        </label>
        <div>
          <input
            v-model="form.identifier"
            id="identifier"
            type="text"
            autocomplete="username email"
            placeholder="John Doe"
            class="w-full px-3 py-1 rounded-md border border-gray-800 bg-gray-100"
          />
          <p v-if="errors.identifier" class="text-xs text-red-600">
            {{ errors.identifier }}
          </p>
        </div>

        <!-- password -->
        <label for="password" class="md:text-right md:self-start md:pt-1">
          password
        </label>
        <div>
          <input
            v-model="form.password"
            id="password"
            type="password"
            autocomplete="current-password"
            placeholder="password"
            class="w-full px-3 py-1 rounded-md border border-gray-800 bg-gray-100"
          />
          <p v-if="errors.password" class="text-xs text-red-600">
            {{ errors.password }}
          </p>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center mt-4 gap-2">
        <button
          :disabled="loading"
          type="submit"
          class="border-amber-800 px-4 py-2 font-medium hover:bg-amber-900 hover:text-white rounded-md border transition-colors text-amber-950"
        >
          Sign in
        </button>

        <RouterLink
          to="/signup"
          class="text-xs text-gray-600 hover:text-gray-800 transition-colors"
        >
          Don't have an account? Create one
        </RouterLink>
      </div>
    </form>
  </section>
</template>
