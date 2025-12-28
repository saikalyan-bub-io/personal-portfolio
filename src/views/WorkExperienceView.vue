<template>
  <div
    class="min-h-screen bg-homebg text-white relative overflow-x-hidden flex flex-col justify-center"
  >
    <section class="flex flex-col justify-center min-h-screen">
      <div class="grid md:grid-cols-3 gap-10 items-center">
        <!-- Left: Heading and description (wider, similar to HomeView) -->
        <div class="md:col-span-2 space-y-6">
          <p class="text-gray-400 font-unbounded text-xs sm:text-sm tracking-[0.25em] uppercase">
            My journey so far
          </p>
          <h1 class="text-brand font-Anton text-5xl sm:text-6xl md:text-8xl font-extrabold leading-none">
            WORK
            <br />
            <span class="text-white ml-8" ref="experienceTitle">EXPERIENCE</span>
          </h1>
          <div ref="experienceDetails" class="space-y-2">
            <p class="text-gray-300 max-w-2xl leading-relaxed font-unbounded text-sm sm:text-base">
              A timeline of my professional journey, from internships to my current role, all mapped along a
              single growth arrow.
            </p>
          </div>
        </div>

        <!-- Right: D3 timeline arrow aligned to the right (similar to HomeView stats) -->
        <div class="md:col-span-1 flex items-center justify-end">
          <div
            ref="timelineRef"
            class="w-full max-w-md h-[70vh] md:h-[80vh] bg-gray-900/40 rounded-lg ml-auto"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as d3 from 'd3'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Experience = {
  id: string
  company: string
  role: string
  start: Date
  end: Date
  current?: boolean
  displayDates: string
}

const timelineRef = ref<HTMLDivElement | null>(null)
const experienceDetails = ref<HTMLElement | null>(null)
let svg: any | null = null
let scrollTriggers: ScrollTrigger[] = []
let activeExperienceId: string | null = null

onMounted(() => {
  if (!timelineRef.value) return

  const container = timelineRef.value
  const width = container.clientWidth || 400
  const height = container.clientHeight || 600

  // All experiences in chronological order (first to current)
  const experiences: Experience[] = [
    {
      id: 'assert-it',
      company: 'Assert IT Solutions',
      role: 'Software Engineering Intern',
      start: new Date(2021, 1, 1),
      end: new Date(2021, 3, 30),
      displayDates: 'Feb 2021 – Apr 2021',
    },
    {
      id: 'powerschool',
      company: 'PowerSchool India',
      role: 'Software Engineer Intern',
      start: new Date(2022, 8, 1),
      end: new Date(2023, 5, 30),
      displayDates: 'Sep 2022 – Jun 2023',
    },
    {
      id: 'mantra',
      company: 'Mantra Technologies',
      role: 'Software Engineer',
      start: new Date(2024, 0, 1),
      end: new Date(2025, 2, 31),
      displayDates: 'Jan 2024 – Mar 2025',
    },
    {
      id: 'owfis',
      company: 'Owfis Jobpe Technologies',
      role: 'Software Engineer',
      start: new Date(2024, 0, 1),
      end: new Date(),
      current: true,
      displayDates: 'Jan 2024 – Present',
    },
  ]

  const marginTop = 60
  const marginBottom = 60
  const leftX = width * 0.1
  const spacing = (height - marginTop - marginBottom) / (experiences.length - 1)

  // Create SVG canvas
  svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // Arrowhead marker (pointing downward)
  const defs = svg.append('defs')

  defs
    .append('marker')
    .attr('id', 'experience-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 8)
    .attr('refY', 0)
    .attr('markerWidth', 10)
    .attr('markerHeight', 10)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#a3e635')

  // Define positions for each experience with expanding curves
  const positions = experiences.map((exp, i) => {
    const y = marginTop + (spacing * i)
    // Curve expands more as we go down
    const curveExpansion = (i / (experiences.length - 1)) * width * 0.4
    return { x: leftX + curveExpansion, y: y }
  })

  // Safely get the first position with a sensible fallback
  const firstPosition = positions[0] ?? { x: leftX, y: marginTop }

  // Create path with expanding curves through all experiences
  let pathData = `M ${firstPosition.x} ${firstPosition.y}`
  
  for (let i = 0; i < positions.length - 1; i++) {
    const current = positions[i]
    const next = positions[i + 1]

    // Extra safety in case indexes are out of bounds
    if (!current || !next) continue

    const midY = (current.y + next.y) / 2
    
    // Control points that create expanding curves
    const controlX1 = current.x + (next.x - current.x) * 0.5 + width * 0.15
    const controlY1 = current.y + (midY - current.y) * 0.5
    
    const controlX2 = current.x + (next.x - current.x) * 0.5 - width * 0.1
    const controlY2 = midY + (next.y - midY) * 0.5
    
    pathData += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${next.x} ${next.y}`
  }

  // Main curved arrow path
  svg
    .append('path')
    .attr('d', pathData)
    .attr('stroke', '#4b5563')
    .attr('stroke-width', 3)
    .attr('fill', 'none')
    .attr('marker-end', 'url(#experience-arrow)')

  // Timeline label at top
  svg
    .append('text')
    .attr('x', firstPosition.x - 50)
    .attr('y', marginTop - 10)
    .attr('fill', '#9ca3af')
    .style('font-size', '12px')
    .style('font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif')
    .text('Start')

  // Draw experience nodes
  const nodes = svg
    .selectAll('g.experience-node')
    .data(experiences)
    .enter()
    .append('g')
    .attr('class', 'experience-node')
    .attr('data-id', (d: Experience) => d.id)
    .attr('transform', (_d: Experience, i: number) => {
      const position = positions[i]
      if (!position) {
        return `translate(${firstPosition.x}, ${firstPosition.y})`
      }
      return `translate(${position.x}, ${position.y})`
    })

  // Circles for each experience
  nodes
    .append('circle')
    .attr('class', 'node-circle')
    .attr('r', (d: Experience) => (d.current ? 9 : 7))
    .attr('fill', (d: Experience) => (d.current ? '#a3e635' : '#020617'))
    .attr('stroke', (d: Experience) => (d.current ? '#bef264' : '#9ca3af'))
    .attr('stroke-width', 2)

  // Company name - always to the right
  nodes
    .append('text')
    .attr('class', 'node-company')
    .attr('x', 20)
    .attr('y', -10)
    .attr('text-anchor', 'start')
    .attr('fill', '#a3e635')
    .style('font-size', '16px')
    .style('font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif')
    .style('font-weight', '600')
    .text((d: Experience) => d.company)

  // Role
  nodes
    .append('text')
    .attr('class', 'node-role')
    .attr('x', 20)
    .attr('y', 6)
    .attr('text-anchor', 'start')
    .attr('fill', '#e5e7eb')
    .style('font-size', '14px')
    .style('font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif')
    .text((d: Experience) => d.role)

  // Dates
  nodes
    .append('text')
    .attr('class', 'node-dates')
    .attr('x', 20)
    .attr('y', 22)
    .attr('text-anchor', 'start')
    .attr('fill', '#9ca3af')
    .style('font-size', '11px')
    .style('font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif')
    .text((d: Experience) => d.displayDates)

  // GSAP ScrollTrigger animation - smoothly move through all experiences
  const totalExperiences = experiences.length

  if (totalExperiences > 0) {
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: true,
      onUpdate: (self: ScrollTrigger) => {
        const progress = self.progress // 0 -> 1
        const index = Math.min(totalExperiences - 1, Math.floor(progress * totalExperiences))
        const exp = experiences[index]

        if (exp && exp.id !== activeExperienceId) {
          updateActiveExperience(exp)
        }
      },
    })

    scrollTriggers.push(trigger)

    // Initialize with first experience
    updateActiveExperience(experiences[0])
  }

  function updateActiveExperience(exp: Experience | undefined) {
    if (!exp) return

    activeExperienceId = exp.id

    // Reset all nodes
    d3.selectAll('.experience-node .node-circle')
      .transition()
      .duration(300)
      .attr('r', (d: any) => (d.current ? 9 : 7))
      .attr('fill', (d: any) => (d.current ? '#a3e635' : '#020617'))
      .attr('stroke', (d: any) => (d.current ? '#bef264' : '#9ca3af'))
      .attr('stroke-width', 2)

    d3.selectAll('.experience-node .node-company')
      .transition()
      .duration(300)
      .attr('fill', '#a3e635')
      .style('font-size', '16px')

    // Highlight active node
    const activeNode = d3.select(`[data-id="${exp.id}"]`)
    
    activeNode.select('.node-circle')
      .transition()
      .duration(300)
      .attr('r', 12)
      .attr('fill', '#a3e635')
      .attr('stroke', '#bef264')
      .attr('stroke-width', 3)

    activeNode.select('.node-company')
      .transition()
      .duration(300)
      .attr('fill', '#bef264')
      .style('font-size', '18px')

    // Update details
    if (experienceDetails.value) {
      gsap.to(experienceDetails.value, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
          if (experienceDetails.value) {
            experienceDetails.value.innerHTML = `
              <p class="text-2xl font-bold text-white">${exp.role}</p>
              <p class="text-gray-400 text-sm">${exp.displayDates}</p>
            `
            gsap.to(experienceDetails.value, {
              opacity: 1,
              y: 0,
              duration: 0.3
            })
          }
        }
      })
    }
  }
})

onBeforeUnmount(() => {
  // Clean up GSAP ScrollTriggers
  scrollTriggers.forEach(trigger => trigger.kill())
  scrollTriggers = []
  
  if (svg) {
    svg.remove()
    svg = null
  }
})
</script>
