<template>
  <CustomInput
    v-model:value="inputValue"
    @keyup.esc="handleCancelEdit"
    @keyup.enter="handleSave"
    class="text-red-700"
    v-if="isEditing"
    ref="input"
  />
  <div class="flex gap-x-4 items-center" v-else>
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
  <div class="flex gap-x-4 items-center">
    <CustomButton @custom-click="handleSave" v-if="isEditing">Save</CustomButton>
    <CustomButton v-else @custom-click="handleEdit">Edit</CustomButton>
    <button @click="$emit('handleDelete', item.id)" class="text-red-500">
      <CloseIcon class="w-6 h-6" />
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '@/views/HomeView.vue'
import CloseIcon from './icons/Close.vue'
import { ref } from 'vue'
import CustomButton from './CustomButton.vue'
import CustomInput from './CustomInput.vue'

const isEditing = ref(false)
const inputValue = ref('')
const input = ref(null)

defineOptions({
  inheritAttrs: false
})

const props = defineProps<{
  item: Todo
}>()

const emit = defineEmits<{
  (e: 'handleDelete', id: string): void
  (e: 'update:isCompleted', newValue: boolean): void
  (e: 'updateTodoName', newValue: string): void
}>()

const handleChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).checked
  emit('update:isCompleted', value)
}

const handleSave = () => {
  emit('updateTodoName', inputValue.value)
  isEditing.value = false
  inputValue.value = ''
}

const handleEdit = () => {
  isEditing.value = true
  inputValue.value = props.item.name
  input.value.focus()
}

const handleCancelEdit = () => {
  isEditing.value = false
  inputValue.value = ''
}
</script>
