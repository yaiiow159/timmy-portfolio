import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../store/authStore'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { transition: 'slide-up' }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/Blog.vue'),
    meta: { transition: 'fade-in' }
  },
  {
    path: '/blog/:id',
    name: 'BlogPost',
    component: () => import('../views/BlogPost.vue'),
    meta: { transition: 'fade-in' }
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: () => import('../views/Portfolio.vue'),
    meta: { transition: 'slide-up' }
  },
  {
    path: '/resume',
    name: 'Resume',
    component: () => import('../views/Resume.vue'),
    meta: { transition: 'fade-in' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/Contact.vue'),
    meta: { transition: 'slide-up' }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue'),
    meta: { transition: 'fade-in' }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true, transition: 'fade-in' },
    children: [
      {
        path: '',
        redirect: { name: 'AdminDashboard' }
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue')
      },
      {
        path: 'posts',
        name: 'AdminPosts',
        component: () => import('../views/admin/Posts.vue')
      },
      {
        path: 'posts/new',
        name: 'AdminNewPost',
        component: () => import('../views/admin/EditPost.vue')
      },
      {
        path: 'posts/:id',
        name: 'AdminEditPost',
        component: () => import('../views/admin/EditPost.vue')
      },
      {
        path: 'projects',
        name: 'AdminProjects',
        component: () => import('../views/admin/Projects.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { transition: 'fade-in' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({ name: 'Auth' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
