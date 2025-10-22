import type { useAuthStore } from '@/stores/useAuthStore'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { SigninPayload } from '@/lib/types'

export const useSignIn = (
    auth: ReturnType<typeof useAuthStore>,
    toast: {open: (opts: any) => void }
) => {
    const router = useRouter()

    const form = reactive<SigninPayload>({
        identifier: '',
        password: '',
    })

    const errors = reactive<Record<string, string>>({})
    const loading = ref(false)

    const validate = () => {
        Object.keys(errors).forEach(k => delete errors[k])

        const identifier = form.identifier.trim()
        const password = form.password

        if (!identifier) {
            errors.identifier = 'Username or email is required'
        }

        if (!password || password.trim().length < 8) {
            errors.password = 'Password is required and must be at least 8 characters long'
        }

        return Object.keys(errors).length === 0
    }

    const onSignIn = async () => {
        if (!validate()) return

        loading.value = true
        try {
            const payload: SigninPayload = {
                identifier: form.identifier.trim(),
                password: form.password,
            }

            await auth.signin(payload)

            toast.open({
                message: 'Welcome Back!',
                type: 'success',
                position: 'top',
            })
            router.push('/')
        } catch (e: any) {
            errors.form = e?.data?.message || 'Sign in failed'
            toast.open({
                message: errors.form,
                type: 'error',
                position: 'top',
            })
        } finally {
            loading.value = false
        }
    }

    return { form, errors, loading, onSignIn }
}
