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
| 3D scenes | Three.js | First-person view across the table from your advisors, in a room built for each decision. Runs in the browser, so the game is still a link, not a download. |
| Sound | Web Audio API, synthesised | Room drone, wall clock, typewriter, stamp and a heartbeat under 7 days of cover. No audio files yet. |
| Episode content | Typed data in `src/episode.ts` | Writers change text and numbers without touching the engine. |
| Rules | `src/engine.ts` | Meters, the passage of time, forced events, endings, and the free-text matcher. |
| Rooms and people | `src/world/` | `rooms.ts` builds the five locations, `people.ts` the characters, `stage.ts` the camera and lighting. |

A full game engine (Unity, Unreal, Godot) was considered and rejected for now: web exports are tens of megabytes, slow on mid-range Android phones, and awkward to share. Three.js gives real 3D inside the same web page.

## Characters and likeness

The characters are stylised 3D figures built from simple shapes. Each is defined in `src/world/people.ts` by the features people recognise someone by: headwear, hairline, beard, glasses, build and dress. Dr Manmohan Singh (blue turban, white beard, glasses) is recognisable at a glance. The others are approximations and should be checked against reference photos.

For true likeness there are two routes:

- **Sculpted or scanned heads (not built).** Commission a 3D head per character as a `.glb` file and load it in place of the primitive head.
- **Portrait photos beside the dialogue (slot ready).** Drop `public/art/portraits/<id>.jpg` (about 400×500) and it appears next to that advisor's words. Ids: `chandra`, `singh`, `fm-politician`, `venkitaramanan`, `verma`, `veteran`.

## Not built yet

- **AI for the free-text box.** "Do something else" currently matches typed orders against the pre-written cases in `src/engine.ts`. Anything else gets a holding reply.
- **"X% of players chose this".** Needs a backend to record choices.
- **Fact-check.** The script lists eight items to verify before public release.
