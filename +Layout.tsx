export { Layout }

import { usePageContext } from 'vike-react/usePageContext'
import './css/index.css'
import './Layout.css'
import './components/Reveal.css'
import React from 'react'
import { getSlideNumber } from './utils/getSlideNumber'

function Layout({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext()
  /* Implement +style setting?
  const {style} = pageContext.config
  */
  const style = {}
  const { fullscreen, sections } = pageContext.config
  const noFooter = fullscreen || !sections
  const className = noFooter ? 'fullscreen' : undefined
  return (
    <div id="slide-wrapper" className={className}>
      <div id="slide-content" style={style}>
        {children}
      </div>
      {!noFooter && <Footer />}
    </div>
  )
}

function Footer() {
  const pageContext = usePageContext()
  const { pathname } = pageContext.urlParsed
  const slideNumber = getSlideNumber(pathname)
  let slideNumberFooter = 0
  return (
    <div id="footer" style={{ lineHeight: '1.2em' }}>
      <div id="footer-content">
        {pageContext.config.sections!.map(({ name, numberOfSlides }) => (
          <div key={name}>
            <a href={`/${slideNumberFooter + 1}`}>{name}</a>
            <div>
              {' '}
              {Array(numberOfSlides)
                .fill(undefined)
                .map((_, index) => {
                  slideNumberFooter++
                  const isCurrentSlide = slideNumberFooter === slideNumber
                  return (
                    <a key={index} href={`/${slideNumberFooter}`}>
                      {!isCurrentSlide ? '○' : '●'}
                    </a>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
