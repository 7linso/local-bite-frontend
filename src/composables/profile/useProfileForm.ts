import { ref } from 'vue'
import type { ProfileForm, UpdateProfilePayload } from '@/lib/types'
import type { useAuthStore } from '@/stores/useAuthStore'

export function useProfileForm(
    auth: ReturnType<typeof useAuthStore>,
    toast: ReturnType<any>,
    onSaved?: () => void
) {
    const form = ref<ProfileForm>({
        fullname: '',
        username: '',
        email: '',
        bio: '',
        location: { locality: '', area: '', country: '' }
    })

    const errors = ref<Record<string, string>>({})

    function setAllFromUser() {
        const u = auth.user
        if (!u) return

        form.value = {
            fullname: u.fullname ?? '',
            username: u.username ?? '',
            email: u.email ?? '',
            bio: u.bio ?? '',
            location: {
                locality: u.defaultLocation?.locality ?? '',
                area: u.defaultLocation?.area ?? '',
                country: u.defaultLocation?.country ?? '',
            }
        }
    }

    const validate = () => {
        errors.value = {}

        if (!form.value.fullname)
            errors.value.fullname = 'Full name is required.'
        else if (form.value.fullname.trim().length < 3)
            errors.value.fullname = 'Full name must be at least 3 characters long.'

        if (!form.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))
            errors.value.email = 'Enter a valid email'

        if (!form.value.username)
            errors.value.username = 'Username is required.'
        else if (form.value.username.trim().length < 6)
            errors.value.username = 'Username must be at least 6 characters long.'

        if (form.value.bio.trim().length > 200)
            errors.value.bio = 'Bio should be 200 characters max.'

        const anyLoc = form.value.location.locality || form.value.location.area || form.value.location.country

        if (anyLoc && (!form.value.location.locality || !form.value.location.area || !form.value.location.country)) {
            errors.value.location = 'All location fields must be filled (locality, area, and country).'
        }
        return Object.keys(errors.value).length === 0
    }

    const submitUpdate = async (validateFn: () => boolean) => {
        if (!validateFn()) {
            toast.error('Check credentials!', { position: 'top' })
            return
        }

        try {
            const payload: UpdateProfilePayload = {
                fullname: form.value.fullname,
                username: form.value.username,
                email: form.value.email,
                bio: form.value.bio,
            }

            const loc = form.value.location
            if (loc.locality.trim() && loc.area.trim() && loc.country.trim()) {
                payload.location = {
                    locality: loc.locality.trim(),
                    area: loc.area.trim(),
                    country: loc.country.trim(),
                }
            }

            await auth.updateProfile(payload)

            toast.success('Success!', { position: 'top' })

            onSaved?.()
        } catch (e: any) {
            const msg = e?.response?.data?.message ?? e?.friendlyMessage ?? e?.data?.message ?? e?.message ?? 'Failed to update profile'

            errors.value = {}

            if (msg.includes('Username'))
                errors.value.username = msg
            else if (msg.toLowerCase().includes('email'))
                errors.value.email = msg
            else if (msg.includes('Bio')) errors.value.bio = msg
            else if (msg.startsWith('Missing required location fields') || msg === 'Unknown country name.' || msg === 'Failed to geocode.') {
                errors.value.location = msg
            } else {
                errors.value.form = msg
            }
            toast.error(msg, { position: 'top' })
        }
    }

    return {
        form,
        errors: errors.value ? errors : errors,
        setAllFromUser,
        validate,
        submitUpdate
    }
}
