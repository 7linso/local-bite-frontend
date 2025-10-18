<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { storeToRefs } from 'pinia'
import { Check, Edit, ChefHat, X, Loader2 } from 'lucide-vue-next'

const auth = useAuthStore()
const { user } = storeToRefs(auth)

const isEditing = ref(false)

const isUploading = ref(false)
const fileInputref = ref< HTMLInputElement | null >(null)
const tempPreview = ref< string | null >(null)

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
  },
  { immediate: true }
)

const errors = reactive<Record<string, string>>({})

const validate = () => {
    Object.keys(errors).forEach((k) => delete errors[k])

    if (!form.fullname) 
        errors.fullname = 'Full name is required'
    else if (form.fullname.trim().length < 3) 
        errors.fullname = 'Full name must be at least 3 characters long'

    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) 
        errors.email = 'Enter a valid email'

    if (!form.username) 
        errors.username = 'Username is required'
    else if (form.username.trim().length < 6) 
        errors.username = 'Username must be at least 6 characters long'

    if (form.bio.trim().length > 200) 
        errors.bio = 'Bio should be 200 characters max'

    return Object.keys(errors).length === 0
}

const setAllFromUser = () => {
    if(!user.value) 
        return

    form.fullname = user.value.fullname ?? ''
    form.username = user.value.username ?? ''
    form.email = user.value.email ?? ''
    form.bio = user.value.bio ?? ''
}

const onUpdateProfile = async () => {
    if (!validate()) 
        return

    isEditing.value = true

    try{
        await auth.updateProfile({
            fullname: form.fullname,
            username: form.username,
            email: form.email,
            bio: form.bio
        })

        isEditing.value = false
        setAllFromUser()
    } catch (e: any) {
        const msg= e.data?.message || 'Sign up failed'

        if (msg === "Username already taken.") {
            errors.username = msg;
        } else if (msg === 'Email already used.') {
            errors.email = msg;
        } else if (msg === "Not valid email.") {
            errors.email = msg;
        } else if (msg === 'Bio is too long. Max 200 characters.') {
            errors.bio = msg;
        } else {
            errors.form = msg;
        }
    }
}

const fileToDataUrl = async(file: File):Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

const compressPic = async (dataUrl: string, maxW: 512, quality = 0.85): Promise<string> => {
    const img = new Image()
    img.src = dataUrl
    await img.decode

    const scale = Math.min(1, maxW / img.width)
    const w = Math.round(img.width * scale)
    const h = Math.round(img.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(img, 0, 0, w, h)

    const out = canvas.toDataURL('image/jpeg', quality)
    return out

}

const handleUpdateProfilePic = async() => {
    fileInputref.value?.click()
}

const onPickProfilePic = async(e: Event) => {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/png', 'image/webp']

    if(!allowed.includes(file.type)){
        alert('Please select a JPG/PNG/WEBP image.')
        input.value = ''
        return
    }

    const MAX_SIZE = 5 * 1024 * 1024
    if(file.size > MAX_SIZE){
        alert(`Please select a smaller image. Max ${MAX_SIZE / 1024 / 1024} mb`)
        input.value = ''
        return
    }

    try{
        isUploading.value = true

        const dataUrl = await fileToDataUrl(file)

        const compressed = await compressPic(dataUrl, 512, 0.85)

        tempPreview.value = compressed

        await auth.updateProfilePic({ profilePic: compressed })
        tempPreview.value = null
    } catch (e: unknown) {
        console.error('Upload failed', e)
        alert('Failed to update profile picture.')

        tempPreview.value = null
    } finally {
        isUploading.value = true

        if(fileInputref.value) 
            fileInputref.value.value = ''
    }
}
</script>

<template>
  <section class="flex items-center justify-center mt-10">
    <form
        @submit.prevent="onUpdateProfile"
        class="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px] border rounded-lg border-gray-900 p-5 bg-white shadow-sm text-sm"
    >
        <div class="relative mb-5 flex justify-center">
            <!-- Toggle button -->
            <button
                v-if="!isEditing"
                type="button"
                @click="isEditing = true"
                class="absolute right-0 top-0 -mt-2 -mr-2 text-gray-500 hover:text-gray-700 z-10"
            >
                <Edit class="w-6 h-6" />
            </button>
            <div v-else class="absolute right-0 top-0 -mt-2 -mr-2 flex items-center gap-2 z-10">
                <button
                    type="button"
                    @click="isEditing = false"
                    class="text-red-300 hover:text-red-500 transition-colors"
                >
                    <X class="w-6 h-6" />
                </button>
                <button
                    type="submit"
                    class="text-green-300 hover:text-green-500 transition-colors"
                >
                    <Check class="w-6 h-6" />
                </button>
            </div>

            <!-- Avatar -->
            <div class="flex items-center justify-center border rounded-full w-20 h-20 overflow-hidden bg-gray-100">
                <input
                    ref="fileInputref"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    class="hidden"
                    @change="onPickProfilePic"
                />

                <!-- Click avatar to edit -->
                <button
                    type="button"
                    @click="handleUpdateProfilePic"
                    class="relative flex items-center justify-center border rounded-full w-20 h-20 overflow-hidden bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/60"
                    aria-label="Change profile picture"
                >
                <img
                    v-if="user && user.profilePic"
                    :src="user.profilePic"
                    alt="Profile picture"
                    class="object-cover w-full h-full"
                />
                <ChefHat v-else class="w-10 h-10 text-gray-400" />
                </button>
            </div>
        </div>

        <div
            class="grid gap-y-1 md:gap-y-3 gap-x-4 grid-cols-1 md:[grid-template-columns:150px_minmax(0,1fr)]"
            aria-label="input-placeholder"
        >
            <!-- full name -->
            <label for="fullname" class="md:text-right md:self-start md:pt-1">
                full name
            </label>
            <div>
                <input
                    v-model="form.fullname"
                    id="fullname"
                    type="text"
                    placeholder="John Doe"
                    :disabled="!isEditing"
                    class="w-full px-3 py-1 rounded-lg border border-gray-600 bg-gray-100"
                />
                <p v-if="errors.fullname" class="text-xs text-red-600">{{ errors.fullname }}</p>
            </div>

            <!-- email -->
            <label for="email" class="md:text-right md:self-start md:pt-1">
                email
            </label>
            <div>
                <input
                    v-model="form.email"
                    id="email"
                    type="email"
                    placeholder="john1doe@gmail.com"
                    :disabled="!isEditing"
                    class="w-full px-3 py-1 rounded-lg border border-gray-600 bg-gray-100"
                />
                <p v-if="errors.email" class="text-xs text-red-600">{{ errors.email }}</p>
            </div>

            <!-- username -->
            <label for="username" class="md:text-right md:self-start md:pt-1">
                username
            </label>
            <div>
                <input
                    v-model="form.username"
                    id="username"
                    type="text"
                    placeholder="john_doe111"
                    :disabled="!isEditing"
                    class="w-full px-3 py-1 rounded-lg border border-gray-600 bg-gray-100"
                />
                <p v-if="errors.username" class="text-xs text-red-600">{{ errors.username }}</p>
            </div>

            <!-- bio -->
            <label for="bio" class="md:text-right md:self-start md:pt-1">
                bio
            </label>
            <div>
                <textarea
                    v-model="form.bio"
                    id="bio"
                    placeholder="tell smth about yourself"
                    :disabled="!isEditing"
                    class="w-full px-3 py-1 rounded-lg border border-gray-600 bg-gray-100"
                ></textarea>
                <p v-if="errors.bio" class="text-xs text-red-600">{{ errors.bio }}</p>
            </div>

            <!-- location -->
            <!-- <label for="fullname" class="md:text-right md:self-start md:pt-1">
                full name
            </label>
            <div>
                <input
                    v-model="form.fullname"
                    id="fullname"
                    type="text"
                    placeholder="John Doe"
                    :disabled="!isEditing"
                    class="w-full px-3 py-1 rounded-lg border border-gray-600 bg-gray-100"
                />
                <p v-if="errors.fullname" class="text-xs text-red-600">{{ errors.fullname }}</p>
            </div> -->
        </div>
    </form>
  </section>
</template>
