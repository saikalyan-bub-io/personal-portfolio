<template>
  <div
    class="min-h-screen bg-homebg text-white relative overflow-x-hidden flex flex-col justify-center"
  >
    <section class="flex flex-col justify-center min-h-screen">
      <div class="grid md:grid-cols-3 gap-10 items-center">
        <!-- Left: Heading and description (wider, similar to WorkExperienceView) -->
        <div class="md:col-span-2 space-y-6">
          <p class="text-gray-400 font-unbounded text-xs sm:text-sm tracking-[0.25em] uppercase">
            Tools & technologies I use
          </p>
          <h2 class="text-brand font-Anton text-4xl sm:text-5xl md:text-7xl font-extrabold leading-none">
            MY
            <br />
            <span class="text-white ml-8">SKILLS</span>
          </h2>
          <p class="text-gray-300 max-w-2xl leading-relaxed font-unbounded text-sm sm:text-base">
            From frontend experiences to backend APIs, these are the tools I use to build complete solutions
            with a strong focus on performance, reliability, and developer experience.
          </p>
        </div>

        <!-- Right: Skills summary, aligned like HomeView stats (first skills, then heading) -->
        <div class="md:col-span-1 text-right space-y-8 font-unbounded mt-0 md:mt-64">
          <div>
            <p class="text-xl sm:text-2xl font-bold text-brand">JavaScript, Python</p>
            <p class="text-gray-400 text-sm uppercase tracking-wide">Languages</p>
          </div>

          <div>
            <p class="text-xl sm:text-2xl font-bold text-brand">Vue.js, Next.js, FastAPI</p>
            <p class="text-gray-400 text-sm uppercase tracking-wide">Frameworks</p>
          </div>

          <div>
            <p class="text-xl sm:text-2xl font-bold text-brand">MongoDB</p>
            <p class="text-gray-400 text-sm uppercase tracking-wide">Database</p>
          </div>

          <div>
            <p class="text-xl sm:text-2xl font-bold text-brand">GitHub</p>
            <p class="text-gray-400 text-sm uppercase tracking-wide">Version Control</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
