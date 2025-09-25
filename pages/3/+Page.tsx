import React from 'react'

export default function Page() {
  return (
    <div className="slide">
      <h1>Why Vike → DX</h1>
      <h2>Lots of hooks = lots of power</h2>
      
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto' }}>
        <h3>Powerful Hook System</h3>
        
        <pre><code>{`// +onCreateGlobalContext.js
export { onCreateGlobalContext }

import { createContext } from './database'
import { createAuth } from './auth'

async function onCreateGlobalContext() {
  const db = await createContext()
  const auth = createAuth(db)
  
  return {
    db,
    auth,
    // Available to all pages
    user: await auth.getCurrentUser()
  }
}`}</code></pre>

        <ul style={{ fontSize: '1.3rem', marginTop: '2rem' }}>
          <li><code>+onBeforeRender</code> - Data fetching</li>
          <li><code>+onAfterRender</code> - Cleanup & analytics</li>
          <li><code>+onPageTransitionStart</code> - Loading states</li>
          <li><code>+onPageTransitionEnd</code> - Animations</li>
          <li><code>+onCreateGlobalContext</code> - Global state</li>
          <li><code>+onRenderHtml</code> - Custom SSR</li>
          <li><code>+onRenderClient</code> - Custom hydration</li>
        </ul>
        
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <p><strong>Fine-grained control over every aspect of rendering</strong></p>
        </div>
      </div>
    </div>
  )
}
