## Current talk

Currently deployed:
- [talk.vike.dev](https://talk.vike.dev) — [`2025-ct-webdev`](https://github.com/brillout/vike-talk/tree/2025-ct-webdev)

Permanently deployed:
- [2025-react-berlin.vike.dev](https://2025-react-berlin.vike.dev) — [React Berlin 2025](https://guild.host/events/react-berlin-meetup-6a789v) / [github.com/brillout/2025-react-berlin](https://github.com/brillout/2025-react-berlin)

> [!NOTE]
> To change the deployed branch, update `on.push.branches` at [`.github/workflows/website.yml`](https://github.com/brillout/vike-talk/blob/main/.github/workflows/website.yml).
>
> To permanently deploy, create a copy of this repository (GitHub doesn't allow same-repo forks) and set `on.push.branches` to `main` at [`.github/workflows/website.yml`](https://github.com/brillout/vike-talk/blob/main/.github/workflows/website.yml).

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
