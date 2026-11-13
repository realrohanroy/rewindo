// Episode 01 — Two Weeks of Dollars.
// Content source: episodes/1991-two-weeks-of-dollars.md. All dialogue is dramatised.

import type { Advisor, Beat, Episode, Flags, Meters, Scene } from './types';

const BRIEFING: Beat[] = [
  { text: 'New Delhi, 20 June 1991.' },
  {
    text: 'A month ago you were packing your books to retire to Hyderabad. Then Rajiv Gandhi was assassinated in the middle of the election.',
  },
  {
    text: 'The Congress won the most seats but not a majority. The party, unable to agree on anyone else, chose you.',
  },
  { text: 'You are seventy. You lead a minority government. Tomorrow you take the oath.' },
  { text: 'Tonight, the Cabinet Secretary has asked to see you. He is carrying a file.' },
];

const chandra = (text: string): Advisor => ({
  id: 'chandra',
  name: 'Naresh Chandra',
  role: 'Cabinet Secretary',
  text,
});
const veteran = (text: string): Advisor => ({
  id: 'veteran',
  name: 'The Veteran',
  role: 'Senior Congress MP',
  text,
});
const governor = (text: string): Advisor => ({
  id: 'venkitaramanan',
  name: 'S. Venkitaramanan',
  role: 'Governor, Reserve Bank of India',
  text,
});
const verma = (text: string): Advisor => ({
  id: 'verma',
  name: 'A.N. Verma',
  role: 'Principal Secretary to the PM',
  text,
});
const fm = (f: Flags, technocrat: string, politician: string): Advisor | null => {
  if (f.fm === 'technocrat')
    return { id: 'singh', name: 'Dr Manmohan Singh', role: 'Finance Minister', text: technocrat };
  if (f.fm === 'politician')
    return { id: 'fm-politician', name: 'The Finance Minister', role: 'Congress veteran', text: politician };
  return null;
};
const list = (...a: (Advisor | null)[]) => a.filter((x): x is Advisor => x !== null);

const SCENES: Scene[] = [
  {
    id: 's1',
    num: 'I',
    title: 'The Eight-Page Note',
    date: '20 June 1991 · Night',
    place: 'New Delhi',
    env: 'study',
    days: 0,
    beats: () => [
      { text: 'Naresh Chandra places a thin file on your desk. Eight pages.' },
      {
        text: 'The Gulf War pushed up the oil bill. Remittances from workers in Kuwait and Iraq have dried up. Indians abroad are pulling out their deposits. Foreign banks will no longer roll over short-term loans.',
      },
      { text: 'Reserves stand at roughly 1.1 billion dollars. About two weeks of imports.' },
      { who: 'You', text: 'Is the economic situation really this bad?' },
      { who: 'Chandra', text: 'No, sir. It is actually much worse.' },
      {
        text: 'India has never defaulted on a foreign loan. In a fortnight, it may. You need a Finance Minister by morning.',
      },
    ],
    advisors: () => [
      chandra(
        'Whoever it is must be someone the IMF and the foreign banks trust on sight. We have no time to build a reputation.',
      ),
      veteran(
        'This is a minority government. The Finance Minister must be someone who can count votes, not just dollars. Pick a party man.',
      ),
    ],
    prompt: 'Who holds the Finance Ministry?',
    options: () => [
      {
        id: 'A',
        label: 'A respected economist from outside politics',
        short: 'Chose an economist',
        fx: { lender: 15, capital: -5 },
        set: { fm: 'technocrat' },
        outcome:
          'Your first choice, the former RBI Governor I.G. Patel, declines. Your second is asleep when the call comes. Dr Manmohan Singh, just back from Europe, thinks it is a joke until you ring him yourself the next morning.\n\nYou tell him: if this works, we share the credit. If it fails, you go.',
      },
      {
        id: 'B',
        label: 'A seasoned Congress politician',
        short: 'Chose a party man',
        fx: { capital: 10, lender: -5 },
        set: { fm: 'politician' },
        outcome:
          'The party is relieved. In Washington, the name means nothing. The first cable from the IMF asks, politely, who will be negotiating.',
      },
      {
        id: 'C',
        label: 'Keep Finance yourself',
        short: 'Kept Finance myself',
        fx: { capital: 5, lender: -10 },
        set: { fm: 'self' },
        outcome:
          'The party applauds your grip. Chandra says nothing, which you have already learned is how he disagrees.\n\nYou now hold two of the hardest jobs in the country. Everything will take a little longer.',
      },
    ],
  },
  {
    id: 's2',
    num: 'II',
    title: 'The Gold',
    date: 'Late June 1991',
    place: 'Reserve Bank of India',
    env: 'vault',
    days: 2,
    beats: () => [
      { text: 'Governor Venkitaramanan has a proposal he would rather not put in writing.' },
      {
        text: 'The Reserve Bank holds gold. The Bank of England and the Bank of Japan will lend about 400 million dollars against roughly 47 tonnes of it. But only if the gold physically sits in their vaults.',
      },
      { text: 'It would have to be flown out of Bombay.' },
      {
        text: 'The last government already sold 20 tonnes in May. That was confiscated smugglers’ gold. This is the nation’s own reserve.',
      },
    ],
    advisors: (f) =>
      list(
        governor('It buys us weeks, not a cure. But without those weeks there is nothing to cure.'),
        veteran(
          'An Indian family pawns its gold only when the house is lost. If this comes out, you will be the Prime Minister who pawned the country.',
        ),
        fm(
          f,
          'It is humiliating, and it is necessary. Let the humiliation be the argument for everything that follows.',
          'Try the friendly capitals first. Tokyo, Bonn. Someone will lend.',
        ) ?? chandra('Sir, you are also the Finance Minister. The Governor needs an answer today.'),
      ),
    prompt: 'Do you send the gold?',
    options: () => [
      {
        id: 'A',
        label: 'Pledge it, quietly',
        short: 'Sent the gold quietly',
        fx: { cover: 6, mood: -15 },
        set: { gold: 'pledged' },
        outcome:
          'Between 4 and 18 July, four consignments leave for London. A reporter gets the story anyway.\n\nThe headline runs before your statement does.',
      },
      {
        id: 'B',
        label: 'Pledge it, and tell the country yourself',
        short: 'Sent the gold openly',
        fx: { cover: 6, mood: -8, capital: -5, lender: 5 },
        set: { gold: 'pledged' },
        outcome:
          'You go on Doordarshan. You say the gold is security for a loan, not a sale, and that it will come home.\n\nNobody enjoys the broadcast. Fewer people feel lied to.',
      },
      {
        id: 'C',
        label: 'Refuse. Seek emergency loans from friendly governments',
        short: 'Refused to send the gold',
        fx: { cover: -3, lender: -10 },
        set: { gold: 'refused' },
        outcome:
          'Your envoys are received warmly and sent home with sympathy. Nobody lends to a country that will not use its own collateral.\n\nThree more days are gone.',
      },
    ],
  },
  {
    id: 's3',
    num: 'III',
    title: 'Hop, Skip and Jump',
    date: '30 June 1991',
    place: 'South Block',
    env: 'office',
    days: 3,
    beats: () => [
      {
        text: 'The rupee is fixed at about 21 to the dollar. Everyone abroad believes it is worth less. Exporters delay bringing money home. Importers rush to buy.',
      },
      {
        text: 'The Reserve Bank proposes to devalue: make exports cheaper, imports dearer, and show lenders you are serious.',
      },
      {
        text: 'In 1966, Indira Gandhi devalued under foreign pressure. The party has not forgotten what it cost her.',
      },
      {
        text: 'The plan on your desk is in two steps, two days apart. A small first cut to test the reaction, then a larger one.',
      },
    ],
    advisors: (f) =>
      list(
        fm(
          f,
          'Two steps. The first tells us how the markets and Parliament react. The second finishes the job before anyone can organise against it.',
          'Once, small, and never again. Twice in a week looks like panic.',
        ),
        veteran(
          'Every price in the bazaar goes up the next morning. You will have devalued the rupee and the party in one stroke.',
        ),
        governor('If we do nothing, the market does it for us, and less politely.'),
      ),
    prompt: 'What do you do with the rupee?',
    options: () => [
      {
        id: 'A',
        label: 'Two steps, as planned',
        short: 'Devalued in two steps',
        fx: {},
        set: { plan2: true },
        outcome:
          'On 1 July the rupee is cut by about nine per cent. No announcement from you. Just a notice from the Reserve Bank.\n\nThen the telephones begin.',
      },
      {
        id: 'B',
        label: 'One sharp cut, all at once',
        short: 'Devalued in one shot',
        fx: { lender: 15, mood: -12, capital: -10 },
        set: { devalued: 'one_shot' },
        outcome:
          'Nearly a fifth of the rupee’s value is gone by breakfast. The markets abroad take notice. So does every opposition bench.\n\nNobody can accuse you of hesitating.',
      },
      {
        id: 'C',
        label: 'Hold the rate. Tighten import controls instead',
        short: 'Held the rupee',
        fx: { lender: -15, cover: -2, mood: 5 },
        set: { devalued: 'none' },
        outcome:
          'The rupee holds. Officially. In Dubai and Singapore it trades at whatever people will pay.\n\nThe dollars keep leaving.',
      },
    ],
  },
  {
    id: 's3b',
    num: 'III',
    title: 'The Night of 2 July',
    date: '2 July 1991 · Late night',
    place: '7 Race Course Road',
    env: 'night',
    days: 0,
    skip: (f) => !f.plan2,
    beats: () => [
      { text: 'The first cut went through yesterday. The reaction is worse than you expected.' },
      {
        text: 'Opposition leaders are calling it a sell-out. Your own MPs are ringing the office. One of them says the word “1966” and hangs up.',
      },
      { text: 'The second cut is set for tomorrow morning.' },
    ],
    advisors: () => [
      veteran('You have shown Washington you are willing. Now show the country you are listening. Stop it here.'),
      chandra('Sir, half a devaluation is the worst of both. All of the anger and none of the credibility.'),
    ],
    prompt: 'The second step is hours away.',
    options: (f) => [
      {
        id: 'A',
        label: 'Let it go ahead',
        short: 'Devalued in two steps',
        fx: { lender: 18, mood: -10, capital: -8 },
        set: { devalued: 'two_step' },
        outcome:
          'At 9:30 the next morning the second notice goes out. In two days the rupee has lost almost a fifth of its value.\n\nThe lenders call it decisive. Your backbenchers use other words.',
      },
      f.fm === 'self'
        ? {
            id: 'B',
            label: 'Call the Reserve Bank and stop it',
            short: 'Stopped the second step',
            fx: { lender: 5, mood: -5 },
            set: { devalued: 'half' },
            outcome:
              'You are also the Finance Minister, so there is nobody to call but the Reserve Bank itself. You reach the Deputy Governor before dawn.\n\nThe second step never happens. The markets conclude that India blinked.',
          }
        : {
            id: 'B',
            label: 'Call the Finance Minister and stop it',
            short: 'Tried to stop the second step',
            fx: { lender: 18, mood: -10, capital: -10 },
            set: { devalued: 'two_step' },
            outcome:
              'Early on 3 July you ask for the second step to be halted. Your Finance Minister rings the Reserve Bank. The Deputy Governor, Dr C. Rangarajan, answers.\n\n“I am sorry. I have already jumped.”\n\nThe announcement went out at 9:30. A Prime Minister is not the only one moving.',
          },
    ],
  },
  {
    id: 's4',
    num: 'IV',
    title: 'The Licence Raj',
    date: 'Mid-July 1991',
    place: 'South Block',
    env: 'office',
    days: 4,
    beats: () => [
      {
        text: 'You survived the confidence vote because much of the opposition chose not to bring you down yet. That is not the same as support.',
      },
      {
        text: 'You kept the Industry portfolio for yourself. A.N. Verma has a draft that would end the system under which a company needs government permission to open a factory, expand one, or change what it makes.',
      },
      {
        text: 'Licensing would go for all but 18 industries. Foreign firms could own 51 per cent in 34 sectors. Areas reserved for the public sector would shrink from 17 to 8.',
      },
      { text: 'This is not what the lenders are demanding this week. It is what Verma says the crisis makes possible.' },
    ],
    advisors: (f) =>
      list(
        verma(
          'In a normal year this takes a decade of committees. This year nobody can say what the alternative is. Write it as the next step in Nehru’s journey, not a departure from it.',
        ),
        veteran(
          'Forty years of policy, torn up in a month by a government without a majority? Stabilise first. Reform when you have a mandate.',
        ),
        fm(
          f,
          'Announce it the same morning as the Budget. By evening everyone will be arguing about the Budget.',
          'The party can swallow one bitter thing this month. Not two.',
        ),
      ),
    prompt: 'How far do you go?',
    options: () => [
      {
        id: 'A',
        label: 'Abolish licensing, and announce it loudly as a new era',
        short: 'Ended the licence raj, loudly',
        fx: { lender: 20, capital: -20 },
        set: { licence: 'abolished' },
        outcome:
          'The business papers call you a revolutionary. So does the Left, and it does not mean it kindly.\n\nForty of your MPs sign a letter.',
      },
      {
        id: 'B',
        label: 'Abolish it, but frame it as continuity and let a junior minister table it',
        short: 'Ended the licence raj, quietly',
        fx: { lender: 15, capital: -8 },
        set: { licence: 'abolished' },
        outcome:
          'On the morning of 24 July, a minister of state tables a statement that mentions Nehru, Indira and Rajiv in its opening lines. The House is half empty.\n\nThe most radical document of your government passes almost without comment.',
      },
      {
        id: 'C',
        label: 'Loosen it for a handful of industries only',
        short: 'Loosened licensing a little',
        fx: { lender: 5, capital: -3 },
        set: { licence: 'partial' },
        outcome: 'The policy is welcomed as “a start”. Verma thanks you and files the rest of his draft in a drawer.',
      },
      {
        id: 'D',
        label: 'Defer. Set up a committee',
        short: 'Deferred licence reform',
        fx: { lender: -5, capital: 5 },
        set: { licence: 'deferred' },
        outcome: 'The committee will report in six months.\n\nYou may not have six months.',
      },
    ],
  },
  {
    id: 's5',
    num: 'V',
    title: 'The Budget Draft',
    date: '20 July 1991 · Night',
    place: '7 Race Course Road',
    env: 'study',
    days: 3,
    beats: (f) => [
      {
        text: 'The Budget is four days away. The IMF will not release a full loan without a credible plan to shrink the deficit, which is running above 8 per cent of GDP.',
      },
      {
        text:
          f.fm === 'technocrat'
            ? 'The draft on your desk is more cautious than you expected. Your Finance Minister, new to politics, has written what he thinks the party will accept.'
            : f.fm === 'politician'
              ? 'The draft on your desk protects every subsidy and promises to cut “wasteful expenditure” without naming any.'
              : 'It is your own draft, written between midnight and three. You are not sure it is good.',
      },
      {
        text: 'The real money is in three places: the fertiliser subsidy, petrol and cooking gas prices, and export subsidies. Each one has a constituency.',
      },
    ],
    advisors: () => [
      chandra('The lenders will read one number: the deficit target. Everything else is poetry.'),
      veteran('Touch fertiliser and you lose every MP with a rural seat. Which is most of them.'),
    ],
    prompt: 'What do you send back?',
    options: (f) => [
      {
        id: 'A',
        label: '“Go further.” Cut the deficit by two points. Raise fertiliser prices 40%. Raise fuel prices',
        short: 'Sent a bold Budget',
        fx: { lender: 20, cover: 8, mood: -15, capital: -10 },
        set: { budget: 'bold' },
        outcome:
          f.fm === 'technocrat'
            ? 'You hand the draft back. “If this is what I wanted, why would I have chosen you?”\n\nOn 24 July he rises in the Lok Sabha and ends with Victor Hugo: no power on earth can stop an idea whose time has come.'
            : 'The speech is competent. The numbers do the talking. The IMF’s money begins to move.',
      },
      {
        id: 'B',
        label: 'A middle path. Cut the deficit by one point. Spare fertiliser, raise fuel',
        short: 'Sent a middle-path Budget',
        fx: { lender: 8, cover: 3, mood: -7 },
        set: { budget: 'cautious' },
        outcome: 'The IMF calls it “a constructive first step” and releases part of what you asked for.',
      },
      {
        id: 'C',
        label: 'Protect all subsidies. Promise savings later',
        short: 'Protected every subsidy',
        fx: { lender: -15, capital: 8 },
        set: { budget: 'cautious' },
        outcome: 'The party cheers.\n\nThe IMF mission extends its stay in Delhi, which is not a compliment.',
      },
    ],
  },
  {
    id: 's6',
    num: 'VI',
    title: 'The Revolt',
    date: 'Early August 1991',
    place: 'Congress Parliamentary Party',
    env: 'hall',
    days: 3,
    skip: (f) => f.budget !== 'bold',
    beats: () => [
      { text: 'The Congress Parliamentary Party meets. It goes badly.' },
      {
        text: 'MP after MP stands up to attack the fertiliser price rise. Some are speaking for farmers. Some are speaking for your rivals.',
      },
      { text: 'Your Finance Minister’s Budget is being torn apart by your own benches. All of them are looking at you.' },
    ],
    advisors: (f) =>
      list(
        fm(
          f,
          'If we retreat on the first hard thing, nobody abroad will believe the rest. I will resign if you need a sacrifice.',
          'I warned you about fertiliser. But a government that reverses its own Budget in a week has no Budget.',
        ),
        veteran(
          'You have made your point to Washington. Now make one to your own benches. Give them something to take home.',
        ),
        verma('There may be a number between forty and zero.'),
      ),
    prompt: 'Hold or bend?',
    options: () => [
      {
        id: 'A',
        label: 'Hold the full increase',
        short: 'Held firm on fertiliser',
        fx: { lender: 5, capital: -25 },
        set: { fertiliser: 'held' },
        outcome: 'You let them shout, and you change nothing.\n\nThe meeting ends without a vote. The corridors do not empty.',
      },
      {
        id: 'B',
        label: 'Trim the increase and exempt small farmers',
        short: 'Trimmed the fertiliser rise',
        fx: { lender: -3, capital: 10 },
        set: { fertiliser: 'partial' },
        outcome:
          'Forty becomes thirty. Small and marginal farmers are exempted. Your MPs go home with something to announce.\n\nThe rest of the Budget stands.',
      },
      {
        id: 'C',
        label: 'Roll it back entirely',
        short: 'Rolled back the fertiliser rise',
        fx: { lender: -15, capital: 15, cover: -3 },
        set: { fertiliser: 'rolled_back' },
        outcome: 'The hall applauds.\n\nIn Washington, someone quietly revises a spreadsheet.',
      },
    ],
  },
];


const FERTILISER_LINE: Record<string, string> = {
  held: 'You did not bend, and the party never quite forgave you.',
  partial: 'You gave a little so that you could keep the rest.',
  rolled_back: 'The Budget’s boldest line did not survive August.',
};
const withFertiliser = (lines: string[]) => (f: Flags) =>
  typeof f.fertiliser === 'string' ? [...lines, FERTILISER_LINE[f.fertiliser]] : lines;

const add = (m: Meters, fx: Meters): Meters => ({
  ...m,
  cover: Math.max(0, m.cover + (fx.cover ?? 0)),
  capital: Math.max(0, Math.min(100, m.capital + (fx.capital ?? 0))),
  mood: Math.max(0, Math.min(100, m.mood + (fx.mood ?? 0))),
});

export const E1991: Episode = {
  id: '1991',
  num: '01',
  year: '1991',
  title: 'Two Weeks of Dollars',
  you: 'P.V. Narasimha Rao',
  short: 'Rao',
  hook: 'The country has fourteen days of foreign exchange left.',
  begin: 'Take the oath',
  duration: 'About 15 minutes',
  shareLine: 'I was Narasimha Rao for six weeks.',
  decideHead: 'For orders of the Prime Minister',
  speakers: { Chandra: 'chandra' },

  briefing: BRIEFING,
  meters: [
    { key: 'cover', start: 14, max: 999 },
    { key: 'lender', start: 20 },
    { key: 'capital', start: 50 },
    { key: 'mood', start: 50 },
  ],
  hero: (m) => ({
    key: 'cover',
    label: 'Import cover',
    value: m.cover,
    unit: m.cover === 1 ? 'day' : 'days',
    danger: m.cover <= 7,
  }),
  gauges: (m) => [
    { key: 'lender', label: 'Lender confidence', value: m.lender, low: m.lender < 25 },
    { key: 'capital', label: 'Political capital', value: m.capital, low: m.capital < 25 },
    { key: 'mood', label: 'Public mood', value: m.mood, low: m.mood < 25 },
  ],
  pressure: (m) => 1 - Math.min(14, m.cover) / 14,

  scenes: SCENES,

  // Every scene costs days of imports. Lost confidence and a second portfolio cost more.
  onEnter: (scene, m0, f0) => {
    let m = m0;
    let f = f0;
    const notes: string[] = [];
    if (!scene.days) return { meters: m, flags: f, notes };

    let days = scene.days;
    notes.push(`${scene.days} days of imports paid for.`);
    if (f.fm === 'self') {
      days += 1;
      notes.push('You hold two portfolios. Decisions wait on your desk: 1 more day lost.');
    }
    if (m.lender < 15) {
      days += 2;
      notes.push('Lenders have lost faith. Deposits are fleeing abroad: 2 more days lost.');
    }
    m = add(m, { cover: -days });
    if (m.mood < 25) {
      m = add(m, { capital: -5 });
      notes.push('Anger in the streets is reaching your own MPs.');
    }
    if (f.gold === 'refused' && m.cover < 7) {
      m = add(m, { cover: 6, mood: -15, capital: -5 });
      f = { ...f, gold: 'pledged' };
      notes.push(
        'With under a week of imports left, the Governor returns. This time there is no decision to make. The gold goes to London.',
      );
    }
    return { meters: m, flags: f, notes };
  },

  lost: (m) => (m.cover <= 0 ? 'default' : m.capital <= 0 ? 'fall' : undefined),
  final: (_m, f) => {
    const reforms = [
      f.licence === 'abolished',
      f.budget === 'bold',
      f.devalued === 'two_step' || f.devalued === 'one_shot',
    ].filter(Boolean).length;
    return reforms >= 2 ? 'opening' : 'holding';
  },

  endings: {
    default: {
      title: 'Default',
      env: 'vault',
      text: () => [
        'An Indian Oil tanker waits off Bombay while a bank in London declines to confirm the letter of credit. By evening the news is everywhere.',
        'India has missed a payment for the first time in its history.',
        'The IMF returns, with a longer list and less patience. The reforms you avoided arrive anyway, written by someone else.',
      ],
    },
    fall: {
      title: 'The Fall',
      env: 'hall',
      text: () => [
        'The letter has ninety signatures. You read it twice, though you knew its contents from the first line.',
        'The party that chose you because it could not agree on anyone else has now agreed on something.',
        'Your successor inherits a half-finished rescue and a lesson about how fast to move.',
      ],
    },
    holding: {
      title: 'The Holding Action',
      env: 'office',
      text: withFertiliser([
        'The crisis passes. The gold comes home. By winter the reserves are no longer front-page news.',
        'The permits, the quotas and the queues remain.',
        'You were asked to prevent a default, and you did. Whether the moment offered more than that is a question others will ask.',
      ]),
    },
    opening: {
      title: 'The Opening',
      env: 'office',
      text: withFertiliser([
        'By autumn the reserves are climbing. Within months the pledged gold is redeemed.',
        'The factory that once needed a licence to add a production line now needs only a customer.',
        'You never called it a revolution. You called it continuity, and let the country find out for itself.',
      ]),
    },
  },

  history: [
    {
      decision: 'Finance Minister',
      scenes: ['s1'],
      real: 'Offered it to the economist I.G. Patel, who declined, then appointed Dr Manmohan Singh.',
      realShort: 'Rao chose an economist',
      match: (f) => f.fm === 'technocrat',
    },
    {
      decision: 'The gold',
      scenes: ['s2'],
      real: 'The RBI pledged about 47 tonnes with the Bank of England and the Bank of Japan, raising roughly $400 million. It was done quietly. The press broke the story and there was public outrage.',
      realShort: 'Rao sent it quietly',
      match: (_f, p) => p.s2?.id === 'A',
    },
    {
      decision: 'The rupee',
      scenes: ['s3b', 's3'],
      real: 'Two steps, on 1 and 3 July, about 18–19% in total. Rao got cold feet and tried to stop the second step. The RBI’s C. Rangarajan had already carried it out.',
      realShort: 'Rao took two steps',
      match: (f) => f.devalued === 'two_step',
    },
    {
      decision: 'The licence raj',
      scenes: ['s4'],
      real: 'Abolished for all but 18 industries. Tabled on the morning of Budget day by a minister of state, and framed as continuity with Nehru.',
      realShort: 'Rao ended it quietly',
      match: (_f, p) => p.s4?.id === 'B',
    },
    {
      decision: 'The Budget',
      scenes: ['s5'],
      real: 'Bold: a deficit cut of about two points of GDP, a 40% fertiliser price rise and higher fuel prices.',
      realShort: 'Rao went bold',
      match: (f) => f.budget === 'bold',
    },
    {
      decision: 'The revolt',
      scenes: ['s6'],
      real: 'A partial retreat: the fertiliser increase was cut to 30% and small and marginal farmers were exempted.',
      realShort: 'Rao trimmed it',
      match: (_f, p) => p.s6?.id === 'B',
    },
  ],
  afterwards:
    'India did not default. The pledged gold was redeemed within months. Growth, about 1% in 1991–92, recovered to over 5% the next year. Rao completed a full five-year term, the first prime minister from outside the Nehru–Gandhi family to do so.',
  otherView:
    'Critics then and since have argued that the reforms were shaped by IMF conditions rather than democratic debate, that they favoured industry over agriculture, and that inequality widened in the decades after. Historians also disagree on how much credit belongs to Rao, to Manmohan Singh, and to groundwork laid in the 1980s.',

  free: [
    {
      match: /soviet|ussr|moscow|russia|gorbachev/i,
      who: 'Naresh Chandra',
      text: 'Sir, Moscow is asking us about rupee trade credits. They have months left, not money. A day is gone finding that out.',
      fx: { cover: -1 },
    },
    {
      match: /print|mint|pay in rupees/i,
      who: 'S. Venkitaramanan',
      text: 'Oil is sold in dollars, Prime Minister. We cannot print those. We have lost a day discussing it.',
      fx: { cover: -1 },
    },
    {
      match: /freeze|block|lock|seize/i,
      who: 'S. Venkitaramanan',
      text: 'The order is drafted by noon and leaked by two. Every deposit we did not freeze is leaving on the next wire.',
      fx: { lender: -20 },
    },
    {
      match: /moratorium|stop paying|suspend (the )?(debt|payment)|default|refuse to pay/i,
      who: 'Naresh Chandra',
      text: 'It was discussed, sir, and rejected by everyone who has ever had to borrow again. If that is your order, I will send the telex.',
      fx: { cover: -999 },
    },
    {
      match: /election|mandate|dissolve|resign/i,
      who: 'The Veteran',
      text: 'A campaign takes weeks. The importers will not wait for the counting. But you are the Prime Minister.',
      fx: { cover: -10, capital: 5 },
    },
    {
      match: /donat|appeal|citizen|people.*gold|temple/i,
      who: 'Naresh Chandra',
      text: 'People come forward. Bangles, coins, a wedding necklace. It is moving, sir. It is also about a day of oil.',
      fx: { mood: 10, cover: 1 },
    },
    {
      match: /privati|disinvest|sell.*(psu|public sector|compan|air india)/i,
      who: 'A.N. Verma',
      text: 'It is the right signal and the lenders will notice. But no buyer will wire money this quarter.',
      fx: { lender: 5 },
    },
    {
      match: /imf|world bank|washington/i,
      who: 'Naresh Chandra',
      text: 'The IMF is already in the room, sir. They are waiting to see what you do, which is why the options on this file exist.',
      fx: {},
    },
  ],
  fallback: {
    who: 'Naresh Chandra',
    text: 'I will have that examined, sir. For today, the file needs one of these orders.',
  },
};
