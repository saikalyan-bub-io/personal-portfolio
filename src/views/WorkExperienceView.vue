<template>
  <div class="min-h-screen bg-homebg text-white overflow-x-hidden">
    <section class="flex flex-col min-h-screen">
      <!-- Heading -->
      <div class="text-center space-y-4 mb-10">
        <h1 class="text-brand font-Anton text-2xl md:text-4xl font-extrabold leading-none">
          WORK EXPERIENCE
        </h1>
      </div>

      <!-- Graph container -->
      <div class="flex justify-center">
        <div
          ref="timelineRef"
          class="w-full max-w-6xl px-8 h-[70vh] sm:h-[80vh] md:h-[95vh]"
        ></div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
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
let resizeObserver: ResizeObserver | null = null
let activeId: string | null = null
let totalLength = 0

/* ---------------- MOUNT ---------------- */

onMounted(async () => {
  await nextTick() // 🔥 CRITICAL FIX

  if (!timelineRef.value) return
  const container = timelineRef.value

  const marginTop = 80
  const marginBottom = 80
  const nodeGap = 240

  const height =
    marginTop + marginBottom + nodeGap * (experiences.length - 1)

  svg = d3
    .select(container)
    .append('svg')
    .attr('height', height)
    .style('overflow', 'visible')

  /* ---------------- ARROW ---------------- */

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

  /* ---------------- POSITIONS ---------------- */

  const positions: Position[] = experiences.map((_, i) => ({
    x: 0,
    y: marginTop + i * nodeGap,
  }))

  /* ---------------- PATH ---------------- */

  const pathSelection = svg.append('path')
    .attr('fill', 'none')
    .attr('stroke', '#4b5563')
    .attr('stroke-width', 3)
    .attr('marker-end', 'url(#arrow)')

  /* ---------------- NODES ---------------- */

  const nodes = svg.selectAll('.node')
    .data(experiences)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('data-id', d => d.id)

  nodes.append('circle')
    .attr('r', 7)
    .attr('fill', '#020617')
    .attr('stroke', '#9ca3af')
    .attr('stroke-width', 2)

  nodes.append('text')
    .attr('class', 'company-text')
    .attr('x', (_, i) => (i % 2 === 0 ? 24 : -24))
    .attr('text-anchor', (_, i) => (i % 2 === 0 ? 'start' : 'end'))
    .attr('y', -8)
    .attr('fill', '#a3e635')
    .style('font-size', '16px')
    .style('font-weight', '600')
    .text(d => d.company)

  nodes.append('text')
    .attr('class', 'role-text')
    .attr('x', (_, i) => (i % 2 === 0 ? 24 : -24))
    .attr('text-anchor', (_, i) => (i % 2 === 0 ? 'start' : 'end'))
    .attr('y', 10)
    .attr('fill', '#9ca3af')
    .style('font-size', '10px')
    .style('font-weight', '500')
    .text(d => `${d.role} (${d.displayDates})`)

  /* ---------------- BUILD / UPDATE ---------------- */

  function rebuild() {
    const width = container.getBoundingClientRect().width
    if (!width) return

    const isMobile = width < 600
    const leftX = isMobile ? width * 0.15 : width * 0.1
    const rightX = isMobile ? width * 0.85 : width * 0.9
    const curveOffset = isMobile ? width * 0.1 : width * 0.55
    const textOffset = isMobile ? 12 : 24
    const companyFontSize = isMobile ? '14px' : '16px'
    const roleFontSize = isMobile ? '8px' : '10px'
    const nodeGap = isMobile ? 180 : 240
    const marginTop = isMobile ? 60 : 80
    const marginBottom = isMobile ? 60 : 80
    const height = marginTop + marginBottom + nodeGap * (experiences.length - 1)

    svg!.attr('width', width)
    svg!.attr('height', height)

    positions.forEach((p, i) => {
      p.x = i % 2 === 0 ? leftX : rightX
      p.y = marginTop + i * nodeGap
    })

    let path = `M ${positions[0]!.x} ${positions[0]!.y}`

    for (let i = 0; i < positions.length - 1; i++) {
      const a = positions[i]!
      const b = positions[i + 1]!
      const midY = (a.y + b.y) / 2
      const direction = i % 2 === 0 ? -1 : 1

      path += ` C ${a.x + direction * curveOffset} ${midY},
                 ${b.x + direction * curveOffset} ${midY},
                 ${b.x} ${b.y}`
    }

    pathSelection.attr('d', path)

    totalLength = pathSelection.node()!.getTotalLength()

    pathSelection
      .attr('stroke-dasharray', totalLength)
      .attr('stroke-dashoffset', totalLength * (1 - (trigger?.progress || 1)))

    svg!
      .selectAll<SVGGElement, Experience>('.node')
      .attr('transform', (_, i) =>
        `translate(${positions[i]!.x}, ${positions[i]!.y})`
      )

    svg!.selectAll('.company-text')
      .attr('x', (_, i) => (i % 2 === 0 ? textOffset : -textOffset))
      .style('font-size', companyFontSize)

    svg!.selectAll('.role-text')
      .attr('x', (_, i) => (i % 2 === 0 ? textOffset : -textOffset))
      .style('font-size', roleFontSize)
  }

  rebuild()

  /* ---------------- SCROLL ---------------- */

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

      pathSelection.attr(
        'stroke-dashoffset',
        totalLength * (1 - self.progress)
      )
    },
    onRefresh: rebuild,
  })

  resizeObserver = new ResizeObserver(() => {
    ScrollTrigger.refresh()
  })
  resizeObserver.observe(container)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
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
  }
})

onBeforeUnmount(() => {
  trigger?.kill()
  resizeObserver?.disconnect()
  svg?.remove()
})
</script>
