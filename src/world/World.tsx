import { useEffect, useRef } from 'react';
import type { Env } from '../episodes/types';
import { Stage, type Focus } from './stage';

type Props = { env: Env; cast: string[]; speaker: string | null; focus: Focus; dim: boolean };

/** The 3D room behind the interface. If WebGL is unavailable the game still plays on a dark backdrop. */
export function World({ env, cast, speaker, focus, dim }: Props) {
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

  useEffect(() => stage.current?.set(env, castKey ? castKey.split(',') : []), [env, castKey]);
  useEffect(() => stage.current?.setSpeaker(speaker), [speaker]);
  useEffect(() => stage.current?.setFocus(focus), [focus]);

  return (
    <div className={`env ${dim ? 'dim' : ''}`} aria-hidden="true">
      <canvas ref={canvas} />
      <div className="scrim" />
      <div className="grain" />
      <div className="vignette" />
    </div>
  );
}
