import { reactive, ref } from 'vue'
import type { ProfileForm, UpdateProfilePayload } from '@/lib/types'
import type { useAuthStore } from '@/stores/useAuthStore'
import { fileToDataUrl, compressPic } from '@/lib/pic-helpers'
import { useRouter } from 'vue-router'

export const useProfileForm = (
    auth: ReturnType<typeof useAuthStore>,
    toast: ReturnType<any>,
    onSaved?: () => void
) => {
    const router = useRouter()

    const form = reactive<ProfileForm>({
        fullname: '',
        username: '',
        email: '',
        bio: '',
        location: {
            locality: '',
            area: '',
            country: ''
        }
    })

    let errors = reactive<Record<string, string>>({})

    const resetErrors = () => {
        for (const k of Object.keys(errors)) delete errors[k]
    }

    const isUploading = ref(false)
    const tempPreview = ref<string | null>(null)
    const fileInputref = ref<HTMLInputElement | null>(null)

    const onPickProfilePic = async (e: Event) => {
        const input = e.target as HTMLInputElement

        const file = input.files?.[0]
        if (!file)
            return

        const allowed = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowed.includes(file.type)) {
            toast.error(
                'Use allowed format: jpeg, png, webp!',
                { position: 'top' }
            )
            input.value = ''
            return
        }

        const MAX_SIZE = 5 * 1024 * 1024
        if (file.size > MAX_SIZE) {
            toast.error(
                `Please select a smaller image. Max ${MAX_SIZE / 1024 / 1024} mb`,
                { position: 'top' }
            )
            input.value = ''
            return
        }

        try {
            isUploading.value = true

            const dataUrl = await fileToDataUrl(file)
            const compressed = await compressPic(dataUrl, 512, 0.85)

            tempPreview.value = compressed
            await auth.updateProfilePic({ profilePic: compressed })

            tempPreview.value = null
            toast.success(
                'Success!',
                { position: 'top' }
            )
        } catch (e) {
            console.error('Upload failed', e)

            toast.error(
                'Failed to update profile picture!',
                { position: 'top' }
            )
            tempPreview.value = null
        } finally {
            isUploading.value = false
            if (fileInputref.value)
                fileInputref.value.value = ''
        }
    }

    const updateField = <K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) => {
        if (k === 'location' && v && typeof v === 'object') {
            Object.assign(form.location, v as Partial<ProfileForm['location']>)
        } else {
            (form as any)[k] = v
        }
    }

    const setAllFromUser = () => {
        const u = auth.user
        if (!u) return

        form.fullname = u.fullname ?? '',
            form.username = u.username ?? '',
            form.email = u.email ?? '',
            form.bio = u.bio ?? '',
            form.location = {
                locality: u.defaultLocation?.locality ?? '',
                area: u.defaultLocation?.area ?? '',
                country: u.defaultLocation?.country ?? '',
            }
    }

    const validate = () => {
        resetErrors()

        if (!form.fullname.trim())
            errors.fullname = 'Full name is required.'
        else if (form.fullname.trim().length < 3)
            errors.fullname = 'Full name must be at least 3 characters long.'

        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errors.email = 'Enter a valid email'

        if (!form.username.trim())
            errors.username = 'Username is required.'
        else if (form.username.trim().length < 6)
            errors.username = 'Username must be at least 6 characters long.'

        if (form.bio.trim().length > 200)
            errors.bio = 'Bio should be 200 characters max.'

        const anyLoc = form.location.locality || form.location.area || form.location.country

        if (anyLoc && (!form.location.locality || !form.location.area || !form.location.country)) {
            errors.location = 'All location fields must be filled (locality, area, and country).'
        }
        return Object.keys(errors).length === 0
    }

    const submitUpdate = async (validateFn: () => boolean) => {
        if (!validateFn()) {
            toast.error('Check credentials!', { position: 'top' })
            return
        }

        try {
            const payload: UpdateProfilePayload = {
                fullname: form.fullname,
                username: form.username,
                email: form.email,
                bio: form.bio,
            }

            const loc = form.location
            if (loc.locality.trim() && loc.area.trim() && loc.country.trim()) {
                payload.location = {
                    locality: loc.locality.trim(),
                    area: loc.area.trim(),
                    country: loc.country.trim(),
                }
            }

            await auth.updateProfile(payload)

            toast.success('Success!', { position: 'top' })
            await Promise.resolve()
            onSaved?.()

        } catch (e: any) {
            const msg = e?.response?.data?.message ?? e?.friendlyMessage ?? e?.data?.message ?? e?.message ?? 'Failed to update profile'

            resetErrors()
            if (msg.includes('Username')) errors.username = msg
            else if (msg.toLowerCase().includes('email')) errors.email = msg
            else if (msg.includes('Bio')) errors.bio = msg
            else if (msg.startsWith('Missing required location fields') || msg === 'Unknown country name.' || msg === 'Failed to geocode.') {
                errors.location = msg
            } else {
                errors.form = msg
            }
            toast.error(msg, { position: 'top' })
        }
    }

    const deleteOpen = ref(false)

    const deleteAccount = async () => {
        try {
            await auth.deleteProfile()
            await auth.signout()
            toast.success('Successfully deleted profile!', { position: 'top' })
            router.replace('/signin')
        } catch {
            toast.error('Failed to delete profile!', { position: 'top' })
        } finally {
            deleteOpen.value = false
        }
    }

    return {
        form,
        errors,
        isUploading,
        tempPreview,
        fileInputref,
        onPickProfilePic,
        setAllFromUser,
        validate,
        submitUpdate,
        updateField,
        deleteOpen,
        deleteAccount
    }
}
