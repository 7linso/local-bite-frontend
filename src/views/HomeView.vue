<script lang="ts" setup>
import MapView from '@/components/ui/MapView.vue'
import { locations } from '@/lib/api/locations'
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import type { FeatureCollection, Feature, Point } from 'geojson'

const $toast = useToast()

const geojson = ref<FeatureCollection<Point>>({
  type: 'FeatureCollection',
  features: []
})

onMounted(async () => {
  try {
    const res = await locations.getAllLocCoords()
    const coords: [number, number][] = res.coords

    const fc: FeatureCollection<Point> = {
      type: 'FeatureCollection',
      features: coords.map(([lng, lat]): Feature<Point> => ({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: [lng, lat] }
      }))
    }

    geojson.value = fc
  } catch (e) {
    console.log(e)
    $toast.error('Cannot fetch locations!', { position: 'top' })
  }
})
</script>

<template>
  <div class="relative h-[60vh] w-full">
    <MapView 
        :spinPeriodSec="160" 
        :points="geojson"
     />

    <!-- darken gradient -->
    <div class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

    <!-- hero -->
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center z-10 text-white px-6">
        <h1 class="text-5xl md:text-6xl font-bold drop-shadow-lg">
            Local-Bite
        </h1>
        <p class="mt-3 text-lg md:text-xl opacity-90">
            Bite every bit of the world
        </p>
    </div>
  </div>
</template>
