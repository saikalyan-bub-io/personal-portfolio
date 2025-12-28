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

    <!-- Skills section with GSAP zoom-on-scroll effect -->
    <section
      id="skills-section"
      ref="skillsSectionWrapper"
      class="mt-32"
    >
      <SkillsView />
    </section>

    <!-- Work Experience section rendered after Skills -->
    <section
      id="work-experience-section"
      class="mt-32"
    >
      <WorkExperienceView />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import welcome from '@/components/welcome.vue'
import TilesTransition from '@/components/TilesTransition.vue'
import SkillsView from '@/views/SkillsView.vue'
import WorkExperienceView from '@/views/WorkExperienceView.vue'

const dynamicWelcomeName = ref('SAIKALYAN LABHISHETTY')
const showWelcome = ref(true)
const showTiles = ref(false)
const showHomeContent = ref(false)

const skillsSectionWrapper = ref<HTMLElement | null>(null)
// Keep a reference to this view's ScrollTrigger so we can clean it up
const skillsScrollTrigger = ref<any | null>(null)

// Register GSAP ScrollTrigger plugin once on component setup
gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  // Adjust timing to match your GSAP letter animation
  setTimeout(() => {
    showTiles.value = true
    showWelcome.value = false
  }, 3000)

  // Wait for DOM to be ready before creating scroll-triggered zoom animation
  nextTick(() => 
    {
      if (!skillsSectionWrapper.value) return

      const tween = gsap.from(skillsSectionWrapper.value, {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: skillsSectionWrapper.value,
          start: 'top 80%',
          end: 'top 40%',
          scrub: false,
          toggleActions: 'play none none reverse',
        },
      })

      // Store ScrollTrigger instance for cleanup
      skillsScrollTrigger.value = tween.scrollTrigger || null
    }
  )
})

onBeforeUnmount(() => {
  // Clean up ScrollTrigger created for the skills zoom animation
  if (skillsScrollTrigger.value) {
    skillsScrollTrigger.value.kill()
    skillsScrollTrigger.value = null
  }
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
  top: 30%;
  transform-origin: left center;
  transform: translateY(-50%) rotate(-90deg);
  white-space: nowrap;
  color: #9ca3af;
  font-size: 14px;
  letter-spacing: 0.15em;
}
</style>
