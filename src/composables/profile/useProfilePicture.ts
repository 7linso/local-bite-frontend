import { ref } from 'vue'
import type { useAuthStore } from '@/stores/useAuthStore'
import { fileToDataUrl, compressPic } from '@/lib/pic-helpers'

export function useProfilePicture(
    auth: ReturnType<typeof useAuthStore>,
    toast: any
) {
    const isUploading = ref(false)
    const tempPreview = ref<string | null>(null)
    const fileInputref = ref<HTMLInputElement | null>(null)

    const triggerPick = () => fileInputref.value?.click()

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

    return {
        isUploading,
        tempPreview,
        fileInputref,
        triggerPick,
        onPickProfilePic
    }
}
