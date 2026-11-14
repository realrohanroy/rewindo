import { useEffect, useRef } from 'react';
import type { Env } from '../episodes/types';
import { Stage, type Focus } from './stage';

type Props = { env: Env; cast: string[]; speaker: string | null; focus: Focus; dim: boolean; reel: boolean; paused: boolean };

/** The 3D room behind the interface. If WebGL is unavailable the game still plays on a dark backdrop. */
export function World({ env, cast, speaker, focus, dim, reel, paused }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<Stage | null>(null);
  const castKey = cast.join(',');

  useEffect(() => {
    try {
      stage.current = new Stage(canvas.current!);
    } catch {
      stage.current = null;
    }
    return () => {
      stage.current?.dispose();
      stage.current = null;
    };
  }, []);

  // On the title screen the stage runs its own montage. In an episode it shows the room it is told to.
  useEffect(() => {
    const s = stage.current;
    if (!s) return;
    if (reel) return s.playReel();
    s.stopReel();
    s.set(env, castKey ? castKey.split(',') : []);
  }, [reel, env, castKey]);
  useEffect(() => stage.current?.pauseReel(paused), [paused]);
  useEffect(() => {
    if (!reel) stage.current?.setSpeaker(speaker);
  }, [speaker, reel]);
  useEffect(() => stage.current?.setFocus(focus), [focus]);

  return (
    <div className={`env ${reel ? 'reel' : dim ? 'dim' : ''}`} aria-hidden="true">
      <canvas ref={canvas} />
      <div className="scrim" />
      <div className="grain" />
      <div className="vignette" />
    </div>
  );
}
