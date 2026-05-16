import type { OnPageTransitionStartAsync } from 'vike/types'
import { setIsNavigating } from './utils/navState'

export const onPageTransitionStart: OnPageTransitionStartAsync = async () => {
  setIsNavigating(true)
  document.querySelector('body')?.classList.add('page-is-transitioning')
}
