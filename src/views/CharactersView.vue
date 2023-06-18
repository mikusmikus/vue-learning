<template>
  <div class="flex justify-end mt-10 mb-4">
    <CustomButton @custom-click="state.updateTheme()"
      >Toggle theme to {{ state.theme === 'dark' ? 'light' : 'dark' }}</CustomButton
    >
  </div>
  <div class="flex justify-between gap-x-4">
    <CustomButton :isDisabled="!info?.prev" @custom-click="handlePrev">Prev</CustomButton>
    <CustomButton :isDisabled="!info?.next" @custom-click="handleNext">Next</CustomButton>
  </div>
  <div v-if="isLoading">Loading...</div>
  <div v-if="!isLoading && characters.length > 0" class="mb-20">
    <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-10">
      <li v-for="character in visibleCharacters" :key="character.id">
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
    <div class="flex justify-center" v-if="isLoadMoreVisible">
      <CustomButton @custom-click="loadMore">Load more</CustomButton>
    </div>
  </div>

  <div v-if="!isLoading && error">
    <p class="text-red-500">{{ error }}</p>
    Try get data again
    <CustomButton @custom-click="getData(url)">Get data</CustomButton>
  </div>
  {{ count }}
</template>

<script setup lang="ts">
import CustomButton from '@/components/CustomButton.vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { state } from '../globalState'

export type Character = {
  id: string
  name: string
  status: string
  species: string
  gender: string
  image: string
}

type Info = {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

const CHARACTER_STEP = 10

const count = ref(0)

const characters = ref<Character[]>([])
const isLoading = ref(false)
const error = ref('')
// page info state
const url = ref('https://rickandmortyapi.com/api/character')
const info = ref<Info | null>(null)
const visibleCharacterCount = ref(CHARACTER_STEP)

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const pageValue = route.query.page || 1
  const pageUrl = `${url.value}?page=${pageValue}`
  getData(pageUrl)
})

onUnmounted(() => {
  console.log('unmountted')
})

const delay = (ms: number) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      const random = Math.random()
      if (random > 0.5) {
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

    const { results, info: pageInfo } = data as { results: Character[]; info: Info }

    info.value = pageInfo

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
    error.value = ''
  } catch (e) {
    error.value = 'Something went wrong'
    isLoading.value = false
  }
}

const handlePrev = () => {
  const prevUrl = info.value?.prev
  if (!prevUrl) {
    return
  }

  const pageId = info.value?.prev && info.value.prev.split('page=')[1]
  router.push({ query: { page: pageId } })
  visibleCharacterCount.value = CHARACTER_STEP

  getData(prevUrl)
}

const handleNext = () => {
  const nextUrl = info.value?.next

  if (!nextUrl) {
    return
  }

  const pageId = info.value?.next && info.value.next.split('page=')[1]
  router.push({ query: { page: pageId } })
  visibleCharacterCount.value = CHARACTER_STEP

  getData(nextUrl)
}

const visibleCharacters = computed(() => {
  return characters.value.filter((_, index) => {
    if (index < visibleCharacterCount.value) {
      return true
    }
    return false
  })
})

const isLoadMoreVisible = computed(() => {
  if (visibleCharacterCount.value < characters.value.length) {
    return true
  }
  return false
})

const loadMore = () => {
  visibleCharacterCount.value += CHARACTER_STEP
}
</script>
