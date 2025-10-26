<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from 'vue-toast-notification'
import { useSignUp } from '@/composables/auth/useSignUp'
import SignUpForm from '@/components/ui/auth/SignUpForm.vue'

const auth = useAuthStore()
const toast = useToast()

const { form, errors, loading, onSignUp } = useSignUp(auth, toast)

</script>

<template>
  <SignUpForm
    :form="form"
    :errors="errors"
    :loading="loading"
    @submit="onSignUp"
  />
</template>
