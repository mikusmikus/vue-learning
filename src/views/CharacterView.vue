<template>
  <div class="">
    <CustomButton @custom-click="router.back()">Go back</CustomButton>

    <article v-if="character" class="md:grid md:gap-x-4 md:grid-cols-2 lg:grid-cols-3">
      <div class="aspect-square rounded-lg overflow-hidden relative">
        <img
          src="https://picsum.photos/700/1400"
          :alt="character.name"
          class="absolute inset-0 object-cover w-full h-full"
        />
      </div>

      <div class="bg-lime-100 lg:col-span-2 flex flex-col justify-center pl-4 py-4">
        <h1 class="text-lg">{{ character.name }}</h1>

        <p class="font-bold">
          <span class="w-4 h-4 rounded-full inline-block" :class="statusColor"></span>
          {{ character.status }}
        </p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Character } from './CharactersView.vue'
import CustomButton from '@/components/CustomButton.vue'

type EpandedCharacter = Character & {
  location: string
  origin: string
  episode: string[]
}

const route = useRoute()
const router = useRouter()

const url = ref('https://rickandmortyapi.com/api/character/')

const id = route.params.id
const character = ref<EpandedCharacter | null>(null)

const fetchSingleCharacter = async (id: string) => {
  const response = await fetch(`${url.value}${id}`)
  const data = (await response.json()) as EpandedCharacter
  character.value = {
    id: data.id,
    name: data.name,
    status: data.status,
    species: data.species,
    gender: data.gender,
    image: data.image,
    location: data.location,
    origin: data.origin,
    episode: data.episode
  }
}

const statusColor = computed(() => {
  if (!character.value) {
    return 'bg-black'
  }
  if (character.value.status === 'Alive') {
    return 'bg-green-500'
  }
  if (character.value.status === 'Dead') {
    return 'bg-red-500'
  }
  if (character.value.status === 'unknown') {
    return 'bg-gray-500'
  }

  return 'bg-black'
})

onMounted(() => {
  if (typeof id === 'string') {
    fetchSingleCharacter(id)
  }
})
</script>
