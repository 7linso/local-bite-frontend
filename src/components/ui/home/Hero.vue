<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import type { FeatureCollection, Point } from 'geojson'
import { RouterLink } from 'vue-router'
import { defineAsyncComponent } from 'vue'

const MapView = defineAsyncComponent(() => import('@/components/ui/MapView.vue'))

const props = defineProps<{
  points: FeatureCollection<Point>
  title?: string
  subtitle?: string
  ctaText?: string
  ctaTo?: string
  spinPeriodSec?: number
}>()

const mapReady = ref(false)
const handleMapLoaded = () => (mapReady.value = true)

const elRef = ref<HTMLElement | null>(null)
const visible = ref(false)
let obs: IntersectionObserver | null = null

onMounted(() => {
    if (!elRef.value) return
    obs = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
            visible.value = true
            obs?.disconnect()
            obs = null
        }
    }, { threshold: 0.1})
    obs.observe(elRef.value)
})

onUnmounted(() => {
    obs?.disconnect()
    obs = null
})
</script>

<template>
  <div ref="elRef" class="relative h-[60vh] w-full rounded-2xl overflow-hidden">
    <!-- skeleton -->
    <div
      v-if="!visible || !mapReady"
      class="absolute inset-0 w-full h-full bg-gray-200 animate-pulse"
      aria-hidden="true"
    ></div>

    <!-- map -->
    <MapView
      v-if="visible"
      :points="points"
      :spinPeriodSec="spinPeriodSec ?? 160"
      @loaded="handleMapLoaded"
    />

    <!-- gradient -->
    <div class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

    <div class="absolute inset-0 flex flex-col items-center justify-center text-center z-10 text-white px-6">
      <h1 class="text-5xl md:text-6xl font-bold drop-shadow-lg">
        {{ props.title ?? 'Local-Bite' }}
      </h1>
      <p class="mt-3 text-lg md:text-xl font-semibold opacity-90">
        {{ props.subtitle ?? 'Bite every bit of the world' }}
      </p>

      <RouterLink
        v-if="props.ctaTo"
        :to="props.ctaTo"
        class="mt-2 text-lg md:text-xl font-bold drop-shadow-lg py-1.5 px-2.5 border border-white rounded-md"
      >
        {{ props.ctaText ?? 'Start exploring' }}
      </RouterLink>
    </div>
  </div>
</template>
