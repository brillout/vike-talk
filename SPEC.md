Sections: Intro | Brief history | Why Vike > Architecture | Why Vike > DX | Vike Future | Future of Frameworks

==Slide==

Vike

Next.js/Nuxt alternative with a novel architecture

[tagline]

`name.com` | `bild.de` | Spline | `ecosia.de` | `focus.de` | Sourcegraph

===

Rom(uald Brillout)

- Creator of Vike

- Half French/German
  > @AI use flags emoji
- Grew up in Paris
- Studied Computer Science at the KIT (Karlsruhe)
- Lived in Berlin for 5 years
- Now living in Munich

> @me:
> - Who has heard of Vite before? Used it?
> - Who has heard of Vike before? Who has used Vike before?

> @me: don't hesitate to ask questions


==Slide==

# History

vite-plugin-ssr — Like Next.js/Nuxt but as do-one-thing-do-it-well Vite plugin

- 2021 (right after Vite 2 came out)

```js
pages/+onRenderHtml.js

TODO: fill this
```

```js
pages/+onRenderClient.js

TODO: fill this
```

- `renderPage()`

- Renamed to Vike

- Created extensions vike-react/vike-vue/vike-solid


==Slide==

# Architecture

- Control over integration
  - Any UI framework (React/Vue/Solid/...)
  - Data fetching tools (React Query, GraphQL, tRPC...)
  - Any server (Hono/Express.js/Fastify/Elysia/...)
  - Any deployment (Self-hosted/Cloudflare/Vercel/...)
  - Any render mode (SSR/SPA/SSG/
  - i18n

- Choice between:
  - Vike Extensions => Easy path
  - Manual integration => full control

- Confidence to build whatever you want
  - E.g. BurdaForward building a publishing framework

- Future proof
  - E.g. Gatsby's demise
  - Confidence for Vike team => confidence for users


==Slide==

# Low-level hooks

- Lots of hooks => lot's of power.

```js
+onCreateGlobalContext.js
```

```js
+onCreatePageContext.js
```

```js
+onBeforeRoute.js
```


==Slide==

# RPC

Versus Remix
RPC
> @AI: take example from https://github.com/brillout/telefunc/issues/212

==Slide==

# RPC

Versus Next.js
> @AI: take example of previous slide and compare it to a Next.js counterpart

- No environemnet mingling in same file


==Slide==

# Polished

- We care about details
- Bugs quickly fixed (usually under 24h)

==Slide==

# Open Source Pricing

- 100% MIT licensed
- As an Engineer, you never need a license — everthing works just like a free open source tool
- Only larger companies need a license
  - Pay only how much you can/want

- It isn't a bug, it's a feature
  - Companies pay a small amount and, in exchange, get a high-quality tool
  - No hidden fees — a truly free framework doesn't exist
    - Next.js is hard to self host
    - Astro is VC backed => they will have to make money at some point
    - Frameworks are complex to develop — donations alone cannot cover the cost

# Ecosystem

- Telefunc
- Photon


# Future

- Extensions, extensions, extensions
- Powerful extensions

> @me: I believe it's the future not only of Vike, but any framework will have to go down that route


# Why Vike

- Architecture (extensible core + powerful extensions)
- Next-gen DX
- Polished
- Vibrant ecosystem
- Transparent business model


## Slide

 - Vike team
 - Significant contributors
 - Join us
