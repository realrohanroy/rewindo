import * as THREE from 'three';
import { box, cyl, glow, light, M, rng, shell, table, TABLE_TOP, type Room } from './rooms';

/* ---------- dressing: the visitors' dressing room at Lord's, between innings ---------- */

export function dressing(): Room {
  const g = new THREE.Group();
  shell(g, { w: 7.6, h: 3.1, back: -3.6, wall: 0xcbbd9c, floor: 0x5a4028, ceil: 0xd8cdb2 });
  box(g, 7.6, 1.0, 0.04, M(0x4a3524), 0, 0.5, -3.57);
  table(g, 0x6a4a2c, 0x4a321e);

  // What is on the table in front of you: the ball, a scorebook, an untouched plate.
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.036, 20, 16), M(0x8f1a1a, { roughness: 0.45 }));
  ball.position.set(0.22, TABLE_TOP + 0.036, 0.3);
  g.add(ball);
  box(g, 0.34, 0.012, 0.26, M(0x2a3a2c), -0.12, TABLE_TOP + 0.006, 0.3).rotation.y = 0.12;
  box(g, 0.3, 0.004, 0.22, M(0xf0e8d2, { roughness: 0.95 }), -0.12, TABLE_TOP + 0.014, 0.3).rotation.y = 0.12;
  cyl(g, 0.11, 0.1, 0.01, M(0xf2efe8, { roughness: 0.4 }), 0.62, TABLE_TOP + 0.005, 0.2);
  for (let i = 0; i < 3; i++) box(g, 0.09, 0.03, 0.09, M(0xe6d9b0), 0.58 + i * 0.045, TABLE_TOP + 0.025 + i * 0.012, 0.2);

  // Lockers and pegs along the back wall, with whites hanging from them.
  const wood = M(0x5c4129);
  for (let i = 0; i < 7; i++) {
    const x = -3.3 + i * 0.78;
    if (Math.abs(x - 2.1) < 0.9) continue; // leave room for the balcony door
    box(g, 0.7, 1.9, 0.3, wood, x, 1.95, -3.4);
    box(g, 0.6, 1.7, 0.02, M(0x2e2013), x, 1.95, -3.24);
    if (i % 2 === 0) box(g, 0.34, 0.9, 0.05, M(0xf2efe6, { roughness: 1 }), x, 1.9, -3.2);
    else box(g, 0.1, 0.8, 0.05, M(0xcaa86a), x + 0.1, 1.6, -3.2).rotation.z = 0.12; // a bat
  }
  // The door to the balcony, bright with afternoon light.
  box(g, 1.3, 2.3, 0.02, glow(0xf3f6f2), 2.1, 1.25, -3.56);
  box(g, 0.06, 2.3, 0.06, wood, 2.1, 1.25, -3.52);
  box(g, 1.42, 0.08, 0.08, wood, 2.1, 2.44, -3.52);
  light(g, new THREE.PointLight(0xf2f6ff, 16, 9, 1.5), 2.0, 1.8, -2.6);

  g.add(new THREE.HemisphereLight(0xfff3dc, 0x4a3a28, 0.85));
  const fill = light(g, new THREE.DirectionalLight(0xfff0d8, 0.9), -0.6, 2.2, 2.6) as THREE.DirectionalLight;
  fill.target.position.set(0, 1.1, -1);
  g.add(fill.target);

  return { group: g, background: 0x1a140c, fog: 0x2a2014, tick: () => {} };
}

/* ---------- ground: the middle at Lord's, the pavilion behind your huddle ---------- */

export function ground(): Room {
  const g = new THREE.Group();
  const r = rng(1983);

  // Outfield, mown in stripes, and the pitch running away from you.
  box(g, 260, 0.1, 260, M(0x4c8a3a, { roughness: 1 }), 0, -0.05, -40);
  for (let i = -12; i <= 12; i += 2) box(g, 5, 0.012, 200, M(0x5a9a44, { roughness: 1 }), i * 5, 0.004, -40);
  box(g, 3.05, 0.02, 20.2, M(0xcbb98a, { roughness: 1 }), 0, 0.012, -14);
  const white = M(0xf4f1e8);
  for (const z of [-4.6, -23.4]) {
    box(g, 2.7, 0.006, 0.05, white, 0, 0.026, z);
    for (const x of [-0.115, 0, 0.115]) cyl(g, 0.018, 0.018, 0.71, M(0xe0c98a), x, 0.355, z + (z > -10 ? 0.7 : -0.7));
  }

  // The pavilion: terracotta brick, white balconies, a tower at each end.
  const brick = M(0xa7553a);
  const pav = new THREE.Group();
  pav.position.set(0, 0, -86);
  box(pav, 62, 15, 10, brick, 0, 7.5, 0);
  for (const x of [-34, 34]) {
    box(pav, 9, 21, 11, brick, x, 10.5, 0);
    box(pav, 10, 1.2, 12, M(0x6e6e6a), x, 21.6, 0);
  }
  box(pav, 64, 1.2, 11, M(0x6e6e6a), 0, 15.6, 0);
  for (const y of [5.2, 10.2]) {
    box(pav, 60, 0.9, 2.4, white, 0, y, 6);
    for (let x = -28; x <= 28; x += 4) box(pav, 0.3, 4.2, 0.3, white, x, y + 2.5, 6.9);
  }
  for (let x = -27; x <= 27; x += 4.5) box(pav, 2.2, 3.2, 0.2, M(0x2c2a26), x, 2.6, 5.1);
  cyl(pav, 0.12, 0.12, 9, white, 0, 20.5, 0);
  g.add(pav);

  // Stands either side, and the crowd in them.
  const stand = M(0xdad6cc);
  const seats: THREE.Matrix4[] = [];
  const colours: number[] = [];
  const shirts = [0xf4f1e8, 0xd9d2c0, 0x9c2b2b, 0x2f4a7a, 0xe0a030, 0x3a6a45, 0x1f1f1f, 0xf0c8a0];
  for (const side of [-1, 1]) {
    for (let tier = 0; tier < 9; tier++) {
      const x = side * (62 + tier * 2.4);
      const y = 1.2 + tier * 1.5;
      box(g, 2.4, 1.5, 150, stand, x, y - 0.75, -40);
      for (let z = -112; z < 32; z += 1.5) {
        if (r() < 0.12) continue;
        seats.push(new THREE.Matrix4().makeTranslation(x - side * 0.2, y + 0.5, z + r() * 0.5));
        colours.push(shirts[Math.floor(r() * shirts.length)]);
      }
    }
    box(g, 26, 1.2, 152, M(0x8c8c88), side * 74, 16.5, -40);
  }
  const crowd = new THREE.InstancedMesh(new THREE.BoxGeometry(0.75, 1.0, 0.6), M(0xffffff, { roughness: 1 }), seats.length);
  const col = new THREE.Color();
  seats.forEach((m, i) => {
    crowd.setMatrixAt(i, m);
    crowd.setColorAt(i, col.setHex(colours[i]));
  });
  g.add(crowd);
  // The boundary boards.
  for (const side of [-1, 1]) box(g, 0.3, 1.0, 150, white, side * 60, 0.5, -40);
  box(g, 120, 1.0, 0.3, white, 0, 0.5, -79);

  // Your fielders, scattered in the deep, and the two batsmen at the far end.
  const spots: [number, number][] = [
    [-9, -12],
    [11, -16],
    [-22, -30],
    [24, -34],
    [-6, -44],
    [16, -52],
    [-34, -18],
    [0.9, -22.6],
    [-2.4, -6.2],
  ];
  const bodies = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.2, 1.1, 4, 10), M(0xf2efe6, { roughness: 1 }), spots.length);
  const heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.12, 10, 8), M(0xa9744e), spots.length);
  spots.forEach(([x, z], i) => {
    bodies.setMatrixAt(i, new THREE.Matrix4().makeTranslation(x, 0.75, z));
    heads.setMatrixAt(i, new THREE.Matrix4().makeTranslation(x, 1.62, z));
  });
  g.add(bodies, heads);

  g.add(new THREE.HemisphereLight(0xe6eef8, 0x4f7038, 1.25));
  const sun = light(g, new THREE.DirectionalLight(0xfff1d6, 2.1), -30, 40, 20) as THREE.DirectionalLight;
  sun.target.position.set(0, 0, -20);
  g.add(sun.target);

  return {
    group: g,
    background: 0xa9bfd4,
    fog: 0xa9bfd4,
    fogDensity: 0.0045,
    standing: true,
    tick: () => {},
  };
}
