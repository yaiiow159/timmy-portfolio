<template>
  <div class="min-h-screen py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-text-primary mb-2">
          {{ isEditing ? t('admin.editPost') : t('admin.createPost') }}
        </h1>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>

      <BlogEditor
        v-else
        :post="currentPost as BlogPost"
        :is-editing="isEditing"
        @save="handleSave"
        @cancel="router.push('/admin/posts')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/store/blogStore'
import { useNotificationStore } from '@/store/notificationStore'
import BlogEditor from '@/components/blog/BlogEditor.vue'
import type { BlogPost } from '@/store/blogStore'
import { useAuthStore } from '@/store/authStore'
import api from '@/services/api'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const notificationStore = useNotificationStore()
const authStore = useAuthStore()

const isEditing = computed(() => !!route.params.id)
const isLoading = ref(false)
const currentPost = ref<Partial<BlogPost>>({
  title: '',
  content: '',
  excerpt: '',
  coverImage: '',
  tags: [],
  author: authStore.user?.name || 'Anonymous'
})

onMounted(async () => {

  if (isEditing.value) {
    try {
      isLoading.value = true
      const post = await blogStore.fetchPostById(route.params.id as string)
      
      if (post) {
        currentPost.value = {
          id: post.id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          coverImage: post.coverImage || '',
          tags: [...post.tags],
          author: post.author,
          date: post.date
        }
      }
    } catch (error) {
      console.error('Error loading post:', error)
      notificationStore.addNotification({
        type: 'error',
        message: t('admin.loadError'),
        duration: 5000
      })
      router.push('/admin/posts')
    } finally {
      isLoading.value = false
    }
  }
})

async function handleSave(postData: Partial<BlogPost>) {
  try {
    isLoading.value = true
    const completePostData = {
      title: postData.title || '',
      content: postData.content || '',
      excerpt: postData.content?.substring(0, 200).replace(/<[^>]*>/g, '') || '',
      coverImage: postData.coverImage || '',
      tags: postData.tags || [],
      date: currentPost.value.date || new Date().toISOString(),
      author: currentPost.value.author || authStore.user?.name || 'Anonymous'
    }

    if (isEditing.value && route.params.id) {
      await blogStore.updatePost(route.params.id as string, completePostData)
      notificationStore.addNotification({
        type: 'success',
        message: t('admin.postUpdated'),
        duration: 3000
      })
    } else {
      const response = await blogStore.createPost(completePostData)
      
      // 創建活動記錄
      await api.post('/activities', {
        type: 'POST_CREATED',
        title: '發布了新文章',
        description: `《${completePostData.title}》`,
        userName: authStore.user?.name ?? 'Anonymous',
        targetId: response.id,
        targetType: 'post'
      })
      
      notificationStore.addNotification({
        type: 'success',
        message: t('admin.postCreated'),
        duration: 3000
      })
    }

    router.push('/admin/posts')
  } catch (error) {
    console.error('Error saving post:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.saveError'),
      duration: 3000
    })
  } finally {
    isLoading.value = false
  }
}
</script>
