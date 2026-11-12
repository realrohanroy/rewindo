import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { sound } from './audio';
import { afterOutcome, choose, enter, freeText, isLost, newGame, type Game } from './engine';
import {
  AFTERWARDS,
  BRIEFING,
  ENDINGS,
  FERTILISER_LINE,
  HISTORY,
  METER_LABEL,
  OTHER_VIEW,
  SCENES,
  type Advisor,
  type Beat,
  type Env,
  type Meters,
  type Option,
} from './episode';

/* ---------- art slots: drop real images in /public/art and they replace the placeholders ---------- */

function useArt(src: string) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    setOk(false);
    const img = new Image();
    img.onload = () => setOk(true);
    img.src = src;
    return () => {
      img.onload = null;
    };
  }, [src]);
  return ok ? src : null;
}

function Portrait({ id, name }: { id: string; name: string }) {
  const art = useArt(`/art/portraits/${id}.jpg`);
  const initials = name
    .replace(/^(Dr|The)\s+/i, '')
    .split(/[\s.]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
  return (
    <div className="portrait" aria-hidden="true">
      {art ? (
        <img src={art} alt="" />
      ) : (
        <>
          <svg viewBox="0 0 100 120" preserveAspectRatio="xMidYMax slice">
            <circle cx="50" cy="44" r="22" />
            <path d="M8 120c0-30 18-46 42-46s42 16 42 46z" />
          </svg>
          <span>{initials}</span>
        </>
      )}
    </div>
  );
}

function Backdrop({ env }: { env: Env }) {
  const art = useArt(`/art/scenes/${env}.jpg`);
  return (
    <div className={`env env-${env}`} aria-hidden="true">
      <div className="wash" key={env} />
      {art && <img className="plate" key={art} src={art} alt="" />}
      {!art && <div className="prop" key={`${env}-prop`} />}
      {!art && env === 'office' && <div className="fan" />}
      <div className="haze" />
      <div className="grain" />
      <div className="vignette" />
    </div>
  );
}

/* ---------- typewriter text ---------- */

function Typed({ text, skip, onDone }: { text: string; skip: boolean; onDone: () => void }) {
  const [n, setN] = useState(0);
  const cb = useRef(onDone);
  cb.current = onDone;
  const full = skip || n >= text.length;

  useEffect(() => {
    if (full) return;
    const t = window.setTimeout(() => {
      setN((m) => Math.min(text.length, m + 2));
      sound.key();
    }, 22);
    return () => window.clearTimeout(t);
  }, [n, full, text]);

  useEffect(() => {
    if (full) cb.current();
  }, [full]);

  return (
    <>
      {full ? text : text.slice(0, n)}
      {!full && <span className="caret" />}
    </>
  );
}

type Item = Beat & { advisor?: Advisor };

/** Reveals items one at a time. Click, Space or Enter skips the typing, then advances. */
function Reveal({ items, endLabel, onEnd }: { items: Item[]; endLabel: string; onEnd: () => void }) {
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(false);
  const last = i >= items.length - 1;
  const tail = useRef<HTMLButtonElement>(null);

  const advance = useCallback(() => {
    if (!done) return setSkip(true);
    if (last) return onEnd();
    setI((v) => v + 1);
    setDone(false);
    setSkip(false);
  }, [done, last, onEnd]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.code !== 'Enter') return;
      e.preventDefault();
      advance();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance]);

  useEffect(() => {
    tail.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [i, done]);

  const onDone = useCallback(() => setDone(true), []);

  return (
    <div className="reveal" onClick={advance}>
      {items.slice(0, i + 1).map((it, k) => {
        const body = k < i ? it.text : <Typed text={it.text} skip={skip} onDone={onDone} />;
        if (it.advisor)
          return (
            <div className="counsel" key={k}>
              <Portrait id={it.advisor.id} name={it.advisor.name} />
              <div>
                <div className="who">
                  {it.advisor.name} <em>{it.advisor.role}</em>
                </div>
                <p className="quote">“{body}”</p>
              </div>
            </div>
          );
        if (it.who)
          return (
            <p className="line" key={k}>
              <span className="who">{it.who}</span>
              {body}
            </p>
          );
        return (
          <p className="narration" key={k}>
            {body}
          </p>
        );
      })}
      <button className="next" ref={tail} tabIndex={-1}>
        {!done ? 'Skip' : last ? endLabel : 'Continue'} <span>▸</span>
      </button>
    </div>
  );
}

/* ---------- HUD ---------- */

function Deltas({ fx }: { fx: Partial<Meters> }) {
  const keys = (Object.keys(fx) as (keyof Meters)[]).filter((k) => fx[k] && Math.abs(fx[k]!) < 50);
  if (!keys.length) return null;
  return (
    <div className="deltas">
      {keys.map((k) => {
        const v = fx[k]!;
        return (
          <span key={k} className={v > 0 ? 'up' : 'down'}>
            {v > 0 ? '▲' : '▼'} {METER_LABEL[k]} {v > 0 ? '+' : '−'}
            {Math.abs(v)}
            {k === 'cover' ? (Math.abs(v) === 1 ? ' day' : ' days') : ''}
          </span>
        );
      })}
    </div>
  );
}

function Hud({ m, muted, onMute }: { m: Meters; muted: boolean; onMute: () => void }) {
  return (
    <header className={`hud ${m.cover <= 7 ? 'danger' : ''}`}>
      <div className="cover">
        <span className="label">Import cover</span>
        <span className="num" key={m.cover}>
          {m.cover}
        </span>
        <span className="unit">{m.cover === 1 ? 'day' : 'days'}</span>
      </div>
      <div className="gauges">
        {(['lender', 'capital', 'mood'] as const).map((k) => (
          <div className={`gauge ${m[k] < 25 ? 'low' : ''}`} key={k}>
            <span>{METER_LABEL[k]}</span>
            <i>
              <b style={{ width: `${m[k]}%` }} />
            </i>
          </div>
        ))}
      </div>
      <button className="mute" onClick={onMute} aria-label={muted ? 'Turn sound on' : 'Turn sound off'}>
        {muted ? 'Sound off' : 'Sound on'}
      </button>
    </header>
  );
}

/* ---------- screens ---------- */

function SceneCard({ g, onGo }: { g: Game; onGo: () => void }) {
  const s = SCENES[g.idx];
  useEffect(() => {
    sound.telex();
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        onGo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onGo]);
  return (
    <div className="card" onClick={onGo}>
      <div className="card-num">Scene {s.num}</div>
      <h2>{s.title}</h2>
      <div className="card-date">
        {s.place} · {s.date}
      </div>
      {g.notes.length > 0 && (
        <ul className="card-notes">
          {g.notes.map((n, i) => (
            <li key={i} style={{ animationDelay: `${0.9 + i * 0.5}s` }}>
              {n}
            </li>
          ))}
        </ul>
      )}
      <div className={`card-cover ${g.meters.cover <= 7 ? 'danger' : ''}`}>
        Import cover: <b>{g.meters.cover}</b> days
      </div>
      <button className="next" tabIndex={-1}>
        Enter <span>▸</span>
      </button>
    </div>
  );
}

function Decide({ g, setG }: { g: Game; setG: (g: Game) => void }) {
  const s = SCENES[g.idx];
  const options = s.options(g.flags);
  const [stamped, setStamped] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const dead = isLost(g.meters);

  const pick = (opt: Option) => {
    if (stamped) return;
    setStamped(opt.id);
    sound.stamp();
    window.setTimeout(() => setG(choose(g, opt)), 950);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const next = freeText(g, text.trim());
    if (isLost(next.meters)) sound.hit();
    setG(next);
    setText('');
    setOpen(false);
  };

  return (
    <div className={`decide ${stamped ? 'stamping' : ''}`}>
      <div className="file-head">For orders of the Prime Minister</div>
      <h3>{s.prompt}</h3>

      {g.freeReply && (
        <div className="reply">
          <div className="who">{g.freeReply.who}</div>
          <p>{g.freeReply.text}</p>
          <Deltas fx={g.freeReply.fx} />
        </div>
      )}

      {dead ? (
        <button className="primary" onClick={() => setG({ ...g, phase: 'ending', ending: dead })}>
          Continue ▸
        </button>
      ) : (
        <>
          <div className="options">
            {options.map((o) => (
              <button
                key={o.id}
                className={`option ${stamped === o.id ? 'chosen' : ''}`}
                onClick={() => pick(o)}
                disabled={!!stamped}
              >
                <span className="letter">{o.id}</span>
                <span className="text">{o.label}</span>
                {stamped === o.id && <span className="stamp">Ordered</span>}
              </button>
            ))}
          </div>

          {!stamped &&
            !g.freeUsed &&
            (open ? (
              <form className="free" onSubmit={submit}>
                <input
                  autoFocus
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your own order…"
                  maxLength={140}
                  aria-label="Type your own order"
                />
                <button type="submit">Issue</button>
              </form>
            ) : (
              <button className="free-toggle" onClick={() => setOpen(true)}>
                Do something else…
              </button>
            ))}
        </>
      )}
    </div>
  );
}

function Ending({ g, onNext }: { g: Game; onNext: () => void }) {
  const e = ENDINGS[g.ending!];
  useEffect(() => sound.hit(), []);
  const items: Item[] = e.text.map((text) => ({ text }));
  const survived = g.ending === 'holding' || g.ending === 'opening';
  if (survived && g.flags.fertiliser) items.push({ text: FERTILISER_LINE[g.flags.fertiliser] });
  return (
    <div className="ending">
      <div className="card-num">Your ending</div>
      <h2>{e.title}</h2>
      <Reveal items={items} endLabel="What really happened" onEnd={onNext} />
    </div>
  );
}

function History({ g, onReplay }: { g: Game; onReplay: () => void }) {
  const [copied, setCopied] = useState(false);
  const rows = HISTORY.map((r) => {
    const mine = r.scenes.map((id) => g.picked[id]).find(Boolean);
    return { ...r, mine: mine?.short ?? null, same: !!mine && r.match(g.flags, g.picked) };
  });
  const faced = rows.filter((r) => r.mine);
  const same = faced.filter((r) => r.same).length;
  const title = ENDINGS[g.ending!].title.toUpperCase();
  const share = [
    'REWINDO · 1991',
    'I was Narasimha Rao for six weeks.',
    '',
    ...faced.map((r) => (r.same ? `✔ ${r.mine} — like Rao` : `✘ ${r.mine} — ${r.raoShort}`)),
    '',
    `Ending: ${title}`,
    'What would you have done?',
  ].join('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(share);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="history">
      <div className="card-num">The record</div>
      <h2>What really happened</h2>
      <p className="tally">
        You made the same call as Rao on <b>{same}</b> of <b>{faced.length}</b> decisions.
      </p>
      <div className="rows">
        {rows.map((r) => (
          <div className={`row ${r.mine ? (r.same ? 'same' : 'diff') : 'none'}`} key={r.decision}>
            <div className="row-head">
              <span>{r.decision}</span>
              <em>{r.mine ? (r.same ? '✔ Same as Rao' : '✘ Different') : 'You never faced this'}</em>
            </div>
            {r.mine && (
              <p className="mine">
                <span>You</span> {r.mine}
              </p>
            )}
            <p className="rao">
              <span>Rao</span> {r.rao}
            </p>
          </div>
        ))}
      </div>
      <h4>Afterwards</h4>
      <p className="prose">{AFTERWARDS}</p>
      <h4>The other view</h4>
      <p className="prose">{OTHER_VIEW}</p>

      <pre className="share">{share}</pre>
      <div className="actions">
        <button className="primary" onClick={copy}>
          {copied ? 'Copied' : 'Copy to share'}
        </button>
        <button className="ghost" onClick={onReplay}>
          Play again
        </button>
      </div>
      <p className="fine">All dialogue is dramatised. Figures are being checked against published sources.</p>
    </div>
  );
}

/* ---------- app ---------- */

export default function App() {
  const [g, setG] = useState<Game>(newGame);
  const [muted, setMuted] = useState(false);
  const scene = g.idx >= 0 ? SCENES[g.idx] : null;

  useEffect(() => sound.setCover(g.meters.cover), [g.meters.cover]);

  const env: Env =
    g.phase === 'ending' ? ENDINGS[g.ending!].env : g.phase === 'history' ? 'study' : (scene?.env ?? 'study');

  const begin = () => {
    sound.start();
    setG({ ...g, phase: 'briefing' });
  };
  const go = useCallback((phase: Game['phase']) => setG((cur) => ({ ...cur, phase })), []);
  const toCard = useCallback(() => setG((cur) => enter(cur, 0)), []);
  const toBeats = useCallback(() => go('beats'), [go]);
  const toCounsel = useCallback(() => go('counsel'), [go]);
  const toDecide = useCallback(() => go('decide'), [go]);
  const toNext = useCallback(() => setG((cur) => afterOutcome(cur)), []);
  const toHistory = useCallback(() => go('history'), [go]);

  const showHud = !['title', 'briefing', 'history'].includes(g.phase);
  const key = `${g.phase}-${g.idx}`;

  return (
    <div className={`stage phase-${g.phase}`}>
      <Backdrop env={env} />
      {showHud && <Hud m={g.meters} muted={muted} onMute={() => setMuted(sound.toggle())} />}

      <main className="content" key={key}>
        {g.phase === 'title' && (
          <div className="title">
            <div className="brand">Rewindo · Episode 01</div>
            <h1>1991</h1>
            <div className="sub">Two Weeks of Dollars</div>
            <p className="you">
              You are <b>P.V. Narasimha Rao</b>, Prime Minister of India.
              <br />
              The country has fourteen days of foreign exchange left.
            </p>
            <button className="primary" onClick={begin}>
              Take the oath
            </button>
            <p className="fine">Best with sound on. About 15 minutes. All dialogue is dramatised.</p>
          </div>
        )}

        {g.phase === 'briefing' && <Reveal items={BRIEFING} endLabel="Open the file" onEnd={toCard} />}

        {g.phase === 'card' && <SceneCard g={g} onGo={toBeats} />}

        {g.phase === 'beats' && scene && (
          <Reveal items={scene.beats(g.flags)} endLabel="Hear your advisors" onEnd={toCounsel} />
        )}

        {g.phase === 'counsel' && scene && (
          <Reveal
            items={scene.advisors(g.flags).map((a) => ({ text: a.text, advisor: a }))}
            endLabel="Decide"
            onEnd={toDecide}
          />
        )}

        {g.phase === 'decide' && scene && <Decide g={g} setG={setG} />}

        {g.phase === 'outcome' && g.outcome && (
          <div className="outcome">
            <div className="file-head">{g.picked[scene!.id]?.label}</div>
            <Reveal
              items={g.outcome.text.split('\n\n').map((text) => ({ text }))}
              endLabel="Continue"
              onEnd={toNext}
            />
            <Deltas fx={g.outcome.fx} />
          </div>
        )}

        {g.phase === 'ending' && <Ending g={g} onNext={toHistory} />}

        {g.phase === 'history' && <History g={g} onReplay={() => setG(newGame())} />}
      </main>
    </div>
  );
}
