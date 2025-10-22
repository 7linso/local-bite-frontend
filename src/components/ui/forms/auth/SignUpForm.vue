<script lang="ts" setup>
import type { SignupFormPayload } from '@/lib/types';

const props=defineProps<{
    form: SignupFormPayload,
    errors: Record<string, string>,
    loading: boolean
}>()

const emit = defineEmits<{(e: 'submit'): void}>()
</script>

<template>
    <section class="flex items-center justify-center mt-10 ">
    <form @submit.prevent="emit('submit')"
      class="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px]
             border rounded-md border-gray-900 p-5 bg-white shadow-sm text-sm"
    >
      <div
        class="grid gap-y-1 md:gap-y-3 gap-x-4
               grid-cols-1 md:[grid-template-columns:150px_minmax(0,1fr)]"
        aria-label="input-placeholder"
      >
        <!-- full name -->
        <label for="fullname" class="md:text-right md:self-start md:pt-1" >
          full name
        </label>
        <div class="">
            <input
                v-model="form.fullname" 
                id="fullname"
                type="text"
                placeholder="John Doe"
                class="w-full px-3 py-1 rounded-md border border-gray-800 bg-gray-100"
            />
            <p v-if="errors.fullname" class="text-xs text-red-600">{{ errors.fullname }}</p>
        </div>

        <!-- email -->
        <label for="email"class="md:text-right md:self-start md:pt-1" >
          email
        </label>
        <div class="">
            <input
                v-model="form.email" 
                id="email"
                type="email"
                placeholder="john1doe@gmail.com"
                class="w-full px-3 py-1 rounded-md border border-gray-800 bg-gray-100"
            />
            <p v-if="errors.email" class="text-xs text-red-600">{{ errors.email }}</p>

        </div>

        <!-- username -->
        <label for="username"class="md:text-right md:self-start md:pt-1" >
          username
        </label>
        <div class="">
            <input
                v-model="form.username" 
                id="username"
                type="text"
                placeholder="john_doe111"
                class="w-full px-3 py-1 rounded-md border border-gray-800 bg-gray-100"
            />
            <p v-if="errors.username" class="text-xs text-red-600">{{ errors.username }}</p>
        </div>

        <!-- password -->
        <label for="password"class="md:text-right md:self-start md:pt-1" >
          password
        </label>
        <div class="">
            <input
                v-model="form.password" 
                id="password"
                type="password"
                placeholder="password"
                class="w-full px-3 py-1 rounded-md border border-gray-800 bg-gray-100"
            />
            <p v-if="errors.password" class="text-xs text-red-600">{{ errors.password }}</p>

        </div>

        <!-- confirm password -->
        <label for="password2"class="md:text-right md:self-start md:pt-1" >
          confirm password
        </label>
        <div class="">
            <input
                v-model="form.password2" 
                id="password2"
                type="password"
                placeholder="password"
                class="w-full px-3 py-1 rounded-md border border-gray-800 bg-gray-100"
            />
            <p v-if="errors.password2" class="text-xs text-red-600">{{ errors.password2 }}</p>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center mt-4 gap-2">
        <button
          :disabled="loading"
          type="submit"
          class="px-4 py-1.5 rounded-md border border-gray-800 hover:bg-gray-100 transition-colors"
        >
          Sign up
        </button>

        <RouterLink
          to="/signin"
          class="text-xs text-gray-600 hover:text-gray-800 transition-colors"
        >
          Already have an account?
        </RouterLink>
      </div>
    </form>
  </section>
</template>