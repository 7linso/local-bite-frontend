<script lang="ts" setup>
import { LogIn, LogOut, User, Info } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore'
import { storeToRefs } from 'pinia'
import router from '@/router';

const auth = useAuthStore()
const { isAuth } = storeToRefs(auth)

const onSignout = async() => {
  await router.replace({ name: 'signin', query: { redirect: '/' } })
  await auth.signout()
}
</script>


<template>
  <header class="border-b border-amber-900 p-4 bg-[#f7dec5] text-amber-950">
    <nav class="flex items-center justify-between max-w-[1000px] mx-auto w-full">
      <RouterLink to="/" class="font-bold text-lg">local-bite</RouterLink>

      <div class="flex items-center gap-3">
        <template v-if="!isAuth">
          <RouterLink to="/signup"><LogIn /></RouterLink>
        </template>

        <template v-else>
          <RouterLink to="/profile"><User /></RouterLink>
          <button @click="onSignout"><LogOut /></button>
        </template>
      </div>
    </nav>
  </header>
</template>