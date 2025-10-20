<script lang="ts" setup>
const { open } = defineProps<{
  open: boolean
}>()

defineEmits<{
    (e: 'confirm'): void;
    (e: 'cancel'): void;
}>()

</script>

<template>
    <div v-if="open"
        class="fixed inset-0 bg-black/40 grid place-items-center z-50"
    >
        <div class="bg-white rounded-lg p-5 shadow max-w-sm w-[90%]">
            <p class="text-gray-800 mb-4">
                Are you sure you want to delete your account? This action is irreversible!
            </p>
            <div class="flex justify-end gap-3">
                <button class="border px-3 py-1 rounded" @click="$emit('cancel')">Cancel</button>
                <button class="bg-red-600 text-white px-3 py-1 rounded" @click="$emit('confirm')">Yes, delete</button>
            </div>
        </div>
    </div>

</template>