<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import ProfileEditForm from '@/components/ui/profile/ProfileEditForm.vue'
import RecipesList from '@/components/ui/recipe/RecipesList.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRecipeListStore } from '@/stores/useRecipeListStore'
import { auth as users } from '@/lib/api/auth'
import { recipes } from '@/lib/api/recipes'
import ProfilePicForm from '@/components/ui/profile/ProfilePicForm.vue'

const route = useRoute()
const router = useRouter()

const auth = useAuthStore()
const { user: me } = storeToRefs(auth)

const username = computed(() => route.params.username as string)
const profile = ref<any | null>(null)     
const loadingProfile = ref(false)
const errorProfile = ref<string | null>(null)

const recipesStore = useRecipeListStore()
const authorId = computed(() => profile.value?._id as string | undefined)

const authorBucket = computed(() => authorId.value ? recipesStore.authors[authorId.value] : undefined)

const loadProfile = async () => {
  errorProfile.value = null
  loadingProfile.value = true
  try {
    if (me.value?.username && me.value.username === username.value) {
      router.replace('/profile')
      return
    }

    const res = await users.getProfile(username.value)
    profile.value = res 
    if (!profile.value?._id) throw new Error('User not found')

    await recipesStore.fetchAuthorFirstPage(profile.value._id)
  } catch (e: any) {
    errorProfile.value = e?.data?.message ?? e?.message ?? 'Failed to load profile'
    profile.value = null
  } finally {
    loadingProfile.value = false
  }
}

const loadMore = async () => {
  if (!authorId.value) 
    return
  await recipesStore.fetchAuthorNextPage(authorId.value)
}

const applyLikeLocal = (id: string, next: boolean) => {
  const bucket = authorBucket.value
  if (!bucket) return

  const it = bucket.list.find(x => x._id === id)
  if (it) {
    const delta = next ? 1 : -1
    it.isLiked = next
    it.likeCount = Math.max(0, (it.likeCount ?? 0) + delta)
  }
}

const onToggleLike = async({ id, next }: { id: string; next: boolean }) => {
    const bucket = authorBucket.value
    if (!bucket) return

    const prev = bucket.list.find(x => x._id === id)
    const prevState = prev ? { isLiked: prev.isLiked, likeCount: prev.likeCount } : null

    applyLikeLocal(id, next)

    try {
        await (next ? recipes.likeRecipe(id) : recipes.dislikeRecipe(id))
    } catch (e) {
        if (prev && prevState) {
            prev.isLiked = prevState.isLiked
            prev.likeCount = prevState.likeCount
        }
    }
}

watch(username, () => loadProfile(), { immediate: true })
</script>

<template>
    <section class="flex items-center justify-center mt-10">
        <div class="w-[90%] sm:w-[400px] md:w-[500px] lg:w-[600px] bg-white rounded-2xl shadow-sm overflow-hidden border border-amber-900 p-5">
            <div v-if="errorProfile" class="text-red-600">
                {{ errorProfile }}
            </div>

            <div v-else-if="profile">
                <div class="relative mb-5 flex justify-center">
                    <ProfilePicForm
                        :src="profile.profilePic || null"
                    />
                </div>
                
                <ProfileEditForm
                    :form="{
                    fullname: profile.fullname ?? '',
                    username: profile.username ?? '',
                    email: profile.email ?? '',
                    bio: profile.bio ?? '',
                    location: profile.location ?? { locality: '', area: '', country: '' }
                    }"
                    :errors="{}"
                    :disabled="true"
                    :hidden-fields="['email']" 
                />

                <div class="mt-10">
                    <h1 class="text-center font-semibold mb-3 text-amber-950">
                        Recipes by {{ profile.username }}
                    </h1>

                    <RecipesList
                        :recipes="authorBucket?.list ?? []"
                        :loading="authorBucket?.loading ?? false"
                        :errors="{ list: authorBucket?.error ?? '' }"
                        @openRecipe="(id: string) => router.push(`/recipes/${id}`)"
                        @toggle-like="(p) => onToggleLike(p)"
                    />

                    <div v-if="authorBucket?.hasNextPage" class="flex justify-center mt-4">
                        <button
                            @click="loadMore"
                            class="inline-flex items-center rounded-xl border border-gray-800 px-4 py-2 font-medium hover:bg-gray-900 hover:text-white transition"
                        >
                            More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
