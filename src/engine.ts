import { SCENES, START, type EndingId, type Flags, type Meters, type Option } from './episode';

export type Phase = 'title' | 'briefing' | 'card' | 'beats' | 'counsel' | 'decide' | 'outcome' | 'ending' | 'history';

export type FreeReply = { who: string; text: string; fx: Partial<Meters> };

export type Game = {
  phase: Phase;
  idx: number;
  meters: Meters;
  flags: Flags;
  picked: Record<string, Option>;
  notes: string[];
  outcome?: { text: string; fx: Partial<Meters> };
  ending?: EndingId;
  freeUsed: boolean;
  freeReply?: FreeReply;
};

export const newGame = (): Game => ({
  phase: 'title',
  idx: -1,
  meters: { ...START },
  flags: {},
  picked: {},
  notes: [],
  freeUsed: false,
});

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function applyFx(m: Meters, fx: Partial<Meters>): Meters {
  return {
    cover: Math.max(0, m.cover + (fx.cover ?? 0)),
    lender: clamp(m.lender + (fx.lender ?? 0), 0, 100),
    capital: clamp(m.capital + (fx.capital ?? 0), 0, 100),
    mood: clamp(m.mood + (fx.mood ?? 0), 0, 100),
  };
}

function lost(m: Meters): EndingId | undefined {
  if (m.cover <= 0) return 'default';
  if (m.capital <= 0) return 'fall';
  return undefined;
}

function finalEnding(f: Flags): EndingId {
  const reforms = [
    f.licence === 'abolished',
    f.budget === 'bold',
    f.devalued === 'two_step' || f.devalued === 'one_shot',
  ].filter(Boolean).length;
  return reforms >= 2 ? 'opening' : 'holding';
}

/** Move to the next playable scene at or after `from`, applying the passage of time. */
export function enter(g: Game, from: number): Game {
  let idx = from;
  while (idx < SCENES.length && SCENES[idx].skip?.(g.flags)) idx++;
  if (idx >= SCENES.length) return { ...g, phase: 'ending', ending: finalEnding(g.flags) };

  const scene = SCENES[idx];
  let meters = g.meters;
  let flags = g.flags;
  const notes: string[] = [];

  if (scene.days > 0) {
    let days = scene.days;
    notes.push(`${scene.days} days of imports paid for.`);
    if (flags.fm === 'self') {
      days += 1;
      notes.push('You hold two portfolios. Decisions wait on your desk: 1 more day lost.');
    }
    if (meters.lender < 15) {
      days += 2;
      notes.push('Lenders have lost faith. Deposits are fleeing abroad: 2 more days lost.');
    }
    meters = applyFx(meters, { cover: -days });
    if (meters.mood < 25) {
      meters = applyFx(meters, { capital: -5 });
      notes.push('Anger in the streets is reaching your own MPs.');
    }
    if (flags.gold === 'refused' && meters.cover < 7) {
      meters = applyFx(meters, { cover: 6, mood: -15, capital: -5 });
      flags = { ...flags, gold: 'pledged' };
      notes.push(
        'With under a week of imports left, the Governor returns. This time there is no decision to make. The gold goes to London.',
      );
    }
  }

  const base: Game = {
    ...g,
    idx,
    meters,
    flags,
    notes,
    outcome: undefined,
    freeUsed: false,
    freeReply: undefined,
  };
  const end = lost(meters);
  return end ? { ...base, phase: 'ending', ending: end } : { ...base, phase: 'card' };
}

export function choose(g: Game, opt: Option): Game {
  const scene = SCENES[g.idx];
  return {
    ...g,
    meters: applyFx(g.meters, opt.fx),
    flags: { ...g.flags, ...opt.set },
    picked: { ...g.picked, [scene.id]: opt },
    outcome: { text: opt.outcome, fx: opt.fx },
    freeReply: undefined,
    phase: 'outcome',
  };
}

export function afterOutcome(g: Game): Game {
  const end = lost(g.meters);
  if (end) return { ...g, phase: 'ending', ending: end };
  return enter(g, g.idx + 1);
}

/**
 * "Do something else" box. In this prototype there is no language model behind it:
 * typed actions are matched against the pre-authored cases from the script.
 */
type FreeCase = { match: RegExp; who: string; text: string; fx: Partial<Meters>; ending?: EndingId };

const FREE_CASES: FreeCase[] = [
  {
    match: /\b(kill|riot|attack|bomb|arrest|jail|shoot|muslim|hindu|sikh|christian|caste)\b/i,
    who: 'Rewindo',
    text: 'That is outside what this episode will simulate. Choose from the options on the file.',
    fx: {},
  },
  {
    match: /soviet|ussr|moscow|russia|gorbachev/i,
    who: 'Naresh Chandra',
    text: 'Sir, Moscow is asking us about rupee trade credits. They have months left, not money. A day is gone finding that out.',
    fx: { cover: -1 },
  },
  {
    match: /print|mint|pay in rupees/i,
    who: 'S. Venkitaramanan',
    text: 'Oil is sold in dollars, Prime Minister. We cannot print those. We have lost a day discussing it.',
    fx: { cover: -1 },
  },
  {
    match: /freeze|block|lock|seize/i,
    who: 'S. Venkitaramanan',
    text: 'The order is drafted by noon and leaked by two. Every deposit we did not freeze is leaving on the next wire.',
    fx: { lender: -20 },
  },
  {
    match: /moratorium|stop paying|suspend (the )?(debt|payment)|default|refuse to pay/i,
    who: 'Naresh Chandra',
    text: 'It was discussed, sir, and rejected by everyone who has ever had to borrow again. If that is your order, I will send the telex.',
    fx: { cover: -99 },
    ending: 'default',
  },
  {
    match: /election|mandate|dissolve|resign/i,
    who: 'The Veteran',
    text: 'A campaign takes weeks. The importers will not wait for the counting. But you are the Prime Minister.',
    fx: { cover: -10, capital: 5 },
  },
  {
    match: /donat|appeal|citizen|people.*gold|temple/i,
    who: 'Naresh Chandra',
    text: 'People come forward. Bangles, coins, a wedding necklace. It is moving, sir. It is also about a day of oil.',
    fx: { mood: 10, cover: 1 },
  },
  {
    match: /privati|disinvest|sell.*(psu|public sector|compan|air india)/i,
    who: 'A.N. Verma',
    text: 'It is the right signal and the lenders will notice. But no buyer will wire money this quarter.',
    fx: { lender: 5 },
  },
  {
    match: /imf|world bank|washington/i,
    who: 'Naresh Chandra',
    text: 'The IMF is already in the room, sir. They are waiting to see what you do, which is why the options on this file exist.',
    fx: {},
  },
];

export function freeText(g: Game, input: string): Game {
  const hit = FREE_CASES.find((c) => c.match.test(input));
  if (!hit) {
    return {
      ...g,
      freeReply: {
        who: 'Naresh Chandra',
        text: 'I will have that examined, sir. For today, the file needs one of these orders.',
        fx: {},
      },
    };
  }
  const meters = applyFx(g.meters, hit.fx);
  const next: Game = { ...g, meters, freeUsed: true, freeReply: { who: hit.who, text: hit.text, fx: hit.fx } };
  return next;
}

export const isLost = lost;
