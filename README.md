## Current talk

Currently deployed: [talk.vike.dev](https://talk.vike.dev) — this branch (`main`).

Previous talks: see [branches](https://github.com/brillout/vike-talk/branches).

> [!NOTE]
> To permanently deploy a branch:
> 1. Create a copy of this repository and name it `brillout/yyyy-conf-name` (GitHub doesn't allow same-repo forks)
> 1. `git remote add yyyy-conf-name git@github.com:brillout/yyyy-conf-name.git`
> 1. `git checkout yyyy-conf-name`
> 1. Set `on.push.branches` to `main` at [`.github/workflows/website.yml`](https://github.com/brillout/vike-talk/blob/main/.github/workflows/website.yml).
> 1. `git push yyyy-conf-name HEAD:main`
> 1. Enable GitHub Pages:
>    1. Select `gh-pages` branch
>    1. Custom domain `yyyy-conf-name.vike.dev`
>    1. Update DNS setting of `yyyy-conf-name.vike.dev`

## Slide Management

See `package.json` scripts.

## OBS editing

Masks for camera cutting on OBS:
 - `/assets/mask.png`
 - `/assets/mask2.png`
