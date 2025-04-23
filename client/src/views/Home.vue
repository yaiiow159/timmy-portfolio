<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import gsap from 'gsap'

const { t } = useI18n()
const router = useRouter()

const isLoaded = ref(false)

onMounted(() => {
  isLoaded.value = true
  
  const tl = gsap.timeline()
  
  tl.from('.hero-title', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  })
  .from('.hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.4')
  .from('.hero-description', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.3')
  .from('.hero-cta', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.3')
  .from('.skill-item', {
    y: 20,
    opacity: 0,
    duration: 0.4,
    stagger: 0.1,
    ease: 'power2.out'
  }, '-=0.2')
})

const skills = [
  { name: 'Java', icon: 'devicon-java-plain' },
  { name: 'Spring Boot', icon: 'devicon-spring-plain' },
  { name: 'Vue.js', icon: 'devicon-vuejs-plain' },
  { name: 'JavaScript', icon: 'devicon-javascript-plain' },
  { name: 'TypeScript', icon: 'devicon-typescript-plain' },
  { name: 'Node.js', icon: 'devicon-nodejs-plain' },
  { name: 'MongoDB', icon: 'devicon-mongodb-plain' },
  { name: 'MySQL', icon: 'devicon-mysql-plain' },
  { name: 'Docker', icon: 'devicon-docker-plain' }
]

function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="min-h-screen">
    <section class="relative py-20 md:py-32 overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="hero-title text-4xl md:text-6xl font-bold mb-4">
            <span class="block text-text-secondary">{{ t('home.greeting') }}</span>
            <span class="text-accent">{{ t('home.name') }}</span>
          </h1>
          <h2 class="hero-subtitle text-2xl md:text-3xl font-semibold mb-6 text-text-primary">
            {{ t('home.title') }}
          </h2>
          <p class="hero-description text-lg md:text-xl text-text-secondary mb-8">
            {{ t('home.intro') }}
          </p>
          <div class="hero-cta flex flex-col sm:flex-row justify-center gap-4">
            <button 
              @click="navigateTo('/portfolio')" 
              class="px-6 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors"
            >
              {{ t('home.cta') }}
            </button>
            <button 
              @click="navigateTo('/contact')" 
              class="px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-white font-medium rounded-lg transition-colors"
            >
              {{ t('contact.title') }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
    </section>
    
    <section class="py-16 bg-secondary">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12 text-text-primary">
          {{ t('resume.skills') }}
        </h2>
        <div class="grid grid-cols-3 md:grid-cols-9 gap-6 justify-items-center">
          <div 
            v-for="(skill, index) in skills" 
            :key="index"
            class="skill-item flex flex-col items-center"
          >
            <div class="w-16 h-16 flex items-center justify-center bg-primary rounded-lg mb-3">
              <i :class="[skill.icon, 'text-3xl text-accent']"></i>
            </div>
            <span class="text-sm text-text-secondary">{{ skill.name }}</span>
          </div>
        </div>
      </div>
    </section>
    
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-12">
          <h2 class="text-3xl font-bold text-text-primary">
            {{ t('portfolio.title') }}
          </h2>
          <router-link 
            to="/portfolio" 
            class="text-accent hover:text-accent-light transition-colors flex items-center gap-1"
          >
            {{ t('portfolio.viewProject') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="bg-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div class="h-48 bg-gray-700 animate-pulse"></div>
            <div class="p-6">
              <div class="h-6 bg-gray-700 rounded w-3/4 mb-4 animate-pulse"></div>
              <div class="h-4 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
              <div class="h-4 bg-gray-700 rounded w-5/6 mb-6 animate-pulse"></div>
              <div class="flex gap-2 mb-4">
                <div v-for="j in 3" :key="j" class="h-6 bg-gray-700 rounded px-3 animate-pulse"></div>
              </div>
              <div class="h-10 bg-gray-700 rounded w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="py-16 bg-secondary">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-12">
          <h2 class="text-3xl font-bold text-text-primary">
            {{ t('blog.title') }}
          </h2>
          <router-link 
            to="/blog" 
            class="text-accent hover:text-accent-light transition-colors flex items-center gap-1"
          >
            {{ t('blog.readMore') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="i in 3" :key="i" class="bg-primary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div class="h-48 bg-gray-700 animate-pulse"></div>
            <div class="p-6">
              <div class="h-6 bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
              <div class="h-4 bg-gray-700 rounded w-1/3 mb-4 animate-pulse"></div>
              <div class="h-4 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
              <div class="h-4 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
              <div class="h-4 bg-gray-700 rounded w-2/3 mb-4 animate-pulse"></div>
              <div class="h-8 bg-gray-700 rounded w-1/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
</style>
