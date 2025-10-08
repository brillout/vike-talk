export { Layout }

import { usePageContext } from 'vike-react/usePageContext'
import './css/index.css'
import './LayoutDefault.css'
import React from 'react'
import { getSlideNumber } from '../utils/getSlideNumber'

const footerContent: { name: string; numberOfSlides: number }[] = [
  {
    name: 'Intro',
    numberOfSlides: 1,
  },
  {
    name: 'What is SSR',
    numberOfSlides: 1,
  },
  {
    name: 'SSR vs SPA',
    numberOfSlides: 1,
  },
  {
    name: 'Workshop',
    numberOfSlides: 1,
  },
  {
    name: 'SSR vs SSG',
    numberOfSlides: 1,
  },
  {
    name: 'Custom integration VS framework',
    numberOfSlides: 1,
  },
  {
    name: 'Vike',
    numberOfSlides: 5,
  },
]

function Layout({ children }: { children: React.ReactNode }) {
  const pageContext = usePageContext()
  /* Implement +style setting?
  const {style} = pageContext.config
  */
  const style = {}
  return (
    <div id="slide-wrapper">
      <div id="slide-content" style={style}>
        {children}
      </div>
      <Footer />
    </div>
  )
}

function Footer() {
  const pageContext = usePageContext()
  const { pathname } = pageContext.urlParsed
  const slideNumber = getSlideNumber(pathname)
  let slideNumberFooter = 0
  return (
    <div id="footer">
      <div id="footer-content">
        {footerContent.map(({ name, numberOfSlides }) => (
          <div key={name}>
            <div>{name}</div>
            <div className="footer-bullets">
              {' '}
              {Array(numberOfSlides)
                .fill(undefined)
                .map(() => {
                  slideNumberFooter++
                  const isCurrentSlide = slideNumberFooter === slideNumber
                  return !isCurrentSlide ? '○' : '●'
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
