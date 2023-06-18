<template>
  <button
    @click="handleClick"
    :type="props.type"
    class="border px-4 py-2 text-xl transition-colors duration-200 rounded dark:bg-slate-950 dark:text-red-200"
    :disabled="props.isDisabled"
    :class="{
      'hover:bg-slate-800 hover:text-white dark:hover:bg-red-100 dark:hover:text-blue-950':
        !props.isDisabled,
      'opacity-50 cursor-not-allowed': props.isDisabled
    }"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset'
    isDisabled?: boolean
  }>(),
  {
    type: 'button',
    isDisabled: false
  }
)

const emit = defineEmits<{
  (e: 'customClick'): void
}>()

const handleClick = () => {
  emit('customClick')
}
</script>
