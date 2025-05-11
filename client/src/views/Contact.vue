<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import gsap from 'gsap'
import { contactService } from '../services/contactService'
import { handleApiError } from '../services/api'
import { useNotificationStore } from '../store/notificationStore'

const { t } = useI18n()
const notificationStore = useNotificationStore()

const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})
const isSubmitting = ref(false)
const formError = ref('')
const formSuccess = ref(false)

onMounted(() => {
  const tl = gsap.timeline()
  
  tl.from('.contact-header', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  })
  .from('.contact-form', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    ease: 'power3.out'
  }, '-=0.3')
  .from('.contact-info', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    ease: 'power3.out'
  }, '-=0.3')
})

async function submitForm() {
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) {
    formError.value = t('contact.requiredFields') || '請填寫所有必填欄位'
    return
  }
  
  isSubmitting.value = true
  formError.value = ''
  
  try {
    const response = await contactService.sendMessage({
      name: contactForm.value.name,
      email: contactForm.value.email,
      subject: contactForm.value.subject,
      message: contactForm.value.message
    })
    
    console.log('表單提交成功:', response)
    
    contactForm.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
    
    formSuccess.value = true
    setTimeout(() => {
      formSuccess.value = false
    }, 5000)
  } catch (error) {
    console.error('提交表單時出錯:', error)
    const errorResult = handleApiError(error)
    formError.value = t('contact.sendError') || '發送失敗，請稍後再試'
    
    notificationStore.addNotification({
      type: errorResult.type,
      message: errorResult.message,
      duration: 5000
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen py-12">
    <div class="container mx-auto px-4">
      <div class="contact-header mb-12 text-center">
        <h1 class="text-4xl font-bold mb-4 text-text-primary">{{ t('contact.title') }}</h1>
        <p class="text-lg text-text-secondary max-w-2xl mx-auto">
          {{ t('contact.subtitle') }}
        </p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 contact-form">
          <div class="bg-secondary rounded-lg p-6 shadow-lg">
            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-text-secondary mb-1">
                    {{ t('contact.name') }} *
                  </label>
                  <input 
                    v-model="contactForm.name"
                    type="text" 
                    id="name"
                    class="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-text-secondary mb-1">
                    {{ t('contact.email') }} *
                  </label>
                  <input 
                    v-model="contactForm.email"
                    type="email" 
                    id="email"
                    class="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label for="subject" class="block text-sm font-medium text-text-secondary mb-1">
                  {{ t('contact.subject') }}
                </label>
                <input 
                  v-model="contactForm.subject"
                  type="text" 
                  id="subject"
                  class="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              
              <div>
                <label for="message" class="block text-sm font-medium text-text-secondary mb-1">
                  {{ t('contact.message') }} *
                </label>
                <textarea 
                  v-model="contactForm.message"
                  id="message"
                  rows="6"
                  class="w-full bg-primary border border-gray-700 rounded-lg py-3 px-4 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                ></textarea>
              </div>
              
              <div v-if="formError" class="text-red-500 text-sm">
                {{ formError }}
              </div>
              
              <div v-if="formSuccess" class="bg-green-900/20 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
                {{ t('contact.sendSuccess') || '訊息已成功發送！我會盡快回覆您。' }}
              </div>
              
              <div>
                <button 
                  type="submit"
                  class="w-full px-6 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting">{{ t('contact.sending') || '發送中...' }}</span>
                  <span v-else>{{ t('contact.send') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div class="contact-info">
          <div class="bg-secondary rounded-lg p-6 shadow-lg mb-8">
            <h3 class="text-xl font-semibold mb-6 text-accent">{{ t('contact.info') || '聯絡資訊' }}</h3>
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-text-primary mb-1">{{ t('contact.emailAddress') }}</h4>
                  <a href="mailto:examyou076@gmail.com" class="text-text-secondary hover:text-accent transition-colors">
                    examyou076@gmail.com
                  </a>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-text-primary mb-1">{{ t('contact.phone') }}</h4>
                  <a href="tel:+886920778600" class="text-text-secondary hover:text-accent transition-colors">
                    +886 092 077 8600
                  </a>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-text-primary mb-1">{{ t('contact.address') }}</h4>
                  <p class="text-text-secondary">
                    Taipei, Taiwan
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-secondary rounded-lg p-6 shadow-lg">
            <h3 class="text-xl font-semibold mb-6 text-accent">{{ t('contact.social') || '社群媒體' }}</h3>
            <div class="flex flex-wrap gap-4">
              <a href="https://github.com/yaiiow159" target="_blank" class="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/timmy-chung-46a132289" target="_blank" class="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-colors" aria-label="Line">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.819 4.588 8.845 10.56 9.608.386.083.922.258 1.056.593.121.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.049-3.856 2.049-5.993zm-18.452 2.25h-1.147v-4.596h1.147v4.596zm2.874 0h-1.147v-4.596h1.147v4.596zm2.873 0h-1.147v-4.596h1.147v4.596zm2.874 0h-1.147v-4.596h1.147v4.596z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
