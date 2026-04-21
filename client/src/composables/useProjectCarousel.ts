import type { Ref } from 'vue'
import type { Project } from '@/types/project'

/**
 * Manual project image carousel intervals with cleanup.
 */
export function useProjectCarousel(
  getProjects: () => Project[],
  projectCarouselIndices: Ref<Record<string, number>>,
  carouselIntervals: Ref<Record<string, number>>
) {
  function getProjectCarouselIndex(projectId: string): number {
    return projectCarouselIndices.value[projectId] || 0
  }

  function setProjectCarouselIndex(projectId: string, index: number): void {
    projectCarouselIndices.value[projectId] = index
  }

  function nextProjectImage(projectId: string): void {
    const project = getProjects().find((p) => p.id === projectId)
    if (!project || !project.imageUrl || (Array.isArray(project.imageUrl) && project.imageUrl.length <= 1))
      return

    const currentIndex = getProjectCarouselIndex(projectId)
    const nextIndex =
      (currentIndex + 1) % (Array.isArray(project.imageUrl) ? project.imageUrl.length : 1)
    setProjectCarouselIndex(projectId, nextIndex)
  }

  function prevProjectImage(projectId: string): void {
    const project = getProjects().find((p) => p.id === projectId)
    if (!project || !project.imageUrl || (Array.isArray(project.imageUrl) && project.imageUrl.length <= 1))
      return

    const currentIndex = getProjectCarouselIndex(projectId)
    const len = Array.isArray(project.imageUrl) ? project.imageUrl.length : 1
    const prevIndex = (currentIndex - 1 + len) % len
    setProjectCarouselIndex(projectId, prevIndex)
  }

  function startCarousel(projectId: string): void {
    const project = getProjects().find((p) => p.id === projectId)
    if (!project || !project.imageUrl || (Array.isArray(project.imageUrl) && project.imageUrl.length <= 1))
      return

    stopCarousel(projectId)

    carouselIntervals.value[projectId] = globalThis.setInterval(() => {
      nextProjectImage(projectId)
    }, 5000)
  }

  function stopCarousel(projectId: string): void {
    if (carouselIntervals.value[projectId]) {
      globalThis.clearInterval(carouselIntervals.value[projectId])
      delete carouselIntervals.value[projectId]
    }
  }

  function cleanupAllCarousels(): void {
    Object.keys(carouselIntervals.value).forEach((projectId) => {
      globalThis.clearInterval(carouselIntervals.value[projectId])
    })
  }

  return {
    getProjectCarouselIndex,
    setProjectCarouselIndex,
    nextProjectImage,
    prevProjectImage,
    startCarousel,
    stopCarousel,
    cleanupAllCarousels
  }
}
