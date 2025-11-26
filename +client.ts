import { navigate } from 'vike/client/router'
import { getSlideNumber } from './utils/getSlideNumber'

window.onkeydown = (event) => {
  const { code, shiftKey } = event
  console.log('code', code)

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
  let slideNumberNext = slideNumber
  if (['ArrowLeft', 'PageUp'].includes(code)) {
    if (shiftKey) {
      slideNumberNext++
    } else {
      slideNumberNext--
    }
  } else if (['ArrowRight', 'PageDown', 'Space'].includes(code)) {
    if (shiftKey) {
      slideNumberNext--
    } else {
      slideNumberNext++
    }
  } else {
    return
  }
  if (slideNumberNext !== slideNumber && slideNumberNext !== 0) {
    navigate(`/${slideNumberNext}`)
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
