import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { auth as apiAuth } from "@/lib/auth";

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null)

    const isAuth = computed(() => !!user.value)

    const signup = async (payload: any) => {
        const data = await apiAuth.signup(payload)
        user.value = data
        return data
    }

    const signin = async (payload: any) => {
        const data = await apiAuth.signin(payload)
        user.value = data
        return data
    }

    const signout = async () => {
        const data = await apiAuth.signout()
        user.value = null
    }

    return {user, isAuth, signup, signin, signout}
})