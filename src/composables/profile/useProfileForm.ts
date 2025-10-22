import { reactive } from 'vue'
import type { ProfileForm, UpdateProfilePayload } from '@/lib/types'
import type { useAuthStore } from '@/stores/useAuthStore'

export const useProfileForm = (
    auth: ReturnType<typeof useAuthStore>,
    toast: ReturnType<any>,
    onSaved?: () => void
) => {
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

    function setAllFromUser() {
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
        if (!form.fullname)
            errors.fullname = 'Full name is required.'
        else if (form.fullname.trim().length < 3)
            errors.fullname = 'Full name must be at least 3 characters long.'

        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            errors.email = 'Enter a valid email'

        if (!form.username)
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

            onSaved?.()
        } catch (e: any) {
            const msg = e?.response?.data?.message ?? e?.friendlyMessage ?? e?.data?.message ?? e?.message ?? 'Failed to update profile'

            errors = {}

            if (msg.includes('Username'))
                errors.username = msg
            else if (msg.toLowerCase().includes('email'))
                errors.email = msg
            else if (msg.includes('Bio')) errors.bio = msg
            else if (msg.startsWith('Missing required location fields') || msg === 'Unknown country name.' || msg === 'Failed to geocode.') {
                errors.location = msg
            } else {
                errors.form = msg
            }
            toast.error(msg, { position: 'top' })
        }
    }

    return {
        form,
        errors: errors,
        setAllFromUser,
        validate,
        submitUpdate
    }
}
