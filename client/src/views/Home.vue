<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { usePortfolioStore } from '@/store/portfolioStore'
import { useBlogStore } from '@/store/blogStore'

const { t } = useI18n()
const router = useRouter()
const portfolioStore = usePortfolioStore()
const blogStore = useBlogStore()
const isLoaded = ref(false)
const projectCarouselIndices = ref<Record<string, number>>({})
const activeSkillCategory = ref('all')

function getProjectCarouselIndex(projectId: string): number {
  return projectCarouselIndices.value[projectId] || 0
}

function setProjectCarouselIndex(projectId: string, index: number): void {
  projectCarouselIndices.value[projectId] = index
}

function nextProjectImage(projectId: string): void {
  const project = portfolioStore.featuredProjects.find(p => p.id === projectId)
  if (!project || !project.imageUrls || project.imageUrls.length <= 1) return
  
  const currentIndex = getProjectCarouselIndex(projectId)
  const nextIndex = (currentIndex + 1) % project.imageUrls.length
  setProjectCarouselIndex(projectId, nextIndex)
}

function prevProjectImage(projectId: string): void {
  const project = portfolioStore.featuredProjects.find(p => p.id === projectId)
  if (!project || !project.imageUrls || project.imageUrls.length <= 1) return
  
  const currentIndex = getProjectCarouselIndex(projectId)
  const prevIndex = (currentIndex - 1 + project.imageUrls.length) % project.imageUrls.length
  setProjectCarouselIndex(projectId, prevIndex)
}

onMounted(async () => {
  try {
    await Promise.all([
      portfolioStore.fetchFeaturedProjects(),
      blogStore.fetchPosts()
    ])
    
    portfolioStore.featuredProjects.forEach(project => {
      projectCarouselIndices.value[project.id] = 0
    })
    
    isLoaded.value = true
  } catch (error) {
    console.error('Error fetching data:', error)
    isLoaded.value = true
  }
})

const skillCategories = [
  {
    id: 'frontend',
    skills: [
      { name: 'Vue.js', icon: 'devicon-vuejs-plain colored' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
      { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain colored' }
    ]
  },
  {
    id: 'backend',
    skills: [
      { name: 'Java', icon: 'devicon-java-plain colored' },
      { name: 'Spring Boot', icon: 'devicon-spring-plain colored' },
      { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
      { name: 'Express', icon: 'devicon-express-original' }
    ]
  },
  {
    id: 'database',
    skills: [
      { name: 'MongoDB', icon: 'devicon-mongodb-plain colored' },
      { name: 'MySQL', icon: 'devicon-mysql-plain colored' },
      { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
      { name: 'Redis', icon: 'devicon-redis-plain colored' }
    ]
  },
  {
    id: 'devops',
    skills: [
      { name: 'AWS', icon: 'devicon-amazonwebservices-original colored' },
      { name: 'Docker', icon: 'devicon-docker-plain colored' },
      { name: 'Git', icon: 'devicon-git-plain colored' },
      { name: 'SVN', icon: 'devicon-subversion-plain' },
      { name: 'Jenkins', icon: 'devicon-jenkins-line' },
      { name: 'GitLab', icon: 'devicon-gitlab-plain colored' }
    ]
  },
  {
    id: 'monitoring',
    skills: [
      { name: 'JConsole', icon: 'devicon-java-plain' },
      { name: 'Grafana', icon: 'devicon-grafana-original colored' }
    ]
  },
  {
    id: 'systems',
    skills: [
      { name: 'Ubuntu', icon: 'devicon-ubuntu-plain colored' },
      { name: 'CentOS', icon: 'devicon-centos-plain' },
      { name: 'Windows', icon: 'devicon-windows8-original colored' }
    ]
  }
]

watch(() => activeSkillCategory.value, () => {
  setTimeout(() => {
    const skillItems = document.querySelectorAll('.skill-item')
    skillItems.forEach(item => {
      const htmlItem = item as HTMLElement;
      htmlItem.style.setProperty('opacity', '0');
      htmlItem.style.setProperty('transform', 'translateY(20px)');
    })
    
    setTimeout(() => {
      skillItems.forEach(item => {
        const htmlItem = item as HTMLElement;
        htmlItem.style.setProperty('opacity', '1');
        htmlItem.style.setProperty('transform', 'translateY(0)');
      })
    }, 50)
  }, 50)
})

</script>

<template>
  <div class="min-h-screen" v-if="isLoaded">
    <section class="relative py-20 md:py-32 overflow-hidden hero-section">
      <div class="container mx-auto px-4 relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="hero-title text-4xl md:text-6xl font-bold mb-6">
            <span class="block greeting-text">{{ t('home.greeting') }}</span>
            <div class="name-container inline-block">
              <span class="name-highlight">{{ t('home.name') }}</span>
            </div>
          </h1>
          <div class="profession-container mb-6">
            <h2 class="profession-highlight text-2xl md:text-3xl font-semibold">
              {{ t('home.title') }}
            </h2>
          </div>
          <p class="hero-description text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            {{ t('home.intro') }}
          </p>
          <div class="hero-cta flex flex-col sm:flex-row justify-center gap-6">
            <button 
              @click="router.push('/portfolio')" 
              class="cta-button primary-button"
            >
              {{ t('home.cta') }}
            </button>
            <button 
              @click="router.push('/contact')" 
              class="cta-button secondary-button"
            >
              {{ t('contact.title') }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="hero-bg-element top-right"></div>
      <div class="hero-bg-element bottom-left"></div>
      <div class="hero-bg-element center"></div>
    </section>
    
    <section class="py-16 bg-secondary skills-section">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-text-primary mb-4">
            {{ t('resume.skills') }}
          </h2>
          <div class="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </div>
        
        <div class="skills-filter flex flex-wrap justify-center gap-4 mb-10">
          <button 
            v-for="category in ['all', 'frontend', 'backend', 'database', 'devops', 'monitoring', 'systems']" 
            :key="category"
            @click="activeSkillCategory = category"
            :class="[
              'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md',
              activeSkillCategory === category 
                ? 'bg-accent text-white shadow-md' 
                : 'bg-secondary border border-accent/20 text-text-secondary hover:border-accent/50 hover:text-accent'
            ]"
          >
            {{ t(`skills.categories.${category}`) }}
          </button>
        </div>
        
        <div class="skills-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-items-center">
          <template v-if="activeSkillCategory === 'all'">
            <div 
              v-for="(skill, index) in skillCategories.flatMap(category => category.skills)"
              :key="`all-${skill.name}`"
              class="skill-item flex flex-col items-center transform hover:scale-110 transition-transform duration-300"
              :style="{ '--index': index }"
            >
              <div class="skill-icon w-16 h-16 flex items-center justify-center bg-primary rounded-lg mb-3 shadow-lg hover:shadow-xl transition-shadow">
                <i :class="[skill.icon, 'text-3xl text-accent']"></i>
              </div>
              <span class="skill-name text-sm text-text-secondary font-medium">{{ skill.name }}</span>
            </div>
          </template>
          
          <template v-else>
            <div 
              v-for="(skill, index) in skillCategories.find(c => c.id === activeSkillCategory)?.skills || []"
              :key="`cat-${activeSkillCategory}-${skill.name}`"
              class="skill-item flex flex-col items-center transform hover:scale-110 transition-transform duration-300"
              :style="{ '--index': index }"
            >
              <div class="skill-icon w-16 h-16 flex items-center justify-center bg-primary rounded-lg mb-3 shadow-lg hover:shadow-xl transition-shadow">
                <i :class="[skill.icon, 'text-3xl text-accent']"></i>
              </div>
              <span class="skill-name text-sm text-text-secondary font-medium">{{ skill.name }}</span>
            </div>
          </template>
        </div>
      </div>
    </section>
    
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-12">
          <h2 class="text-3xl font-bold text-text-primary">
            {{ t('portfolio.title') }}
          </h2>
          <button 
            @click="router.push('/portfolio')" 
            class="text-accent hover:text-accent-light transition-colors flex items-center gap-1 cursor-pointer"
          >
            {{ t('portfolio.viewProject') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-if="portfolioStore.isLoading" v-for="i in 3" :key="i" class="bg-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
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
          
          <div v-else v-for="project in portfolioStore.featuredProjects" :key="project.id" class="bg-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow project-card">
            <div class="h-48 relative overflow-hidden">
              <div v-if="project.imageUrls && project.imageUrls.length > 0" class="project-image-carousel h-full w-full">
                <div class="carousel-images h-full w-full" :style="{ transform: `translateX(-${getProjectCarouselIndex(project.id) * 100}%)` }">
                  <img 
                    v-for="(imageUrl, index) in project.imageUrls" 
                    :key="`${project.id}-img-${index}`"
                    :src="imageUrl" 
                    :alt="`${project.title} - Image ${index + 1}`"
                    class="w-full h-full object-cover"
                    style="position: absolute; top: 0; width: 100%;"
                    :style="{ left: `${index * 100}%` }"
                  />
                </div>
                
                <div v-if="project.imageUrls.length > 1" class="carousel-controls absolute inset-0 flex items-center justify-between z-10">
                  <button @click.prevent="prevProjectImage(project.id)" class="carousel-control carousel-prev ml-2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button @click.prevent="nextProjectImage(project.id)" class="carousel-control carousel-next mr-2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                <div v-if="project.imageUrls.length > 1" class="carousel-indicators absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                  <button 
                    v-for="(_, index) in project.imageUrls" 
                    :key="`${project.id}-indicator-${index}`"
                    @click="setProjectCarouselIndex(project.id, index)"
                    class="carousel-indicator w-2 h-2 rounded-full bg-white/50 hover:bg-white"
                    :class="{ 'bg-white': getProjectCarouselIndex(project.id) === index }"
                  ></button>
                </div>
              </div>
              
              <div v-else class="w-full h-full bg-gray-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2 text-text-primary">{{ project.title }}</h3>
              <p class="text-text-secondary mb-4">{{ project.description }}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span 
                  v-for="tech in project.technologies.slice(0, 3)" 
                  :key="tech"
                  class="px-2 py-1 bg-primary text-text-secondary text-sm rounded"
                >
                  {{ tech }}
                </span>
              </div>
              <div class="flex gap-4">
                <button 
                  v-if="project.liveUrl" 
                  @click="router.push(project.liveUrl)" 
                  class="flex-1 inline-flex justify-center items-center px-4 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors cursor-pointer"
                >
                  {{ t('portfolio.viewLive') }}
                </button>
                <button 
                  v-if="project.codeUrl" 
                  @click="router.push(project.codeUrl)" 
                  class="flex-1 inline-flex justify-center items-center px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-white font-medium rounded-lg transition-colors cursor-pointer"
                >
                  {{ t('portfolio.viewCode') }}
                </button>
                <button 
                  v-if="!project.liveUrl && !project.codeUrl" 
                  @click="router.push('/portfolio')" 
                  class="flex-1 inline-flex justify-center items-center px-4 py-2 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors cursor-pointer"
                >
                  {{ t('portfolio.viewProject') }}
                </button>
              </div>
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
          <button 
            @click="router.push('/blog')" 
            class="text-accent hover:text-accent-light transition-colors flex items-center gap-1 cursor-pointer"
          >
            {{ t('blog.viewAll') }}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-if="blogStore.isLoading" v-for="i in 3" :key="i" class="bg-primary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div class="h-48 bg-gray-700 animate-pulse"></div>
            <div class="p-6">
              <div class="h-6 bg-gray-700 rounded w-3/4 mb-4 animate-pulse"></div>
              <div class="h-4 bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
              <div class="h-4 bg-gray-700 rounded w-5/6 mb-6 animate-pulse"></div>
              <div class="h-10 bg-gray-700 rounded w-full animate-pulse"></div>
            </div>
          </div>
          
          <div v-else-if="blogStore.posts.length > 0" v-for="post in blogStore.posts.slice(0, 3)" :key="post.id" class="bg-primary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div class="h-48 relative overflow-hidden">
              <img 
                v-if="post.coverImage" 
                :src="post.coverImage" 
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div v-else class="w-full h-full bg-gray-700 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 14h5m5-4h5M5 8h5" />
                </svg>
              </div>
              <div class="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
                {{ new Date(post.date).toLocaleDateString() }}
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold mb-2 text-text-primary">{{ post.title }}</h3>
              <p class="text-text-secondary mb-4">{{ post.excerpt }}</p>
              <button 
                @click="router.push(`/blog/${post.id}`)" 
                class="inline-flex items-center text-accent hover:text-accent-light transition-colors cursor-pointer"
              >
                {{ t('blog.readMore') }}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H6" />
                </svg>
              </button>
            </div>
          </div>
          
          <div v-else class="col-span-3 text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 14h5m5-4h5M5 8h5" />
            </svg>
            <h3 class="text-xl font-semibold text-text-primary mb-2">{{ t('blog.noPosts') }}</h3>
            <p class="text-text-secondary">{{ t('blog.checkBack') }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero-section {
  position: relative;
  overflow: hidden;
  padding: 8rem 0;
}

.hero-title {
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.greeting-text {
  color: var(--text-primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 0.75rem;
}

.dark .greeting-text {
  color: #ffffff;
}

.light .greeting-text {
  color: #333333;
}

.name-container {
  margin-top: 0.5rem;
  display: inline-block;
}

.name-highlight {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--accent);
  color: white;
  border-radius: 0.75rem;
  transform: translateY(0);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.name-highlight::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: 0.5s;
}

.name-highlight:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.name-highlight:hover::after {
  left: 100%;
}

.profession-container {
  margin: 1.5rem 0;
}

.profession-highlight {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  position: relative;
  font-weight: 700;
  transform: translateY(0);
  transition: all 0.3s ease;
  text-shadow: none;
  box-shadow: none;
}

.dark .profession-highlight {
  color: transparent;
  background-image: linear-gradient(135deg, var(--accent), var(--accent-light));
  background-clip: text;
  -webkit-background-clip: text;
  text-shadow: 0 0 20px rgba(var(--accent-rgb), 0.3);
}

.light .profession-highlight {
  color: var(--accent-dark);
  text-shadow: 0 0 3px rgba(var(--accent-rgb), 0.2);
}

.profession-highlight:hover {
  transform: translateY(-2px);
}

.dark .profession-highlight:hover {
  text-shadow: 0 0 25px rgba(var(--accent-rgb), 0.4);
}

.light .profession-highlight:hover {
  text-shadow: 0 0 15px rgba(var(--accent-rgb), 0.3);
}

.hero-description {
  color: var(--text-secondary);
  max-width: 36rem;
  margin: 0 auto 2rem auto;
  line-height: 1.6;
}

.hero-cta {
  margin-top: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1.125rem;
  text-align: center;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.primary-button {
  background-color: var(--accent);
  color: white;
}

.primary-button:hover {
  background-color: var(--accent-light);
}

.secondary-button {
  background-color: transparent;
  color: var(--accent);
  border: 2px solid var(--accent);
}

.secondary-button:hover {
  background-color: rgba(var(--accent-rgb), 0.1);
}

.hero-bg-element {
  position: absolute;
  border-radius: 100%;
  filter: blur(60px);
}

.hero-bg-element.top-right {
  top: -6rem;
  right: -6rem;
  width: 24rem;
  height: 24rem;
  background-color: rgba(var(--accent-rgb), 0.3);
  animation: pulse-slow 8s infinite alternate;
}

.hero-bg-element.bottom-left {
  bottom: -6rem;
  left: -6rem;
  width: 24rem;
  height: 24rem;
  background-color: rgba(var(--accent-rgb), 0.3);
  animation: pulse-slow 8s infinite alternate-reverse;
}

.hero-bg-element.center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  max-width: 60rem;
  max-height: 24rem;
  background: radial-gradient(circle, rgba(var(--accent-rgb), 0.1), rgba(var(--accent-light-rgb), 0.05));
}

@keyframes pulse-slow {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  100% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}

.project-image-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-images {
  display: flex;
  transition: transform 0.3s ease;
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-images img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-controls {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.project-card:hover .carousel-controls {
  opacity: 1;
}

.carousel-indicator {
  transition: background-color 0.2s ease;
}

.skill-item {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.skill-icon {
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: box-shadow 0.3s ease;
}

.skill-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(var(--accent-rgb), 0.1), transparent);
  z-index: -1;
}

.skill-name {
  transition: color 0.3s ease;
}

.skill-item:hover .skill-name {
  color: var(--accent);
}

.skills-section {
  position: relative;
  overflow: hidden;
  border-radius: 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
}

.skills-filter button {
  position: relative;
  overflow: hidden;
}

.skills-filter button::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.skills-filter button:hover::after {
  left: 100%;
}

.skills-grid {
  padding: 1rem;
}
</style>
