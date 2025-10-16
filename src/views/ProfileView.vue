<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { storeToRefs } from 'pinia'
import { ChefHatIcon } from 'lucide-vue-next'

const auth = useAuthStore()
const { user } = storeToRefs(auth)
const router = useRouter()

const form = reactive({
  fullname: '',
  username: '',
  email: '',
  bio: '',
})

watch(user, (u) => {
  if (u) {
    form.fullname = u.fullname ?? ''
    form.username = u.username ?? ''
    form.email = u.email ?? ''
    form.bio = u.bio ?? ''
  }
}, { immediate: true })

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
    
    if(form.bio.trim().length > 200) 
        errors.fullname = 'Bio should be 200 characters max' 

    return Object.keys(errors).length === 0
}

async function onSubmit() {
    // edit
}

</script>

<template>
    <section class="flex items-center justify-center mt-10 ">
        <form @submit.prevent="onSubmit"
        class="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px]
                border rounded-lg border-gray-900 p-5 bg-white shadow-sm text-sm"
        >
            <div class="mb-5 flex items-center justify-center border rounded-full w-20 h-20 overflow-hidden mx-auto" >
                <img
                    v-if="user && user.profilePic"
                    :src="user.profilePic"
                    alt="Profile picture"
                    class="object-cover w-full h-full"
                />
                <ChefHatIcon v-else class="w-10 h-10 text-gray-400" />
            </div>

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

                <!-- bio -->
                <label for="username"class="md:text-right md:self-start md:pt-1" >
                bio
                </label>
                <div class="">
                    <textarea
                        v-model="form.bio" 
                        id="bio"
                        type="text"
                        placeholder="tell smth about yourself"
                        class="w-full px-3 py-1 rounded-lg border border-gray-800 bg-gray-100"
                    ></textarea>
                    <p v-if="errors.username" class="text-xs text-red-600">{{ errors.bio }}</p>
                </div>
            </div>
        </form>
    </section>
</template>
