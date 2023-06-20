<template>
  <div class="flex justify-between mt-10 mb-4">
    <ul class="flex gap-x-4 items-center">
      <li v-if="!!filter.statusOptions.length">
        <select class="border border-red-400 px-2 py-1 rounded" v-model="selectedFilters.status">
          <option value="">All status</option>
          <option v-for="status in filter.statusOptions" :key="status" :value="status">
            {{ status }}
          </option>
        </select>
      </li>
      <li v-if="!!filter.speciesOptions.length">
        <select class="border border-red-400 px-2 py-1 rounded" v-model="selectedFilters.species">
          <option value="">All species</option>
          <option v-for="specie in filter.speciesOptions" :key="specie" :value="specie">
            {{ specie }}
          </option>
        </select>
      </li>
    </ul>
    <CustomButton @custom-click="state.updateTheme()"
      >Toggle theme to {{ state.theme === 'dark' ? 'light' : 'dark' }}</CustomButton
    >
  </div>
  <div v-if="data.length">test</div>
  <div class="flex justify-between gap-x-4">
    <CustomButton :isDisabled="!info?.prev" @custom-click="handlePrev">Prev</CustomButton>
    <CustomButton :isDisabled="!info?.next" @custom-click="handleNext">Next</CustomButton>
  </div>
  <div v-if="isLoading">Loading...</div>
  <div v-if="!isLoading && visibleCharacters.length > 0" class="mb-20">
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
              <p>{{ character.status }}</p>
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
</template>

<script setup lang="ts">
import CustomButton from '@/components/CustomButton.vue'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
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

type Filter = {
  statusOptions: string[]
  speciesOptions: string[]
}

const CHARACTER_STEP = 6

const data = ref([])

const characters = ref<Character[]>([])

const filter = reactive<Filter>({
  statusOptions: [],
  speciesOptions: []
})

const selectedFilters = reactive({
  status: '',
  species: ''
})

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
      if (random > 0.99) {
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

    const charactersList: Character[] = []
    const statusOptions = [] as string[]
    const speciesOptions = [] as string[]

    results.forEach((result) => {
      const status = result.status
      const species = result.species

      if (!statusOptions.includes(status)) {
        statusOptions.push(status)
      }
      if (!speciesOptions.includes(species)) {
        speciesOptions.push(species)
      }

      const singleCharacter = {
        id: result.id,
        name: result.name,
        status: status,
        species: species,
        gender: result.gender,
        image: result.image
      }
      charactersList.push(singleCharacter)
    })

    characters.value = charactersList
    filter.statusOptions = statusOptions
    filter.speciesOptions = speciesOptions

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

// filter by status
const filteredCharactersByStatus = computed(() => {
  if (!selectedFilters.status) {
    return characters.value
  }
  return characters.value.filter((character) => character.status === selectedFilters.status)
})

const filteredCharactersBySpecies = computed(() => {
  if (!selectedFilters.species) {
    return filteredCharactersByStatus.value
  }

  return filteredCharactersByStatus.value.filter(
    (character) => character.species === selectedFilters.species
  )
})

const visibleCharacters = computed(() => {
  return filteredCharactersBySpecies.value.filter((_, index) => {
    if (index < visibleCharacterCount.value) {
      return true
    }
    return false
  })
})

const isLoadMoreVisible = computed(() => {
  if (visibleCharacterCount.value < filteredCharactersBySpecies.value.length) {
    return true
  }
  return false
})

const loadMore = () => {
  visibleCharacterCount.value += CHARACTER_STEP
}
</script>
