<template>
  <div
    class="min-h-screen bg-homebg text-white relative overflow-x-hidden px-8 md:px-16 flex flex-col justify-center"
  >
    <section class="flex flex-col justify-center min-h-screen">
      <div class="grid md:grid-cols-3 gap-10 items-start">
        <!-- Left: Heading and subtitle (aligned similar to HomeView) -->
        <div class="space-y-4 md:col-span-1">
          <p class="text-gray-400 font-unbounded text-xs sm:text-sm tracking-[0.25em] uppercase">
            Tools & technologies I use
          </p>
          <h2 class="text-brand font-Anton text-5xl sm:text-6xl md:text-7xl font-extrabold leading-none">
            MY SKILLS
          </h2>
          <p class="text-gray-300 max-w-xs leading-relaxed font-unbounded text-sm sm:text-base">
            From frontend experiences to backend APIs, these are the tools I use to build complete solutions.
          </p>
        </div>

        <!-- Right: Skills cards -->
        <div class="md:col-span-2 space-y-10">
          <div class="grid md:grid-cols-2 gap-10 text-left">
            <!-- Languages -->
            <div class="space-y-6">
              <h3 class="text-2xl font-bold text-white font-unbounded">Languages</h3>
              <div class="flex flex-wrap gap-4">
                <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">JavaScript</span>
                <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">Python</span>
              </div>
            </div>

            <!-- Frameworks -->
            <div class="space-y-6">
              <h3 class="text-2xl font-bold text-white font-unbounded">Frameworks</h3>
              <div class="flex flex-wrap gap-4">
                <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">Vue.js</span>
                <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">Next.js</span>
                <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">FastAPI</span>
              </div>
            </div>

            <!-- Database -->
            <div class="space-y-6">
              <h3 class="text-2xl font-bold text-white font-unbounded">Database</h3>
              <div class="flex flex-wrap gap-4">
                <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">MongoDB</span>
              </div>
            </div>

            <!-- Version Control -->
            <div class="space-y-6">
              <h3 class="text-2xl font-bold text-white font-unbounded">Version Control</h3>
              <div class="flex flex-wrap gap-4">
                <span class="bg-brand text-black px-4 py-2 rounded-full font-semibold">GitHub</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
