<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import maplibregl, { Map } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { FeatureCollection, Point, Feature, GeoJsonProperties } from 'geojson'

type LngLat = [number, number]

const POINTS_SRC_ID = 'points-src'
const POINTS_LAYER_ID = 'points-layer'

const emit = defineEmits<{
  (e: 'pointClick', data: { lat: number; lng: number }): void
}>()

const props = withDefaults(defineProps<{
  styleUrl?: string
  center?: LngLat
  zoom?: number
  pitch?: number
  /** if set - map carousel, not interactive */
  spinPeriodSec?: number | null
  spinPitch?: number
  autoPauseOnHidden?: boolean

  points?: FeatureCollection<Point, GeoJsonProperties>

  pointColor?: string
  pointStrokeColor?: string
  pointSize?: number
}>(), {
  styleUrl: `https://api.maptiler.com/maps/openstreetmap/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
  center: () => [-96, 45],
  zoom: 2.2,
  pitch: 0,
  spinPeriodSec: null,
  autoPauseOnHidden: true,
  points: undefined,
  pointColor: '#b22222',
  pointStrokeColor: '#ffffff',
  pointSize: 4,
})

const mapEl = ref<HTMLDivElement | null>(null)
let map: Map | null = null
const mapLoaded = ref(false)

// --- spin state ---
let rafId: number | null = null
let lastTs = 0
let currLng = props.center[0]
let baseLat = props.center[1]

const setInteractionsEnabled = (enabled: boolean) => {
  if (!map) return
  const m = map
  if (enabled) {
    m.scrollZoom.enable()
    m.boxZoom.enable()
    m.dragRotate.enable()
    m.dragPan.enable()
    m.keyboard.enable()
    m.doubleClickZoom.enable()
    m.touchZoomRotate.enable()
  } else {
    m.scrollZoom.disable()
    m.boxZoom.disable()
    m.dragRotate.disable()
    m.dragPan.disable()
    m.keyboard.disable()
    m.doubleClickZoom.disable()
    m.touchZoomRotate.disable()
  }
}

const animate = (ts: number) => {
  if (!map || !props.spinPeriodSec) 
    return
  if (!lastTs) 
    lastTs = ts
  const dt = (ts - lastTs) / 1000
  lastTs = ts

  const dps = 360 / props.spinPeriodSec 
  currLng += dps * dt
  if (currLng > 180) currLng -= 360
  if (currLng < -180) currLng += 360

  map.setCenter([currLng, baseLat])
  map.setPitch(0)

  rafId = requestAnimationFrame(animate)
}

const startSpin = () => {
  if (!map) 
    return
  stopSpin()
  lastTs = 0
  currLng = props.center[0]
  baseLat = props.center[1]
  map.setCenter([currLng, baseLat])
  map.setPitch(0)
  setInteractionsEnabled(false)
  rafId = requestAnimationFrame(animate)
}

const stopSpin = () => {
  setInteractionsEnabled(true)
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

const applyMode = () => {
  if (props.spinPeriodSec) startSpin()
  else stopSpin()
}

const upsertPoints = () => {
  if (!map) 
    return
  
  if (!props.points || !props.points.features.length) {
    if (map.getLayer(POINTS_LAYER_ID)) 
      map.removeLayer(POINTS_LAYER_ID)

    if (map.getSource(POINTS_SRC_ID)) 
      map.removeSource(POINTS_SRC_ID)

    return
  }

  const existing = map.getSource(POINTS_SRC_ID) as any

  if (existing) {
    existing.setData(props.points)
  } else {
    map.addSource(POINTS_SRC_ID, { type: 'geojson', data: props.points })
    map.addLayer({
      id: POINTS_LAYER_ID,
      type: 'circle',
      source: POINTS_SRC_ID,
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'],
          1, Math.max(1, props.pointSize - 2),
          6, props.pointSize,
          12, props.pointSize + 2
        ],
        'circle-color': props.pointColor,
        'circle-stroke-color': props.pointStrokeColor,
        'circle-stroke-width': 1,
      },
    })
    
    map.on('click', POINTS_LAYER_ID, (e) => {
      const f = e.features?.[0] as Feature<Point> | undefined
      if (!f) return

      const [lng = 0, lat = 0] = f.geometry.coordinates

      emit('pointClick', { lat, lng })
    })

    map.on('mouseenter', POINTS_LAYER_ID, () => 
      map!.getCanvas().style.cursor = 'pointer'
    )

    map.on('mouseleave', POINTS_LAYER_ID, () => 
      map!.getCanvas().style.cursor = ''
    )
  }
}

const handleVisibility = () => {
  if (!props.autoPauseOnHidden || !props.spinPeriodSec) 
    return

  if (document.hidden) stopSpin()
  else startSpin()
}

onMounted(() => {
  if (!mapEl.value) 
    return

  map = new maplibregl.Map({
    container: mapEl.value,
    style: props.styleUrl,
    center: props.center,
    zoom: props.zoom,
    pitch: props.pitch,
    renderWorldCopies: true,
  })

  map.on('load', () => {
    mapLoaded.value = true
    currLng = props.center[0]
    baseLat = props.center[1]

    upsertPoints()
    applyMode()
  })

  map.on('error', (e) => console.error('Map error:', e?.error ?? e))

  const ro = new ResizeObserver(() => map?.resize())
  ro.observe(mapEl.value)
  ;(mapEl.value as any).__ro = ro

  if (props.autoPauseOnHidden)
    document.addEventListener('visibilitychange', handleVisibility)
})

onBeforeUnmount(() => {
  if (props.autoPauseOnHidden)
    document.removeEventListener('visibilitychange', handleVisibility)

  if (mapEl.value && (mapEl.value as any).__ro)
    (mapEl.value as any).__ro.disconnect()

  stopSpin()
  map?.remove()
  map = null
})

watch(
  () => props.points,
  () => {
    if (!mapLoaded.value) return
    upsertPoints()
  },
  { deep: true }
)

</script>

<template>
  <div 
    ref="mapEl" 
    class="w-full h-[60vh] rounded-2xl overflow-hidden"
  ></div>
</template>
