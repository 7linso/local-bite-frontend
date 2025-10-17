<script lang="ts" setup>
import { LogIn, LogOut, User, Info } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore'
import { storeToRefs } from 'pinia'
import router from '@/router';

const auth = useAuthStore()
const { isAuth } = storeToRefs(auth)

const onSignout = async() => {
  await auth.signout()
  router.replace('/')
}
</script>


<template>
  <header class="border-b p-4">
    <nav class="flex items-center justify-between max-w-[1000px] mx-auto w-full">
      <RouterLink to="/" class="font-bold text-lg">local-bite</RouterLink>

      <div class="flex items-center gap-3">
        <template v-if="!isAuth">
          <RouterLink to="/signup"><LogIn /></RouterLink>
          <RouterLink to="/about"><Info /></RouterLink>
        </template>

        <template v-else>
          <RouterLink to="/profile"><User /></RouterLink>
          <RouterLink to="/about"><Info /></RouterLink>
          <button @click="onSignout"><LogOut /></button>
        </template>
      </div>
    </nav>
  </header>
</template>