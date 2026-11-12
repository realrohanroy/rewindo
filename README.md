# Rewindo

Step into the shoes of the people who made history's hardest calls.

Episode 01, **1991: Two Weeks of Dollars**, is playable. The script it is built from is in [episodes/1991-two-weeks-of-dollars.md](episodes/1991-two-weeks-of-dollars.md).

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Stack

| Layer | Choice | Why |
|---|---|---|
| App | Vite + React + TypeScript | Loads in about a second on a phone, shareable by link, no install. |
| Cinematics | CSS animation over layered stills | The episode is scenes, faces and text. A 3D engine adds load time and nothing else. |
| Sound | Web Audio API, synthesised | Room drone, wall clock, typewriter, stamp and a heartbeat under 7 days of cover. No audio files yet. |
| Episode content | Typed data in `src/episode.ts` | Writers change text and numbers without touching the engine. |
| Rules | `src/engine.ts` | Meters, the passage of time, forced events, endings, and the free-text matcher. |

A game engine (Unity, Unreal, Godot) was considered and rejected for now: web exports are tens of megabytes, slow on mid-range Android phones, and awkward to share. If a later episode needs real 3D, a single scene can be embedded with Three.js without changing the rest.

## Adding real faces and locations

The prototype draws placeholder silhouettes and lighting. Drop images at these paths and they replace the placeholders with no code change.

**Portraits** — `public/art/portraits/<id>.jpg`, portrait orientation, about 400×500:

`chandra` · `singh` · `fm-politician` · `venkitaramanan` · `verma` · `veteran`

**Scene plates** — `public/art/scenes/<env>.jpg`, landscape, about 2400×1350, dark enough for text to sit on:

| File | Scene |
|---|---|
| `study.jpg` | The PM's study at night, one desk lamp |
| `vault.jpg` | Reserve Bank vault or strongroom |
| `office.jpg` | South Block office, afternoon, blinds and ceiling fan |
| `night.jpg` | 7 Race Course Road after midnight |
| `hall.jpg` | Congress Parliamentary Party meeting |

Plates are automatically darkened and given a slow camera drift.

## Not built yet

- **AI for the free-text box.** "Do something else" currently matches typed orders against the pre-written cases in `src/engine.ts`. Anything else gets a holding reply.
- **"X% of players chose this".** Needs a backend to record choices.
- **Fact-check.** The script lists eight items to verify before public release.
