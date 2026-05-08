import { navigate } from 'vike/client/router'
import { getSlideNumber } from './utils/getSlideNumber'
import { nextStep, prevStep } from './utils/reveal'

// Keep the screen awake during the presentation
let wakeLock: WakeLockSentinel | null = null
async function acquireWakeLock() {
  if (!('wakeLock' in navigator)) {
    console.warn('[WakeLock] API not supported in this browser')
    return
  }
  try {
    wakeLock = await navigator.wakeLock.request('screen')
    console.log('[WakeLock] Acquired')
    wakeLock.addEventListener('release', () => console.log('[WakeLock] Released'))
  } catch (err) {
    console.error('[WakeLock] Failed to acquire:', err)
  }
}
acquireWakeLock()
// Re-acquire after the tab becomes visible again (wake lock is released on visibility change)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') acquireWakeLock()
})

const Digit = 'Digit'
let digitBuffer = ''

window.onkeydown = (event) => {
  const { code, shiftKey, altKey, ctrlKey, metaKey } = event

  if (code.startsWith(Digit)) {
    if (digitBuffer.length === 2) digitBuffer = ''
    digitBuffer += code.slice(Digit.length)
    navigate(`/${digitBuffer}`)
    return
  } else {
    digitBuffer = ''
  }

  // On my [Logitech R400 Presenter](https://www.logitech.com/de-de/shop/p/r400-wireless-presenter) the follow
  // - 'F5' => left button: "Launch slide show"
  // - 'Period' => right button: "Black screen"
  // Source: https://www.logitech.com/assets/65044/2/r400-laser-presentation-remote.pdf
  if (['Period', 'F5'].includes(code)) {
    event.preventDefault()
    toggleFullscreen()
    return
  }

  const { pathname } = window.location
  const slideNumber = getSlideNumber(pathname)
  let forward: boolean
  if (['ArrowLeft', 'PageUp'].includes(code)) {
    forward = false
  } else if (['ArrowRight', 'PageDown', 'Space'].includes(code)) {
    forward = true
  } else {
    return
  }

  // Any modifier (shift/alt/ctrl/meta) skips reveal steps and jumps slide-to-slide.
  const skipReveal = shiftKey || altKey || ctrlKey || metaKey

  let slideNumberNext = slideNumber
  if (skipReveal) {
    slideNumberNext += forward ? 1 : -1
  } else if (forward) {
    if (nextStep()) return
    slideNumberNext++
  } else {
    if (prevStep()) return
    slideNumberNext--
  }
  if (slideNumberNext !== slideNumber && slideNumberNext !== 0) {
    navigate(forward ? `/${slideNumberNext}` : `/${slideNumberNext}#last`)
  }
}

function toggleFullscreen(element: HTMLElement = document.documentElement): void {
  if (!document.fullscreenElement) {
    // Enter fullscreen
    element.requestFullscreen?.().catch((err) => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`)
    })
  } else {
    // Exit fullscreen
    document.exitFullscreen?.().catch((err) => {
      console.error(`Error attempting to exit fullscreen: ${err.message}`)
    })
  }
}
