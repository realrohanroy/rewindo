import * as THREE from 'three';
import type { Env } from '../episode';

export type Room = {
  group: THREE.Group;
  background: number;
  fog: number;
  tick: (t: number) => void;
};

const TABLE_TOP = 0.76;

const M = (color: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.85, ...extra });
const glow = (color: number) => new THREE.MeshBasicMaterial({ color });

function box(g: THREE.Object3D, w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.position.set(x, y, z);
  g.add(mesh);
  return mesh;
}
function cyl(g: THREE.Object3D, rt: number, rb: number, h: number, m: THREE.Material, x: number, y: number, z: number) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 20), m);
  mesh.position.set(x, y, z);
  g.add(mesh);
  return mesh;
}

/** Deterministic random, so a room looks the same every time it is built. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Shell = { w: number; h: number; back: number; wall: number; floor: number; ceil: number };

function shell(g: THREE.Object3D, s: Shell) {
  const depth = 3.2 - s.back;
  const zc = (3.2 + s.back) / 2;
  box(g, s.w, 0.1, depth, M(s.floor, { roughness: 0.7 }), 0, -0.05, zc);
  box(g, s.w, 0.1, depth, M(s.ceil), 0, s.h + 0.05, zc);
  const wall = M(s.wall);
  box(g, s.w, s.h, 0.1, wall, 0, s.h / 2, s.back - 0.05);
  box(g, 0.1, s.h, depth, wall, -s.w / 2 - 0.05, s.h / 2, zc);
  box(g, 0.1, s.h, depth, wall, s.w / 2 + 0.05, s.h / 2, zc);
}

function table(g: THREE.Object3D, top: number, side: number, inlay?: number) {
  box(g, 3.3, 0.05, 1.2, M(top, { roughness: 0.5 }), 0, TABLE_TOP - 0.025, 0);
  box(g, 3.1, TABLE_TOP - 0.05, 0.05, M(side), 0, (TABLE_TOP - 0.05) / 2, -0.5);
  box(g, 0.05, TABLE_TOP - 0.05, 1.05, M(side), -1.55, (TABLE_TOP - 0.05) / 2, 0);
  box(g, 0.05, TABLE_TOP - 0.05, 1.05, M(side), 1.55, (TABLE_TOP - 0.05) / 2, 0);
  if (inlay !== undefined) box(g, 2.9, 0.006, 0.86, M(inlay, { roughness: 0.95 }), 0, TABLE_TOP + 0.003, 0);
}

/** What sits in front of the player: the file awaiting orders, a pen, a cup of tea. */
function deskItems(g: THREE.Object3D) {
  const file = new THREE.Group();
  file.position.set(0, TABLE_TOP + 0.01, 0.28);
  file.rotation.y = 0.06;
  box(file, 0.36, 0.012, 0.48, M(0xc49a5c), 0, 0, 0);
  box(file, 0.31, 0.008, 0.43, M(0xf0e8d2, { roughness: 0.95 }), 0.005, 0.01, 0);
  const tape = M(0x9c1c1c, { roughness: 0.6 });
  box(file, 0.37, 0.004, 0.022, tape, 0, 0.016, 0.02);
  box(file, 0.022, 0.004, 0.49, tape, -0.06, 0.016, 0);
  for (let i = 0; i < 9; i++) box(file, 0.2 - (i % 3) * 0.03, 0.001, 0.005, M(0x3a3632), 0.03, 0.0155, -0.17 + i * 0.03);
  g.add(file);

  const pen = cyl(g, 0.006, 0.006, 0.15, M(0x14110f, { roughness: 0.3 }), 0.27, TABLE_TOP + 0.012, 0.32);
  pen.rotation.set(Math.PI / 2, 0, 0.5);

  cyl(g, 0.07, 0.06, 0.008, M(0xf2efe8, { roughness: 0.4 }), 0.52, TABLE_TOP + 0.006, 0.22);
  cyl(g, 0.04, 0.03, 0.055, M(0xf2efe8, { roughness: 0.4 }), 0.52, TABLE_TOP + 0.036, 0.22);
  cyl(g, 0.036, 0.036, 0.002, M(0x5a3518, { roughness: 0.2 }), 0.52, TABLE_TOP + 0.062, 0.22);
}

function light(g: THREE.Object3D, l: THREE.Light, x: number, y: number, z: number) {
  l.position.set(x, y, z);
  g.add(l);
  return l;
}

/* ---------- study: the Prime Minister's desk at night, one brass lamp ---------- */

function study(): Room {
  const g = new THREE.Group();
  shell(g, { w: 7, h: 3.1, back: -3.2, wall: 0x2b1c12, floor: 0x1a110b, ceil: 0x140f0a });
  table(g, 0x4a2c18, 0x2e1c10, 0x1c3d2e);
  deskItems(g);

  // Bookshelves across the back wall.
  const wood = M(0x23160e);
  for (let s = 0; s < 5; s++) box(g, 6.4, 0.04, 0.32, wood, 0, 0.42 + s * 0.52, -3.0);
  for (const x of [-3.2, -1.07, 1.07, 3.2]) box(g, 0.06, 2.6, 0.32, wood, x, 1.45, -3.0);
  const r = rng(7);
  const palette = [0x5a2a22, 0x2f3d2c, 0x26324a, 0x6b5a36, 0x3a2a1c, 0x7a6a55, 0x4a1f1f, 0x1f2a33];
  const slots: { x: number; y: number; w: number; h: number; c: number }[] = [];
  for (let s = 0; s < 4; s++) {
    let x = -3.1;
    while (x < 3.1) {
      const w = 0.045 + r() * 0.06;
      if (r() > 0.12) slots.push({ x: x + w / 2, y: 0.44 + s * 0.52, w, h: 0.26 + r() * 0.18, c: palette[Math.floor(r() * palette.length)] });
      x += w + 0.004;
    }
  }
  const books = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), M(0xffffff, { roughness: 0.9 }), slots.length);
  const m4 = new THREE.Matrix4();
  const col = new THREE.Color();
  slots.forEach((b, i) => {
    m4.makeScale(b.w, b.h, 0.22).setPosition(b.x, b.y + b.h / 2, -2.98);
    books.setMatrixAt(i, m4);
    books.setColorAt(i, col.setHex(b.c));
  });
  g.add(books);

  // Brass banker's lamp with a green shade.
  const brass = M(0xa8823c, { roughness: 0.35, metalness: 0.6 });
  cyl(g, 0.07, 0.085, 0.02, brass, -1.05, TABLE_TOP + 0.01, 0.1);
  cyl(g, 0.01, 0.01, 0.3, brass, -1.05, TABLE_TOP + 0.16, 0.1);
  const shade = cyl(
    g,
    0.07,
    0.07,
    0.3,
    new THREE.MeshStandardMaterial({ color: 0x1f6b45, emissive: 0x2f9a63, emissiveIntensity: 0.9, roughness: 0.4 }),
    -1.05,
    TABLE_TOP + 0.33,
    0.12,
  );
  shade.rotation.z = Math.PI / 2;
  const lamp = light(g, new THREE.PointLight(0xffbf78, 9, 9, 1.6), -0.95, TABLE_TOP + 0.3, 0.3) as THREE.PointLight;

  g.add(new THREE.HemisphereLight(0x5a4530, 0x0a0705, 0.55));
  const fill = light(g, new THREE.DirectionalLight(0xffd6a0, 0.55), 0.6, 2, 2.4) as THREE.DirectionalLight;
  fill.target.position.set(0, 1.1, -1);
  g.add(fill.target);

  return {
    group: g,
    background: 0x070504,
    fog: 0x070504,
    tick: (t) => {
      lamp.intensity = 9 + Math.sin(t * 7.3) * 0.25 + Math.sin(t * 2.1) * 0.35;
    },
  };
}

/* ---------- vault: the Reserve Bank strongroom, gold behind bars ---------- */

function vault(): Room {
  const g = new THREE.Group();
  shell(g, { w: 8, h: 3.1, back: -4.8, wall: 0x32383d, floor: 0x191c1f, ceil: 0x15171a });
  table(g, 0x4b5258, 0x30353a);
  deskItems(g);

  const steel = M(0x596168, { roughness: 0.35, metalness: 0.7 });
  for (let x = -3.9; x <= 3.91; x += 0.24) cyl(g, 0.022, 0.022, 3.1, steel, x, 1.55, -2.5);
  for (const y of [0.35, 1.55, 2.75]) box(g, 8, 0.07, 0.07, steel, 0, y, -2.5);

  // Stacked bullion.
  const bars: THREE.Matrix4[] = [];
  for (const sx of [-2.7, -1.35, 0, 1.35, 2.7]) {
    for (let layer = 0; layer < 6; layer++) {
      const n = 6 - layer;
      for (let i = 0; i < n; i++)
        for (let k = 0; k < 2; k++)
          bars.push(
            new THREE.Matrix4().makeTranslation(sx + (i - (n - 1) / 2) * 0.19, 0.3 + layer * 0.075, -3.5 - k * 0.24),
          );
    }
    box(g, 1.3, 0.26, 0.6, M(0x2a2d30), sx, 0.13, -3.62);
  }
  const gold = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.17, 0.065, 0.21),
    new THREE.MeshStandardMaterial({
      color: 0xe0b040,
      roughness: 0.32,
      metalness: 0.55,
      emissive: 0x6a4708,
      emissiveIntensity: 0.55,
    }),
    bars.length,
  );
  bars.forEach((m, i) => gold.setMatrixAt(i, m));
  g.add(gold);
  const warm = [-2, 0, 2].map((x) => light(g, new THREE.PointLight(0xffc860, 10, 7, 1.7), x, 1.5, -2.9) as THREE.PointLight);

  box(g, 1.8, 0.04, 0.14, glow(0xd5e6ff), 0, 2.95, 0);
  light(g, new THREE.PointLight(0xc4dcff, 11, 9, 1.6), 0, 2.7, 0.3);
  g.add(new THREE.HemisphereLight(0x8fa3b8, 0x0b0d10, 0.5));

  return {
    group: g,
    background: 0x06080a,
    fog: 0x06080a,
    tick: (t) => warm.forEach((l, i) => (l.intensity = 10 + Math.sin(t * 0.9 + i * 2) * 1.2)),
  };
}

/* ---------- office: South Block by day, blinds, a ceiling fan, the flag ---------- */

function office(): Room {
  const g = new THREE.Group();
  shell(g, { w: 7.4, h: 3.2, back: -3.6, wall: 0xb39a70, floor: 0x4b3423, ceil: 0xc9bc9d });
  box(g, 7.4, 0.95, 0.04, M(0x5c3d24), 0, 0.475, -3.57);
  table(g, 0x5a3a22, 0x3d2616, 0x1f4a35);
  deskItems(g);

  // Two tall windows with slatted blinds, sun behind them.
  const frame = M(0x4a321f);
  for (const x of [-1.9, 1.9]) {
    box(g, 1.3, 1.9, 0.02, glow(0xfff0cf), x, 1.95, -3.56);
    for (let i = 0; i < 15; i++) box(g, 1.3, 0.05, 0.05, M(0x7a6646), x, 1.06 + i * 0.127, -3.5);
    box(g, 1.46, 0.08, 0.1, frame, x, 2.94, -3.52);
    box(g, 1.46, 0.08, 0.1, frame, x, 0.98, -3.52);
    for (const s of [-1, 1]) box(g, 0.08, 2.04, 0.1, frame, x + s * 0.69, 1.96, -3.52);
  }
  // A framed portrait between the windows.
  box(g, 0.78, 1.0, 0.05, M(0x6b4a22, { roughness: 0.5 }), 0, 2.05, -3.54);
  box(g, 0.62, 0.84, 0.02, M(0x2c2620), 0, 2.05, -3.5);

  // The national flag on a stand.
  const flag = new THREE.Group();
  flag.position.set(-3.0, 0, -3.0);
  cyl(flag, 0.016, 0.016, 2.4, M(0xb08a3c, { metalness: 0.6, roughness: 0.35 }), 0, 1.2, 0);
  cyl(flag, 0.12, 0.14, 0.05, M(0x3a2a1a), 0, 0.025, 0);
  const cloth = new THREE.Group();
  cloth.position.set(0.02, 2.3, 0);
  cloth.rotation.z = -1.25;
  [0xff9933, 0xf4f1e8, 0x138808].forEach((c, i) => box(cloth, 0.95, 0.2, 0.025, M(c, { roughness: 0.95 }), 0.47, 0.2 - i * 0.2, 0));
  flag.add(cloth);
  g.add(flag);

  // Ceiling fan.
  cyl(g, 0.015, 0.015, 0.36, M(0x8c8473), 0, 3.02, -0.3);
  const fan = new THREE.Group();
  fan.position.set(0, 2.84, -0.3);
  cyl(fan, 0.1, 0.1, 0.07, M(0xd8cfb8), 0, 0, 0);
  for (let i = 0; i < 3; i++) {
    const arm = new THREE.Group();
    arm.rotation.y = (i * Math.PI * 2) / 3;
    box(arm, 0.95, 0.012, 0.15, M(0xd8cfb8), 0.58, 0, 0);
    fan.add(arm);
  }
  g.add(fan);

  g.add(new THREE.HemisphereLight(0xfff1d6, 0x4a3524, 1.0));
  const sun = light(g, new THREE.DirectionalLight(0xffd9a0, 2.4), 2.5, 3.2, -4) as THREE.DirectionalLight;
  sun.target.position.set(0, 0.8, 0);
  g.add(sun.target);
  const fill = light(g, new THREE.DirectionalLight(0xfff2dd, 0.9), -0.8, 2.2, 2.6) as THREE.DirectionalLight;
  fill.target.position.set(0, 1.1, -1);
  g.add(fill.target);

  return {
    group: g,
    background: 0x191209,
    fog: 0x2a2014,
    tick: (t) => {
      fan.rotation.y = t * 7;
    },
  };
}

/* ---------- night: the residence after midnight, moonlight and a telephone ---------- */

function night(): Room {
  const g = new THREE.Group();
  shell(g, { w: 6.6, h: 3.0, back: -3.2, wall: 0x1d2333, floor: 0x0e1016, ceil: 0x10131a });
  table(g, 0x33221a, 0x211610);
  deskItems(g);

  // Window, moonlit, with curtains.
  box(g, 1.5, 1.7, 0.02, glow(0x6f8fc4), 1.3, 1.85, -3.16);
  const mull = M(0x10131a);
  box(g, 0.05, 1.7, 0.05, mull, 1.3, 1.85, -3.13);
  box(g, 1.5, 0.05, 0.05, mull, 1.3, 1.85, -3.13);
  for (const s of [-1, 1]) box(g, 0.42, 2.3, 0.1, M(0x3a1f2c, { roughness: 1 }), 1.3 + s * 0.95, 1.75, -3.08);
  light(g, new THREE.PointLight(0x7f9fdc, 9, 8, 1.5), 1.3, 1.9, -2.4);

  // Red telephone, close to hand.
  const phone = new THREE.Group();
  phone.position.set(-0.5, TABLE_TOP, 0.26);
  phone.rotation.y = 0.4;
  const red = M(0xa81a1a, { roughness: 0.35 });
  box(phone, 0.2, 0.06, 0.17, red, 0, 0.03, 0);
  box(phone, 0.23, 0.03, 0.045, red, 0, 0.095, -0.03);
  for (const s of [-1, 1]) box(phone, 0.05, 0.045, 0.055, red, s * 0.095, 0.075, -0.03);
  cyl(phone, 0.045, 0.045, 0.006, M(0xe8e4da, { roughness: 0.4 }), 0, 0.064, 0.035);
  g.add(phone);

  // Small shaded lamp.
  cyl(g, 0.05, 0.06, 0.2, M(0x5a4a3a), 1.0, TABLE_TOP + 0.1, 0.05);
  cyl(
    g,
    0.07,
    0.12,
    0.16,
    new THREE.MeshStandardMaterial({ color: 0xd9b27a, emissive: 0xffa850, emissiveIntensity: 0.8 }),
    1.0,
    TABLE_TOP + 0.28,
    0.05,
  );
  light(g, new THREE.PointLight(0xffa860, 5, 6, 1.7), 0.9, TABLE_TOP + 0.3, 0.3);

  g.add(new THREE.HemisphereLight(0x3d4c6e, 0x05060a, 0.55));
  const fill = light(g, new THREE.DirectionalLight(0xa9bce0, 0.4), -0.6, 2, 2.4) as THREE.DirectionalLight;
  fill.target.position.set(0, 1.1, -1);
  g.add(fill.target);

  return { group: g, background: 0x04050a, fog: 0x04050a, tick: () => {} };
}

/* ---------- hall: the Congress Parliamentary Party, rows of MPs behind your advisors ---------- */

function hall(): Room {
  const g = new THREE.Group();
  shell(g, { w: 13, h: 4.6, back: -10, wall: 0x5c3427, floor: 0x2a1a14, ceil: 0x1a100c });
  table(g, 0x4a2c1c, 0x30190f, 0xe9e4d6);
  deskItems(g);

  [0xff9933, 0xf4f1e8, 0x138808].forEach((c, i) => box(g, 7, 0.45, 0.04, M(c, { roughness: 0.95 }), 0, 3.9 - i * 0.45, -9.94));

  const r = rng(91);
  const seats: { x: number; y: number; z: number; skin: number; cap: boolean; turn: number }[] = [];
  const skins = [0xb98863, 0xa77750, 0x99694a, 0xc1906a, 0x8a5d3f];
  for (let row = 0; row < 10; row++)
    for (let x = -5.6; x <= 5.6; x += 0.66)
      seats.push({
        x: x + (r() - 0.5) * 0.18 + (row % 2) * 0.33,
        y: row * 0.11,
        z: -2.7 - row * 0.72 + (r() - 0.5) * 0.12,
        skin: skins[Math.floor(r() * skins.length)],
        cap: r() > 0.4,
        turn: (r() - 0.5) * 0.7,
      });
  const bodies = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.19, 0.36, 4, 10), M(0xe4dfd0, { roughness: 0.95 }), seats.length);
  const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 12, 10), M(0xffffff, { roughness: 0.75 }), seats.length);
  const caps = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.075, 0.095, 0.075, 12), M(0xf1eee6), seats.length);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const col = new THREE.Color();
  const one = new THREE.Vector3(1, 1, 1);
  seats.forEach((s, i) => {
    q.setFromAxisAngle(up, s.turn);
    bodies.setMatrixAt(i, m4.compose(new THREE.Vector3(s.x, 0.82 + s.y, s.z), q, one));
    heads.setMatrixAt(i, m4.compose(new THREE.Vector3(s.x, 1.27 + s.y, s.z), q, new THREE.Vector3(0.9, 1.14, 0.98)));
    heads.setColorAt(i, col.setHex(s.skin));
    caps.setMatrixAt(
      i,
      m4.compose(new THREE.Vector3(s.x, 1.375 + s.y, s.z), q, s.cap ? new THREE.Vector3(0.9, 1, 1.25) : new THREE.Vector3(0, 0, 0)),
    );
  });
  g.add(bodies, heads, caps);

  const lamps = [-3.5, 0, 3.5].map((x) => {
    box(g, 0.5, 0.06, 0.5, glow(0xffe1b0), x, 4.5, -3.2);
    return light(g, new THREE.PointLight(0xffc48a, 34, 16, 1.5), x, 4.2, -3.2) as THREE.PointLight;
  });
  light(g, new THREE.PointLight(0xffb070, 20, 14, 1.5), 0, 4.2, -7.5);
  g.add(new THREE.HemisphereLight(0xffcfa0, 0x1a0f0a, 0.6));
  const fill = light(g, new THREE.DirectionalLight(0xffe2c0, 0.8), 0.5, 2.4, 2.6) as THREE.DirectionalLight;
  fill.target.position.set(0, 1.1, -1);
  g.add(fill.target);

  return {
    group: g,
    background: 0x140a07,
    fog: 0x24120c,
    tick: (t) => lamps.forEach((l, i) => (l.intensity = 34 + Math.sin(t * 3 + i * 1.7) * 1.5)),
  };
}

const BUILDERS: Record<Env, () => Room> = { study, vault, office, night, hall };

export const buildRoom = (env: Env): Room => BUILDERS[env]();
