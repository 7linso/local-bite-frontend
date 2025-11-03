<script lang="ts" setup>
import { locations } from '@/lib/api/locations'
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import type { FeatureCollection, Feature, Point } from 'geojson'
import Hero from '@/components/ui/home/Hero.vue'
import FeaturedSection from '@/components/ui/home/FeaturedSection.vue'

const toast = useToast()
const geojson = ref<FeatureCollection<Point>>({
  type: 'FeatureCollection',
  features: []
})

onMounted(async () => {
  try {
    const res = await locations.getAllLocCoords()
    const coords: [number, number][] = res.coords
    geojson.value = {
      type: 'FeatureCollection',
      features: coords.map(([lng, lat]): Feature<Point> => ({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: [lng, lat] }
      }))
    }
  } catch (e) {
    console.error(e)
    toast.error('Cannot fetch locations!', { position: 'top' })
  }
})
</script>

<template>
  <Hero
    :points="geojson"
    title="Local-Bite"
    subtitle="Bite every bit of the world"
    cta-text="Start exploring"
    cta-to="/recipes"
    :spin-period-sec="160"
  />

  <div class="my-10 space-y-10">
    <FeaturedSection
      variant="overlay"
      title="Local-Bite connects people."
      :copy="`Discover authentic recipes from people across the globe and share your own creations with the community.<br>
              Whether it&apos;s a family classic or your own twist on a traditional dish — every recipe has a story.`"
      img-src="https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870"
      
      img-alt="Shared table with world dishes"
    />

    <FeaturedSection
      variant="left"
      title="Food is the most universal language."
      :copy="`You don&apos;t need to speak the same language or live in the same country to connect through taste.<br>
              A recipe is more than ingredients — it&apos;s culture, memory and tradition.`"
      img-src="https://plus.unsplash.com/premium_photo-1700752343056-e89926bf5ff9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=871"
      img-alt="Spices and ingredients"
    />

    <FeaturedSection
      variant="right"
      title="Explore recipes from around the world"
      :copy="`• Browse community recipes from every corner of the world<br>
              • Filter by country, dish type, keywords<br>
              • Explore nearby food with the interactive map<br>
              • Save favourites and build your personal collection<br>
              • Discover flavours you never knew existed`"
      img-src="https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=870"
      img-alt="World map with food"
    />

    <FeaturedSection
      variant="left"
      title="Becoming a contributor is easy!"
      :copy="`Share a recipe — inspire others — and let your dish become part of the global cookbook.<br>
              No perfect photography or fancy writing required — just your authentic dish, exactly how you make it.`"
      img-src="https://plus.unsplash.com/premium_photo-1726718570770-f4f41e26b90f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=849"
      img-alt="Home cooking in progress"
    />

    <FeaturedSection
      variant="overlay"
      title="A community built on curiosity & kindness"
      :copy="`We don&apos;t compete or judge perfection — we celebrate creativity and authenticity.<br>
              Learn, try new things and exchange culture. Food is meant to bring people together.`"
      img-src="https://images.unsplash.com/photo-1532980400857-e8d9d275d858?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
      img-alt="People sharing food together"
    />

    <FeaturedSection
      variant="right"
      title="Your world of flavours — all in one place"
      :copy="`Wherever you live, whatever you cook — it has value. One recipe can be ordinary for you, but extraordinary for someone else.<br>
              Explore — share — taste — and travel the world with every bite.`"
      img-src="https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
      img-alt="Colorful table of dishes"
    />
  </div>
</template>
