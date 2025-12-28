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

          <!-- Dynamic Work Content -->
          <div
            ref="workDetailsRef"
            class="space-y-4 max-w-xl"
          >
            <p class="text-gray-400 text-sm">
              Scroll the timeline to explore my work.
            </p>
          </div>

        </div>

        <!-- RIGHT COLUMN (GRAPH UNCHANGED) -->
        <div class="flex justify-center">
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

type WorkDetails = {
  title: string
  points: string[]
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

const workMap: Record<string, WorkDetails> = {
  'assert-it': {
    title: 'Assert IT Solutions',
    points: [
      'Resolved UI issues and front-end bugs to improve user experience.',
      'Implemented minor features and enhanced existing functionality.',
    ],
  },
  powerschool: {
    title: 'PowerSchool India',
    points: [
      'Worked as a full-stack developer on the Shared Services project.',
      'Developed production-grade features using ReactJS and NodeJS.',
      'Implemented responsive UI and reusable components.',
      'Wrote test cases using Jest.',
      'Worked with MySQL and Auth0.',
    ],
  },
  mantra: {
    title: 'Mantra Technologies',
    points: [
      'Developed scalable web apps using Next.js with optimized SSR.',
      'Built backend services with Node.js.',
      'Integrated Razorpay payment gateway.',
      'Used Vue 3 Composition API for scalable components.',
      'Improved performance with Vanilla JavaScript.',
    ],
  },
  owfis: {
    title: 'Owfis Jobpe Technologies',
    points: [
      'Built dynamic apps using Vue 3 and Nuxt.js.',
      'Developed REST APIs using FastAPI.',
      'Integrated LLM-based generative AI features.',
      'Implemented real-time, context-aware chat responses.',
      'Optimized apps for high concurrent traffic.',
    ],
  },
}

/* ---------------- REFS ---------------- */

const timelineRef = ref<HTMLDivElement | null>(null)
const workDetailsRef = ref<HTMLElement | null>(null)

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

  svg.append('path')
    .attr('d', path)
    .attr('fill', 'none')
    .attr('stroke', '#4b5563')
    .attr('stroke-width', 3)
    .attr('marker-end', 'url(#arrow)')

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

  nodes.append('text')
    .attr('x', (_, i) => (i % 2 === 0 ? 20 : -20))
    .attr('text-anchor', (_, i) => (i % 2 === 0 ? 'start' : 'end'))
    .attr('y', -6)
    .attr('fill', '#a3e635')
    .style('font-size', '16px')
    .style('font-weight', '600')
    .text(d => d.company)

  /* ScrollTrigger */
  requestAnimationFrame(() => {
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
      },
    })
    ScrollTrigger.refresh()
  })

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

    const details = workMap[exp.id]
    if (!details || !workDetailsRef.value) return

    gsap.to(workDetailsRef.value, {
      opacity: 0,
      y: 20,
      duration: 0.25,
      onComplete: () => {
        if (!workDetailsRef.value) return
        workDetailsRef.value.innerHTML = `
          <h3 class="text-xl font-semibold text-brand">${details.title}</h3>
          <ul class="list-disc list-inside text-gray-300 text-sm space-y-2">
            ${details.points.map(p => `<li>${p}</li>`).join('')}
          </ul>
        `
        gsap.to(workDetailsRef.value, { opacity: 1, y: 0, duration: 0.25 })
      },
    })
  }
})

onBeforeUnmount(() => {
  trigger?.kill()
  svg?.remove()
})
</script>
