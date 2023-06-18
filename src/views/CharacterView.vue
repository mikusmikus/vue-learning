<template>
  <div class="">
    <CustomButton @custom-click="router.back()">Go back</CustomButton>
    <h1>This is an Single Character page</h1>
    <template v-if="character">
      <h1>
        {{ character.name }}
      </h1>
      <img :src="character.image" :alt="character.name" />
      <p>
        {{ character.status }}
      </p>
      <p>
        {{ character.species }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
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

  console.log('character', character.value)
}

onMounted(() => {
  console.log('route', route)
  console.log('router', router)

  if (typeof id === 'string') {
    fetchSingleCharacter(id)
  }
})
</script>
