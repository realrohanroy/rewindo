# Contributing to Rewindo

Thanks for being here. Rewindo is a history game, so it needs two kinds of help: people who can build the game, and people who can get the history right. Both matter equally.

- [Ways to help](#ways-to-help)
- [Set up](#set-up)
- [Project layout](#project-layout)
- [Adding an episode](#adding-an-episode)
- [Content rules](#content-rules)
- [Changing the game](#changing-the-game)
- [Pull requests](#pull-requests)
- [Conduct](#conduct)

---

## Ways to help

| You are… | You could… |
|---|---|
| **A reader of history** | Check a script against its sources. Every script ends with a fact-check list marked **[verify]**. Pick one item, find the answer, open a [fact correction](../../issues/new?template=fact-correction.yml). |
| **A writer** | Propose or script an episode. No code needed for the script. |
| **A developer** | Pick up something from the [roadmap](README.md#roadmap), fix a bug, improve mobile layout or accessibility. |
| **A 3D or sound designer** | Better faces, rooms, lighting, a richer soundtrack. |
| **Bilingual** | Help translate, starting with Hindi. |
| **A player** | Play an episode and [tell us](../../issues/new?template=bug.yml) what broke, confused you, or felt unfair. |

Not sure where to start? Open an issue and say what you'd like to do. Someone will help you find a piece that fits.

---

## Set up

You need [Node.js](https://nodejs.org) 20 or later and Git.

```bash
git clone https://github.com/realrohanroy/rewindo.git
```

```bash
cd rewindo
```

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:5173. The page reloads as you edit.

Before you open a pull request, make sure this passes:

```bash
npm run build
```

It type-checks the whole project and builds it. There is no separate test suite yet, so **play through what you changed**, to at least one ending.

---

## Project layout

```
episodes/                    The scripts. Markdown, human-readable, every branch.
src/
  episodes/
    types.ts                 The Episode contract. Read this first.
    e1991.ts                 Episode 01 as game data
    e1975.ts                 Episode 02 as game data
    e1983.ts                 Episode 03 as game data
    index.ts                 The list of episodes shown on the title screen
  engine.ts                  Rules: entering scenes, applying choices, endings, free-text matching
  App.tsx                    Screens: title, briefing, scene, decision, ending, record
  audio.ts                   All sound, synthesised with the Web Audio API
  styles.css                 All styling
  world/
    World.tsx                Mounts the 3D view behind the interface
    stage.ts                 Camera, lighting, who is speaking, transitions
    rooms.ts                 The indoor rooms: study, vault, office, night, hall
    cricket.ts               Lord's: the dressing room and the ground
    people.ts                The characters
public/
  art/portraits/             Optional portrait photos, shown beside dialogue
docs/                        Images for the README
```

The important idea: **the engine and the screens know nothing about any particular story.** Everything specific to 1991 or 1975 lives in that episode's data file.

---

## Adding an episode

### 1. Pitch it

Open an [episode proposal](../../issues/new?template=episode-proposal.yml) before writing anything long. A good Rewindo moment has:

- **One person** who had to decide, and the authority to do it.
- **Real alternatives.** Choices people at the time actually argued for, not hindsight.
- **Advisors who disagreed.** Documented, ideally on the record.
- **Enough sources** to check the facts.
- **A clock or a pressure** that makes each decision cost something.

### 2. Write the script

Copy the structure of [`episodes/1991-two-weeks-of-dollars.md`](episodes/1991-two-weeks-of-dollars.md). A script has:

1. **Design notes:** what the player knows and doesn't, the meters, the flags.
2. **Briefing:** a few lines before the first scene.
3. **Scenes:** each with the situation, two or three advisors, a decision, and the consequence of each option.
4. **The free-text box:** the typed orders you expect and what happens.
5. **Endings**, each with a trigger.
6. **What really happened**, and **the other view**.
7. **A fact-check list** marked **[verify]**, and **sources**.

Open the script as a pull request on its own. It is much easier to review a story than code.

### 3. Turn it into data

Create `src/episodes/eYEAR.ts`. The shape is defined in [`src/episodes/types.ts`](src/episodes/types.ts). The parts that matter most:

```ts
export const E1984: Episode = {
  id: '1984',
  num: '03',
  year: '1984',
  title: 'A Short Title',
  you: 'Full Name',
  short: 'Surname',            // used in "Same as Surname"
  hook: 'One line of stakes.',
  begin: 'Button label',

  briefing: [{ text: '…' }],

  meters: [{ key: 'clock', start: 10 }, { key: 'support', start: 50 }],
  hero: (m) => ({ key: 'clock', label: 'Days left', value: m.clock, unit: 'days', danger: m.clock <= 3 }),
  gauges: (m) => [{ key: 'support', label: 'Support', value: m.support }],
  pressure: (m) => 1 - m.clock / 10,   // 0 calm … 1 critical; drives the soundtrack

  scenes: [ /* see below */ ],
  lost: (m) => (m.clock <= 0 ? 'out-of-time' : undefined),
  final: (m, f) => (f.bold ? 'gamble' : 'safe'),
  endings: { /* id → { title, env, text } */ },

  history: [ /* one row per decision: what really happened */ ],
  afterwards: '…',
  otherView: '…',
  free: [ /* typed orders you anticipate */ ],
  fallback: { who: 'An Advisor', text: 'A polite holding reply.' },
};
```

A scene:

```ts
{
  id: 's1',
  num: 'I',
  title: 'The Telegram',
  date: '3 June 1984',
  place: 'New Delhi',
  env: 'study',                        // study | vault | office | night | hall | dressing | ground
  skip: (f) => f.someFlag !== 'x',     // optional: only show on some paths
  beats: (f, m) => [{ text: 'Narration.' }, { who: 'You', text: 'A line.' }],
  advisors: () => [{ id: 'advisor-id', name: 'Name', role: 'Role', text: 'Advice.' }],
  prompt: 'What do you do?',
  options: () => [
    {
      id: 'A',
      label: 'What the player clicks',
      short: 'Past tense, for the record',
      fx: { support: -10 },            // meter changes
      set: { bold: true },             // flags later scenes can read
      outcome: 'What happens.\n\nA blank line starts a new subtitle.',
    },
  ],
}
```

Then add it to `src/episodes/index.ts`.

### 4. Seat the advisors

Each advisor `id` needs a look in [`src/world/people.ts`](src/world/people.ts). Give them the two or three features people recognise: headwear, hair, beard, glasses, build, dress. Check against reference photos. At most three advisors are seated per scene.

### 5. Play every ending

Play until you have reached every ending at least once. Check that skipped scenes are skipped, that meters can't get stuck, and that the record screen matches what you chose.

---

## Content rules

Rewindo deals with real people and contested events, some within living memory. Every episode follows these rules. Reviewers will hold pull requests to them.

1. **Dialogue is dramatised and says so.** Never present invented words as a quotation.
2. **No invented accusations.** Do not give a real person lines that accuse them of a crime the record does not support.
3. **Facts are checkable.** Dates, figures and outcomes come from published sources, listed in the script. If unsure, mark it **[verify]**.
4. **Show the other view.** Every episode includes the strongest honest case against the real decision.
5. **No glory for repression.** Authoritarian choices may "work" on the meters, as they sometimes did. The writing must still show what they cost.
6. **Victims are not scenery.** Violence reaches the player as testimony from someone who was there. The player never performs or directs it in detail.
7. **Composites where honesty needs them.** When a group, not a person, held a view, use a clearly fictional composite (like "The Veteran") rather than putting words in one real mouth.
8. **No communal or caste framing.** The free-text box refuses orders aimed at a community. Keep it that way.
9. **Sensitive episodes get outside review** from a historian of the period before they are published.

If you aren't sure whether something crosses a line, ask in the issue. That is a normal question here, not a failure.

---

## Changing the game

- **Keep the engine story-agnostic.** If you need episode-specific behaviour, add a hook to the `Episode` type (like `onEnter` or `afterChoice`) instead of an `if (ep.id === …)` in the engine.
- **Keep it light.** Rewindo has to load fast on a mid-range Android phone over mobile data. Think twice before adding a dependency, a texture or an audio file.
- **Respect reduced motion.** The game honours `prefers-reduced-motion`. New animation should too.
- **No tracking.** Don't add analytics, cookies or third-party scripts without discussing it in an issue first.

### Code style

- TypeScript, strict mode. `npm run build` must pass with no errors.
- Comments explain *why*, not *what*.
- Match the formatting of the file you are editing.

---

## Pull requests

1. **Open or find an issue first** for anything bigger than a small fix.
2. **Keep a pull request to one thing.** A script and its data file can be separate PRs.
3. **Write a clear description:** what changed, why, and how you checked it.
4. **For content changes, cite your sources** in the description.
5. **Screenshots help** for anything visual.

The pull request template has a short checklist. A maintainer will review, may ask for changes, and will merge when it is ready.

### Commit messages

Short summary line in the imperative, then a blank line, then the why if it isn't obvious.

```
Correct the gold tonnage in Episode 01

The script said 47 tonnes; the RBI's own history gives the exact figure.
Source: <book or document, with page or chapter>
```

---

## Conduct

Be kind, assume good faith, and argue about sources, not about people. History is contested; that is the point of the game. Personal attacks, harassment, or communal and caste hostility are not welcome here, in issues, pull requests or anywhere else in the project.

If something goes wrong, open an issue or contact the maintainers privately through GitHub.
