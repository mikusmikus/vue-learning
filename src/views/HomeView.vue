<script setup lang="ts">
import { ref } from 'vue'

const todos = ref([
  { id: 1, name: 'list1', isFinished: false },
  { id: 2, name: 'list2' },
  { id: 3, name: 'list3' },
  { id: 4, name: 'list4' }
])

const inputValue = ref('')
const count = ref(1)

const handleSubmit = () => {
  todos.value.push({
    id: todos.value.length + 1,
    name: inputValue.value
  })
  inputValue.value = ''
}

const updateInput = (value: string) => {
  inputValue.value = value
}

const updateCount = () => {
  count.value += 1
}
</script>

<template>
  <main>
    <div v-if="count % 2 !== 0">odd number: {{ count }}</div>
    <button @click="updateCount()">Update count</button>
    <h1>Home page</h1>

    <ul>
      <li v-for="item in todos" :key="item.id">
        {{ item.name }}
      </li>
    </ul>

    <form @submit.prevent="handleSubmit">
      <input
        type="text"
        :value="inputValue"
        @input="(event) => updateInput((event.target as HTMLInputElement).value)"
      />
      <button type="submit">Add todo</button>
    </form>
  </main>
</template>

<!-- // Nostilot navigāciju todos un formu -->
<!-- Pievienot delete button -->
<!-- Pievienot isFinished checkbox -->

<style>
main {
  background: lightcyan;
}
</style>
