import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { auth as apiAuth } from "@/lib/auth";

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null)

    const isAuth = computed(() => !!user.value)

    function normalizeUser(u: any) {
        return {
            _id: u._id,
            fullname: u.fullname,
            username: u.username,
            email: u.email,
            bio: u.bio ?? null,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            profilePic: u.profilePic?.imageURL ?? null,
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
        const data = await apiAuth.signout()
        user.value = null
    }

    const me = async () => {
        const res = await apiAuth.me()
        user.value = normalizeUser(res.user ?? res)
    }

    return { user, isAuth, signup, signin, signout, me }
})