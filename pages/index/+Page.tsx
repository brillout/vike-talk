import React from 'react'

export default function Page() {
  return (
    <div className="slide">
      <h1>Vike Presentation</h1>
      <p>A Next.js/Nuxt alternative with a novel architecture</p>
      
      <div style={{ marginTop: '3rem' }}>
        <h2>Creator: Rom Brillout</h2>
        
        <div className="logos">
          <img src="https://vike.dev/icons/vike-square-gradient.svg" alt="Vike" className="logo" />
        </div>
        
        <ul style={{ fontSize: '1.3rem', maxWidth: '600px', margin: '2rem auto' }}>
          <li>Creator of Vike — a Next.js/Nuxt alternative with a novel architecture</li>
          <li>Used by bild.de, ecosia.de, focus.de, Sourcegraph</li>
          <li>Half French/German <span className="flags">🇫🇷🇩🇪</span></li>
          <li>Grew up in Paris</li>
          <li>Studied Computer Science at the KIT (Karlsruhe)</li>
          <li>Lived in Berlin for 5 years</li>
          <li>Now living in Munich</li>
        </ul>
      </div>
      
      <div className="speaker-notes">
        <strong>Speaker Notes:</strong><br/>
        - Who has heard of Vite before? Used it?<br/>
        - Who has heard of Vike before? Who has used Vike before?<br/>
        - Don't hesitate to ask questions
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <a href="/1" style={{ 
          color: 'white', 
          textDecoration: 'none', 
          background: 'rgba(255,255,255,0.2)', 
          padding: '1rem 2rem', 
          borderRadius: '8px',
          fontSize: '1.2rem'
        }}>
          Start Presentation →
        </a>
      </div>
    </div>
  )
}
