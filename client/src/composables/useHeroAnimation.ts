import { onUnmounted, type Ref } from 'vue'

/**
 * Hero entrance animation chain with timeout cleanup on unmount.
 */
export function useHeroAnimation(animationComplete: Ref<boolean>) {
  const timers: ReturnType<typeof setTimeout>[] = []

  function schedule(fn: () => void, ms: number) {
    const id = setTimeout(fn, ms)
    timers.push(id)
  }

  function animateHeroElements() {
    schedule(() => {
      const profilePicture = document.querySelector('.profile-picture-inner') as HTMLElement
      if (profilePicture) {
        profilePicture.classList.add('animate-profile')
      }

      schedule(() => {
        const professionElement = document.querySelector('.profession-highlight') as HTMLElement
        if (professionElement) {
          professionElement.classList.add('animate-title')
        }

        const experienceBadge = document.querySelector('.experience-badge') as HTMLElement
        if (experienceBadge) {
          experienceBadge.classList.add('animate-badge')
        }

        schedule(() => {
          const description = document.querySelector('.hero-description') as HTMLElement
          if (description) {
            description.classList.add('animate-description')
          }

          schedule(() => {
            const ctaButtons = document.querySelectorAll('.cta-button')
            ctaButtons.forEach((button, index) => {
              schedule(() => {
                ;(button as HTMLElement).classList.add('animate-button')
              }, index * 200)
            })

            animationComplete.value = true
          }, 300)
        }, 300)
      }, 500)
    }, 300)
  }

  onUnmounted(() => {
    timers.forEach((id) => clearTimeout(id))
  })

  return { animateHeroElements }
}
