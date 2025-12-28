<template>
  <div class="flex items-center justify-center min-h-screen bg-black -mx-8 md:-mx-16">
    <h1
      ref="textElement"
      class="text-animation text-4xl sm:text-5xl md:text-10xl font-extrabold text-brand tracking-wide w-full font-Anton text-center"
    >
      {{ name }}
    </h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import gsap from 'gsap'

const props = defineProps<{ name?: string }>()
const textElement = ref<HTMLElement | null>(null)

// Function to animate letters
const animateText = () => {
  if (!textElement.value || !props.name) return

  // Split text into spans
  const letters = props.name.split('')
  textElement.value.innerHTML = ''
  letters.forEach(letter => {
    const span = document.createElement('span')
    span.textContent = letter === ' ' ? '\u00A0' : letter // preserve spaces
    span.className = 'text-animation' // Tailwind class replaces CSS
    textElement.value!.appendChild(span)
  })

  // Animate letters from bottom to top
  gsap.fromTo(
    textElement.value.children,
    { y: '100%', opacity: 0 },
    {
      y: '0%',
      opacity: 1,
      stagger: 0.1,
      duration: 0.2,
      ease: 'power3.out',
    }
  )
}

onMounted(() => {
  animateText()
})

watch(() => props.name, () => {
  animateText()
})
</script>
