import { navigate } from 'vike/client/router'
import { getSlideNumber } from './utils/getSlideNumber'

window.onkeydown = ({ code, shiftKey }) => {
  const { pathname } = window.location

  const slideNumber = getSlideNumber(pathname)
  let slideNumberNext = slideNumber

  if (['ArrowLeft'].includes(code)) {
    if (shiftKey) {
      slideNumberNext++
    } else {
      slideNumberNext--
    }
  } else if (['ArrowRight', 'Space'].includes(code)) {
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
