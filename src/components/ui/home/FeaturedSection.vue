<script setup lang="ts">
const props = defineProps<{
    title: string
    copy: string
    imgSrc: string
    imgAlt?: string
    variant?: 'overlay' | 'left' | 'right'
}>()
</script>

<template>
    <section
        class="mx-auto w-[90%] sm:w-[640px] md:w-[760px] lg:w-[920px] my-10"
        :class="variant === 'overlay' ? 'relative' : ''"
    >
        <div v-if="variant === 'overlay'"
            class="relative rounded-2xl overflow-hidden"
        >
            <div class="aspect-[16/9] md:aspect-[21/9] w-full">
                <img
                    :src="imgSrc"
                    :alt="imgAlt || title"
                    class="block h-full w-full object-cover"
                />
            </div>
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

            <div class="absolute inset-0 flex items-end md:items-center">
                <div class="p-5 md:p-10 text-white drop-shadow-md max-w-3xl">
                <h2 class="text-2xl md:text-4xl font-bold">{{ title }}</h2>
                <p class="mt-3 md:text-lg leading-relaxed opacity-95" v-html="copy"></p>
                </div>
            </div>
        </div>

        <div v-else class="rounded-2xl overflow-hidden border border-amber-900/20 bg-white/70 backdrop-blur">
            <div class="grid md:grid-cols-2 items-stretch">
                
                <div :class="variant === 'right' ? 'md:order-2' : 'md:order-1'">
                    <div class="relative h-full min-h-[260px] md:min-h-[340px]">
                        <img
                            :src="imgSrc"
                            :alt="imgAlt || title"
                            class="block absolute inset-0 h-full w-full object-cover"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    </div>
                </div>

                <div :class="variant === 'right' ? 'md:order-1' : 'md:order-2'">
                    <div class="h-full p-5 md:p-8 flex flex-col justify-center">
                        <h3 class="text-xl md:text-2xl font-semibold text-amber-900">{{ title }}</h3>
                        <p class="mt-3 text-gray-800 leading-relaxed" v-html="copy"></p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
