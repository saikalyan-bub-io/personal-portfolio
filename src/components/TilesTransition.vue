<template>
  <div class="fixed inset-0 z-50 grid grid-cols-5 grid-rows-2">
    <div
      v-for="(tile, i) in 10"
      :key="i"
      ref="tiles"
      class="bg-black"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['finished'])
const tiles = ref<HTMLElement[]>([])

onMounted(() => {
  const tl = gsap.timeline({
    onComplete: () => emit('finished'),
  })

  // Animate each tile moving up and fading out sequentially
  tl.to(tiles.value, {
    yPercent: -120,
    opacity: 0,
    duration: 0.5,
    ease: 'power3.inOut',
    stagger: {
      each: 0.1,
      from: 'start', // left to right (or random)
    },
  })
})
</script>

<style scoped>
.grid {
  pointer-events: none;
}
</style>
