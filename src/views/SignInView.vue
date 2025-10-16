<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/lib/auth'

const router = useRouter()

const form = reactive({
    identifier: '',
    password: '',
})

const errors = reactive<Record<string, string>>({})
const loading = ref(false)

const validate = () => {
    Object.keys(errors).forEach(k => delete errors[k])

    if(!form.identifier) 
        errors.identifier = 'Username is required'
            
    if(form.password.trim().length < 8) 
        errors.password = 'Password is required and must be al least 6 characters long'

    return Object.keys(errors).length === 0
}

async function onSubmit() {
  if (!validate()) 
    return

  loading.value = true

  try {
    await auth.signin({
      identifier: form.identifier,
      password: form.password,
    })

    router.push('/about') 
  } catch (e: any) {
        errors.form = e.data?.message || 'Sign up failed'
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <section class="flex items-center justify-center mt-10 ">
    <form @submit.prevent="onSubmit"
      class="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px]
             border rounded-lg border-gray-900 p-5 bg-white shadow-sm text-sm"
    >
      <p v-if="errors.form" class="text-xs text-red-600">{{ errors.form }}</p>

      <div
        class="grid gap-y-1 md:gap-y-3 gap-x-4
               grid-cols-1 md:[grid-template-columns:150px_minmax(0,1fr)]"
        aria-label="input-placeholder"
      >
        <!-- identifier -->
        <label for="identifier" class="md:text-right md:self-start md:pt-1" >
          email/username
        </label>
        <div class="">
            <input
                v-model="form.identifier" 
                id="identifier"
                type="text"
                placeholder="John Doe"
                class="w-full px-3 py-1 rounded-lg border border-gray-800 bg-gray-100"
            />
            <p v-if="errors.identifier" class="text-xs text-red-600">{{ errors.identifier }}</p>
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
                class="w-full px-3 py-1 rounded-lg border border-gray-800 bg-gray-100"
            />
            <p v-if="errors.password" class="text-xs text-red-600">{{ errors.password }}</p>

        </div>
      </div>

      <div class="flex flex-col items-center justify-center mt-4 gap-2">
        <button
          :disabled="loading"
          type="submit"
          class="px-4 py-1.5 rounded-lg border border-gray-800 hover:bg-gray-100 transition-colors"
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
