<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/store/themeStore.ts'
import { useLanguageStore } from '@/store/languageStore.ts'
import type { SupportedLanguage } from '@/store/languageStore.ts'
import { availableLocales } from '@/i18n'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()
const languageStore = useLanguageStore()

const isMenuOpen = ref(false)
const isLanguageMenuOpen = ref(false)

const navItems = ['home', 'blog', 'portfolio', 'resume', 'contact'] as const

const currentLanguage = computed(() =>
  availableLocales.find(locale => locale.code === languageStore.currentLanguage)?.name || 'English'
)

function getNavPath(item: string) {
  return item === 'home' ? '/' : `/${item}`
}

function isActive(item: string) {
  const path = getNavPath(item)
  return item === 'home' ? route.path === '/' : route.path.startsWith(path)
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) isLanguageMenuOpen.value = false
}

function toggleLanguageMenu() {
  isLanguageMenuOpen.value = !isLanguageMenuOpen.value
}

function changeLanguage(lang: SupportedLanguage) {
  languageStore.setLanguage(lang)
  isLanguageMenuOpen.value = false
}

function navigateTo(path: string) {
  router.push(path)
  isMenuOpen.value = false
}

function closeLanguageMenu() {
  isLanguageMenuOpen.value = false
}

// 點擊 navbar 外部自動關閉 language dropdown
function handleGlobalClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.navbar-lang-wrapper')) {
    closeLanguageMenu()
  }
}
onMounted(() => document.addEventListener('click', handleGlobalClick))
onUnmounted(() => document.removeEventListener('click', handleGlobalClick))
</script>

<template>
  <header class="navbar-root fixed w-full top-0 z-50">
    <nav class="container mx-auto px-5 py-0 flex justify-between items-stretch min-h-[60px]">
      <!-- Logo -->
      <div class="flex items-center">
        <router-link to="/" class="navbar-logo">
          Timmy
        </router-link>
      </div>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-stretch space-x-1">
        <router-link
          v-for="item in navItems"
          :key="item"
          :to="getNavPath(item)"
          class="navbar-link"
          :class="{ 'navbar-link--active': isActive(item) }"
        >
          {{ t(`nav.${item}`) }}
        </router-link>
      </div>

      <!-- Desktop controls -->
      <div class="hidden md:flex items-center space-x-3">
        <!-- Language dropdown -->
        <div class="relative navbar-lang-wrapper" @keydown.escape="closeLanguageMenu">
          <button
            @click="toggleLanguageMenu"
            class="navbar-ctrl-btn"
            :class="{ 'navbar-ctrl-btn--active': isLanguageMenuOpen }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.554-.6 19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-3.754 1 1 0 111.93-.534c.217.805.5 1.568.853 2.268.494-1.086.844-2.22 1.012-3.418H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clip-rule="evenodd"/>
            </svg>
            <span class="text-sm font-medium">{{ currentLanguage }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 opacity-60 transition-transform duration-200" :class="{ 'rotate-180': isLanguageMenuOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <Transition name="dropdown">
            <div v-if="isLanguageMenuOpen" class="navbar-dropdown">
              <button
                v-for="locale in availableLocales"
                :key="locale.code"
                @click="changeLanguage(locale.code as SupportedLanguage)"
                class="navbar-dropdown-item"
                :class="{ 'navbar-dropdown-item--active': locale.code === languageStore.currentLanguage }"
              >
                {{ locale.name }}
              </button>
            </div>
          </Transition>
        </div>

        <!-- Theme toggle -->
        <button @click="themeStore.toggleDarkMode" class="navbar-icon-btn" aria-label="Toggle dark mode">
          <svg v-if="themeStore.isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>

      <!-- Mobile controls -->
      <div class="md:hidden flex items-center space-x-3">
        <button @click="themeStore.toggleDarkMode" class="navbar-icon-btn" aria-label="Toggle dark mode">
          <svg v-if="themeStore.isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>

        <button @click="toggleMenu" class="navbar-icon-btn" aria-label="Toggle menu">
          <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div v-if="isMenuOpen" class="md:hidden navbar-mobile-panel">
        <div class="px-4 py-3 space-y-1">
          <button
            v-for="item in navItems"
            :key="item"
            @click="navigateTo(getNavPath(item))"
            class="navbar-mobile-link"
            :class="{ 'navbar-mobile-link--active': isActive(item) }"
          >
            {{ t(`nav.${item}`) }}
          </button>
        </div>

        <div class="px-4 pb-3 border-t border-white/10">
          <p class="text-xs text-text-secondary mt-3 mb-2 font-medium uppercase tracking-wider">{{ t('nav.language') }}</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="locale in availableLocales"
              :key="locale.code"
              @click="changeLanguage(locale.code as SupportedLanguage)"
              class="navbar-lang-pill"
              :class="{ 'navbar-lang-pill--active': locale.code === languageStore.currentLanguage }"
            >
              {{ locale.name }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </header>

  <div class="h-[60px]"></div>
</template>

<style scoped>
/* ── 外殼 glassmorphism ── */
.navbar-root {
  background: rgba(10, 10, 10, 0.75);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.12);
  box-shadow: 0 1px 24px rgba(0, 0, 0, 0.35);
  transition: background 0.3s;
}

:global(.light) .navbar-root {
  background: rgba(238, 242, 255, 0.82);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border-bottom-color: rgba(124, 58, 237, 0.15);
  box-shadow: 0 1px 16px rgba(109, 40, 217, 0.1);
}

/* ── Logo ── */
.navbar-logo {
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--accent);
  transition: color 0.2s, text-shadow 0.2s;
  text-decoration: none;
}
.navbar-logo:hover {
  color: var(--accent-light);
  text-shadow: 0 0 12px rgba(0, 212, 255, 0.5);
}
:global(.light) .navbar-logo { color: #7c3aed; }
:global(.light) .navbar-logo:hover { color: #6d28d9; text-shadow: 0 0 12px rgba(124,58,237,0.35); }

/* ── Desktop nav link ── */
.navbar-link {
  display: inline-flex;
  align-items: center;
  padding: 0 14px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  position: relative;
  transition: color 0.2s;
}
/* active 底線指示條 */
.navbar-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 14px;
  right: 14px;
  height: 2px;
  border-radius: 2px 2px 0 0;
  background: var(--accent);
  transform: scaleX(0);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.navbar-link:hover { color: var(--text-primary); }
.navbar-link--active {
  color: var(--accent);
  font-weight: 600;
}
.navbar-link--active::after { transform: scaleX(1); }

:global(.light) .navbar-link { color: #64748b; }
:global(.light) .navbar-link:hover { color: #1e1b4b; }
:global(.light) .navbar-link--active { color: #7c3aed; }
:global(.light) .navbar-link--active::after { background: #7c3aed; }

/* ── Control buttons ── */
.navbar-ctrl-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: rgba(var(--accent-rgb), 0.05);
  border: 1px solid rgba(var(--accent-rgb), 0.12);
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.navbar-ctrl-btn:hover,
.navbar-ctrl-btn--active {
  background: rgba(var(--accent-rgb), 0.1);
  border-color: rgba(var(--accent-rgb), 0.3);
  color: var(--accent);
}

.navbar-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}
.navbar-icon-btn:hover {
  background: rgba(var(--accent-rgb), 0.1);
  border-color: rgba(var(--accent-rgb), 0.2);
  color: var(--accent);
}

/* ── Language dropdown ──
   使用 CSS 變數取代 hardcoded 深色值，--bg-secondary-rgb 與 --accent-rgb
   已在 :root（dark）及 html.light 分別定義，主題切換自動生效 */
.navbar-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 150px;
  background: rgba(var(--bg-secondary-rgb), 0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(var(--accent-rgb), 0.2);
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(var(--accent-rgb), 0.08);
  z-index: 100;
}

.navbar-dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border-radius: 7px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.navbar-dropdown-item:hover {
  background: rgba(var(--accent-rgb), 0.1);
  color: var(--accent);
}
.navbar-dropdown-item--active {
  background: rgba(var(--accent-rgb), 0.12);
  color: var(--accent);
  font-weight: 600;
}

.navbar-mobile-panel {
  background: rgba(var(--bg-primary-rgb), 0.97);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-top: 1px solid rgba(var(--accent-rgb), 0.12);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.navbar-mobile-link {
  display: flex;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.navbar-mobile-link:hover { background: rgba(var(--accent-rgb), 0.08); color: var(--text-primary); }
.navbar-mobile-link--active { color: var(--accent); font-weight: 600; background: rgba(var(--accent-rgb), 0.1); }

.navbar-lang-pill {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: rgba(var(--accent-rgb), 0.06);
  border: 1px solid rgba(var(--accent-rgb), 0.15);
  cursor: pointer;
  transition: all 0.15s;
}
.navbar-lang-pill:hover { background: rgba(var(--accent-rgb), 0.12); border-color: rgba(var(--accent-rgb), 0.35); color: var(--accent); }
.navbar-lang-pill--active { background: rgba(var(--accent-rgb), 0.15); border-color: var(--accent); color: var(--accent); font-weight: 600; }

/* ── Dropdown transition ── */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* ── Mobile menu transition ── */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
