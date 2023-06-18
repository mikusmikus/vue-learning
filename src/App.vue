<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { state } from './globalState'
</script>

<template>
  <header class="dark:bg-slate-900 dark:text-yellow-50 bg-slate-200 text-slate-900">
    <div class="max-w-5xl px-4 lg:px-10 mx-auto flex justify-between items-center">
      <nav class="p-3 flex flex-col sm:flex-row md:text-lg gap-4">
        <RouterLink class="hover:text-red-400" to="/">Home</RouterLink>
        <RouterLink class="hover:text-red-400" to="/about">About</RouterLink>
        <RouterLink class="hover:text-red-400" to="/characters">Characters</RouterLink>
        <RouterLink class="hover:text-red-400" to="/form">Form</RouterLink>
      </nav>
      <div>Current theme: {{ state.theme }}</div>
    </div>
  </header>
  <div class="max-w-5xl px-4 lg:px-10 mx-auto">
    <RouterView />
  </div>
</template>

<style scoped></style>
