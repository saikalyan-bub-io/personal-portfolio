<template>
  <div
    class="min-h-screen bg-homebg text-white relative overflow-x-hidden"
    :class="[
      { 'overflow-y-hidden': showWelcome },
      showHomeContent ? 'px-8 md:px-16' : ''
    ]"
  >
    <!-- Welcome animation -->
    <welcome :name="dynamicWelcomeName" v-if="showWelcome" />

    <!-- Tiles overlay animation -->
    <TilesTransition v-if="showTiles" @finished="onTilesFinished" />

    <!-- Home section -->
    <section id="home-section" v-show="showHomeContent" class="flex flex-col justify-center min-h-screen">
      <div class="grid md:grid-cols-3 gap-10 items-center">
        <!-- Left: Main headline and text -->
        <div class="md:col-span-2 space-y-6">
          <h1 class="text-brand font-Anton text-5xl sm:text-6xl md:text-8xl font-extrabold leading-none">
            FULLSTACK
            <br />
            <span class="text-white ml-8">DEVELOPER</span>
          </h1>

          <p class="text-gray-300 max-w-xl leading-relaxed font-unbounded">
            Hi! I'm <span class="text-brand font-semibold">Saikalyan</span>.
            A creative Full Stack Developer with 2+ years of experience in building
            high-performance, scalable, and responsive web solutions.
          </p>

          <button
            class="bg-brand text-black font-bold py-3 px-8 text-lg uppercase tracking-wide hover:bg-lime-400 transition-all duration-200"
          >
            Hire Me
          </button>
        </div>

        <!-- Right: Stats -->
        <div class="text-right space-y-8 font-unbounded mt-64">
          <div>
            <p class="text-4xl font-bold text-brand">2+</p>
            <p class="text-gray-400 text-sm uppercase tracking-wide">Years of Experience</p>
          </div>
          <div>
            <p class="text-4xl font-bold text-brand">7+</p>
            <p class="text-gray-400 text-sm uppercase tracking-wide">Completed Projects</p>
          </div>
          <div>
            <p class="text-4xl font-bold text-brand">10K+</p>
            <p class="text-gray-400 text-sm uppercase tracking-wide">Hours Worked</p>
          </div>
        </div>
      </div>

      <!-- Vertical email text -->
      <div
        class="vertical-email md:block font-unbounded"
      >
        labhishettysaikalyan@gmail.com
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import welcome from '@/components/welcome.vue'
import TilesTransition from '@/components/TilesTransition.vue'

const dynamicWelcomeName = ref('SAIKALYAN LABHISHETTY')
const showWelcome = ref(true)
const showTiles = ref(false)
const showHomeContent = ref(false)

onMounted(() => {
  // Adjust timing to match your GSAP letter animation
  setTimeout(() => {
    showTiles.value = true
    showWelcome.value = false
  }, 3000)
})

function onTilesFinished() {
  showTiles.value = false
  showHomeContent.value = true
}
</script>

<style scoped>
.vertical-email {
  position: absolute;
  left: 10px;
  top: 85%;
  transform-origin: left center;
  transform: translateY(-50%) rotate(-90deg);
  white-space: nowrap;
  color: #9ca3af;
  font-size: 14px;
  letter-spacing: 0.15em;
}
</style>
