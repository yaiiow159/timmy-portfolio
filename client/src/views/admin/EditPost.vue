<template>
  <div class="edit-post min-h-screen bg-primary dark:bg-primary-dark p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-text-primary dark:text-text-primary-light">
        {{ isEditing ? t('admin.editPost') : t('admin.createPost') }}
      </h1>
      
      <div class="flex space-x-2">
        <button 
          @click="$router.push({ name: 'AdminPosts' })"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-text-primary dark:text-text-primary-light hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {{ t('admin.cancel') }}
        </button>
      </div>
    </div>
    
    <BlogEditor
      :post="currentPost"
      :is-editing="isEditing"
      @save="savePost"
      @cancel="$router.push({ name: 'AdminPosts' })"
    />
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

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()
const notificationStore = useNotificationStore()
const authStore = useAuthStore()

const isEditing = computed(() => !!route.params.id)
const isSubmitting = ref(false)
const currentPost = ref<Partial<BlogPost>>({
  title: '',
  content: '',
  excerpt: '',
  coverImage: '',
  tags: []
})

async function savePost(postData: Partial<BlogPost>) {
  try {
    isSubmitting.value = true
    const basePostData: Omit<BlogPost, 'id'> = {
      title: postData.title || '',
      content: postData.content || '',
      excerpt: postData.excerpt || '',
      coverImage: postData.coverImage || '',
      tags: postData.tags || [],
      date: new Date().toISOString(),
      author: authStore.user?.name || 'Anonymous',
      comments: []
    }

    let savedPost: BlogPost
    if (isEditing.value && route.params.id) {
      savedPost = await blogStore.updatePost(route.params.id as string, basePostData)
    } else {
      savedPost = await blogStore.createPost(basePostData)
    }

    notificationStore.addNotification({
      type: 'success',
      message: t('admin.saveSuccess'),
      duration: 3000
    })

    router.push(`/blog/${savedPost.id}`)
  } catch (error) {
    console.error('Error saving post:', error)
    notificationStore.addNotification({
      type: 'error',
      message: t('admin.saveError'),
      duration: 3000
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  if (isEditing.value) {
    try {
      isSubmitting.value = true
      const post = await blogStore.fetchPostById(route.params.id as string)
      
      if (post) {
        currentPost.value = {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage || '',
          tags: [...post.tags]
        }
      }
    } catch (error) {
      console.error('Error loading post:', error)
      notificationStore.addNotification({
        type: 'error',
        message: t('admin.loadError'),
        duration: 5000
      })
      router.push({ name: 'AdminPosts' })
    } finally {
      isSubmitting.value = false
    }
  }
})
</script>
