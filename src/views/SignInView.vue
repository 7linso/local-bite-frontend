<script lang="ts" setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from 'vue-toast-notification'
import { useSignIn } from '@/composables/auth/useSignIn'
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'
import SignInForm from '@/components/ui/forms/auth/SignInForm.vue'

const auth = useAuthStore()
const toast = useToast()
const route = useRoute()

const { form, errors, loading, onSignIn } = useSignIn(auth, toast)

onMounted(() => {
  const prefill = route.query.u as string | undefined
  if (prefill) form.identifier = prefill
})
</script>

<template>
  <SignInForm
    :form="form"
    :errors="errors"
    :loading="loading"
    @submit="onSignIn"
  />
</template>
