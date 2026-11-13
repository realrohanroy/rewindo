import type { Episode, Flags, Fx, Meters, Option, Reading } from './episodes/types';

export type Phase = 'title' | 'briefing' | 'card' | 'beats' | 'counsel' | 'decide' | 'outcome' | 'ending' | 'history';

/** What the player could see change: the difference between two sets of readings. */
export type Delta = { label: string; by: number; unit?: string };

export type Game = {
  ep: Episode;
  phase: Phase;
  idx: number;
  meters: Meters;
  flags: Flags;
  picked: Record<string, Option>;
  notes: string[];
  outcome?: { text: string; deltas: Delta[]; end?: string };
  ending?: string;
  freeUsed: boolean;
  freeReply?: { who: string; text: string; deltas: Delta[] };
};

export const newGame = (ep: Episode, phase: Phase = 'title'): Game => ({
  ep,
  phase,
  idx: -1,
  meters: Object.fromEntries(ep.meters.map((d) => [d.key, d.start])),
  flags: {},
  picked: {},
  notes: [],
  freeUsed: false,
});

function applyFx(ep: Episode, m: Meters, fx: Fx): Meters {
  const next = { ...m };
  for (const d of ep.meters) {
    const by = fx[d.key];
    if (by) next[d.key] = Math.max(0, Math.min(d.max ?? 100, m[d.key] + by));
  }
  return next;
}

export const readings = (ep: Episode, m: Meters, f: Flags): Reading[] => [ep.hero(m, f), ...ep.gauges(m, f)];

function diff(before: Reading[], after: Reading[]): Delta[] {
  return after
    .map((a) => ({ label: a.label, unit: a.unit, by: a.value - (before.find((b) => b.key === a.key)?.value ?? a.value) }))
    .filter((d) => d.by !== 0 && Math.abs(d.by) < 50);
}

/** Move to the next playable scene at or after `from`, applying the passage of time. */
export function enter(g: Game, from: number): Game {
  const { ep } = g;
  let idx = from;
  while (idx < ep.scenes.length && ep.scenes[idx].skip?.(g.flags, g.meters)) idx++;
  if (idx >= ep.scenes.length) return { ...g, phase: 'ending', ending: ep.final(g.meters, g.flags) };

  const arrived = ep.onEnter?.(ep.scenes[idx], g.meters, g.flags) ?? { meters: g.meters, flags: g.flags, notes: [] };
  const base: Game = { ...g, idx, ...arrived, outcome: undefined, freeUsed: false, freeReply: undefined };
  const end = ep.lost(base.meters, base.flags);
  return end ? { ...base, phase: 'ending', ending: end } : { ...base, phase: 'card' };
}

export function choose(g: Game, opt: Option): Game {
  const { ep } = g;
  const flags = { ...g.flags, ...opt.set };
  let meters = applyFx(ep, g.meters, opt.fx);
  meters = ep.afterChoice?.({ m: g.meters, f: g.flags }, { m: meters, f: flags }) ?? meters;
  return {
    ...g,
    meters,
    flags,
    picked: { ...g.picked, [ep.scenes[g.idx].id]: opt },
    outcome: {
      text: typeof opt.outcome === 'function' ? opt.outcome(meters, flags) : opt.outcome,
      deltas: diff(readings(ep, g.meters, g.flags), readings(ep, meters, flags)),
      end: opt.end,
    },
    freeReply: undefined,
    phase: 'outcome',
  };
}

export function afterOutcome(g: Game): Game {
  const end = g.outcome?.end ?? g.ep.lost(g.meters, g.flags);
  if (end) return { ...g, phase: 'ending', ending: end };
  return enter(g, g.idx + 1);
}

const OFF_LIMITS = /\b(kill|murder|assassinat|riot|bomb|shoot|torture|muslim|hindu|sikh|christian|caste)\b/i;

/**
 * "Do something else" box. In this prototype there is no language model behind it:
 * typed orders are matched against each episode's pre-authored cases.
 */
export function freeText(g: Game, input: string): Game {
  const { ep } = g;
  if (OFF_LIMITS.test(input))
    return {
      ...g,
      freeReply: {
        who: 'Rewindo',
        text: 'That is outside what this episode will simulate. Choose from the options on the file.',
        deltas: [],
      },
    };
  const hit = ep.free.find((c) => c.match.test(input));
  if (!hit) return { ...g, freeReply: { ...ep.fallback, deltas: [] } };
  const meters = applyFx(ep, g.meters, hit.fx);
  return {
    ...g,
    meters,
    freeUsed: true,
    freeReply: {
      who: hit.who,
      text: hit.text,
      deltas: diff(readings(ep, g.meters, g.flags), readings(ep, meters, g.flags)),
    },
  };
}
