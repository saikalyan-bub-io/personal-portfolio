<template>
  <div class="min-h-screen bg-homebg text-white overflow-x-hidden">
    <section class="flex flex-col justify-center min-h-screen">
      <div class="grid md:grid-cols-3 gap-10 items-center">

        <!-- LEFT COLUMN -->
        <div class="md:col-span-2 space-y-6">

          <!-- Heading -->
          <div class="space-y-4">
            <p class="text-gray-400 font-unbounded text-xs tracking-[0.25em] uppercase">
              My work experience
            </p>

            <h1 class="text-brand font-Anton text-6xl md:text-8xl font-extrabold leading-none">
              WORK<br />
              <span class="text-white ml-8">EXPERIENCE</span>
            </h1>
          </div>

          <!-- Description -->
          <p class="text-gray-300 max-w-xl leading-relaxed font-unbounded">
            Over the years, I've gained hands-on experience in developing scalable web applications,
            working with modern technologies and frameworks to deliver high-performance solutions.
          </p>
        </div>

        <!-- RIGHT COLUMN (GRAPH UNCHANGED) -->
        <div class="flex justify-center mt-64">
          <div
            ref="timelineRef"
            class="w-full max-w-md h-[60vh] sm:h-[70vh] md:h-[90vh]"
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

/* ---------------- TYPES ---------------- */

type Experience = {
  id: string
  company: string
  role: string
  displayDates: string
}

type Position = {
  x: number
  y: number
}



/* ---------------- DATA ---------------- */

const experiences: Experience[] = [
  {
    id: 'assert-it',
    company: 'Assert IT Solutions',
    role: 'Software Engineering Intern',
    displayDates: 'Feb 2021 – Apr 2021',
  },
  {
    id: 'powerschool',
    company: 'PowerSchool India',
    role: 'Software Engineer Intern',
    displayDates: 'Sep 2022 – Jun 2023',
  },
  {
    id: 'mantra',
    company: 'Mantra Technologies',
    role: 'Software Engineer',
    displayDates: 'Jan 2024 – Mar 2025',
  },
  {
    id: 'owfis',
    company: 'Owfis Jobpe Technologies',
    role: 'Software Engineer',
    displayDates: 'Jan 2024 – Present',
  },
]



/* ---------------- REFS ---------------- */

const timelineRef = ref<HTMLDivElement | null>(null)

let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null
let trigger: ScrollTrigger | null = null
let activeId: string | null = null

/* ---------------- MOUNT ---------------- */

onMounted(() => {
  if (!timelineRef.value) return
  const container = timelineRef.value!

  const width = container.getBoundingClientRect().width || 400
  const marginTop = 80
  const marginBottom = 80
  const nodeGap = 240

  const height =
    marginTop + marginBottom + nodeGap * (experiences.length - 1)

  svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  /* Arrow */
  svg.append('defs')
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 8)
    .attr('refY', 0)
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#a3e635')

  /* Positions */
  const leftX = width * 0.15
  const rightX = width * 0.8

  const positions: Position[] = experiences.map((_, i) => ({
    x: i % 2 === 0 ? leftX : rightX,
    y: marginTop + i * nodeGap,
  }))

  /* Path */
  let path = `M ${positions[0]!.x} ${positions[0]!.y}`

  for (let i = 0; i < positions.length - 1; i++) {
    const a = positions[i]!
    const b = positions[i + 1]!
    const midY = (a.y + b.y) / 2
    path += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`
  }

  const pathSelection = svg.append('path')
    .attr('d', path)
    .attr('fill', 'none')
    .attr('stroke', '#4b5563')
    .attr('stroke-width', 3)
    .attr('marker-end', 'url(#arrow)')

  const pathElement = pathSelection.node() as SVGPathElement
  const totalLength = pathElement.getTotalLength()
  pathSelection
    .attr('stroke-dasharray', totalLength)
    .attr('stroke-dashoffset', totalLength)

  /* Nodes */
  const nodes = svg.selectAll('.node')
    .data(experiences)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('data-id', d => d.id)
    .attr('transform', (_, i) =>
      `translate(${positions[i]!.x}, ${positions[i]!.y})`
    )

  nodes.append('circle')
    .attr('r', 7)
    .attr('fill', '#020617')
    .attr('stroke', '#9ca3af')
    .attr('stroke-width', 2)

  // Company text
  nodes.append('text')
    .attr('x', (_, i) => (i % 2 === 0 ? 20 : -20))
    .attr('text-anchor', (_, i) => (i % 2 === 0 ? 'start' : 'end'))
    .attr('y', -6)
    .attr('fill', '#a3e635')
    .style('font-size', '16px')
    .style('font-weight', '600')
    .text(d => d.company)

  // Role and dates text
  nodes.append('text')
    .attr('x', (_, i) => (i % 2 === 0 ? 20 : -20))
    .attr('text-anchor', (_, i) => (i % 2 === 0 ? 'start' : 'end'))
    .attr('y', 8)
    .attr('fill', '#9ca3af')
    .style('font-size', '10px')
    .style('font-weight', '500')
    .text(d => `${d.role} (${d.displayDates})`)

  /* ScrollTrigger */
  trigger = ScrollTrigger.create({
    trigger: container,
    start: 'top center',
    end: 'bottom center',
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate(self) {
      const index = Math.round(self.progress * (experiences.length - 1))
      const exp = experiences[index]
      if (exp && exp.id !== activeId) activate(exp)
      pathSelection.attr('stroke-dashoffset', totalLength * (1 - self.progress))
    },
  })
  ScrollTrigger.refresh()

  function activate(exp: Experience) {
    activeId = exp.id

    svg!.selectAll('circle')
      .attr('r', 7)
      .attr('fill', '#020617')
      .attr('stroke', '#9ca3af')

    svg!.select(`[data-id="${exp.id}"]`)
      .select('circle')
      .attr('r', 12)
      .attr('fill', '#a3e635')
      .attr('stroke', '#bef264')
  }
})

onBeforeUnmount(() => {
  trigger?.kill()
  svg?.remove()
})
</script>
