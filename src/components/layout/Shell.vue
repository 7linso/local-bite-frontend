<script setup lang="ts">
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'

import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-dvh flex flex-col">     
    <Navbar />

    <main class="flex-1">                    
      <RouterView v-slot="{ Component }">
          <keep-alive include="RecipesListPage">
              <component :is="Component" />
          </keep-alive>
      </RouterView>
    </main>

    <Footer />                               
  </div>
</template>
