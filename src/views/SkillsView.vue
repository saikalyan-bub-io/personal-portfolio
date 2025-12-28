<template>
  <div class="w-screen min-h-screen bg-homebg text-white px-8 md:px-16 flex flex-col justify-center">
    <div class="max-w-4xl mx-auto text-center space-y-12">
      <h2 class="text-brand font-Anton text-5xl sm:text-6xl md:text-7xl font-extrabold leading-none">
        MY SKILLS
      </h2>

      <div class="grid md:grid-cols-2 gap-10">
        <!-- Skills -->
        <div class="space-y-6">
          <h3 class="text-2xl font-bold text-white font-unbounded">Skills</h3>
          <div class="flex flex-wrap gap-4">
            <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">JavaScript</span>
            <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">Python</span>
          </div>
        </div>

        <!-- Frameworks -->
        <div class="space-y-6">
          <h3 class="text-2xl font-bold text-white font-unbounded">Frameworks</h3>
          <div class="flex flex-wrap gap-4">
            <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">Vue.js</span>
            <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">Next.js</span>
            <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">FastAPI</span>
          </div>
        </div>

        <!-- Database -->
        <div class="space-y-6">
          <h3 class="text-2xl font-bold text-white font-unbounded">Database</h3>
          <div class="flex flex-wrap gap-4">
            <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">MongoDB</span>
          </div>
        </div>

        <!-- Version Control -->
        <div class="space-y-6">
          <h3 class="text-2xl font-bold text-white font-unbounded">Version Control</h3>
          <div class="flex flex-wrap gap-4">
            <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">GitHub</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for now
</script>

<style scoped>
/* Add any scoped styles if needed */
</style>
