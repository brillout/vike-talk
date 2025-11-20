// TODO: git revert af61d8f5d3cd2df22b25e62c6bd87483b4356e71

import { navigate } from 'vike/client/router'
import { getSlideNumber } from '../utils/getSlideNumber'

window.onkeydown = ({ code, shiftKey }) => {
  const { pathname } = window.location

  const slideNumber = getSlideNumber(pathname)
  let slideNumberNext = slideNumber

  if (['ArrowLeft', 'PageDown'].includes(code)) {
    if (shiftKey) {
      slideNumberNext++
    } else {
      slideNumberNext--
    }
  } else if (['ArrowRight', 'PageUp', 'Space'].includes(code)) {
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
