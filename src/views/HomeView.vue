<script setup lang="ts">
import { computed, ref } from 'vue'
import CloseIcon from '../components/icons/Close.vue'
import CustomButton from '../components/CustomButton.vue'
import CustomInput from '../components/CustomInput.vue'
import TodoItem from '../components/TodoItem.vue'

export type Todo = {
  id: string
  name: string
  isFinished: boolean
}

const todos = ref<Todo[]>([{ id: '1', name: 'list1', isFinished: true }])

type Filter = 'all' | 'finished' | 'unfinished'
const filterOptions = ['all', 'finished', 'unfinished'] as const

const inputValue = ref('')
const selectedFilter = ref<Filter>('all')

const count = ref(0)

const handleSubmit = () => {
  todos.value.push({
    id: new Date().toISOString(),
    name: inputValue.value,
    isFinished: false
  })
  inputValue.value = ''
}

const handleTodoDelete = (id: string) => {
  todos.value = todos.value.filter((item) => item.id !== id)
}

const filterdTodosList = computed(() => {
  if (selectedFilter.value === 'finished') {
    return todos.value.filter((item) => item.isFinished)
  }

  if (selectedFilter.value === 'unfinished') {
    return todos.value.filter((item) => !item.isFinished)
  }

  return todos.value
})

const handleClick = () => {
  count.value++
}

// Updated computed
const isActiveFilter = computed(() => {
  return (filter: Filter) => filter === selectedFilter.value
})

</script>

<template>
  <main class="py-10">
    {{ isActiveFilter('all') && 'all' }}
    {{ isActiveFilter('finished') && 'finished' }}
    {{ isActiveFilter('unfinished') && 'unfinished' }}
    <ul class="flex gap-x-2 mb-4">
      <li v-for="option in filterOptions" :key="option">
        <CustomButton
          @customClick="selectedFilter = option"
          :class="{
            'bg-fancy-pink hover:bg-pink-800 hover:text-yellow-100': isActiveFilter(option)
          }"
        >
          {{ option }}
        </CustomButton>
      </li>
    </ul>
    <CustomButton @customClick="handleClick" class="bg-fancy-pink">
      Update count {{ count }}
    </CustomButton>

    <form
      @submit.prevent="handleSubmit"
      class="flex gap-x-4 mb-4 border border-red-300 rounded p-4"
    >
      <CustomInput v-model:value="inputValue" />
      <CustomButton type="submit" class="bg-fancy-pink"> Submit </CustomButton>
    </form>
    <ul class="flex flex-col gap-4">
      <li
        v-for="item in filterdTodosList"
        :key="item.id"
        class="bg-slate-700 text-slate-200 p-3 flex justify-between gap-x-4"
      >
        <TodoItem
          :item="item"
          @handleDelete="(id) => handleTodoDelete(id)"
          @updateTodoName="(newValue) => (item.name = newValue)"
          v-model:isCompleted="item.isFinished"
          class="bg-blue-400"
        />
      </li>
    </ul>
    <CustomButton @customClick="inputValue = ''">
      <span class="flex">
        <CloseIcon class="w-6 h-6" />
        <span>Clear input</span>
      </span>
    </CustomButton>
  </main>
</template>

<style scoped></style>
