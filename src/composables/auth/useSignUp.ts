import type { SignupPayload } from "@/lib/types";
import type { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";

export const useSignUp = (
    auth: ReturnType<typeof useAuthStore>,
    toast: { open: (opts: any) => void }
) => {
    const router = useRouter()

    const form = reactive({
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

        if (!form.fullname)
            errors.fullname = 'Full name is required'
        if (form.fullname.trim().length < 3)
            errors.fullname = 'Full name must be al least 3 characters long'

        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errors.email = 'Enter a valid email'

        if (!form.username)
            errors.username = 'Username is required'
        if (form.username.trim().length < 6)
            errors.fullname = 'Username must be al least 6 characters long'

        if (form.password.trim().length < 8)
            errors.password = 'Password is required and must be al least 6 characters long'

        if (form.password2 !== form.password)
            errors.password2 = 'Make sure your passwords match'

        return Object.keys(errors).length === 0
    }

    const onSignUp = async () => {
        if (!validate()) {
            toast.open({
                message: 'Check credentials!',
                type: 'error',
                position: 'top'
            })
            return
        }

        loading.value = true

        try {
            await auth.signup({
                fullname: form.fullname,
                email: form.email,
                username: form.username,
                password: form.password,
            })

            toast.open({
                message: 'Good to see you!',
                type: 'success',
                position: 'top'
            })
            router.push('/')
        } catch (e: any) {
            errors.form = e.data?.message || 'Sign up failed'
            toast.open({
                message: 'Failed to sign up!',
                type: 'error',
                position: 'top'
            })
        } finally {
            loading.value = false
        }
    }

    return { form, errors, loading, onSignUp }
}