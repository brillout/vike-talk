## Current talk

Currently deployed:
- [talk.vike.dev](https://talk.vike.dev) — [`2025-ct-webdev`](https://github.com/brillout/vike-talk/tree/2025-ct-webdev)

Permanently deployed:
- [2025-ct-webdev](https://2025-ct-webdev.vike.dev) — [github.com/brillout/2025-ct-webdev](https://github.com/brillout/2025-ct-webdev)
- [2025-react-berlin.vike.dev](https://2025-react-berlin.vike.dev) — [React Berlin 2025](https://guild.host/events/react-berlin-meetup-6a789v) / [github.com/brillout/2025-react-berlin](https://github.com/brillout/2025-react-berlin)

> [!NOTE]
> Deployment:
> - To change the branch deployed to `talk.vike.dev`, update `on.push.branches` at [`.github/workflows/website.yml`](https://github.com/brillout/vike-talk/blob/main/.github/workflows/website.yml).
> - To permanently deploy a branch:
>   1. Create a copy of this repository and name it `brillout/yyyy-conf-name` (GitHub doesn't allow same-repo forks)
>   1. `git remote add yyyy-conf-name git@github.com:brillout/yyyy-conf-name.git`
>   1. `git checkout yyyy-conf-name`
>   1. Set `on.push.branches` to `main` at [`.github/workflows/website.yml`](https://github.com/brillout/vike-talk/blob/main/.github/workflows/website.yml).
>   1. `git push yyyy-conf-name main`
>   1. Enable GitHub Pages (select `gh-pages` branch)

## Talks

- [`2025-ct-webdev`](https://github.com/brillout/vike-talk/tree/2025-ct-webdev) — [c't `<webdev>` 2025](https://ct-webdev.com/agenda-2025/)
- [`2025-vite-conf`](https://github.com/brillout/vike-talk/tree/2025-vite-conf) — [ViteConf 2025](https://viteconf.amsterdam/workshops/)
- [`2025-react-berlin`](https://github.com/brillout/vike-talk/tree/2025-react-berlin) — [React Berlin 2025](https://guild.host/events/react-berlin-meetup-6a789v)
- [`2024-vite-conf`](https://github.com/brillout/vike-talk/tree/2024-vite-conf) — [ViteConf 2024](https://www.youtube.com/watch?v=jzjtDC31ZnI)

## Slide Management

```bash
# Insert a slide at position 5 (shifts all subsequent slides)
pnpm run slides:insert 5
```

## OBS editing

Masks for camera cutting on OBS:
 - `/assets/mask.png`
 - `/assets/mask2.png`
