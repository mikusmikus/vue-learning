<template>
  <input
    class="w-full px-4 py-2 border border-gray-300 rounded-md"
    type="text"
    @input="$emit('update:value', ($event.target as HTMLInputElement).value)"
    :value="value"
  />
</template>

<script setup lang="ts">

type Props = {
  value: string
}
type Emits = {
  (e: 'update:value', value: string): void
}

defineProps<Props>()
defineEmits<Emits>()


</script>
