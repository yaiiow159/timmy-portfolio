<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGlobalSearch } from '@/composables/useGlobalSearch'
import { useDebouncedWatch } from '@/composables/useDebouncedWatch'
import { blogService } from '@/services/blogService'
import { usePortfolioStore } from '@/store/portfolioStore'
import { buildProjectSearchIndexRow, filterProjectsByIndex } from '@/utils/projectSearch'
import type { Project } from '@/store/portfolioStore'
import type { BlogPost } from '@/store/blogStore'

const { t } = useI18n()
const router = useRouter()
const { isOpen, close } = useGlobalSearch()
const portfolioStore = usePortfolioStore()
const { projects: storeProjects } = storeToRefs(portfolioStore)

const projectSearchIndex = computed(() => storeProjects.value.map((p) => buildProjectSearchIndexRow(p)))

const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const blogResults = ref<BlogPost[]>([])
const projectResults = ref<Project[]>([])
const isSearching = ref(false)

async function ensureProjects() {
  if (storeProjects.value.length > 0) {
    return
  }
  await portfolioStore.fetchProjects()
}

function filterProjectsForQuery(q: string): Project[] {
  const s = q.trim().toLowerCase()
  if (!s) {
    return []
  }
  if (s.length < 2) {
    return []
  }
  return filterProjectsByIndex(projectSearchIndex.value, s, 5)
}

async function runSearch() {
  const q = query.value.trim()
  if (!q) {
    blogResults.value = []
    projectResults.value = []
    isSearching.value = false
    return
  }
  isSearching.value = true
  try {
    const [blogRes] = await Promise.all([
      blogService.getPosts({ search: q, limit: 5, mode: 'list', page: 1, sortBy: 'date', sortOrder: 'desc' }),
      ensureProjects()
    ])
    blogResults.value = blogRes.data
    projectResults.value = filterProjectsForQuery(q)
  } catch {
    blogResults.value = []
    projectResults.value = filterProjectsForQuery(q)
  } finally {
    isSearching.value = false
  }
}

useDebouncedWatch(query, () => {
  void runSearch()
}, 250)

watch(isOpen, async (open) => {
  if (open) {
    await ensureProjects()
    await nextTick()
    inputRef.value?.focus()
  } else {
    query.value = ''
    blogResults.value = []
    projectResults.value = []
  }
})

function onBackdropClick() {
  close()
}

function goBlog(id: string) {
  close()
  router.push(`/blog/${id}`)
}

function goProject(id: string) {
  close()
  router.push({ path: '/portfolio', query: { open: id } })
}

function onGlobalKey(e: KeyboardEvent) {
  if (!isOpen.value) {
    return
  }
  if (e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onGlobalKey)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onGlobalKey)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-show="isOpen"
      class="global-search-backdrop fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      :aria-label="t('globalSearch.title')"
      @click.self="onBackdropClick"
    >
      <div
        class="tech-card w-full max-w-lg overflow-hidden border border-accent/30 shadow-2xl"
        @click.stop
      >
        <div class="flex items-center gap-2 border-b border-accent/15 px-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="search"
            class="min-w-0 flex-1 bg-transparent text-text-primary placeholder:text-text-secondary/70 focus:outline-none"
            :placeholder="t('globalSearch.placeholder')"
            autocomplete="off"
            @keydown.stop
          />
          <button
            type="button"
            class="shrink-0 rounded-lg px-2 py-1 text-xs text-text-secondary hover:text-accent"
            @click="close"
          >
            Esc
          </button>
        </div>

        <div class="max-h-[min(60vh,28rem)] overflow-y-auto p-2">
          <p v-if="isSearching" class="px-2 py-4 text-center text-sm text-text-secondary">
            {{ t('blog.loading') }}
          </p>
          <div v-else-if="!query.trim()" class="px-2 py-6 text-center text-sm text-text-secondary">
            {{ t('globalSearch.hint') }}
          </div>
          <div v-else-if="!blogResults.length && !projectResults.length" class="px-2 py-6 text-center text-sm text-text-secondary">
            {{ t('globalSearch.noResults') }}
          </div>
          <template v-else>
            <div v-if="blogResults.length" class="mb-3">
              <h3 class="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {{ t('globalSearch.posts') }}
              </h3>
              <ul>
                <li v-for="post in blogResults" :key="post.id">
                  <button
                    type="button"
                    class="w-full rounded-lg px-3 py-2.5 text-left text-sm text-text-primary hover:bg-accent/15"
                    @click="goBlog(post.id)"
                  >
                    <span class="line-clamp-2 font-medium">{{ post.title }}</span>
                  </button>
                </li>
              </ul>
            </div>
            <div v-if="projectResults.length">
              <h3 class="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                {{ t('globalSearch.projects') }}
              </h3>
              <ul>
                <li v-for="project in projectResults" :key="project.id">
                  <button
                    type="button"
                    class="w-full rounded-lg px-3 py-2.5 text-left text-sm text-text-primary hover:bg-accent/15"
                    @click="goProject(project.id)"
                  >
                    <span class="line-clamp-2 font-medium">{{ project.title }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>
