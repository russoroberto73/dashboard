<template>
  <div>
    <textarea v-model="text" rows="10" cols="50"></textarea>
    <button @click="copiaDB" class="bg-yellow-400">Copia DB</button>
    {{text}}
  </div>
</template>
<script setup lang="js">
  import { ref } from 'vue'
  const text = ref('')
  const copiaDB = async () => {
    const parse = JSON.parse(text.value)
    console.log(Object.keys(parse))
  }

</script>
