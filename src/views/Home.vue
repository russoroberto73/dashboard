<template>
  <main>
    Homepage<br />
    {{ Assistenti }}
  </main>
</template>

<script setup lang="ts">
import { Pinia } from '@/stores/index'
const FirebaseAssistenti = Pinia.Assistenti()

const Assistenti = FirebaseAssistenti.getElenco
</script>
<style lang="scss" scoped>
main {
  @apply bg-Sfondo h-screen w-screen text-center;
}
</style>