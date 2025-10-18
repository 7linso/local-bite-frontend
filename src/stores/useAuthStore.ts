import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { auth as apiAuth } from '@/lib/auth'

type RawUser = any

type User = {
    _id: string
    fullname?: string
    username?: string
    email?: string
    bio?: string | null
    createdAt?: string
    updatedAt?: string
    profilePic?: string | null
    location?: string | null
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const initialized = ref(false)

    const isAuth = computed(() => !!user.value)

    function normalizeUser(u: RawUser): User {
        const pic = u.profilePic
        const imageURL = typeof pic === 'string' ? pic : pic?.imageURL
        return {
            _id: u._id,
            fullname: u.fullname,
            username: u.username,
            email: u.email,
            bio: u.bio ?? null,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            profilePic: imageURL ?? null,
            location: u.location ?? null,
        }
    }

    const signup = async (payload: any) => {
        const res = await apiAuth.signup(payload)
        user.value = normalizeUser(res.user ?? res)
        return user.value
    }

    const signin = async (payload: any) => {
        const res = await apiAuth.signin(payload)
        user.value = normalizeUser(res.user ?? res)
        return user.value
    }

    const signout = async () => {
        await apiAuth.signout()
        user.value = null
    }

    const me = async () => {
        const res = await apiAuth.me()
        user.value = normalizeUser(res.user ?? res)
    }

    const updateProfilePic = async (payload: any) => {
        const res = await apiAuth.updateProfilePic(payload)
        user.value = normalizeUser(res.user ?? res)
        return user.value
    }

    const updateProfile = async (payload: any) => {
        const res = await apiAuth.updateProfile(payload)
        user.value = normalizeUser(res.user ?? res)
        return user.value
    }

    const ensureAuthChecked = async () => {
        if (initialized.value) return
        try {
            await me()
        } catch {
        } finally {
            initialized.value = true
        }
    }

    return {
        user,
        isAuth,
        signup,
        signin,
        signout,
        me,
        updateProfilePic,
        updateProfile,
        ensureAuthChecked,
        initialized
    }
})
