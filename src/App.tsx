import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { sound } from './audio';
import { afterOutcome, choose, enter, freeText, newGame, type Delta, type Game } from './engine';
import { EPISODES } from './episodes';
import type { Advisor, Beat, Env, Episode, Option } from './episodes/types';
import type { Focus } from './world/stage';
import { World } from './world/World';

/* ---------- art slot: a real portrait dropped in /public/art/portraits appears beside that advisor's words ---------- */

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

function Portrait({ id }: { id: string }) {
  const art = useArt(`${import.meta.env.BASE_URL}art/portraits/${id}.jpg`);
  if (!art) return null;
  return (
    <div className="portrait" aria-hidden="true">
      <img src={art} alt="" />
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

type RevealProps = {
  items: Item[];
  endLabel: string;
  onEnd: () => void;
  /** Show only the current item, like a subtitle, so the room stays visible. */
  single?: boolean;
  onItem?: (item: Item) => void;
};

/** Reveals items one at a time. Click, Space or Enter skips the typing, then advances. */
function Reveal({ items, endLabel, onEnd, single, onItem }: RevealProps) {
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

  const current = items[i];
  useEffect(() => onItem?.(current), [current, onItem]);

  return (
    <div className="reveal" onClick={advance}>
      {items.map((it, k) => {
        if (k > i || (single && k < i)) return null;
        const body = k < i ? it.text : <Typed text={it.text} skip={skip} onDone={onDone} />;
        if (it.advisor)
          return (
            <div className="counsel" key={k}>
              <Portrait id={it.advisor.id} />
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

function Deltas({ deltas }: { deltas: Delta[] }) {
  if (!deltas.length) return null;
  return (
    <div className="deltas">
      {deltas.map((d) => (
        <span key={d.label} className={d.by > 0 ? 'up' : 'down'}>
          {d.by > 0 ? '▲' : '▼'} {d.label} {d.by > 0 ? '+' : '−'}
          {Math.abs(d.by)}
          {d.unit?.startsWith('day') ? (Math.abs(d.by) === 1 ? ' day' : ' days') : ''}
        </span>
      ))}
    </div>
  );
}

/** Asks before leaving, since an episode can't be resumed. Holds the keyboard while open so Space doesn't advance the story underneath. */
function ExitConfirm({ title, onLeave, onStay }: { title: string; onLeave: () => void; onStay: () => void }) {
  const stay = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    stay.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      // No key reaches the game while this is open. Tab, and Enter/Space on a focused button, keep their default action.
      e.stopImmediatePropagation();
      if (e.code === 'Escape') return onStay();
      const pressesButton = e.target instanceof HTMLButtonElement && (e.code === 'Enter' || e.code === 'Space');
      if (e.code !== 'Tab' && !pressesButton) e.preventDefault();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onStay]);
  return (
    <div className="exit-backdrop" onClick={onStay}>
      <div className="exit-dialog" role="dialog" aria-modal="true" aria-labelledby="exit-title" onClick={(e) => e.stopPropagation()}>
        <div className="file-head">Leave the episode</div>
        <h3 id="exit-title">Walk away from {title}?</h3>
        <p>Your choices so far will be lost. You can start any episode again from the beginning.</p>
        <div className="actions">
          <button className="primary" onClick={onLeave}>
            Leave
          </button>
          <button className="ghost" ref={stay} onClick={onStay}>
            Stay
          </button>
        </div>
      </div>
    </div>
  );
}

function Hud({ g, muted, onMute, onExit }: { g: Game; muted: boolean; onMute: () => void; onExit: () => void }) {
  const hero = g.ep.hero(g.meters, g.flags);
  return (
    <header className={`hud ${hero.danger ? 'danger' : ''}`}>
      <div className="cover">
        <span className="label">{hero.label}</span>
        <span className="num" key={hero.value}>
          {hero.value}
        </span>
        <span className="unit">{hero.unit}</span>
      </div>
      <div className="gauges">
        {g.ep.gauges(g.meters, g.flags).map((r) => (
          <div className={`gauge ${r.low ? 'low' : ''}`} key={r.key}>
            <span key={r.label}>{r.label}</span>
            <i>
              <b style={{ width: `${r.value}%` }} />
            </i>
          </div>
        ))}
      </div>
      <div className="hud-buttons">
        <button className="mute" onClick={onMute} aria-label={muted ? 'Turn sound on' : 'Turn sound off'}>
          {muted ? 'Sound off' : 'Sound on'}
        </button>
        <button className="mute exit" onClick={onExit} title="Leave this episode (Esc)">
          Exit
        </button>
      </div>
    </header>
  );
}

/* ---------- screens ---------- */

function Title({ onBegin }: { onBegin: (ep: Episode) => void }) {
  return (
    <div className="title">
      <div className="brand">Rewindo</div>
      <p className="pitch">Sit in their chair. Make their call.</p>
      <div className="episodes">
        {EPISODES.map((ep) => (
          <button className="episode" key={ep.id} onClick={() => onBegin(ep)}>
            <span className="ep-num">Episode {ep.num}</span>
            <span className="ep-year">{ep.year}</span>
            <span className="ep-title">{ep.title}</span>
            <span className="ep-you">
              You are <b>{ep.you}</b>. {ep.hook}
            </span>
            <span className="ep-go">
              {ep.begin} <i>▸</i>
            </span>
          </button>
        ))}
      </div>
      <p className="fine">Best with sound on. All dialogue is dramatised.</p>
    </div>
  );
}

function SceneCard({ g, onGo }: { g: Game; onGo: () => void }) {
  const s = g.ep.scenes[g.idx];
  const hero = g.ep.hero(g.meters, g.flags);
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
      <div className={`card-cover ${hero.danger ? 'danger' : ''}`}>
        {hero.label}: <b>{hero.value}</b> {hero.unit}
      </div>
      <button className="next" tabIndex={-1}>
        Enter <span>▸</span>
      </button>
    </div>
  );
}

function Decide({ g, setG }: { g: Game; setG: (g: Game) => void }) {
  const s = g.ep.scenes[g.idx];
  const options = s.options(g.flags, g.meters);
  const [stamped, setStamped] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const dead = g.ep.lost(g.meters, g.flags);

  const pick = (opt: Option) => {
    if (stamped) return;
    setStamped(opt.id);
    sound.stamp();
    window.setTimeout(() => setG(choose(g, opt)), 950);
  };

  // A snap decision: when the fuse burns down, the fallback is taken for you.
  const latest = useRef(pick);
  latest.current = pick;
  const timer = s.timer;
  useEffect(() => {
    if (!timer) return;
    const t = window.setTimeout(() => {
      const fallback = options.find((o) => o.id === timer.fallback);
      if (fallback) latest.current(fallback);
    }, timer.seconds * 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.id]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const next = freeText(g, text.trim());
    if (g.ep.lost(next.meters, next.flags)) sound.hit();
    setG(next);
    setText('');
    setOpen(false);
  };

  return (
    <div className={`decide ${stamped ? 'stamping' : ''}`}>
      <div className="file-head">{g.ep.decideHead}</div>
      <h3>{s.prompt}</h3>
      {timer && !stamped && <div className="fuse" style={{ animationDuration: `${timer.seconds}s` }} />}

      {g.freeReply && (
        <div className="reply">
          <div className="who">{g.freeReply.who}</div>
          <p>{g.freeReply.text}</p>
          <Deltas deltas={g.freeReply.deltas} />
        </div>
      )}

      {dead ? (
        <button className="primary" onClick={() => setG({ ...g, phase: 'ending', ending: dead })}>
          Continue ▸
        </button>
      ) : (
        <>
          <div className={`options ${options.length === 1 ? 'solo' : ''}`}>
            {options.map((o) => (
              <button
                key={o.id}
                className={`option ${stamped === o.id ? 'chosen' : ''}`}
                onClick={() => pick(o)}
                disabled={!!stamped}
              >
                <span className="letter">{o.id}</span>
                <span className="text">{o.label}</span>
                {stamped === o.id && <span className="stamp">{g.ep.stamp ?? 'Ordered'}</span>}
              </button>
            ))}
          </div>

          {!stamped &&
            !g.freeUsed &&
            !timer &&
            options.length > 1 &&
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
  const e = g.ep.endings[g.ending!];
  useEffect(() => sound.hit(), []);
  return (
    <div className="ending">
      <div className="card-num">Your ending</div>
      <h2>{e.title}</h2>
      <Reveal
        items={e.text(g.flags, g.meters).map((text) => ({ text }))}
        endLabel="What really happened"
        onEnd={onNext}
      />
    </div>
  );
}

function History({ g, onReplay, onMenu }: { g: Game; onReplay: () => void; onMenu: () => void }) {
  const { ep } = g;
  const [copied, setCopied] = useState(false);
  const rows = ep.history.map((r) => {
    const mine = r.scenes.map((id) => g.picked[id]).find(Boolean);
    return { ...r, mine: mine?.short ?? null, same: !!mine && r.match(g.flags, g.picked) };
  });
  const faced = rows.filter((r) => r.mine);
  const same = faced.filter((r) => r.same).length;
  const share = [
    `REWINDO · ${ep.year}`,
    ep.shareLine,
    '',
    ...faced.map((r) => (r.same ? `✔ ${r.mine} — like ${ep.short}` : `✘ ${r.mine} — ${r.realShort}`)),
    '',
    `Ending: ${ep.endings[g.ending!].title.toUpperCase()}`,
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
        You made the same call as {ep.short} on <b>{same}</b> of <b>{faced.length}</b> decisions.
      </p>
      <div className="rows">
        {rows.map((r) => (
          <div className={`row ${r.mine ? (r.same ? 'same' : 'diff') : 'none'}`} key={r.decision}>
            <div className="row-head">
              <span>{r.decision}</span>
              <em>{r.mine ? (r.same ? `✔ Same as ${ep.short}` : '✘ Different') : 'You never faced this'}</em>
            </div>
            {r.mine && (
              <p className="mine">
                <span>You</span> {r.mine}
              </p>
            )}
            <p className="rao">
              <span>{ep.short}</span> {r.real}
            </p>
          </div>
        ))}
      </div>
      <h4>Afterwards</h4>
      <p className="prose">{ep.afterwards}</p>
      <h4>The other view</h4>
      <p className="prose">{ep.otherView}</p>

      <pre className="share">{share}</pre>
      <div className="actions">
        <button className="primary" onClick={copy}>
          {copied ? 'Copied' : 'Copy to share'}
        </button>
        <button className="ghost" onClick={onReplay}>
          Play again
        </button>
        <button className="ghost" onClick={onMenu}>
          All episodes
        </button>
      </div>
      <p className="fine">All dialogue is dramatised. Figures are being checked against published sources.</p>
    </div>
  );
}

/* ---------- app ---------- */

export default function App() {
  const [g, setG] = useState<Game>(() => newGame(EPISODES[0]));
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState<string | null>(null);
  const [exiting, setExiting] = useState(false);
  const { ep } = g;
  const playing = g.phase !== 'title' && g.phase !== 'history';

  const askExit = useCallback(() => setExiting(true), []);
  const stay = useCallback(() => setExiting(false), []);
  const leave = useCallback(() => {
    setExiting(false);
    setSpeaker(null);
    setG((cur) => newGame(cur.ep));
  }, []);

  useEffect(() => {
    if (!playing || exiting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') setExiting(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playing, exiting]);
  const scene = g.idx >= 0 ? ep.scenes[g.idx] : null;

  const inScene = ['card', 'beats', 'counsel', 'decide', 'outcome'].includes(g.phase);
  const pressure = g.phase === 'title' ? 0 : ep.pressure(g.meters, g.flags);
  useEffect(() => sound.setPressure(pressure), [pressure]);

  const env: Env = g.phase === 'ending' ? ep.endings[g.ending!].env : g.phase === 'history' ? 'study' : (scene?.env ?? 'study');
  const cast = inScene && scene ? scene.advisors(g.flags, g.meters).map((a) => a.id) : [];
  const focus: Focus = g.phase === 'decide' ? 'file' : inScene && g.phase !== 'card' ? 'room' : 'wide';
  const talking = g.phase === 'beats' || g.phase === 'counsel' ? speaker : null;

  const onItem = useCallback(
    (it: Item) => setSpeaker(it.advisor?.id ?? (it.who ? (ep.speakers[it.who] ?? null) : null)),
    [ep],
  );

  const begin = (chosen: Episode) => {
    sound.start();
    setG(newGame(chosen, 'briefing'));
  };
  const go = useCallback((phase: Game['phase']) => setG((cur) => ({ ...cur, phase })), []);
  const toCard = useCallback(() => setG((cur) => enter(cur, 0)), []);
  const toBeats = useCallback(() => go('beats'), [go]);
  // A scene with nobody to consult goes straight to the decision.
  const toCounsel = useCallback(
    () =>
      setG((cur) => {
        const s = cur.ep.scenes[cur.idx];
        return { ...cur, phase: s.advisors(cur.flags, cur.meters).length ? 'counsel' : 'decide' };
      }),
    [],
  );
  const toDecide = useCallback(() => go('decide'), [go]);
  const toNext = useCallback(() => setG((cur) => afterOutcome(cur)), []);
  const toHistory = useCallback(() => go('history'), [go]);

  const showHud = !['title', 'briefing', 'history'].includes(g.phase);
  const key = `${ep.id}-${g.phase}-${g.idx}`;

  return (
    <div className={`stage phase-${g.phase} ${pressure >= 0.5 && inScene ? 'tense' : ''}`}>
      <World env={env} cast={cast} speaker={talking} focus={focus} dim={!inScene || g.phase === 'card'} />
      {showHud && <Hud g={g} muted={muted} onMute={() => setMuted(sound.toggle())} onExit={askExit} />}
      {g.phase === 'briefing' && (
        <button className="mute exit corner-exit" onClick={askExit} title="Leave this episode (Esc)">
          Exit
        </button>
      )}
      {exiting && <ExitConfirm title={ep.title} onLeave={leave} onStay={stay} />}

      <main className="content" key={key}>
        {g.phase === 'title' && <Title onBegin={begin} />}

        {g.phase === 'briefing' && <Reveal items={ep.briefing} endLabel="Begin" onEnd={toCard} />}

        {g.phase === 'card' && <SceneCard g={g} onGo={toBeats} />}

        {g.phase === 'beats' && scene && (
          <Reveal
            single
            items={scene.beats(g.flags, g.meters)}
            endLabel={scene.advisors(g.flags, g.meters).length ? 'Hear your advisors' : 'Continue'}
            onEnd={toCounsel}
            onItem={onItem}
          />
        )}

        {g.phase === 'counsel' && scene && (
          <Reveal
            single
            items={scene.advisors(g.flags, g.meters).map((a) => ({ text: a.text, advisor: a }))}
            endLabel="Decide"
            onEnd={toDecide}
            onItem={onItem}
          />
        )}

        {g.phase === 'decide' && scene && <Decide g={g} setG={setG} />}

        {g.phase === 'outcome' && g.outcome && (
          <div className="outcome">
            <div className="file-head">{g.picked[scene!.id]?.label}</div>
            <Reveal
              single
              items={g.outcome.text.split('\n\n').map((text) => ({ text }))}
              endLabel="Continue"
              onEnd={toNext}
            />
            <Deltas deltas={g.outcome.deltas} />
          </div>
        )}

        {g.phase === 'ending' && <Ending g={g} onNext={toHistory} />}

        {g.phase === 'history' && (
          <History g={g} onReplay={() => setG(newGame(ep, 'briefing'))} onMenu={() => setG(newGame(ep))} />
        )}
      </main>
    </div>
  );
}
