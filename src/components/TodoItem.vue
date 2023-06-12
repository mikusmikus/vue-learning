<template>
  <div class="flex">
    <input type="checkbox" :id="item.id" :checked="item.isFinished" @change="handleChange" />

    <label
      class="text-lg"
      :for="item.id"
      :class="{
        'line-through': item.isFinished,
        'text-red-400': item.name.length > 5
      }"
    >
      {{ item.name }}
    </label>
  </div>

  <button @click="$emit('handleDelete', item.id)" class="text-red-500">
    <CloseIcon class="w-6 h-6" />
  </button>
</template>

<script setup lang="ts">
import type { Todo } from '@/views/HomeView.vue'
import CloseIcon from './icons/Close.vue'
import { ref } from 'vue'

const isEditing = ref(false)
const inputValue = ref('')

defineOptions({
  inheritAttrs: false
})

defineProps<{
  item: Todo
}>()

const emit = defineEmits<{
  (e: 'handleDelete', id: string): void
  (e: 'update:isCompleted', newValue: boolean): void
}>()

const handleChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).checked
  emit('update:isCompleted', value)
}
</script>
