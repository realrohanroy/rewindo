import * as THREE from 'three';

/**
 * Stylised seated figures. Each one is built from a few primitives, with the
 * features people actually recognise someone by: headwear, hairline, beard,
 * glasses, build and dress.
 */
type Look = {
  skin: number;
  build: number;
  hair?: { style: 'full' | 'sides'; color: number };
  glasses?: number;
  moustache?: number;
  beard?: number;
  turban?: number;
  cap?: boolean;
  torso: number;
  sleeves: number;
  shirt?: number;
  tie?: number;
};

const WHITE_KHADI = 0xe9e4d6;

const LOOKS: Record<string, Look> = {
  // Dr Manmohan Singh: sky-blue turban, white beard, glasses, kurta under a dark jacket.
  singh: {
    skin: 0xc1906a,
    build: 0.95,
    glasses: 0x2a2520,
    beard: 0xe6e3dc,
    moustache: 0xe6e3dc,
    turban: 0x7db3e8,
    torso: 0x38445a,
    sleeves: WHITE_KHADI,
  },
  // Naresh Chandra: heavy-set, balding with grey sides, glasses, dark suit.
  chandra: {
    skin: 0xb98863,
    build: 1.18,
    hair: { style: 'sides', color: 0x8d8b87 },
    glasses: 0x1d1a17,
    torso: 0x2b2e35,
    sleeves: 0x2b2e35,
    shirt: 0xe8e6e0,
    tie: 0x6b1f1f,
  },
  // S. Venkitaramanan: slight, grey hair, glasses, banker's suit.
  venkitaramanan: {
    skin: 0x9a6a47,
    build: 0.92,
    hair: { style: 'full', color: 0x55524e },
    glasses: 0x1d1a17,
    torso: 0x3b404b,
    sleeves: 0x3b404b,
    shirt: 0xdfe3ea,
    tie: 0x22304d,
  },
  // A.N. Verma: silver hair, glasses, closed-collar bandhgala.
  verma: {
    skin: 0xb48a69,
    build: 1,
    hair: { style: 'full', color: 0xb0aea8 },
    glasses: 0x3a3028,
    torso: 0x26231f,
    sleeves: 0x26231f,
  },
  // The Veteran (fictional): Gandhi cap, white khadi, white moustache.
  veteran: {
    skin: 0xa77750,
    build: 1.1,
    hair: { style: 'sides', color: 0xd9d6cf },
    moustache: 0xd9d6cf,
    cap: true,
    torso: WHITE_KHADI,
    sleeves: WHITE_KHADI,
  },
  // Sanjay Gandhi: young, receding hairline, heavy dark glasses, white kurta.
  sanjay: {
    skin: 0xc79a76,
    build: 1,
    hair: { style: 'sides', color: 0x1a1614 },
    glasses: 0x0f0d0c,
    torso: WHITE_KHADI,
    sleeves: WHITE_KHADI,
  },
  // Siddhartha Shankar Ray: tall barrister, swept silver-grey hair, dark suit.
  ray: {
    skin: 0xc49672,
    build: 1.12,
    hair: { style: 'full', color: 0x8f8c87 },
    torso: 0x23252b,
    sleeves: 0x23252b,
    shirt: 0xe8e6e0,
    tie: 0x4a1a22,
  },
  // P.N. Dhar: slight academic, thinning grey hair, glasses, grey suit.
  dhar: {
    skin: 0xc9a07c,
    build: 0.92,
    hair: { style: 'sides', color: 0x9a9793 },
    glasses: 0x2a2520,
    torso: 0x4a4d52,
    sleeves: 0x4a4d52,
    shirt: 0xe8e6e0,
    tie: 0x2a3550,
  },
  // R.K. Dhawan: dark hair, clean-shaven, closed-collar safari suit.
  dhawan: {
    skin: 0xb98863,
    build: 1.02,
    hair: { style: 'full', color: 0x1b1816 },
    torso: 0x6f6a5c,
    sleeves: 0x6f6a5c,
  },
  // The Elder (fictional): Gandhi cap, glasses, dark closed-collar coat.
  elder: {
    skin: 0xa77750,
    build: 1.15,
    hair: { style: 'sides', color: 0xcfccc5 },
    glasses: 0x2a2520,
    cap: true,
    torso: 0x2c2823,
    sleeves: 0x2c2823,
  },
  // The party Finance Minister (fictional): black hair, moustache, heavy glasses, brown jacket.
  'fm-politician': {
    skin: 0x99694a,
    build: 1.08,
    hair: { style: 'full', color: 0x1b1816 },
    moustache: 0x1b1816,
    glasses: 0x0f0d0c,
    torso: 0x5a4530,
    sleeves: 0xdcd3bd,
  },
};

export type Person = {
  id: string;
  group: THREE.Group;
  body: THREE.Group;
  head: THREE.Group;
  x: number;
  phase: number;
};

const mat = (color: number, roughness = 0.85) => new THREE.MeshStandardMaterial({ color, roughness });

function add(parent: THREE.Object3D, geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(geo, m);
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

/** A capsule stretched between two points: upper arms and forearms. */
function limb(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, r: number, m: THREE.Material) {
  const dir = b.clone().sub(a);
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(r, dir.length(), 4, 10), m);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  parent.add(mesh);
}

export function buildPerson(id: string, x: number, z: number, faceTo: THREE.Vector3): Person {
  const L = LOOKS[id] ?? LOOKS.veteran;
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = Math.atan2(faceTo.x - x, faceTo.z - z);

  // High-backed chair.
  add(group, new THREE.BoxGeometry(0.56, 0.86, 0.06), mat(0x2a1a12, 0.6), 0, 0.98, -0.25);

  const body = new THREE.Group();
  group.add(body);
  const cloth = mat(L.torso, 0.9);
  const sleeve = mat(L.sleeves, 0.9);
  const skin = mat(L.skin, 0.7);

  const torso = add(body, new THREE.CapsuleGeometry(0.16, 0.34, 6, 18), cloth, 0, 0.82, 0);
  torso.scale.set(1.28 * L.build, 1, 0.86 * L.build);
  const front = 0.16 * 0.86 * L.build;
  if (L.shirt) add(body, new THREE.BoxGeometry(0.075, 0.17, 0.02), mat(L.shirt), 0, 1.0, front - 0.012);
  if (L.tie) add(body, new THREE.BoxGeometry(0.032, 0.15, 0.022), mat(L.tie, 0.6), 0, 0.99, front - 0.006);
  if (!L.shirt && L.torso !== L.sleeves) {
    // Sleeveless jacket over a kurta: show the kurta at the collar.
    add(body, new THREE.BoxGeometry(0.06, 0.1, 0.02), sleeve, 0, 1.06, front - 0.012);
  }
  add(body, new THREE.CylinderGeometry(0.046, 0.052, 0.09, 14), skin, 0, 1.14, 0);

  for (const s of [-1, 1]) {
    const shoulder = new THREE.Vector3(s * 0.2 * L.build, 1.05, 0);
    const elbow = new THREE.Vector3(s * 0.27 * L.build, 0.84, 0.14);
    const hand = new THREE.Vector3(s * 0.1, 0.8, 0.44);
    limb(body, shoulder, elbow, 0.052 * L.build, sleeve);
    limb(body, elbow, hand, 0.044 * L.build, sleeve);
    add(body, new THREE.SphereGeometry(0.038, 12, 10), skin, hand.x, hand.y, hand.z + 0.02);
  }

  // Head. Local +z is the face.
  const head = new THREE.Group();
  head.position.set(0, 1.27, 0.01);
  body.add(head);
  const HS = new THREE.Vector3(0.9, 1.14, 0.98);
  add(head, new THREE.SphereGeometry(0.1, 28, 20), skin).scale.copy(HS);

  const dark = mat(0x17110d, 0.4);
  const browColor = L.hair?.color ?? L.beard ?? 0x2a2420;
  for (const s of [-1, 1]) {
    add(head, new THREE.SphereGeometry(0.011, 10, 8), dark, s * 0.034, 0.012, 0.083);
    add(head, new THREE.BoxGeometry(0.036, 0.007, 0.012), mat(browColor), s * 0.034, 0.036, 0.086);
    add(head, new THREE.SphereGeometry(0.022, 10, 8), skin, s * 0.089, 0, 0).scale.set(0.5, 1, 0.8);
  }
  add(head, new THREE.SphereGeometry(0.016, 12, 10), mat(L.skin, 0.6), 0, -0.014, 0.096).scale.set(0.85, 1.35, 1);
  add(head, new THREE.BoxGeometry(0.042, 0.005, 0.008), mat(0x5a2f28), 0, -0.055, 0.083);

  if (L.hair?.style === 'full') {
    const hair = add(
      head,
      new THREE.SphereGeometry(0.108, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.6),
      mat(L.hair.color, 0.95),
    );
    hair.scale.copy(HS);
    hair.rotation.x = -0.5;
  }
  if (L.hair?.style === 'sides') {
    // A band around the back and sides, leaving the crown and forehead bare.
    add(
      head,
      new THREE.SphereGeometry(0.109, 28, 8, Math.PI * 1.5 - 2.25, 4.5, Math.PI * 0.3, Math.PI * 0.32),
      mat(L.hair.color, 0.95),
    ).scale.copy(HS);
  }
  if (L.glasses !== undefined) {
    const frame = mat(L.glasses, 0.35);
    for (const s of [-1, 1])
      add(head, new THREE.TorusGeometry(0.027, 0.0038, 8, 24), frame, s * 0.036, 0.012, 0.092);
    add(head, new THREE.BoxGeometry(0.02, 0.005, 0.005), frame, 0, 0.016, 0.094);
  }
  if (L.moustache !== undefined)
    add(head, new THREE.BoxGeometry(0.056, 0.013, 0.014), mat(L.moustache, 0.95), 0, -0.038, 0.09);
  if (L.beard !== undefined) {
    const beard = add(
      head,
      new THREE.SphereGeometry(0.106, 28, 12, Math.PI * 0.5 - 1.9, 3.8, Math.PI * 0.56, Math.PI * 0.44),
      mat(L.beard, 0.95),
    );
    beard.scale.set(0.93, 1.22, 1.0);
  }
  if (L.turban !== undefined) {
    const cloth2 = mat(L.turban, 0.9);
    const dome = add(
      head,
      new THREE.SphereGeometry(0.119, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.6),
      cloth2,
      0,
      0.03,
      -0.004,
    );
    dome.scale.set(1, 0.98, 1.08);
    dome.rotation.x = -0.24;
    // Two crossing wraps give the peaked front of a tied turban.
    for (const s of [-1, 1]) {
      const wrap = add(head, new THREE.TorusGeometry(0.1, 0.03, 10, 30), cloth2, 0, 0.07, -0.002);
      wrap.rotation.set(Math.PI / 2 - 0.2, s * 0.34, 0);
      wrap.scale.set(1, 1.08, 1);
    }
  }
  if (L.cap) {
    const cap = add(head, new THREE.CylinderGeometry(0.076, 0.094, 0.075, 22), mat(0xf1eee6, 0.95), 0, 0.106, -0.004);
    cap.scale.set(0.9, 1, 1.25);
    cap.rotation.x = -0.1;
  }

  return { id, group, body, head, x, phase: Math.random() * 6 };
}
