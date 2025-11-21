<script setup lang="ts">
import Navbar from "./Navbar.vue";
import Footer from "./Footer.vue";
import { RouterView } from "vue-router";
import { onMounted, ref } from "vue";

const cookingBg = ref("");

onMounted(() => {
  const css = getComputedStyle(document.documentElement);
  const TILE = css.getPropertyValue("--tile").trim() || "#FFF6ED"; // light cream
  const INK = css.getPropertyValue("--ink").trim() || "#E6A15C"; // soft orange-brown
  const INK2 = css.getPropertyValue("--ink2").trim() || "#C47A3E"; // deeper shade
  const SIZE = Number(css.getPropertyValue("--size").trim()) || 120;

  const svg = `
    <svg width="${SIZE}" height="${SIZE}" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" fill="${TILE}"/>

      <defs>
        <!-- COOKIE -->
        <g id="icon-cookie" stroke="${INK2}" stroke-width="1.6" fill="none" opacity=".5">
          <circle cx="12" cy="12" r="8" fill="${INK}" stroke="none" opacity=".6"/>
          <circle cx="9"  cy="10" r="1.2" fill="${INK2}"/>
          <circle cx="13" cy="14" r="1.2" fill="${INK2}"/>
          <circle cx="15" cy="9"  r="1.2" fill="${INK2}"/>
        </g>

        <!-- CROISSANT -->
        <g id="icon-croissant" stroke="${INK2}" stroke-width="1.4" fill="none" opacity=".5">
          <path d="M10.2 18H4.774a1.5 1.5 0 0 1-1.352-.97 11 11 0 0 1 .132-6.487"/>
          <path d="M18 10.2V4.774a1.5 1.5 0 0 0-.97-1.352 11 11 0 0 0-6.486.132"/>
          <path d="M18 5a4 3 0 0 1 4 3 2 2 0 0 1-2 2 10 10 0 0 0-5.139 1.42"/>
          <path d="M5 18a3 4 0 0 0 3 4 2 2 0 0 0 2-2 10 10 0 0 1 1.42-5.14"/>
          <path d="M8.709 2.554a10 10 0 0 0-6.155 6.155l9.807 5.42a2 2 0 0 0 2.718-2.718l-5.42-9.807z" fill="${INK}" stroke="none" opacity=".55"/>
        </g>

        <!-- HAT -->
        <g id="icon-hat" stroke="${INK2}" stroke-width="1.5" fill="none" opacity=".5">
          <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z" fill="${INK}" stroke="none" opacity=".6"/>
          <path d="M6 17h12" stroke="${INK2}" />
        </g>

        <!-- MILK -->
        <g id="icon-milk" fill="none" stroke="${INK2}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".5">
          <path d="M8 2h8"/>
          <path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2"/>
          <path d="M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/>
        </g>
      </defs>

      <!-- Half-drop layout: left column (y: 10, 50), right column shifted (y: 30, 70) -->
      <!-- Each icon centered (24×24 box): translate(cx,cy) rotate(...) translate(-12,-12) -->
      <g transform="translate(12,10) rotate(45) translate(-12,-12)"><use href="#icon-milk"/></g>
      <g transform="translate(12,50) rotate(45) translate(-12,-12)"><use href="#icon-hat"/></g>

      <g transform="translate(52,30) rotate(110) translate(-12,-12)"><use href="#icon-croissant"/></g>
      <g transform="translate(52,70) rotate(45) translate(-12,-12)"><use href="#icon-cookie"/></g>

      <!-- optional faint speckles to break uniformity -->
      <circle cx="60" cy="12" r="1.1" fill="${INK2}" opacity=".18"/>
      <circle cx="22" cy="68" r="1.1" fill="${INK2}" opacity=".14"/>
    </svg>
  `;

  cookingBg.value = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
});
</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <Navbar />
    <main
      class="relative flex-1 bg-cooking-pattern"
      :style="{
        backgroundImage: cookingBg,
        backgroundSize: 'var(--size, 120px) var(--size, 120px)',
      }"
    >
      <RouterView v-slot="{ Component, route }">
        <keep-alive include="RecipesListPage">
          <component :is="Component" :key="route.fullPath"/>
        </keep-alive>
      </RouterView>
    </main>
    <Footer />
  </div>
</template>

<style>
:root {
  --tile: #fff6ed; /* creamy base */
  --ink: #f8c693; /* light orange-brown */
  --ink2: #f7ac70; /* deeper orange-brown */
  --size: 120px; /* tile size */
}
</style>

<style scoped>
.bg-cooking-pattern {
  background-color: var(--tile);
  background-repeat: repeat;
}

/* subtle texture layer */
.bg-cooking-pattern::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='table' tableValues='0 0 0 0 .05 .08 .05 0 0 0'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.04;
}

</style>
