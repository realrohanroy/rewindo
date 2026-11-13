// Episode 03 — One Hundred and Eighty-Three.
// Content source: episodes/1983-one-hundred-and-eighty-three.md. All dialogue is dramatised.

import type { Advisor, Episode, Flags, Meters, Scene } from './types';

const gavaskar = (text: string): Advisor => ({ id: 'gavaskar', name: 'Sunil Gavaskar', role: 'Opening batsman', text });
const amarnath = (text: string): Advisor => ({ id: 'amarnath', name: 'Mohinder Amarnath', role: 'Vice-captain', text });
const madan = (text: string): Advisor => ({ id: 'madanlal', name: 'Madan Lal', role: 'Medium-pacer', text });
const kirmani = (text: string): Advisor => ({ id: 'kirmani', name: 'Syed Kirmani', role: 'Wicketkeeper', text });
const manSingh = (text: string): Advisor => ({ id: 'mansingh', name: 'P.R. Man Singh', role: 'Team manager', text });
const patil = (text: string): Advisor => ({ id: 'patil', name: 'Sandeep Patil', role: 'Your batting partner', text });

/** West Indies' score, worked back from what you have left to defend. */
const score = (m: Meters) => `West Indies ${m.total - m.runs} for ${m.wickets}`;

const SCENES: Scene[] = [
  {
    id: 's1',
    num: 'I',
    title: 'Ninety-Two for Four',
    date: 'Early afternoon',
    place: 'Lord’s · The middle',
    env: 'ground',
    beats: () => [
      {
        text: 'Gavaskar went in the third over. Srikkanth went down on one knee and hit Roberts through the covers, and the ground gasped. Then he went too. Amarnath is out. Yashpal is out.',
      },
      { text: 'You walk down the pavilion steps, through the Long Room, past the members in their ties, and out into the light.' },
      { text: 'Joel Garner is six feet eight inches tall. He is bowling from the Nursery End.' },
      {
        text: 'But Clive Lloyd has a problem. He has four fast bowlers and sixty overs to fill. Twelve of them must come from someone else.',
      },
      { text: 'He throws the ball to Larry Gomes, who bowls gentle off-spin.' },
      { text: 'This morning Gavaskar said: sixty overs is a long time. Somebody has to be there at the end.' },
    ],
    advisors: () => [patil('Gomes is the one. Twelve overs of him. That is where our runs are, Kaps.')],
    prompt: 'How do you bat?',
    options: () => [
      {
        id: 'A',
        label: 'Go after Gomes. Now, before the fast men come back',
        short: 'Went after Gomes',
        fx: { belief: 5 },
        set: { batted: 'attacked' },
        outcome:
          'Three fours in eight balls. The fourth one you hit high towards long-on, and Michael Holding does not drop those. Fifteen. You walk back past the members.\n\nThe tail fights. Madan Lal, Kirmani and Sandhu add runs nobody expected. Marshall hits Sandhu on the helmet, and Sandhu bats on.\n\nAll out in the fifty-fifth over. One hundred and eighty-three.',
      },
      {
        id: 'B',
        label: 'Play yourself in. Bat through to the sixtieth over',
        short: 'Batted through',
        fx: { runs: 13, total: 13, belief: -5, swagger: 5 },
        set: { batted: 'anchored' },
        outcome:
          'You leave Gomes alone, and the fast bowlers return fresh. You are still there in the fifty-eighth over when Garner finds your glove.\n\nOne hundred and ninety-six. A little more on the board.\n\nThe dressing room is a little quieter. They watched the man who made 175 a week ago block a part-time spinner.',
      },
    ],
  },
  {
    id: 's2',
    num: 'II',
    title: 'The Break',
    date: 'Between innings',
    place: 'Lord’s · Visitors’ dressing room',
    env: 'dressing',
    beats: (_f, m) => [
      { text: 'The room smells of liniment and wet pads. Somebody has left a plate of sandwiches untouched.' },
      { text: 'Through the wall you can hear the other dressing room. It is loud.' },
      {
        text: `${m.total === 183 ? 'One hundred and eighty-three' : 'One hundred and ninety-six'}. In sixty overs. Against Greenidge, Haynes, Richards and Lloyd.`,
      },
      { text: 'Nobody is looking at you, which is how you know that everybody is waiting.' },
    ],
    advisors: () => [
      manSingh('Don’t make a speech, Kapil. They are grown men and they can count.'),
      amarnath('They still have to make them. Runs on the board are runs on the board. Say that.'),
      gavaskar(
        'If we bowl tight and they get them in forty overs, there is no shame. If we spray it and they get them in twenty-five, we will hear about it for ten years.',
      ),
    ],
    prompt: 'What do you say?',
    options: () => [
      {
        id: 'A',
        label: '“It is not a winning total. But it is a fighting total. Make them earn every run.”',
        short: 'Called it a fighting total',
        fx: { belief: 20 },
        set: { talk: 'fight' },
        outcome:
          'It is not much of a speech. Your English is still something the newspapers make jokes about.\n\nBut Srikkanth laughs, and Kirmani bangs his gloves together, and when they go down the steps they are walking a little faster than they came up.',
      },
      {
        id: 'B',
        label: '“We batted like fools. I batted like a fool. Now go out and fix it.”',
        short: 'Told them we batted like fools',
        fx: { belief: 5, swagger: -5 },
        set: { talk: 'anger' },
        outcome: 'Nobody argues. Nobody can.\n\nThey go down the steps in silence, each man alone with the shot he played.',
      },
      {
        id: 'C',
        label: 'Say nothing. Pick up the ball and walk to the door',
        short: 'Said nothing',
        fx: { belief: 10 },
        set: { talk: 'silence' },
        outcome: 'You stand at the door until they notice. One by one, they get up.\n\nJimmy Amarnath is the last, and he nods as he passes.',
      },
    ],
  },
  {
    id: 's3',
    num: 'III',
    title: 'The New Ball',
    date: 'West Indies’ innings · Over 1',
    place: 'Lord’s · The middle',
    env: 'ground',
    beats: () => [
      { text: 'Gordon Greenidge and Desmond Haynes walk out together. They have opened for six years. They do not hurry.' },
      { text: 'You will bowl from the Pavilion End. The question is who shares the new ball.' },
    ],
    advisors: () => [
      kirmani(
        'Ballu Sandhu swings it in, and from the Nursery End the slope takes it further. Greenidge likes to leave anything outside off stump. He leaves a lot.',
      ),
      gavaskar(
        'Roger Binny has more wickets in this tournament than anyone, on either side. You give your best bowler the new ball. That is not complicated.',
      ),
      madan('Give it to me, and I will tell you who is complicated.'),
    ],
    prompt: 'Who takes the new ball with you?',
    options: () => [
      {
        id: 'A',
        label: 'Balwinder Sandhu. Swing, and the slope',
        short: 'Gave Sandhu the new ball',
        fx: { wickets: 1, runs: -5, belief: 10, swagger: -5 },
        set: { newball: 'sandhu' },
        outcome:
          'Sandhu runs in, with a bruise coming up where Marshall hit him. The ball starts well outside off stump. Greenidge lifts his bat high out of the way, as he has ten thousand times.\n\nIt comes back down the slope and hits the top of off stump.\n\nGreenidge stands there for a moment with his bat still raised. West Indies 5 for 1. At slip, Gavaskar says something that is not percentages.',
      },
      {
        id: 'B',
        label: 'Roger Binny. The tournament’s leading wicket-taker',
        short: 'Gave Binny the new ball',
        fx: { runs: -12 },
        set: { newball: 'binny' },
        outcome:
          'Binny is accurate, as he always is. The openers watch him carefully and take what he gives.\n\nNo wickets. No damage. Twelve runs gone, and they have had a good look at your best bowler.',
      },
      {
        id: 'C',
        label: 'Madan Lal. He wants it most',
        short: 'Gave Madan Lal the new ball',
        fx: { runs: -18, swagger: 5 },
        set: { newball: 'madan' },
        outcome:
          'Madan Lal bowls as if he is angry with the ball. Haynes hits him through the covers twice.\n\nHe walks back to his mark faster each time. He will have little left later.',
      },
    ],
  },
  {
    id: 's4',
    num: 'IV',
    title: 'Vivian Richards',
    date: 'Over 12',
    place: 'Lord’s · The middle',
    env: 'ground',
    beats: () => [
      { text: 'He comes out without a helmet. He never wears one. He is chewing gum, and he looks at your field the way a man looks at a menu.' },
      { text: 'In half an hour he has thirty-three, with seven fours. Three of them came in one over from Madan Lal.' },
      { text: 'The ground has relaxed. People who came to see West Indies win are settling in to watch how.' },
      { text: 'At this rate it will be over before tea. Madan Lal is standing at your elbow with his hand out.' },
    ],
    advisors: () => [
      madan('One more over. He hit me, fine. I have got him before and I will get him here. Give me the ball, Kaps.'),
      gavaskar('He has just taken twelve off him. You cannot feed a man like that. Take Madan off.'),
      kirmani('He is not respecting anyone. He is hitting good balls. A man who hits good balls will hit one in the air.'),
    ],
    prompt: 'Do you give Madan Lal the ball?',
    options: (f) => [
      f.newball === 'madan'
        ? {
            id: 'A',
            label: 'Give him one more over',
            short: 'Gave Madan Lal one more over',
            fx: { runs: -62, wickets: 1, swagger: 5, belief: -5 },
            set: { madan: 'trusted', spent: true },
            outcome:
              'He wants it badly. But he bowled his heart out with the new ball an hour ago, and his legs have gone.\n\nThe short one sits up. Richards puts it into the Mound Stand. Haynes falls at the other end, but Richards does not.',
          }
        : {
            id: 'A',
            label: 'Give him one more over',
            short: 'Gave Madan Lal one more over',
            fx: {},
            set: { madan: 'trusted' },
            outcome: 'You hand him the ball. He does not say thank you. He is already walking back to his mark.\n\nHaynes drives, and is caught at cover. Then Richards is on strike.',
          },
      {
        id: 'B',
        label: 'Take him off. Bowl yourself',
        short: 'Took Madan Lal off',
        fx: { runs: -85, wickets: 1, belief: -10, swagger: 5 },
        set: { madan: 'removed' },
        outcome:
          'You bowl fast and straight. He hits you through mid-wicket anyway. He is seeing it like a football.\n\nHaynes falls at the other end. Richards goes on to sixty before anyone moves him.',
      },
      {
        id: 'C',
        label: 'Slow it down. Bring on Kirti Azad’s off-spin',
        short: 'Took Madan Lal off for spin',
        fx: { runs: -68, wickets: 1 },
        set: { madan: 'removed' },
        outcome: 'Azad bowls flat, and Richards, for once, just milks it. The scoring slows. So does the match.\n\nHaynes gets himself out. Richards is still there.',
      },
    ],
  },
  {
    id: 's4b',
    num: 'IV',
    title: 'The Ball Is in the Air',
    date: 'Over 14',
    place: 'Lord’s · Mid-wicket',
    env: 'ground',
    skip: (f) => f.madan !== 'trusted' || !!f.spent,
    beats: () => [
      { text: 'Madan Lal drops it short. Richards swivels and pulls, as he has all afternoon. But this one is a fraction quicker, and it takes the top edge.' },
      { text: 'It goes up. A long way up, over mid-wicket, swirling towards the boundary.' },
      { text: 'You are at mid-wicket. The ball is behind you, over your shoulder, twenty yards away and getting further.' },
      { text: 'Yashpal Sharma is running in from the deep. There is no time to think about any of this.' },
    ],
    advisors: () => [],
    prompt: 'The ball is in the air.',
    timer: { seconds: 4, fallback: 'B' },
    options: () => [
      {
        id: 'A',
        label: 'Shout “Mine!” and run',
        short: 'Called for the catch',
        fx: { wickets: 2, runs: -52, belief: 30, swagger: -35 },
        set: { catch: 'called' },
        outcome:
          'You turn your back on the pitch and run. You do not look at the ground. You do not look at Yashpal. You look at a red ball against a white sky, over your left shoulder.\n\nIt is coming down slowly, and you are still running when it falls into your hands.\n\nYou do not fall. You just keep running, because you were already running. Behind you, the Indians in the crowd are making a noise that Lord’s has not heard before.\n\nRichards, caught Kapil Dev, bowled Madan Lal, 33. West Indies 57 for 3.',
      },
      {
        id: 'B',
        label: 'Leave it for Yashpal, who is running towards the ball',
        short: 'Left the catch',
        fx: { wickets: 1, runs: -72, belief: -10, swagger: -5 },
        set: { catch: 'left' },
        outcome:
          'It is the percentage call. Yashpal is facing the ball and you are not.\n\nBut he has thirty yards to make, and the ball dies in the breeze, and he gets one hand to it at full stretch.\n\nRichards does not offer another chance for an hour.',
      },
    ],
  },
  {
    id: 's5',
    num: 'V',
    title: 'The Captain with One Leg',
    date: 'Over 20',
    place: 'Lord’s · The middle',
    env: 'ground',
    beats: (_f, m) => [
      { text: `${score(m)}. And now Clive Lloyd is at the crease, and something is wrong.` },
      { text: 'He has pulled a muscle. He has called for a runner. The most feared captain in cricket is standing on one good leg, and he cannot get to the pitch of the ball.' },
      { text: 'He can still hit it, though. Standing still, he hits it very hard.' },
    ],
    advisors: () => [
      amarnath('He cannot move his feet. Make him drive. Pitch it up outside off, and put men in front of the bat.'),
      gavaskar('They have all the time in the world. Spread the field. Make them take singles on one leg. Let the pressure do it.'),
      kirmani('He is angry. He wants to finish this in boundaries, to show the leg does not matter.'),
    ],
    prompt: 'How do you bowl to Lloyd?',
    options: (f) => [
      {
        id: 'A',
        label: 'Attack. Binny, pitched up, with catchers in front of the bat',
        short: 'Attacked Lloyd',
        fx: { wickets: 3, runs: f.newball === 'binny' ? -27 : -19, belief: 10, swagger: -20 },
        set: { lloyd: 'attacked' },
        outcome:
          'Gomes edges to slip. Then Binny floats one up, wide of off stump. Lloyd cannot get his front foot to it, so he throws his hands.\n\nIt goes flat and hard to mid-off, where you are standing. This one you do not have to run for.\n\nLloyd, caught Kapil Dev, bowled Binny, 8. Then Bacchus edges Sandhu behind. The noise from the other dressing room has stopped.',
      },
      {
        id: 'B',
        label: 'Defend. Spread the field and dry up the runs',
        short: 'Spread the field for Lloyd',
        fx: { wickets: 2, runs: -42, swagger: -5 },
        set: { lloyd: 'defended' },
        outcome:
          'Singles are hard on one leg. But Lloyd waits, and waits, and when the bad ball comes he does not need to run.\n\nHe makes thirty before he holes out. The runs you saved, he took back in fours.',
      },
      {
        id: 'C',
        label: 'Bounce him. He cannot duck on that leg',
        short: 'Bounced Lloyd',
        fx: { wickets: 1, runs: -70, swagger: 10, belief: -5 },
        set: { lloyd: 'bounced' },
        outcome: 'You are twenty-four and you have a fast bowler’s pride.\n\nHe hooks you into the Tavern off the back foot, twice, standing perfectly still.',
      },
    ],
  },
  {
    id: 's6',
    num: 'VI',
    title: 'The Long Afternoon',
    date: 'Over 30 to 42',
    place: 'Lord’s · The middle',
    env: 'ground',
    beats: (_f, m) => [
      { text: 'Now comes the hard part, and nobody warned you about it.' },
      { text: 'Jeff Dujon and Malcolm Marshall are not Richards and Lloyd. They do not need to be. They block. They nudge. They run. Ten runs. Twenty. Forty.' },
      { text: 'The crowd has gone quiet in a different way. Your fielders are starting to look at the scoreboard between balls.' },
      { text: `${score(m)}, and climbing. You have used most of your own overs, and Sandhu’s, and Madan Lal’s.` },
    ],
    advisors: () => [
      gavaskar('You have overs left. You are the best bowler in this side. Bring yourself back and finish it.'),
      kirmani('They are set against pace now. They are waiting for it. Everything is coming on to the bat nicely.'),
      amarnath('Give me a few. I bowl so slowly they will have to make all the pace themselves. Somebody will get bored.'),
    ],
    prompt: 'Who breaks the partnership?',
    options: () => [
      {
        id: 'A',
        label: 'Mohinder Amarnath. Slow, wobbling, harmless-looking',
        short: 'Turned to Amarnath',
        fx: { wickets: 2, runs: -48, belief: 15, swagger: -15 },
        set: { partnership: 'amarnath' },
        outcome:
          'They add forty-three before you turn to him. Jimmy Amarnath runs in off a few lazy paces, as if he is bringing the ball back to someone who lost it.\n\nDujon, who has batted for an hour without a mistake, watches one all the way on to his bat, and from his bat on to his stumps.\n\nThen Marshall reaches for a wide one, and Gavaskar holds it at slip.',
      },
      {
        id: 'B',
        label: 'Yourself. Pace, and the captain’s responsibility',
        short: 'Bowled myself',
        fx: { wickets: 1, runs: -64 },
        set: { partnership: 'pace' },
        outcome:
          'You get Marshall, caught behind off a good one. But Dujon has been waiting for pace all afternoon, and he takes fourteen from your last two overs.\n\nYou are bowled out. The ball goes to someone else now, whatever happens.',
      },
      {
        id: 'C',
        label: 'Kirti Azad. Spin from both ends, and make them hit out',
        short: 'Turned to spin',
        fx: { wickets: 1, runs: -72, swagger: 5 },
        set: { partnership: 'spin' },
        outcome: 'Azad ties them down for three overs. In the fourth, Marshall puts him into the Grandstand.\n\nOne wicket falls, to a slog. The runs have gone.',
      },
    ],
  },
  {
    id: 's7',
    num: 'VII',
    title: 'The Last Pair',
    date: 'Over 50',
    place: 'Lord’s · The middle',
    env: 'ground',
    beats: (_f, m) => [
      { text: `${score(m)}. They are down to the men who are not batsmen. But they are very tall, they have nothing to lose, and they swing.` },
      { text: 'Around the boundary, the crowd is no longer in the seats. They are standing on the grass, ten deep, held back by policemen who keep looking over their shoulders.' },
      { text: 'When this ends, however it ends, they are going to run.' },
    ],
    advisors: () => [
      amarnath('Same as before. Straight. He will miss one.'),
      kirmani('If the crowd comes on before it is over, grab a stump and run. Do not stop for anybody.'),
    ],
    prompt: 'How do you finish it?',
    options: (_f, m) => [
      {
        id: 'A',
        label: 'Keep it straight and slow, with everybody saving one',
        short: 'Kept it straight and slow',
        fx: { runs: -16, wickets: 2 },
        set: { finished: true },
        outcome:
          m.runs > 16
            ? 'One of them plays back to a ball that keeps a little low. It hits him on the pad, in front of all three.\n\nThe bowler turns round. He does not shout. He raises one finger and looks at the umpire, and the umpire’s finger goes up too.\n\nYou do not see what happens next very clearly, because the whole crowd is running at you.'
            : 'They do not need to swing. They need a handful, and they take them in ones and twos, off the edge and off the pad.\n\nThe last of them comes from a thick edge through an empty slip cordon.',
      },
      {
        id: 'B',
        label: 'Bring every man in. Dare them to hit over the top',
        short: 'Brought the field in',
        fx: { runs: m.belief >= 50 ? -8 : -30, wickets: 2 },
        set: { finished: true },
        outcome:
          m.belief >= 50 && m.runs > 8
            ? 'Eleven men round the bat, and every one of them certain. The big swing comes at once. It goes straight up.\n\nKirmani is under it, shouting, before it has reached the top.\n\nThen you cannot see anything, because the whole crowd is running at you.'
            : m.runs > 30
              ? 'It is a gamble, and your fielders are not sure of it. Two swings clear the ring and run away for four. A third is dropped.\n\nThe fourth goes straight up, and this one is held. It was closer than it should have been.'
              : 'It is a gamble, and your fielders are not sure of it. The first swing clears the ring. So does the second.\n\nThere is nobody back to stop the third.',
      },
    ],
  },
];

const won = (m: Meters) => m.runs > 0;

export const E1983: Episode = {
  id: '1983',
  num: '03',
  year: '1983',
  title: 'One Hundred and Eighty-Three',
  you: 'Kapil Dev',
  short: 'Kapil',
  hook: 'It is the World Cup final at Lord’s, and your total is not enough.',
  begin: 'Walk out to bat',
  duration: 'About 15 minutes',
  shareLine: 'I captained India at Lord’s.',
  decideHead: 'Captain’s call',
  stamp: 'Called',
  speakers: {},

  briefing: [
    { text: 'Lord’s, London. Saturday, 25 June 1983.' },
    {
      text: 'You are twenty-four years old. At a training camp once, you asked for more food because fast bowlers need to eat. An official laughed, and told you India does not produce fast bowlers.',
    },
    { text: 'In two previous World Cups, India won one match. It was against East Africa.' },
    { text: 'The bookmakers gave you odds of 66 to 1. One English writer promised to eat his words if you won.' },
    {
      text: 'A week ago, at a small ground in Tunbridge Wells, you walked out at 17 for 5 against Zimbabwe and made 175 not out. The BBC was on strike that day. No camera recorded it.',
    },
    {
      text: 'Today is the final. Across the corridor are the West Indies: champions in 1975, champions in 1979, never beaten in a World Cup final.',
    },
    { text: 'Roberts. Marshall. Holding. Garner. Greenidge. Haynes. Lloyd. Richards.' },
    { text: 'Clive Lloyd has won the toss. He has asked you to bat.' },
  ],

  meters: [
    { key: 'runs', start: 183, max: 999 },
    // India's total, kept so West Indies' score can be shown.
    { key: 'total', start: 183, max: 999 },
    { key: 'wickets', start: 0, max: 10 },
    { key: 'belief', start: 30 },
    { key: 'swagger', start: 90 },
  ],
  hero: (m, f) =>
    f.batted
      ? { key: 'runs', label: 'Runs in hand', value: m.runs, unit: m.runs === 1 ? 'run' : 'runs', danger: m.runs <= 40 }
      : { key: 'score', label: 'India', value: 92, unit: 'for 4', danger: false },
  gauges: (m) => [
    { key: 'wickets', label: `Wickets · ${m.wickets} of 10`, value: m.wickets * 10, delta: { label: 'Wickets', per: 10 } },
    { key: 'belief', label: 'Belief', value: m.belief, low: m.belief < 25 },
    { key: 'swagger', label: 'Their swagger', value: m.swagger },
  ],
  pressure: (m, f) => (f.batted ? Math.max(0, Math.min(1, 1 - m.runs / 125)) : 0.3),

  scenes: SCENES,

  onEnter: (scene, m0, f) => {
    let m = m0;
    const notes: string[] = [];
    const n = Number(scene.id[1]);
    if (n >= 4 && scene.id !== 's4b') {
      if (m.swagger > 85) {
        m = { ...m, runs: Math.max(0, m.runs - 6) };
        notes.push('West Indies are batting without a care. Six more runs gone.');
      }
      if (m.belief < 15) {
        m = { ...m, runs: Math.max(0, m.runs - 8) };
        notes.push('Heads have dropped. A catch goes down. Eight more runs gone.');
      }
    }
    // Arriving at the last pair with fewer than eight down means the missing wickets still have to be bought.
    if (scene.id === 's7' && m.wickets < 8) {
      const short = 8 - m.wickets;
      m = { ...m, runs: Math.max(0, m.runs - short * 14), wickets: 8 };
      notes.push(`You needed ${short} more ${short === 1 ? 'wicket' : 'wickets'} to reach the tail. Each one cost runs.`);
    }
    if (f.batted && scene.id !== 's2') notes.push(score(m) + '.');
    return { meters: m, flags: f, notes };
  },

  lost: (m) => (m.runs <= 0 ? (m.wickets <= 4 ? 'formalities' : 'never') : undefined),
  final: (m: Meters, _f: Flags) => (!won(m) ? 'never' : m.runs >= 30 ? 'champions' : 'whisker'),

  endings: {
    champions: {
      title: 'Champions of the World',
      env: 'dressing',
      text: (_f, m) => [
        `India win by ${m.runs} runs.`,
        'They carry you. You do not remember going up the steps.',
        'On the balcony, somebody puts the Prudential Cup in your hands. It is smaller than you expected, and heavier. Below you the outfield has disappeared under people, and they are all looking up.',
        'At home it is past midnight. Nobody is asleep. In ten thousand towns, people who had gathered round a single television in a shop window are in the street.',
        'There is no champagne in your dressing room. Nobody thought to order any. So you walk across the corridor and ask Clive Lloyd, who is sitting very quietly, if you might borrow some of his.',
        'He says yes.',
      ],
    },
    whisker: {
      title: 'By the Width of a Bat',
      env: 'dressing',
      text: (_f, m) => [
        `India win by ${m.runs} ${m.runs === 1 ? 'run' : 'runs'}.`,
        'It should not have been this close, and you will lie awake thinking about why it was.',
        'World champions. The margin will be forgotten. The date will not.',
      ],
    },
    never: {
      title: 'A Hundred and Eighty-Three Was Never Enough',
      env: 'ground',
      text: () => [
        'West Indies get there, late in the afternoon, with wickets still standing.',
        'The newspapers are kind. Gallant India. Brave little India. They write about how far you came. They write about Tunbridge Wells.',
        'Nobody had expected anything else. That is the part that stays with you.',
        'West Indies have won three World Cups in a row.',
      ],
    },
    formalities: {
      title: 'The Formalities',
      env: 'ground',
      text: () => [
        'Richards finishes it with a six into the Pavilion. He does not watch it land.',
        'You shake hands. You say the right things.',
        'On the flight home, somebody has a newspaper with the odds in it: sixty-six to one. It seems about right.',
      ],
    },
  },

  history: [
    {
      decision: 'With the bat',
      scenes: ['s1'],
      real: 'Attacked Larry Gomes: 15 from 8 balls, then caught by Holding. India were all out for 183 in 54.4 overs.',
      realShort: 'Kapil went after Gomes',
      match: (f) => f.batted === 'attacked',
    },
    {
      decision: 'At the break',
      scenes: ['s2'],
      real: 'By most accounts, told his team it was not a winning total but a fighting one.',
      realShort: 'Kapil called it a fighting total',
      match: (f) => f.talk === 'fight',
    },
    {
      decision: 'The new ball',
      scenes: ['s3'],
      real: 'Shared it with Balwinder Sandhu, who bowled Gordon Greenidge shouldering arms for 1.',
      realShort: 'Kapil gave it to Sandhu',
      match: (f) => f.newball === 'sandhu',
    },
    {
      decision: 'Madan Lal',
      scenes: ['s4'],
      real: 'Gave him the over he asked for. Richards top-edged a pull.',
      realShort: 'Kapil gave him one more over',
      match: (f) => f.madan === 'trusted',
    },
    {
      decision: 'The catch',
      scenes: ['s4b'],
      real: 'Ran back some twenty yards from mid-wicket and took it over his shoulder. Richards c Kapil Dev b Madan Lal 33.',
      realShort: 'Kapil called and ran',
      match: (f) => f.catch === 'called',
    },
    {
      decision: 'Lloyd',
      scenes: ['s5'],
      real: 'Kept attacking. Lloyd, batting with a runner, drove Binny to Kapil Dev for 8.',
      realShort: 'Kapil attacked',
      match: (f) => f.lloyd === 'attacked',
    },
    {
      decision: 'The partnership',
      scenes: ['s6'],
      real: 'Turned to Mohinder Amarnath, who bowled Dujon, had Marshall caught, and later trapped Holding lbw.',
      realShort: 'Kapil turned to Amarnath',
      match: (f) => f.partnership === 'amarnath',
    },
  ],
  afterwards:
    'India 183, West Indies 140. India won by 43 runs. Mohinder Amarnath, with 26 runs and 3 for 12, was Man of the Match. It was the first time West Indies had lost a World Cup final. Four years later the World Cup was held in India and Pakistan, the first outside England.',
  otherView:
    'West Indies beat India 5–0 in a one-day series a few months later, and many of their players have said they lost the final through carelessness, not to a better side. Lloyd’s injury mattered. So did a pitch that helped medium pace. India’s own players have said, cheerfully, that they would have lost that match nine times out of ten. Whether a captain’s choices decide a cricket match, or only decorate it, is something cricket has never settled.',

  free: [
    {
      match: /tamper|match.?fix|bribe|injure|beamer/i,
      who: 'Rewindo',
      text: 'That is outside what this episode will simulate. Make a captain’s call.',
      fx: {},
    },
    {
      match: /srikkanth|cheeka/i,
      who: 'Kris Srikkanth',
      text: 'Captain, I will do it. But I am telling you now, I do not know where it is going.',
      fx: { runs: -10, belief: 5 },
    },
    {
      match: /sledge|abuse|stare|talk to (him|richards)|needle/i,
      who: 'Syed Kirmani',
      text: 'Please do not wake him up.',
      fx: { swagger: 10 },
    },
    {
      match: /spin|azad|shastri/i,
      who: 'Sunil Gavaskar',
      text: 'On a June afternoon at Lord’s, with the ball doing this much for the seamers? It costs you an over to find out.',
      fx: { runs: -8 },
    },
    {
      match: /light|rain|waste time|delay|slow down/i,
      who: 'P.R. Man Singh',
      text: 'From the balcony, the manager simply shakes his head. It is a bright afternoon, and the umpires are watching.',
      fx: {},
    },
    {
      match: /gavaskar.*captain|hand over|let (sunil|gavaskar)/i,
      who: 'Sunil Gavaskar',
      text: 'You got us here. You finish it.',
      fx: { belief: -5 },
    },
    {
      match: /pray|huddle|gather|team talk|together/i,
      who: 'Mohinder Amarnath',
      text: 'You call them in. Nobody says much. Somebody makes a joke about the return tickets. It helps.',
      fx: { belief: 8 },
    },
  ],
  fallback: {
    who: 'Syed Kirmani',
    text: 'Maybe, Kaps. But the umpire is waiting, and the batsman is ready.',
  },
};
