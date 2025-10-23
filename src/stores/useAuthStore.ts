import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { auth as apiAuth } from '@/lib/api/auth'
import type { User, ApiUser, SignupPayload, SigninPayload, UpdateProfilePayload, } from '@/lib/types'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const initialized = ref(false)

    const isAuth = computed(() => !!user.value)

    const normalizeUser = (u: ApiUser): User => {
        const dl = u.defaultLocation ?? null
        return {
            _id: u._id,
            fullname: u.fullname,
            username: u.username,
            email: u.email,
            bio: u.bio ?? null,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            profilePic: u.profilePic ?? null,
            favs: u.favs ?? [],
            defaultLocation: dl,
            defaultLocationId: u.defaultLocationId ?? dl?._id ?? null,
        }
    }

    const signup = async (payload: SignupPayload) => {
        const res = await apiAuth.signup(payload)
        user.value = normalizeUser((res as any).user ?? res)
        return user.value
    }

    const signin = async (payload: SigninPayload) => {
        const res = await apiAuth.signin(payload)
        user.value = normalizeUser((res as any).user ?? res)
        return user.value
    }

    const signout = async () => {
        await apiAuth.signout()
        user.value = null
    }

    const me = async () => {
        try {
            const res = await apiAuth.me()
            user.value = normalizeUser((res as any).user ?? res)
        } catch (e: any) {
            user.value = null
            throw e
        }
    }

    const updateProfilePic = async (payload: { profilePic: string }) => {
        const res = await apiAuth.updateProfilePic(payload)
        user.value = normalizeUser((res as any).user ?? res)
        return user.value
    }

    const updateProfile = async (payload: UpdateProfilePayload) => {
        const res = await apiAuth.updateProfile(payload)
        user.value = normalizeUser((res as any).user ?? res)
        return user.value
    }

    const deleteProfile = async () => {
        await apiAuth.deleteProfile()
        user.value = null
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
        deleteProfile,
        ensureAuthChecked,
        initialized
    }
})
