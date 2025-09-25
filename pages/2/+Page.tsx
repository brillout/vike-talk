import React from 'react'

export default function Page() {
  return (
    <div className="slide">
      <h1>Why Vike → Architecture</h1>
      
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto' }}>
        <h2>Novel Architecture Principles</h2>
        
        <ul style={{ fontSize: '1.4rem', lineHeight: '1.8' }}>
          <li><strong>Do-one-thing-do-it-well philosophy</strong>
            <ul style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
              <li>Vike focuses solely on rendering</li>
              <li>Integrates seamlessly with Vite ecosystem</li>
              <li>No vendor lock-in</li>
            </ul>
          </li>
          
          <li><strong>Universal rendering approach</strong>
            <ul style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
              <li>SSR, SPA, SSG, or hybrid - your choice</li>
              <li>Per-page rendering strategy</li>
              <li>Progressive enhancement</li>
            </ul>
          </li>
          
          <li><strong>Flexible file structure</strong>
            <ul style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
              <li>No rigid conventions</li>
              <li>Organize files as you want</li>
              <li>Scales from simple to complex apps</li>
            </ul>
          </li>
          
          <li><strong>Framework agnostic</strong>
            <ul style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
              <li>Works with React, Vue, Svelte, Solid</li>
              <li>Or even vanilla JavaScript</li>
              <li>Mix and match as needed</li>
            </ul>
          </li>
        </ul>
        
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <h3>Result: Maximum flexibility with minimal complexity</h3>
        </div>
      </div>
    </div>
  )
}
