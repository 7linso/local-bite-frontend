<script lang="ts" setup>
import MapView from '@/components/ui/MapView.vue'
import { locations } from '@/lib/api/locations'
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import type { FeatureCollection, Feature, Point } from 'geojson'
import { RouterLink } from 'vue-router'

const toast = useToast()

const geojson = ref<FeatureCollection<Point>>({
  type: 'FeatureCollection',
  features: []
})

const mapDiv = ref<HTMLDivElement | null>(null)
const mapVisible = ref<boolean>(false)
const mapReady = ref(false)

const handleMapLoaded = () => {
  mapReady.value = true
}

onMounted(async () => {
  const obs = new IntersectionObserver(([entry]) => {
    if(entry?.isIntersecting){
      mapVisible.value = true
      obs.disconnect()
    }
  }, {threshold: 0.1})

  if(mapDiv.value) obs.observe(mapDiv.value)

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
    toast.error('Cannot fetch locations!', { position: 'top' })
  }
})
</script>

<template>
  <div ref="mapDiv" class="relative h-[60vh] w-full">
    <div
      v-if="!mapVisible || !mapReady"
      class="absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
    ></div>

    <MapView v-if="mapVisible"
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
        <p class="mt-3 text-lg  md:text-xl font-semibold opacity-90">
            Bite every bit of the world
        </p>
        <RouterLink
          to="/recipes"
          class="mt-2 text-lg md:text-xl font-bold drop-shadow-lg py-1.5 px-2.5 border border-white rounded-md"
        >
          Start exploring
        </RouterLink>
    </div>
  </div>
</template>
