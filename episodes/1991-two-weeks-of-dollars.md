# Episode 01 — Two Weeks of Dollars

**You are:** P.V. Narasimha Rao, Prime Minister of India
**When:** 21 June – early August 1991
**Play time:** 15–20 minutes, 6 decisions
**Status:** first draft. All dialogue is dramatised. Items marked **[verify]** need a fact-check against the sources at the bottom before release.

---

## 1. Design notes

### What the player knows (and doesn't)

The player knows only what Rao knew on the day. No scene mentions "liberalisation" as a known success, growth figures after 1991, or how any decision turned out. Hindsight arrives only on the ending screen.

### Meters

| Meter | Start | What it means | Lose condition |
|---|---|---|---|
| **Import cover** (days) | 14 | Foreign exchange left to pay for oil, fertiliser, medicine | 0 = India defaults |
| **Lender confidence** | 20/100 | Whether the IMF, banks and NRIs believe you | — |
| **Political capital** | 50/100 | Your hold on a minority government and a restless party | 0 = government falls |
| **Public mood** | 50/100 | Prices, pride, anger | Drags political capital when below 25 |

Import cover drops by 1 day at the start of every scene. The clock is the antagonist.

### Flags (set by choices, read by later scenes)

`fm` (technocrat / politician / self) · `gold` (pledged / refused) · `devalued` (two_step / one_shot / none / half) · `licence` (abolished / partial / deferred) · `budget` (bold / cautious) · `fertiliser` (held / partial / rolled_back)

### Recurring advisors

| Advisor | Role | Pushes for |
|---|---|---|
| **Naresh Chandra** | Cabinet Secretary | Facing the numbers, speed |
| **Finance Minister** | Depends on Decision 1 | Depends on Decision 1 |
| **S. Venkitaramanan** | RBI Governor | Avoiding default at any cost |
| **A.N. Verma** | Principal Secretary to the PM | Structural reform, done quietly |
| **The Veteran** | Composite senior Congress MP (fictional) | Nehruvian self-reliance, farmers, the party's survival |

The Veteran is a composite on purpose: the party's objections were real, but no single person's words are being invented.

---

## 2. Briefing (shown before Scene 1)

> **New Delhi, 20 June 1991.**
>
> A month ago you were packing your books to retire to Hyderabad. Then Rajiv Gandhi was assassinated mid-election. The Congress won the most seats but not a majority, and the party, unable to agree on anyone else, chose you.
>
> You are 70. You lead a minority government. Tomorrow you take the oath.
>
> Tonight, the Cabinet Secretary has asked to see you. He is carrying a file.

---

## 3. Scenes

### Scene 1 — The eight-page note

**Date:** 20 June 1991 · **Import cover:** 14 days

Naresh Chandra places a thin file on your desk. Eight pages.

The Gulf War pushed up the oil bill. Workers' remittances from Kuwait and Iraq dried up. Non-resident Indians are pulling out their deposits. Rating agencies have downgraded India, and foreign banks will no longer roll over short-term loans. Reserves stand at roughly $1.1 billion: about two weeks of imports.

> **You:** Is the economic situation really this bad?
> **Chandra:** No, sir. It is actually much worse.

India has never defaulted on a foreign loan. In a fortnight, it may.

You need a Finance Minister by morning.

**Advisors**

- **Chandra:** "Whoever it is must be someone the IMF and the foreign banks trust on sight. We have no time to build a reputation."
- **The Veteran:** "This is a minority government. The Finance Minister must be someone who can count votes, not just dollars. Pick a party man."

**Decision 1 — Who holds the Finance Ministry?**

| | Option | Effect |
|---|---|---|
| A | **A respected economist from outside politics** | `fm=technocrat` · Lender confidence +15 · Political capital −5 |
| B | **A seasoned Congress politician** | `fm=politician` · Political capital +10 · Lender confidence −5 |
| C | **Keep Finance yourself** | `fm=self` · Political capital +5 · Lender confidence −10 · every later scene costs 1 extra day (you are stretched thin) |

**Consequence text**

- **A:** Your first choice, the former RBI Governor I.G. Patel, declines. Your second is asleep when the call comes. Dr Manmohan Singh, just back from Europe, thinks it is a joke until you ring him yourself the next morning. You tell him: if this works, we share the credit. If it fails, you go.
- **B:** The party is relieved. In Washington, the name means nothing. The first cable from the IMF asks, politely, who will be negotiating.
- **C:** The party applauds your grip. Chandra says nothing, which you have already learned is how he disagrees.

---

### Scene 2 — The gold

**Date:** late June 1991 · **Import cover:** ~12 days

Governor Venkitaramanan has a proposal he would rather not put in writing. The Reserve Bank holds gold. The Bank of England and the Bank of Japan will lend about $400 million against roughly 47 tonnes of it, but only if the gold physically sits in their vaults. It would have to be flown out of Bombay.

The previous government already sold 20 tonnes in May. That was confiscated smugglers' gold. This is the nation's own reserve.

**Advisors**

- **Venkitaramanan:** "It buys us weeks, not a cure. But without those weeks there is nothing to cure."
- **The Veteran:** "An Indian family pawns its gold only when the house is lost. If this comes out, you will be the Prime Minister who pawned the country."
- **Finance Minister:**
  - *technocrat:* "It is humiliating, and it is necessary. Let the humiliation be the argument for everything that follows."
  - *politician:* "Try the friendly capitals first. Tokyo, Bonn. Someone will lend."
  - *self:* (no line; Chandra instead) "Sir, you are also the Finance Minister. The Governor needs an answer today."

**Decision 2 — Do you send the gold?**

| | Option | Effect |
|---|---|---|
| A | **Pledge it, quietly** | `gold=pledged` · Import cover +6 · Public mood −15 when it leaks (it will) |
| B | **Pledge it, and tell the country yourself** | `gold=pledged` · Import cover +6 · Public mood −8 · Political capital −5 · Lender confidence +5 |
| C | **Refuse. Seek emergency loans from friendly governments** | `gold=refused` · Import cover −3 · Lender confidence −10 |

**Consequence text**

- **A:** Between 4 and 18 July, four consignments leave for London. A reporter gets the story anyway. The headline runs before your statement does.
- **B:** You go on Doordarshan. You say the gold is security for a loan, not a sale, and that it will come home. Nobody enjoys the broadcast. Fewer people feel lied to.
- **C:** Your envoys are received warmly and sent home with sympathy. Nobody lends to a country that will not use its own collateral. Three more days are gone. *(The gold option reappears in Scene 3 as a forced choice if import cover falls below 7.)*

---

### Scene 3 — Hop, skip and jump

**Date:** 1–3 July 1991 · **Import cover:** varies

The rupee is fixed at about 21 to the dollar. Everyone abroad believes it is worth less, so exporters delay bringing money home and importers rush to buy. The Reserve Bank proposes to devalue: make exports cheaper, imports dearer, and show lenders you are serious.

In 1966, Indira Gandhi devalued under foreign pressure. The party has not forgotten what it cost her.

The plan on your desk is in two steps, two days apart: a small first cut to test the reaction, then a larger one.

**Advisors**

- **Finance Minister** (*technocrat*): "Two steps. The first tells us how the markets and Parliament react. The second finishes the job before anyone can organise against it."
- **Finance Minister** (*politician*): "Once, small, and never again. Twice in a week looks like panic."
- **The Veteran:** "Every price in the bazaar goes up the next morning. You will have devalued the rupee and the party in one stroke."
- **Venkitaramanan:** "If we do nothing, the market does it for us, and less politely."

**Decision 3a — What do you do with the rupee?**

| | Option | Effect |
|---|---|---|
| A | **Two steps, as planned** | Go to 3b |
| B | **One sharp cut, all at once** | `devalued=one_shot` · Lender confidence +15 · Public mood −12 · Political capital −10 |
| C | **Hold the rate. Tighten import controls instead** | `devalued=none` · Lender confidence −15 · Import cover −2 · Public mood +5 |

**Decision 3b — (only after A) The night of 2 July**

The first cut, about 9%, went through on 1 July. The reaction is worse than you expected: opposition leaders are calling it a sell-out, and your own MPs are ringing your office. The second cut is set for tomorrow morning.

| | Option | Effect |
|---|---|---|
| A | **Let it go ahead** | `devalued=two_step` · Lender confidence +18 · Public mood −10 · Political capital −8 |
| B | **Call the Finance Minister and stop it** | Resolved by a coin the player doesn't control (see below) |

**Consequence text for 3b-B**

You call early on 3 July and ask for the second step to be halted. Your Finance Minister rings the Reserve Bank. The Deputy Governor, Dr C. Rangarajan, answers.

> "I am sorry. I have already jumped."

The announcement went out at 9:30. `devalued=two_step`, same effects as A, plus Political capital −2 (the story of your hesitation gets around).

> **Design note:** this is the only scene where the player's choice is overridden. It is historically what happened, and it teaches the episode's theme: a leader is not the only one moving. If `fm=self`, the player reaches the RBI in time and gets `devalued=half` (Lender confidence +5, Public mood −5).

---

### Scene 4 — The licence raj

**Date:** mid-July 1991 · **Import cover:** varies

You survived the confidence vote because much of the opposition chose not to bring you down yet. That is not the same as support.

You kept the Industry portfolio for yourself. A.N. Verma has a draft policy that would end the system under which a company needs government permission to open a factory, expand one, or change what it makes. Licensing would go for all but 18 industries. Foreign firms could own 51% in 34 sectors. Areas reserved for the public sector would shrink from 17 to 8.

This is not what the lenders are demanding this week. It is what Verma says the crisis makes possible.

**Advisors**

- **Verma:** "In a normal year this takes a decade of committees. This year nobody can say what the alternative is. Write it as the next step in Nehru's journey, not a departure from it."
- **The Veteran:** "Forty years of policy, torn up in a month by a government without a majority? Stabilise first. Reform when you have a mandate."
- **Finance Minister** (*technocrat*): "Announce it the same morning as the Budget. By evening everyone will be arguing about the Budget."

**Decision 4 — How far do you go?**

| | Option | Effect |
|---|---|---|
| A | **Abolish licensing, and announce it loudly as a new era** | `licence=abolished` · Lender confidence +20 · Political capital −20 |
| B | **Abolish licensing, but frame it as continuity and let a junior minister table it** | `licence=abolished` · Lender confidence +15 · Political capital −8 |
| C | **Loosen it for a handful of industries only** | `licence=partial` · Lender confidence +5 · Political capital −3 |
| D | **Defer. Set up a committee** | `licence=deferred` · Lender confidence −5 · Political capital +5 |

**Consequence text**

- **A:** The business papers call you a revolutionary. So does the Left, and it does not mean it kindly. Forty of your MPs sign a letter.
- **B:** On the morning of 24 July, a minister of state tables a statement that mentions Nehru, Indira and Rajiv in its opening lines. The House is half empty. The most radical document of your government passes almost without comment.
- **C:** The policy is welcomed as "a start". Verma thanks you and files the rest of his draft in a drawer.
- **D:** The committee will report in six months. You may not have six months.

---

### Scene 5 — The Budget draft

**Date:** around 20 July 1991 · **Import cover:** varies

The Budget is four days away. The IMF will not release a full loan without a credible plan to shrink the deficit, which is running above 8% of GDP. The draft is on your desk.

**If `fm=technocrat`:** the draft is more cautious than you expected. Your Finance Minister, new to politics, has written what he thinks the party will accept.

**If `fm=politician`:** the draft protects every subsidy and promises to cut "wasteful expenditure" without naming any.

**If `fm=self`:** it is your own draft, written between midnight and three. You are not sure it is good.

The real money is in three places: the fertiliser subsidy, petrol and cooking gas prices, and export subsidies. Each one has a constituency.

**Advisors**

- **Chandra:** "The lenders will read one number: the deficit target. Everything else is poetry."
- **The Veteran:** "Touch fertiliser and you lose every MP with a rural seat. Which is most of them."

**Decision 5 — What do you send back?**

| | Option | Effect |
|---|---|---|
| A | **"Go further." Cut the deficit by about two points; raise fertiliser prices 40%; raise fuel prices** | `budget=bold` · Lender confidence +20 · Import cover +8 (IMF funds flow) · Public mood −15 · Political capital −10 |
| B | **A middle path: cut the deficit by one point; spare fertiliser, raise fuel** | `budget=cautious` · Lender confidence +8 · Import cover +3 · Public mood −7 |
| C | **Protect all subsidies; promise savings later** | `budget=cautious` · Lender confidence −15 · Political capital +8 · Import cover +0 |

**Consequence text**

- **A** (*technocrat*): You hand the draft back. "If this is what I wanted, why would I have chosen you?" **[verify — reported in Sitapati]** On 24 July he rises in the Lok Sabha and ends with Victor Hugo: no power on earth can stop an idea whose time has come.
- **A** (*other*): The speech is competent. The numbers do the talking.
- **B:** The IMF calls it "a constructive first step" and releases part of what you asked for.
- **C:** The party cheers. The IMF mission extends its stay in Delhi, which is not a compliment.

---

### Scene 6 — The revolt

**Date:** early August 1991 · **Import cover:** varies
**Shown only if `budget=bold`.** Otherwise skip to endings.

The Congress Parliamentary Party meets. It goes badly. MP after MP stands up to attack the fertiliser price rise. Some are speaking for farmers. Some are speaking for your rivals. Your Finance Minister sits through it in silence.

**Advisors**

- **Finance Minister** (*technocrat*): "If we retreat on the first hard thing, nobody abroad will believe the rest. I will resign if you need a sacrifice."
- **The Veteran:** "You have made your point to Washington. Now make one to your own benches. Give them something to take home."
- **Verma:** "There may be a number between forty and zero."

**Decision 6 — Hold or bend?**

| | Option | Effect |
|---|---|---|
| A | **Hold the full increase** | `fertiliser=held` · Lender confidence +5 · Political capital −25 |
| B | **Trim the increase and exempt small farmers** | `fertiliser=partial` · Lender confidence −3 · Political capital +10 |
| C | **Roll it back entirely** | `fertiliser=rolled_back` · Lender confidence −15 · Political capital +15 · Import cover −3 |

---

## 4. The free-text box ("Do something else")

At every decision the player may type their own action. The AI must map it to one of three results and write the reply in an advisor's voice.

1. **Equivalent to an existing option:** route to that option's effects.
2. **Plausible and new:** apply effects within ±10 on any meter, then rejoin the next scene.
3. **Impossible in 1991:** an advisor explains why, in character, and the options are offered again. One day of import cover is lost.

**Known cases to pre-author**

| Player tries | Result |
|---|---|
| Ask the Soviet Union for a loan | Impossible. Chandra: "Sir, Moscow is asking *us* about rupee trade credits. They have months left, not money." |
| Freeze NRI deposits so they can't leave | Plausible, disastrous. Lender confidence −20; remaining deposits flee faster. |
| Print money / pay in rupees | Impossible. Venkitaramanan: "Oil is sold in dollars. We cannot print those." |
| Declare a moratorium on foreign debt | Plausible. Triggers the Default ending immediately, with a line noting it was discussed and rejected. |
| Call fresh elections for a mandate | Plausible. Import cover −10 during the campaign; almost always ends in Default. |
| Appeal to citizens to donate gold | Plausible. Public mood +10, Import cover +1. Too slow to matter, but the gesture is remembered. |
| Sell public sector companies | Plausible but slow. Lender confidence +5; no cash this quarter. |
| Anything violent, communal, or targeting a group | Refused out of character; options re-offered. |

**Hard limits for the AI:** no events after August 1991, no invented statistics, no real person saying anything defamatory, no outcome outside the four endings below.

---

## 5. Endings

Checked in this order.

### Ending A — Default
**Trigger:** Import cover hits 0 at any point.

> In the second week of July, an Indian Oil tanker waits off Bombay while a bank in London declines to confirm the letter of credit. By evening the news is everywhere. India has missed a payment for the first time in its history.
>
> The IMF returns, with a longer list and less patience. The reforms you avoided arrive anyway, written by someone else.

### Ending B — The Fall
**Trigger:** Political capital hits 0.

> The letter has ninety signatures. You read it twice, though you knew its contents from the first line. The party that chose you because it could not agree on anyone else has now agreed on something.
>
> Your successor inherits a half-finished rescue and a lesson about how fast to move.

### Ending C — The Holding Action
**Trigger:** survived, and at most one of: `licence=abolished`, `budget=bold`, `devalued` in (two_step, one_shot).

> The crisis passes. The gold, if you sent it, comes home. By winter the reserves are no longer front-page news.
>
> The permits, the quotas and the queues remain. You were asked to prevent a default, and you did. Whether the moment offered more than that is a question others will ask.

### Ending D — The Opening
**Trigger:** survived, and at least two of the three above.

> By autumn the reserves are climbing. Within months the pledged gold is redeemed. The factory that once needed a licence to add a production line now needs only a customer.
>
> You never called it a revolution. You called it continuity, and let the country find out for itself.

**Variant line by `fertiliser`:** *held* — "You did not bend, and the party never quite forgave you." / *partial* — "You gave a little so that you could keep the rest." / *rolled_back* — "The Budget's boldest line did not survive August."

---

## 6. "What really happened" screen

Shown after every ending, with the player's choice beside each.

| Decision | What Rao did |
|---|---|
| Finance Minister | Offered it to economist I.G. Patel, who declined, then appointed Dr Manmohan Singh. |
| The gold | The RBI pledged about 47 tonnes with the Bank of England and Bank of Japan in July 1991, raising roughly $400 million. It was done quietly; the press broke the story and there was public outrage. |
| The rupee | Two steps, on 1 and 3 July, about 18–19% in total. Rao got cold feet and tried to stop the second step. The RBI's C. Rangarajan had already carried it out. |
| Licence raj | Abolished for all but 18 industries. The policy was tabled on the morning of Budget day, 24 July, by a minister of state, and framed as continuity with Nehru. |
| The Budget | Bold: a deficit cut of about two percentage points of GDP, a 40% fertiliser price rise, higher fuel prices. |
| The revolt | A partial retreat: the fertiliser increase was cut to 30% and small and marginal farmers were exempted. |

**Afterwards:** India did not default. The pledged gold was redeemed within months. Growth, about 1% in 1991–92, recovered to over 5% the next year. Rao completed a full five-year term, the first prime minister from outside the Nehru–Gandhi family to do so.

**The other view** (always shown): critics then and since have argued the reforms were shaped by IMF conditions rather than democratic debate, that they favoured industry over agriculture, and that inequality widened in the decades after. Historians also disagree on how much credit belongs to Rao, to Manmohan Singh, and to groundwork laid in the 1980s.

**Then:** "X% of players made the same call as Rao" for each decision.

---

## 7. Share card

```
REWINDO · 1991
I was Narasimha Rao for 43 days.

  Sent the gold         ✔ like Rao
  Devalued in one shot  ✘ Rao took two steps
  Ended the licence raj ✔ like Rao

Ending: THE OPENING
Only 31% of players got here.
What would you have done?
```

---

## 8. Fact-check list before release

- **[verify]** Exact reserve figure and "two weeks" import cover on 21 June 1991 (sources range from $1.1bn to $1.2bn).
- **[verify]** The "much worse" exchange between Rao and Naresh Chandra (Sitapati, Ramesh).
- **[verify]** "If this is what I wanted, why would I have chosen you?" (Sitapati).
- **[verify]** Tonnage and dates of the gold shipments (commonly 46.91 tonnes, 4–18 July).
- **[verify]** Devaluation percentages for each step and the 9:30 am timing.
- **[verify]** Confidence vote date and how each opposition bloc voted.
- **[verify]** GDP growth figures for 1991–92 and 1992–93.
- **[verify]** Date and outcome of the Congress Parliamentary Party meeting on fertiliser.

## 9. Sources to check against

- Vinay Sitapati, *Half-Lion: How P.V. Narasimha Rao Transformed India* (2016)
- Jairam Ramesh, *To the Brink and Back: India's 1991 Story* (2015)
- Montek Singh Ahluwalia, *Backstage: The Story Behind India's High Growth Years* (2020)
- C. Rangarajan's published accounts of the July 1991 devaluation
- Manmohan Singh, Budget Speech, 24 July 1991 (Ministry of Finance)
- Statement on Industrial Policy, 24 July 1991 (Government of India)
- Reserve Bank of India, *History of the RBI*, Volume 4
