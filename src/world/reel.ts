import type { Env } from '../episodes/types';

type V3 = [number, number, number];

/** One camera move in the title-screen montage. The camera travels from `from` to `to`, then cuts. */
export type Shot = {
  env: Env;
  cast: string[];
  seconds: number;
  from: { pos: V3; look: V3 };
  to: { pos: V3; look: V3 };
};

// The table is at the origin, advisors sit at z = -0.95, and the player's seat is at about z = 1.05.
const SEAT: V3 = [0, 1.25, 1.05];
const FACES: V3 = [0, 1.02, -0.95];

/**
 * The montage behind the episode list: overhead shots, side dollies and cranes across every
 * room, each ending or beginning near the one empty chair, which is yours.
 */
export const REEL: Shot[] = [
  // Straight down on the study desk: the file, the lamp, two men waiting.
  {
    env: 'study',
    cast: ['chandra', 'veteran'],
    seconds: 5.5,
    from: { pos: [0.5, 2.95, 0.35], look: [0, 0.76, 0.05] },
    to: { pos: [-0.3, 2.7, 0.75], look: [0, 0.8, -0.25] },
  },
  // A crane down over Lord's, on to the huddle.
  {
    env: 'ground',
    cast: ['kirmani', 'gavaskar', 'madanlal'],
    seconds: 6,
    from: { pos: [7, 11, 16], look: [0, 3, -30] },
    to: { pos: [1.2, 2.4, 3.6], look: [0, 1.5, -0.95] },
  },
  // Sliding along the bars of the vault, gold behind.
  {
    env: 'vault',
    cast: ['venkitaramanan', 'veteran', 'singh'],
    seconds: 5,
    from: { pos: [-2.6, 1.35, -0.2], look: [0.6, 1.15, -1.2] },
    to: { pos: [-1.5, 1.3, 1.0], look: [0.3, 1.1, -1.0] },
  },
  // The party hall: a slow push past the dais into the rows of MPs.
  {
    env: 'hall',
    cast: ['elder', 'dhar', 'sanjay'],
    seconds: 5,
    from: { pos: [2.8, 2.3, 2.4], look: [-0.5, 1.1, -2.5] },
    to: { pos: [1.3, 1.6, 1.5], look: [-0.2, 1.15, -1.6] },
  },
  // Midnight at the residence, from above the red telephone.
  {
    env: 'night',
    cast: ['ray', 'sanjay', 'dhawan'],
    seconds: 5,
    from: { pos: [-1.4, 2.6, 0.9], look: [-0.2, 0.8, -0.2] },
    to: { pos: [-0.5, 1.9, 1.3], look: [0.1, 1.0, -0.8] },
  },
  // Walking into the dressing room and sitting down: the last move ends in your seat, at your eye level.
  {
    env: 'dressing',
    cast: ['mansingh', 'amarnath', 'gavaskar'],
    seconds: 5.5,
    from: { pos: [0.4, 1.75, 2.9], look: [0, 1.2, -0.95] },
    to: { pos: SEAT, look: FACES },
  },
  // South Block by day, the same move: into the chair.
  {
    env: 'office',
    cast: ['dhar', 'sanjay', 'elder'],
    seconds: 5.5,
    from: { pos: [-1.9, 2.2, 2.2], look: [0.2, 1.0, -0.95] },
    to: { pos: SEAT, look: FACES },
  },
];
