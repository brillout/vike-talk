import React from 'react'

export default function Page() {
  return (
    <div className="slide">
      <h1>Brief History</h1>
      
      <h2>vite-plugin-ssr</h2>
      <p>Like Next.js/Nuxt but as do-one-thing-do-it-well Vite plugin</p>
      
      <div className="code-comparison">
        <div className="comparison-section">
          <h4>Server-side Rendering</h4>
          <pre><code>{`// pages/+onRenderHtml.js
export { onRenderHtml }

import { renderToString } from 'react-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'

async function onRenderHtml(pageContext) {
  const { Page, pageProps } = pageContext
  const pageHtml = renderToString(<Page {...pageProps} />)

  const documentHtml = escapeInject\`<!DOCTYPE html>
    <html>
      <head>
        <title>My Vike App</title>
      </head>
      <body>
        <div id="page-view">\${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>\`

  return {
    documentHtml,
    pageContext: {}
  }
}`}</code></pre>
        </div>
        
        <div className="comparison-section">
          <h4>Client-side Hydration</h4>
          <pre><code>{`// pages/+onRenderClient.js
export { onRenderClient }

import { hydrateRoot } from 'react-dom/client'

async function onRenderClient(pageContext) {
  const { Page, pageProps } = pageContext
  const container = document.getElementById('page-view')
  
  if (container.innerHTML === '' || !pageContext.isHydration) {
    const root = createRoot(container)
    root.render(<Page {...pageProps} />)
  } else {
    hydrateRoot(container, <Page {...pageProps} />)
  }
}`}</code></pre>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', fontSize: '1.3rem' }}>
        <p>• Renamed to <strong>Vike</strong> for marketing reasons</p>
      </div>
    </div>
  )
}
