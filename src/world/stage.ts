import * as THREE from 'three';
import type { Env } from '../episodes/types';
import { buildPerson, type Person } from './people';
import { buildRoom, type Room } from './rooms';

/** Where the player is looking: across the table, down at the file, or a pulled-back establishing view. */
export type Focus = 'room' | 'file' | 'wide';

const SEAT_Z = -0.95;
const SEATS: number[][] = [[], [0], [-0.55, 0.55], [-0.95, 0, 0.95]];
const EYE = new THREE.Vector3(0, 1.25, 1.05);

const VIEW: Record<Focus, { pos: THREE.Vector3; look: THREE.Vector3 }> = {
  room: { pos: EYE.clone(), look: new THREE.Vector3(0, 0.98, SEAT_Z) },
  file: { pos: new THREE.Vector3(0, 1.34, 0.98), look: new THREE.Vector3(0, 0.9, -0.45) },
  wide: { pos: new THREE.Vector3(0, 1.5, 2.1), look: new THREE.Vector3(0, 1.0, SEAT_Z) },
};

export class Stage {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(50, 1, 0.05, 60);
  private clock = new THREE.Clock();
  private content = new THREE.Group();
  private room: Room | null = null;
  private people: Person[] = [];
  private spot = new THREE.SpotLight(0xfff0d8, 0, 9, 0.3, 0.85, 1.4);
  private key = '';
  private speaker: string | null = null;
  private focus: Focus = 'wide';
  private look = VIEW.wide.look.clone();
  private fade = 0;
  private raf = 0;
  private observer: ResizeObserver;
  private still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.spot.position.set(0, 2.7, 1.4);
    this.scene.add(this.content, this.spot, this.spot.target);
    this.camera.position.copy(VIEW.wide.pos);

    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(canvas.parentElement!);
    this.resize();
    this.loop();
  }

  /** Build the room and seat the advisors. No-op if nothing changed. */
  set(env: Env, cast: string[]) {
    const key = `${env}|${cast.join(',')}`;
    if (key === this.key) return;
    this.key = key;
    this.clear();

    this.room = buildRoom(env);
    this.content.add(this.room.group);
    this.scene.background = new THREE.Color(this.room.background);
    this.scene.fog = new THREE.FogExp2(this.room.fog, 0.07);

    const seats = SEATS[Math.min(cast.length, 3)];
    this.people = cast.slice(0, 3).map((id, i) => buildPerson(id, seats[i], SEAT_Z, EYE));
    this.people.forEach((p) => this.content.add(p.group));
    this.fade = 0;
  }

  setSpeaker(id: string | null) {
    this.speaker = id;
  }

  setFocus(focus: Focus) {
    this.focus = focus;
  }

  private clear() {
    this.content.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.geometry.dispose();
      for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) m.dispose();
    });
    this.content.clear();
    this.people = [];
    this.room = null;
  }

  private resize() {
    const parent = this.canvas.parentElement!;
    const w = Math.max(1, parent.clientWidth);
    const h = Math.max(1, parent.clientHeight);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Portrait phones need a wider lens to keep three advisors in frame.
    this.camera.fov = w / h < 0.8 ? 82 : w / h < 1.25 ? 64 : 50;
    this.camera.updateProjectionMatrix();
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.1);
    const t = this.clock.elapsedTime;
    const ease = 1 - Math.exp(-dt * 2.2);

    this.room?.tick(t);
    this.fade = Math.min(1, this.fade + dt / 1.4);
    this.renderer.toneMappingExposure = this.fade * this.fade;

    const speaking = this.people.find((p) => p.id === this.speaker);
    for (const p of this.people) {
      const mine = p === speaking;
      p.body.scale.y = 1 + Math.sin(t * 1.3 + p.phase) * 0.006;
      // The speaker leans in and nods as they talk; the others turn to listen.
      const yaw = speaking && !mine ? THREE.MathUtils.clamp((speaking.x - p.x) * 0.45, -0.6, 0.6) : 0;
      const pitch = mine ? 0.05 + Math.sin(t * 5.2) * 0.035 : Math.sin(t * 0.7 + p.phase) * 0.015;
      p.head.rotation.y += (yaw - p.head.rotation.y) * ease;
      p.head.rotation.x += (pitch - p.head.rotation.x) * ease * 2;
      p.body.rotation.x += ((mine ? 0.07 : 0) - p.body.rotation.x) * ease;
    }

    if (speaking) this.spot.target.position.set(speaking.x, 1.2, SEAT_Z);
    this.spot.intensity += ((speaking ? 26 : 0) - this.spot.intensity) * ease;

    const view = VIEW[this.focus];
    const target = view.look.clone();
    if (speaking && this.focus === 'room') target.x = speaking.x * 0.55;
    const pos = view.pos.clone();
    if (!this.still) {
      pos.x += Math.sin(t * 0.31) * 0.012;
      pos.y += Math.sin(t * 0.83) * 0.006;
    }
    this.camera.position.lerp(pos, ease);
    this.look.lerp(target, ease);
    this.camera.lookAt(this.look);

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.observer.disconnect();
    this.clear();
    this.renderer.dispose();
  }
}
