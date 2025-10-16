<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
const router = useRouter()

const form =reactive({
    fullname: '',
    username: '',
    email: '',
    password: '',
    password2: ''
})

const errors = reactive<Record<string, string>>({})
const loading = ref(false)

const validate = () => {
    Object.keys(errors).forEach(k => delete errors[k])

    if(!form.fullname) 
        errors.fullname = 'Full name is required'
    if(form.fullname.trim().length < 3) 
        errors.fullname = 'Full name must be al least 3 characters long'

    if(!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) 
        errors.email = 'Enter a valid email'

    if(!form.username) 
        errors.username = 'Username is required'
    if(form.username.trim().length < 6) 
        errors.fullname = 'Username must be al least 6 characters long'
            
    if(form.password.trim().length < 8) 
        errors.password = 'Password is required and must be al least 6 characters long'

    if(form.password2 !== form.password)
        errors.password2 = 'Make sure your passwords match'

    return Object.keys(errors).length === 0
}

async function onSubmit() {
  if (!validate()) 
    return

  loading.value = true

  try {
    await auth.signup({
      fullname: form.fullname,
      email: form.email,
      username: form.username,
      password: form.password,
    })

    router.push('/profile') 
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
                class="w-full px-3 py-1 rounded-lg border border-gray-800 bg-gray-100"
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
                class="w-full px-3 py-1 rounded-lg border border-gray-800 bg-gray-100"
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
                class="w-full px-3 py-1 rounded-lg border border-gray-800 bg-gray-100"
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
                class="w-full px-3 py-1 rounded-lg border border-gray-800 bg-gray-100"
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
                class="w-full px-3 py-1 rounded-lg border border-gray-800 bg-gray-100"
            />
            <p v-if="errors.password2" class="text-xs text-red-600">{{ errors.password2 }}</p>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center mt-4 gap-2">
        <button
          :disabled="loading"
          type="submit"
          class="px-4 py-1.5 rounded-lg border border-gray-800 hover:bg-gray-100 transition-colors"
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
