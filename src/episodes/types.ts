// The shape every episode fills in. The engine and the interface know nothing about any particular story.

export type Meters = Record<string, number>;
export type Flags = Record<string, string | boolean | undefined>;
/** Changes to apply to meters. Any meter left out is unchanged. */
export type Fx = Record<string, number | undefined>;

export type Env = 'study' | 'vault' | 'office' | 'night' | 'hall';
export type Beat = { who?: string; text: string };
export type Advisor = { id: string; name: string; role: string; text: string };

export type Option = {
  id: string;
  label: string;
  /** Past-tense summary for the record and the share card. */
  short: string;
  fx: Fx;
  set?: Flags;
  outcome: string | ((m: Meters, f: Flags) => string);
  /** Jump straight to this ending once the outcome has been read. */
  end?: string;
};

export type Scene = {
  id: string;
  num: string;
  title: string;
  date: string;
  place: string;
  env: Env;
  days?: number;
  skip?: (f: Flags, m: Meters) => boolean;
  beats: (f: Flags, m: Meters) => Beat[];
  /** At most three are seated in the room. An empty list skips the counsel step. */
  advisors: (f: Flags, m: Meters) => Advisor[];
  prompt: string;
  options: (f: Flags, m: Meters) => Option[];
};

export type MeterDef = { key: string; start: number; max?: number };

/** One meter as the player sees it, which is not always its true value. */
export type Reading = { key: string; label: string; value: number; unit?: string; low?: boolean };

export type Ending = { title: string; env: Env; text: (f: Flags, m: Meters) => string[] };

export type HistoryRow = {
  decision: string;
  scenes: string[];
  real: string;
  realShort: string;
  match: (f: Flags, picked: Record<string, Option>) => boolean;
};

export type FreeCase = { match: RegExp; who: string; text: string; fx: Fx };

export type Episode = {
  id: string;
  num: string;
  year: string;
  title: string;
  /** "P.V. Narasimha Rao" */
  you: string;
  /** "Rao": used in "Same as Rao". */
  short: string;
  hook: string;
  begin: string;
  duration: string;
  shareLine: string;
  decideHead: string;
  /** Names used in narration lines that belong to a seated advisor. */
  speakers: Record<string, string>;

  briefing: Beat[];
  meters: MeterDef[];
  /** The big number in the corner. */
  hero: (m: Meters, f: Flags) => Reading & { danger: boolean };
  /** The bars beside it. */
  gauges: (m: Meters, f: Flags) => Reading[];
  /** 0 is calm, 1 is critical. Drives the soundtrack and the red edge of the frame. */
  pressure: (m: Meters, f: Flags) => number;

  scenes: Scene[];
  /** Passage of time and forced events on arriving at a scene. */
  onEnter?: (scene: Scene, m: Meters, f: Flags) => { meters: Meters; flags: Flags; notes: string[] };
  /** Bookkeeping after a choice, for meters no option sets directly. */
  afterChoice?: (before: { m: Meters; f: Flags }, after: { m: Meters; f: Flags }) => Meters;
  lost: (m: Meters, f: Flags) => string | undefined;
  final: (m: Meters, f: Flags) => string;
  endings: Record<string, Ending>;

  history: HistoryRow[];
  afterwards: string;
  otherView: string;

  free: FreeCase[];
  fallback: { who: string; text: string };
};
