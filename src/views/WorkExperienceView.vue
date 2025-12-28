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
            <span class="text-white ml-8">EXPERIENCE</span>
          </h1>
          <p class="text-gray-300 max-w-2xl leading-relaxed font-unbounded text-sm sm:text-base">
            A timeline of my professional journey, from internships to my current role, all mapped along a
            single growth arrow.
          </p>
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

type Experience = {
  id: string
  company: string
  role: string
  start: Date
  end: Date
  current?: boolean
  displayDates: string
}

type ExperienceWithMid = Experience & { mid: Date }

const timelineRef = ref<HTMLDivElement | null>(null)
// Use a relaxed type here to avoid dependency on external d3-selection typings
let svg: any | null = null

onMounted(() => {
  if (!timelineRef.value) return

  const container = timelineRef.value
  const width = container.clientWidth || 400
  // Make the SVG/timeline use (almost) full viewport height so the arrow fills the page
  const height = container.clientHeight || 600

  // Experiences in chronological order
  const experiences: Experience[] = [
    {
      id: 'assert-it',
      company: 'Assert IT Solutions',
      role: 'Software Engineering Intern',
      start: new Date(2021, 1, 1), // February 2021
      end: new Date(2021, 3, 30), // April 2021
      displayDates: 'Feb 2021 – Apr 2021',
    },
    {
      id: 'powerschool',
      company: 'PowerSchool India',
      role: 'Software Engineer Intern',
      start: new Date(2022, 8, 1), // September 2022
      end: new Date(2023, 5, 30), // June 2023
      displayDates: 'Sep 2022 – Jun 2023',
    },
    {
      id: 'mantra',
      company: 'Mantra Technologies',
      role: 'Software Engineer',
      start: new Date(2024, 0, 1), // January 2024
      end: new Date(2025, 2, 31), // March 2025
      displayDates: 'Jan 2024 – Mar 2025',
    },
    {
      id: 'owfis',
      company: 'Owfis Jobpe Technologies',
      role: 'Software Engineer',
      start: new Date(2024, 0, 1), // January 2024
      end: new Date(), // Current
      current: true,
      displayDates: 'Jan 2024 – Present',
    },
  ]

  // Compute midpoints for positioning along the arrow
  const experiencesWithMid = experiences.map((exp): ExperienceWithMid => {
    const midTime = (exp.start.getTime() + exp.end.getTime()) / 2
    return { ...exp, mid: new Date(midTime) }
  })

  const minStart = d3.min(experiencesWithMid, (d: ExperienceWithMid) => d.start) as Date
  const maxEnd = d3.max(experiencesWithMid, (d: ExperienceWithMid) => d.end) as Date

  const marginTop = 24
  const marginBottom = 32
  const arrowX = width * 0.5 // Center arrow inside its column so it isn't cut off

  const yScale = d3
    .scaleTime()
    .domain([minStart, maxEnd])
    // Invert the range so the most recent experience appears at the top
    .range([height - marginBottom, marginTop])

  // Create SVG canvas
  svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // Arrowhead marker for the main arrow (represents current company at the tip)
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

  const arrowTop = marginTop
  const arrowBottom = height - marginBottom

  // Main vertical arrow on the right side (now pointing upward)
  svg
    .append('line')
    .attr('x1', arrowX)
    .attr('y1', arrowBottom)
    .attr('x2', arrowX)
    .attr('y2', arrowTop)
    .attr('stroke', '#4b5563')
    .attr('stroke-width', 3)
    .attr('marker-end', 'url(#experience-arrow)')

  // Add a subtle timeline label at the bottom
  svg
    .append('text')
    .attr('x', arrowX + 8)
    .attr('y', arrowBottom + 18)
    .attr('fill', '#9ca3af')
    .style('font-size', '12px')
    .style('font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif')
    .text('Timeline')

  // Draw experience nodes along the arrow
  const nodes = svg
    .selectAll('g.experience-node')
    .data(experiencesWithMid)
    .enter()
    .append('g')
    .attr('class', 'experience-node')
    .attr('transform', (d: ExperienceWithMid) => {
      let y = yScale(d.mid)

      // Custom spacing so there is:
      // - A clear gap between the arrow head and the Owfis node
      // - A clear gap between Owfis and Mantra nodes
      if (d.id === 'owfis') {
        // Push slightly up relative to its scaled position but never closer
        // than 24px from the arrow head
        y = Math.max(y - 20, arrowTop + 24)
      } else if (d.id === 'mantra') {
        // Push Mantra further down so it separates more from Owfis
        y += 20
      }

      return `translate(${arrowX}, ${y})`
    })

  // Circles for each experience (last/current one highlighted)
  nodes
    .append('circle')
    .attr('r', (d: ExperienceWithMid) => (d.current ? 9 : 7))
    .attr('fill', (d: ExperienceWithMid) => (d.current ? '#a3e635' : '#020617'))
    .attr('stroke', (d: ExperienceWithMid) => (d.current ? '#bef264' : '#9ca3af'))
    .attr('stroke-width', 2)

  // Text labels around the arrow, zig-zag left/right per node
  // 1) Company (brand color, larger)
  nodes
    .append('text')
    .attr('x', (_d: ExperienceWithMid, i: number) => (i % 2 === 0 ? -20 : 20))
    .attr('y', -10)
    .attr('text-anchor', (_d: ExperienceWithMid, i: number) => (i % 2 === 0 ? 'end' : 'start'))
    .attr('fill', '#a3e635') // matches text-brand
    .style('font-size', '16px')
    .style('font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif')
    .style('font-weight', '600')
    .text((d: ExperienceWithMid) => d.company)

  // 2) Role (white)
  nodes
    .append('text')
    .attr('x', (_d: ExperienceWithMid, i: number) => (i % 2 === 0 ? -20 : 20))
    .attr('y', 6)
    .attr('text-anchor', (_d: ExperienceWithMid, i: number) => (i % 2 === 0 ? 'end' : 'start'))
    .attr('fill', '#e5e7eb')
    .style('font-size', '14px')
    .style('font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif')
    .text((d: ExperienceWithMid) => d.role)

  // 3) Dates (gray)
  nodes
    .append('text')
    .attr('x', (_d: ExperienceWithMid, i: number) => (i % 2 === 0 ? -20 : 20))
    .attr('y', 22)
    .attr('text-anchor', (_d: ExperienceWithMid, i: number) => (i % 2 === 0 ? 'end' : 'start'))
    .attr('fill', '#9ca3af')
    .style('font-size', '11px')
    .style('font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif')
    .text((d: ExperienceWithMid) => d.displayDates)
})

onBeforeUnmount(() => {
  if (svg) {
    svg.remove()
    svg = null
  }
})
</script>
