// Episode 02 — The Midnight Proclamation.
// Content source: episodes/1975-the-midnight-proclamation.md. All dialogue is dramatised.

import type { Advisor, Episode, Flags, Meters, Scene } from './types';

const sanjay = (text: string): Advisor => ({ id: 'sanjay', name: 'Sanjay Gandhi', role: 'Your younger son', text });
const ray = (text: string): Advisor => ({
  id: 'ray',
  name: 'Siddhartha Shankar Ray',
  role: 'Chief Minister of West Bengal',
  text,
});
const dhar = (text: string): Advisor => ({ id: 'dhar', name: 'P.N. Dhar', role: 'Principal Secretary', text });
const dhawan = (text: string): Advisor => ({ id: 'dhawan', name: 'R.K. Dhawan', role: 'Private Secretary', text });
const elder = (text: string): Advisor => ({ id: 'elder', name: 'The Elder', role: 'Senior Cabinet Minister', text });

const declared = (f: Flags) => f.emergency === 'declared';
/** Once the press is censored the player sees only what officials report, until something breaks the mirror. */
const mirrored = (f: Flags) => f.press === 'censored' && !f.revealed;

const SCENES: Scene[] = [
  {
    id: 's1',
    num: 'I',
    title: 'The Verdict',
    date: '12 June 1975',
    place: '1 Safdarjung Road',
    env: 'office',
    beats: () => [
      { text: 'The teleprinter in the next room starts just after ten. Your secretary reads it twice before he brings it in.' },
      {
        text: 'Justice Jagmohanlal Sinha of the Allahabad High Court has found you guilty of electoral malpractice. A government officer worked on your campaign before his resignation took effect. State officials built the stages you spoke from.',
      },
      { text: 'Your election is void. You are barred from elected office for six years.' },
      { text: 'He has stayed his own order for twenty days, so that you may appeal.' },
      {
        text: 'By afternoon the news from Gujarat arrives: the Congress has lost the state. Outside your gate a crowd is gathering. Some of it has been brought in buses.',
      },
    ],
    advisors: () => [
      dhar(
        'Step aside for a few weeks. Name someone you trust. Win the appeal and come back with your hands clean. The country will remember that you respected the court.',
      ),
      sanjay(
        'Step aside and you will never come back. Whoever sits in that chair will like it. Look outside. The people want you.',
      ),
      elder('Whatever you decide, Prime Minister, the party is behind you.'),
    ],
    prompt: 'Do you stay?',
    options: () => [
      {
        id: 'A',
        label: 'Stay in office and appeal to the Supreme Court',
        short: 'Stayed in office',
        fx: { hold: 5, trust: -8 },
        set: { stayed: 'yes' },
        outcome:
          'You tell the party you will abide by the Supreme Court.\n\nThe rallies outside your house continue all week. You wave from the lawn.',
      },
      {
        id: 'B',
        label: 'Step aside for a caretaker while the appeal is heard',
        short: 'Stepped aside',
        fx: { trust: 15, hold: -20 },
        set: { stayed: 'stepped_aside' },
        end: 'caretaker',
        outcome:
          'You name a caretaker. The crowd at the gate is confused, then quiet.\n\nBy evening three ministers have called on him. None has called on you.',
      },
      {
        id: 'C',
        label: 'Stay, and call a snap election to let the voters overrule the judge',
        short: 'Called a snap election',
        fx: { trust: 5, order: -10, hold: -10 },
        set: { stayed: 'yes' },
        outcome:
          'The opposition calls it contempt of court with a ballot box.\n\nYour own party asks how it is meant to campaign with the price of wheat where it is. The date slips, and the summer goes on.',
      },
    ],
  },
  {
    id: 's2',
    num: 'II',
    title: 'The Conditional Stay',
    date: '25 June 1975',
    place: 'Prime Minister’s Office',
    env: 'office',
    beats: () => [
      {
        text: 'The Supreme Court is on vacation. A single judge, Justice V.R. Krishna Iyer, hears you. His order is neither victory nor defeat.',
      },
      { text: 'You may remain Prime Minister. You may not vote in Parliament until the appeal is decided.' },
      {
        text: 'This evening Jayaprakash Narayan will address a rally at the Ramlila Maidan. Your intelligence people say he will call on the police and the army to refuse illegal orders.',
      },
      { text: 'He has been quoting a poet. Vacate the throne, for the people are coming.' },
      {
        text: 'Siddhartha Shankar Ray has been reading the Constitution. Article 352 allows an emergency for “internal disturbance”. It needs only the President’s signature.',
      },
    ],
    advisors: () => [
      ray('It is constitutional. Every power you need is there in the text. You would be using the law, not breaking it.'),
      sanjay('He is telling soldiers to mutiny and you are asking lawyers for permission. I have a list of names.'),
      dhar(
        'You have laws enough already. Arrest those who incite the forces, if they do. Do not suspend a democracy to stop a rally.',
      ),
    ],
    prompt: 'How do you answer?',
    options: () => [
      {
        id: 'A',
        label: 'Proclaim an internal Emergency',
        short: 'Declared the Emergency',
        fx: {},
        set: { emergency: 'declared' },
        outcome: 'You ask Ray to draft the letter to the President.\n\nAcross the city, the rally is beginning.',
      },
      {
        id: 'B',
        label: 'Use existing laws. Ban the rally and detain those who call for mutiny',
        short: 'Used ordinary law',
        fx: { order: 10, liberty: -15, trust: -10, hold: 5 },
        set: { emergency: 'ordinary_law' },
        outcome:
          'The rally is banned. It happens anyway, smaller and angrier. Forty leaders are held.\n\nThe courts begin hearing their petitions the same week, and some are released. You are fighting on every front at once.',
      },
      {
        id: 'C',
        label: 'Let the rally happen. Go on the radio and answer him',
        short: 'Let the rally happen',
        fx: { order: -10, trust: 8, hold: -10 },
        set: { emergency: 'none' },
        outcome:
          'A quarter of a million people hear him. Then they go home.\n\nThe next morning nobody has mutinied, and nobody has stopped marching either.',
      },
      {
        id: 'D',
        label: 'Open talks with JP through intermediaries',
        short: 'Opened talks with JP',
        fx: { order: 5, hold: -15, trust: 5 },
        set: { emergency: 'none' },
        outcome:
          'He will talk. His price is the dissolution of the Bihar assembly, and then, he hints, yours.\n\nYour party hears that you are negotiating and starts to do the same.',
      },
    ],
  },
  {
    id: 's3',
    num: 'III',
    title: 'Before Midnight',
    date: '25 June 1975 · Night',
    place: 'Rashtrapati Bhavan',
    env: 'night',
    skip: (f) => !declared(f),
    beats: () => [
      {
        text: 'The rally is still going on when you and Ray are shown in to see the President. Fakhruddin Ali Ahmed reads the draft. He asks one question: has the Cabinet approved this?',
      },
      { text: 'It has not. The rules say it should.' },
      { text: 'At home, Sanjay and a junior Home minister are going through lists of names.' },
      {
        text: 'Someone asks about the newspapers. Most of Delhi’s are printed on one street, Bahadur Shah Zafar Marg. That street has one power supply.',
      },
    ],
    advisors: () => [
      ray(
        'The Cabinet can ratify at dawn. But I did not advise locking up the entire opposition, and I did not advise touching the press. That is not what the Article is for.',
      ),
      sanjay(
        'If one newspaper prints tomorrow, there will be a crowd by noon. Cut the lights. And the Chief Ministers should be told what to do, not asked.',
      ),
      dhawan('The President is waiting, Madam. The letter needs your signature tonight if it is to be tonight.'),
    ],
    prompt: 'How is it done?',
    options: () => [
      {
        id: 'A',
        label: 'Tonight. Tell the Cabinet at dawn. Arrest the leaders, cut power to the presses, censor the news',
        short: 'Arrests, and silenced the press',
        fx: { hold: 35, order: 30, liberty: -45, trust: -15 },
        set: { cabinet: 'bypassed', press: 'censored' },
        outcome:
          'The President signs a little before midnight. Before dawn, Jayaprakash Narayan, Morarji Desai and hundreds of others are woken and taken away. The presses on Bahadur Shah Zafar Marg go dark.\n\nAt six your ministers are called in and told. Nobody objects. One asks under which law the arrests were made, and does not ask again.\n\nAt eight you speak on All India Radio. “The President has proclaimed Emergency. There is nothing to panic about.”\n\nFrom this morning, what you know of the public mood is what your officials choose to report.',
      },
      {
        id: 'B',
        label: 'Tonight, with arrests, but leave the press alone',
        short: 'Arrests, but left the press free',
        fx: { hold: 20, order: 15, liberty: -25, trust: -12 },
        set: { cabinet: 'bypassed', press: 'free' },
        outcome:
          'The arrests go as planned. So does the morning edition.\n\nThe photograph of JP being led to a police car is on every front page in the country, and in London and New York by evening.',
      },
      {
        id: 'C',
        label: 'Call the Cabinet at midnight first, then proclaim it with their consent',
        short: 'Took it to the Cabinet first',
        fx: { hold: 20, order: 20, liberty: -35, trust: -10 },
        set: { cabinet: 'consulted', press: 'censored' },
        outcome:
          'The ministers assemble at midnight, bewildered. They agree, because the alternative is to be the one who did not.\n\nBut two hours have passed and telephones have been ringing. Several names on the list are not at home when the police arrive.\n\nBy morning the presses are silent. From now on, what you know of the public mood is what your officials choose to report.',
      },
    ],
  },
  {
    id: 's4',
    num: 'IV',
    title: 'Above the Courts',
    date: 'August 1975',
    place: 'Parliament House',
    env: 'hall',
    beats: (f) => [
      {
        text: declared(f)
          ? 'The trains are running on time. Prices are falling. Offices are full at ten in the morning. A good monsoon has helped, and you have announced a Twenty-Point Programme for the poor. Visitors tell you the country needed this.'
          : 'The marches continue. The summer has been long, and Parliament is noisy.',
      },
      { text: 'Your appeal is still before the Supreme Court. If you lose it, none of the rest matters.' },
      {
        text: `The Law Minister has a draft. A constitutional amendment would place the election of a Prime Minister beyond the reach of any court, with effect from the past. With the opposition benches ${declared(f) ? 'half empty' : 'in uproar'}, it could pass in days.`,
      },
    ],
    advisors: () => [
      elder('The Law Minister assures me it is watertight. The party will vote as you ask.'),
      dhar(
        'Change the election law if you must, so that what you did in 1971 was never an offence. Then let the judges rule on it. If you put yourself above the court, you are admitting you would have lost in it.',
      ),
      sanjay('Five old men in robes should not decide who governs six hundred million people.'),
    ],
    prompt: 'What do you put before Parliament?',
    options: () => [
      {
        id: 'A',
        label: 'The full amendment: the Prime Minister’s election is beyond judicial review',
        short: 'Put my election above the courts',
        fx: { hold: 20, liberty: -20, trust: -8 },
        set: { amendment: 'passed' },
        outcome:
          'It passes both Houses in under a week.\n\nIn November the Supreme Court upholds your election, and in the same judgment strikes down the clause that tried to take the question away from it. You have won, and been told what you tried to do.',
      },
      {
        id: 'B',
        label: 'Only change the election law retroactively, and let the Supreme Court decide',
        short: 'Changed the election law only',
        fx: { hold: 10, liberty: -8, trust: -3 },
        set: { amendment: 'limited' },
        outcome:
          'The law is changed. In November the Court applies it and upholds your election.\n\nCritics say you rewrote the rules after the match. But a court decided, and you can say so.',
      },
      {
        id: 'C',
        label: 'Neither. Argue the appeal on the law as it stood',
        short: 'Left the law as it stood',
        fx: { liberty: 5, trust: 10, hold: -25 },
        set: { amendment: 'refused' },
        outcome:
          'Your lawyers are not optimistic. The hearing is set for the autumn.\n\nEvery Chief Minister in your party is now doing arithmetic.',
      },
    ],
  },
  {
    id: 's5',
    num: 'V',
    title: 'The Second Son',
    date: 'April 1976',
    place: '1 Safdarjung Road',
    env: 'study',
    skip: (f) => !declared(f),
    beats: (f) => [
      {
        text:
          f.press === 'censored'
            ? 'The newspapers are full of good news, because that is what they are permitted to print.'
            : 'The newspapers are angry, and you read all of them.',
      },
      {
        text: 'Sanjay has a programme of his own: plant trees, end dowry, teach each one to read, clear the slums, limit families. He holds no office. Chief Ministers come to the airport to receive him.',
      },
      { text: 'A woman you have known for thirty years asks to see you alone. She has been to Old Delhi.' },
      {
        text: 'Near Turkman Gate, she says, bulldozers have been clearing homes. When people resisted, the police opened fire. She does not know how many died.',
      },
      {
        text: 'In the villages of the north, she says, schoolteachers and policemen are being given quotas of men to bring in for sterilisation. They are filling them however they can.',
      },
      { text: 'None of this is in the files on your desk. The files say that targets are being exceeded.' },
    ],
    advisors: () => [
      sanjay(
        'For twenty-five years this country made plans and built nothing. I am getting things done. You cannot make a new city without moving anyone.',
      ),
      dhar(
        'I can no longer tell you what is happening in this country, because nobody will tell me. That should frighten you more than any rally.',
      ),
      dhawan('There are always complaints, Madam. The reports from the states are very positive.'),
    ],
    prompt: 'What do you do about Sanjay?',
    options: () => [
      {
        id: 'A',
        label: 'Nothing. He is the only one who gets results',
        short: 'Backed Sanjay',
        fx: { hold: 5, order: 5, liberty: -10, trust: -25 },
        set: { sanjay: 'backed' },
        outcome: 'The targets go on being exceeded.\n\nThe reports on your desk say so every week.',
      },
      {
        id: 'B',
        label: 'Speak to him privately. Tell the states to end coercion, without saying why',
        short: 'Reined Sanjay in quietly',
        fx: { liberty: -3, trust: -12 },
        set: { sanjay: 'reined' },
        outcome:
          'A circular goes out about “voluntary methods”. In some districts it is obeyed.\n\nSanjay does not come to dinner for a week.',
      },
      {
        id: 'C',
        label: 'Remove him from all public work and order an inquiry into the firing',
        short: 'Removed Sanjay, ordered an inquiry',
        fx: { trust: 15, liberty: 8, hold: -15, order: -5 },
        set: { sanjay: 'removed' },
        outcome:
          'The inquiry is the first bad news the newspapers have carried in months. The Youth Congress is furious. Your son does not speak to you.\n\nSeveral officials, seeing which way the wind blows, discover that they had concerns all along.',
      },
    ],
  },
  {
    id: 's6',
    num: 'VI',
    title: 'The Question',
    date: 'January 1977',
    place: '1 Safdarjung Road · Late evening',
    env: 'night',
    skip: (f) => !declared(f),
    beats: (f) => [
      { text: 'Parliament’s term has already been extended. The country is quiet. It has been quiet for nineteen months.' },
      {
        text: mirrored(f)
          ? 'The Intelligence Bureau estimates that in an election the Congress would win about 340 seats.'
          : 'You have no illusions about what an election would be like. The newspapers have seen to that.',
      },
      {
        text: 'Abroad, old friends of your father’s write that they no longer know what to say about India. At home, you have begun to notice that people stop talking when you enter a room.',
      },
      { text: 'Nobody is asking you to hold an election. That is what makes it your decision.' },
    ],
    advisors: () => [
      sanjay(
        'Why now? In five years the country will be transformed and nobody will remember how. Hold an election and you hand the microphone back to the people in jail.',
      ),
      dhar('You have always said this was temporary. The longer it lasts, the harder it will be to find the door.'),
      elder('The reports are excellent, Prime Minister. Of course, the reports are always excellent now.'),
    ],
    prompt: 'Do you ask the country?',
    options: () => [
      {
        id: 'A',
        label: 'Announce a general election. Release the prisoners. Lift censorship',
        short: 'Called the election',
        fx: { liberty: 40, trust: 10 },
        set: { election: 'called' },
        outcome:
          'On 18 January you go on the radio. Elections in March. The prisoners are to be released.\n\nWithin days the men you jailed are addressing crowds larger than any you have seen in two years.',
      },
      {
        id: 'B',
        label: 'Extend Parliament’s term by another year',
        short: 'Postponed the election',
        fx: { liberty: -10, hold: 5, trust: -10 },
        set: { election: 'postponed' },
        outcome: 'The Bill passes without a division. There is nobody left in the House to divide it.\n\nThe country stays quiet.',
      },
      {
        id: 'C',
        label: 'Release the prisoners and end censorship, but hold no election yet',
        short: 'Freed the prisoners and the press',
        fx: { liberty: 25, order: -20, hold: -15, trust: 8 },
        set: { election: 'postponed', released: true, revealed: true, press: 'free' },
        outcome:
          'The jails open. The newspapers print again, and for the first time in nineteen months you read what the country thinks of you.\n\nIt is not what the reports said.',
      },
    ],
  },
  {
    id: 's6b',
    num: 'VI',
    title: 'The Question, Again',
    date: 'Later',
    place: '1 Safdarjung Road',
    env: 'night',
    skip: (f) => !declared(f) || f.election === 'called',
    beats: (f) =>
      f.released
        ? [
            { text: 'It is a month later. Every newspaper asks the same thing each morning: when?' },
            { text: 'The men you released are holding rallies. Your own party is asking you for a date, or a reason.' },
          ]
        : [
            { text: 'January 1978. Another year has passed. The term runs out again.' },
            {
              text: 'The files are thinner now. Officials have learned that short reports are safer. You cannot remember when someone last disagreed with you.',
            },
            { text: 'Sanjay’s people run most of the states. They no longer wait for your instructions.' },
          ],
    advisors: (f) =>
      f.released
        ? [dhar('You opened the door. The only question left is whether you walk through it or are pushed.')]
        : [
            dhawan('The extension Bill is drafted, Madam. It only needs a date.'),
            dhar('I have asked to return to the university. I do not think I am of use to you here any longer.'),
          ],
    prompt: 'The term is running out.',
    options: (f) => [
      {
        id: 'A',
        label: f.released ? 'Announce the general election' : 'Announce a general election and release the prisoners',
        short: 'Called the election',
        fx: { liberty: f.released ? 15 : 40, trust: f.released ? 5 : 3 },
        set: { election: 'called', revealed: true, press: 'free' },
        outcome: 'You go on the radio and name the date.\n\nFor the first time in a long while, you do not know what will happen next.',
      },
      {
        id: 'B',
        label: 'Extend Parliament’s term again',
        short: 'Never called the election',
        fx: { liberty: -15, hold: 5, trust: -10 },
        set: { election: 'never' },
        outcome: 'The Bill passes.\n\nNobody asks how many more there will be.',
      },
    ],
  },
  {
    id: 's7',
    num: 'VII',
    title: 'Election Night',
    date: '20 March 1977',
    place: '1 Safdarjung Road',
    env: 'night',
    skip: (f) => f.election !== 'called',
    beats: (_f, m) => [
      { text: 'The counting began this morning. You have stopped answering the telephone.' },
      {
        text:
          m.trust >= 50
            ? 'The north is close. The south is holding. By midnight it is clear you will return, with fewer seats and a louder opposition.'
            : m.trust >= 30
              ? 'Seat after seat goes the other way. Some hold. Rae Bareli is too close to call until the small hours, and then it is called against you.'
              : 'By the small hours the pattern is clear. Not one seat in Uttar Pradesh. Not one in Bihar. You have lost Rae Bareli to the man who took you to court.',
      },
      { text: 'The Cabinet Secretary asks whether there are any instructions.' },
    ],
    advisors: () => [],
    prompt: 'The result is in.',
    options: (_f, m) => [
      {
        id: 'A',
        label: 'Accept the result',
        short: 'Accepted the result',
        fx: {},
        outcome:
          m.trust >= 50
            ? 'You form a government. The prisoners you released sit across the aisle and say what they think of you, and it is printed.'
            : 'You call on the Acting President before dawn and resign. On your advice, the Emergency is revoked.\n\nYou go home.',
      },
    ],
  },
];

export const E1975: Episode = {
  id: '1975',
  num: '02',
  year: '1975',
  title: 'The Midnight Proclamation',
  you: 'Indira Gandhi',
  short: 'Indira',
  hook: 'A court has just ruled that you cheated your way into Parliament.',
  begin: 'Read the verdict',
  duration: 'About 20 minutes',
  shareLine: 'I was Indira Gandhi for nineteen months.',
  decideHead: 'The Prime Minister decides',
  speakers: {},

  briefing: [
    { text: 'New Delhi, 12 June 1975.' },
    { text: 'Four years ago you won a landslide and then a war. They called you Durga.' },
    {
      text: 'Since then: drought, an oil shock, prices rising by a quarter in a year. A railway strike broken by force.',
    },
    {
      text: 'A students’ movement in Gujarat and Bihar has found a leader in Jayaprakash Narayan, an old freedom fighter who wants nothing for himself. That makes him dangerous.',
    },
    {
      text: 'This morning a judge in Allahabad will rule on a petition by the man you defeated in 1971. He says you cheated.',
    },
    { text: 'Your lawyers say it is a technical matter. You have not been sleeping well.' },
  ],

  meters: [
    { key: 'liberty', start: 100 },
    { key: 'hold', start: 35 },
    { key: 'order', start: 30 },
    { key: 'trust', start: 45 },
    // What the officials tell you. Only shown while the mirror is up.
    { key: 'reported', start: 45 },
  ],
  hero: (m) => ({ key: 'liberty', label: 'Liberty', value: m.liberty, unit: 'of 100', danger: m.liberty <= 40 }),
  gauges: (m, f) => [
    { key: 'hold', label: 'Hold on office', value: m.hold, low: m.hold < 25 },
    { key: 'order', label: 'Order', value: m.order, low: m.order < 25 },
    mirrored(f)
      ? { key: 'trust', label: 'Public trust (as reported)', value: m.reported }
      : { key: 'trust', label: 'Public trust', value: m.trust, low: m.trust < 25 },
  ],
  // Tense while your office is in doubt, eerily calm once it is secure, tense again on election night.
  pressure: (m, f) => (f.election === 'called' ? 0.75 : Math.max(0, Math.min(1, 1 - m.hold / 70))),

  scenes: SCENES,

  onEnter: (scene, m0, f0) => {
    let m = m0;
    let f = f0;
    const notes: string[] = [];
    if (m.order < 15) {
      m = { ...m, hold: Math.max(0, m.hold - 5) };
      notes.push('Strikes and marches are spreading. Your ministers are losing their nerve.');
    }
    if (mirrored(f)) notes.push('The press is silent. You see the country through official reports.');
    if (scene.id === 's7') {
      f = { ...f, revealed: true };
      notes.push('The ballot boxes are open. No report can soften this.');
    }
    return { meters: m, flags: f, notes };
  },

  // While the mirror is up, the reported figure only ever improves, whatever is really happening.
  afterChoice: (before, after) => {
    if (!mirrored(after.f)) return { ...after.m, reported: after.m.trust };
    const from = mirrored(before.f) ? before.m.reported : before.m.trust;
    return { ...after.m, reported: Math.min(96, from + 6) };
  },

  lost: (m) => (m.hold <= 0 ? 'removed' : undefined),
  final: (m: Meters, f: Flags) => {
    if (!declared(f)) return 'ordinary';
    if (f.election === 'never') return 'long';
    return m.trust >= 50 ? 'mandate' : 'verdict';
  },

  endings: {
    caretaker: {
      title: 'The Caretaker',
      env: 'study',
      text: () => [
        'You watch the autumn from a smaller house. The appeal is heard. What the Court would have decided, on the law as it then stood, is something nobody can know.',
        'There was no Emergency. There was also, for a while, no Indira Gandhi.',
        'Whether you would have found your way back, and what the country would have looked like without those nineteen months, is the question this ending leaves with you.',
      ],
    },
    verdict: {
      title: 'The Verdict of the People',
      env: 'night',
      text: () => [
        'The Congress has been thrown out of office for the first time since Independence.',
        'You suspended a democracy. Then you asked it a question, and when it answered, you went home.',
        'Historians will argue for a long time about which of those facts matters more.',
      ],
    },
    mandate: {
      title: 'The Mandate',
      env: 'office',
      text: () => [
        'You return with fewer seats and a quieter voice.',
        'You held on to power and gave some of it back. It is not a triumph.',
        'It may be the best ending this story has.',
      ],
    },
    long: {
      title: 'The Long Emergency',
      env: 'night',
      text: () => [
        'The term is extended again. And again. The reports remain excellent.',
        'You are safe. The trains run on time. You no longer have any way of knowing what the country thinks, and after a while you stop wondering.',
        'The game does not show how this ends. Governments like this one usually find out all at once.',
      ],
    },
    removed: {
      title: 'Removed',
      env: 'hall',
      text: (f) => [
        f.amendment === 'refused'
          ? 'The Supreme Court upholds the Allahabad verdict. The law, as it stood, was against you.'
          : 'The letter from the Congress Parliamentary Party is polite. It has a great many signatures.',
        'You leave office. There is no proclamation, and no knock on anyone’s door at dawn.',
        'Within a year the men who replaced you have fallen out among themselves.',
      ],
    },
    ordinary: {
      title: 'The Ordinary Road',
      env: 'office',
      text: () => [
        'There is no midnight proclamation. There are eighteen more months of marches, court dates, defections and bad headlines, and then a general election on schedule.',
        'You may win it or lose it.',
        'Either way, the Constitution you inherited is the one you hand on.',
      ],
    },
  },

  history: [
    {
      decision: 'The verdict',
      scenes: ['s1'],
      real: 'Stayed in office and appealed. Accounts say she considered stepping aside and was urged against it by Sanjay Gandhi and others.',
      realShort: 'Indira stayed and appealed',
      match: (_f, p) => p.s1?.id === 'A',
    },
    {
      decision: 'The answer to JP',
      scenes: ['s2'],
      real: 'Proclaimed an internal Emergency under Article 352 on the night of 25 June 1975, on the advice of S.S. Ray.',
      realShort: 'Indira declared the Emergency',
      match: (f) => declared(f),
    },
    {
      decision: 'How it was done',
      scenes: ['s3'],
      real: 'The President signed that night. The Cabinet was informed at 6 a.m. Opposition leaders were arrested before dawn. Power to Delhi’s newspaper offices was cut and censorship imposed.',
      realShort: 'Indira silenced the press',
      match: (_f, p) => p.s3?.id === 'A',
    },
    {
      decision: 'Above the courts',
      scenes: ['s4'],
      real: 'Passed the 39th Amendment, placing the Prime Minister’s election beyond judicial review. In November 1975 the Supreme Court upheld her election but struck down that clause.',
      realShort: 'Indira passed the full amendment',
      match: (f) => f.amendment === 'passed',
    },
    {
      decision: 'Sanjay',
      scenes: ['s5'],
      real: 'Did not restrain him. Demolitions at Turkman Gate in April 1976 ended in police firing. A coercive sterilisation campaign ran through 1976.',
      realShort: 'Indira did not restrain him',
      match: (f) => f.sanjay === 'backed',
    },
    {
      decision: 'The election',
      scenes: ['s6b', 's6'],
      real: 'Extended Parliament’s term twice, then on 18 January 1977 announced elections and released prisoners. Nobody knows for certain why.',
      realShort: 'Indira called it in January 1977',
      match: (_f, p) => p.s6?.id === 'A',
    },
  ],
  afterwards:
    'The Congress fell to 154 seats and won none in Uttar Pradesh or Bihar. Indira Gandhi lost Rae Bareli. She resigned, and the Emergency was revoked on 21 March 1977. More than 100,000 people had been detained without trial. A commission under Justice J.C. Shah later documented the excesses. In January 1980 she was voted back into power.',
  otherView:
    'Her defenders argued then, and some argue now, that the country faced real disorder, that an opposition leader had publicly urged the police and army to disobey, and that inflation fell and administration improved. Her critics answer that existing laws were sufficient, that the proclamation followed a court verdict against her personally, and that the powers taken went far beyond any threat. On why she called the election, historians offer everything from faulty intelligence to conscience, and she never fully explained.',

  free: [
    {
      match: /judge|sinha|krishna iyer|court.*(arrest|remove|transfer|sack)|(arrest|remove|transfer|sack).*court/i,
      who: 'Siddhartha Shankar Ray',
      text: 'I will not draft that, and you will not find a lawyer in India who will.',
      fx: {},
    },
    {
      match: /army|military|soldier|martial|general/i,
      who: 'P.N. Dhar',
      text: 'The Army has stayed out of politics for twenty-eight years. The day you invite it in is the day you can no longer ask it to leave.',
      fx: {},
    },
    {
      match: /sanjay.*(minister|cabinet|office|post)|(appoint|make).*sanjay/i,
      who: 'The Elder',
      text: 'The party will accept it, Prime Minister. It will not forgive it.',
      fx: { hold: -10, trust: -10 },
    },
    {
      match: /turkman|visit|go (there|myself)|see for myself/i,
      who: 'P.N. Dhar',
      text: 'You went without an escort and without warning. Nobody had time to tidy what you saw. I think you understand the reports a little better now.',
      fx: { trust: 3, hold: -3 },
    },
    {
      match: /release.*(jp|narayan|jayaprakash)|free.*(jp|narayan|jayaprakash)/i,
      who: 'P.N. Dhar',
      text: 'He is an old man and he is ill. Letting him go costs you little and will be noticed.',
      fx: { trust: 3, liberty: 3 },
    },
    {
      match: /meet.*(jp|narayan|jayaprakash)|talk.*(jp|narayan|jayaprakash|opposition)|negotiat/i,
      who: 'P.N. Dhar',
      text: 'He will see you. He will also tell the press that you asked. Both things will be true.',
      fx: { trust: 4, hold: -6 },
    },
  ],
  fallback: {
    who: 'R.K. Dhawan',
    text: 'I will look into it, Madam. For now, they are waiting for your decision on this.',
  },
};
