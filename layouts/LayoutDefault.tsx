import React from 'react'
import './LayoutDefault.css'

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  return (
    <div className="presentation-layout">
      <main className="slide-container">
        {children}
      </main>
      <nav className="slide-navigation">
        <a href="/" className="nav-link">Home</a>
        <a href="/1" className="nav-link">1</a>
        <a href="/2" className="nav-link">2</a>
        <a href="/3" className="nav-link">3</a>
        <a href="/4" className="nav-link">4</a>
        <a href="/5" className="nav-link">5</a>
        <a href="/6" className="nav-link">6</a>
        <a href="/7" className="nav-link">7</a>
      </nav>
    </div>
  )
}
