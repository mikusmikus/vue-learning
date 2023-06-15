<template>
  <div v-if="isLoading">Loading...</div>
  <ul
    v-if="!isLoading && characters.length > 0"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10"
  >
    <li v-for="character in characters" :key="character.id">
      <RouterLink :to="`/characters/${character.id}`">
        <article class="bg-white rounded-lg shadow-lg overflow-hidden group">
          <img
            :src="character.image"
            :alt="character.name"
            class="w-full group-hover:scale-110 transition-transform duration-300"
          />
          <div class="p-4">
            <h2 class="text-xl font-bold">{{ character.name }}</h2>
            <p class="text-gray-500">{{ character.species }}</p>
          </div>
        </article>
      </RouterLink>
    </li>
  </ul>
  <div v-if="!isLoading && error">
    <p class="text-red-500">{{ error }}</p>
    Try get data again
    <CustomButton @custom-click="getData(url)">Get data</CustomButton>
  </div>
</template>

<script setup lang="ts">
import CustomButton from '@/components/CustomButton.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

export type Character = {
  id: string
  name: string
  status: string
  species: string
  gender: string
  image: string
}

const characters = ref<Character[]>([])
const isLoading = ref(false)
const error = ref('')
// page info state
const url = ref('https://rickandmortyapi.com/api/character')

// const route = useRoute()
const router = useRouter()

onMounted(() => {
  getData(url.value)
})

onUnmounted(() => {
  console.log('unmountted')
})

const delay = (ms: number) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const random = Math.random()
      if (random > 0.9) {
        return reject(new Error('Something went wrong'))
      }
      return resolve(true)
    }, ms)
  })

const getData = async (url: string) => {
  isLoading.value = true
  try {
    await delay(1000)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Something went wrong')
    }
    const data = await response.json()
    console.log('data', data)

    const { results } = data as { results: Character[] }
    characters.value = results.map((result) => {
      return {
        id: result.id,
        name: result.name,
        status: result.status,
        species: result.species,
        gender: result.gender,
        image: result.image
      }
    })
    isLoading.value = false
  } catch (e) {
    error.value = 'Something went wrong'
    isLoading.value = false
  }
}
</script>
