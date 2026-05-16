import type { OnPageTransitionEndAsync } from 'vike/types'
import { setIsNavigating } from './utils/navState'

export const onPageTransitionEnd: OnPageTransitionEndAsync = async () => {
  setIsNavigating(false)
  document.querySelector('body')?.classList.remove('page-is-transitioning')
}
