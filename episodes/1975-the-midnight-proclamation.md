# Episode 02 — The Midnight Proclamation

**You are:** Indira Gandhi, Prime Minister of India
**When:** 12 June 1975 – March 1977
**Play time:** 20 minutes, 6 decisions
**Status:** first draft. All dialogue is dramatised. Items marked **[verify]** need a fact-check against the sources at the bottom. This episode needs a historian's review before public release (see section 8).

---

## 1. Design notes

### The idea of the episode

The 1991 episode is about a clock. This one is about a mirror.

Every decision makes you safer today and tells you less about tomorrow. Once you silence the press, the game stops showing you the truth too. You govern on the reports your own officials write, and they write what you want to read. The player finds out what the country really thought only when they dare to ask it.

### What the player knows (and doesn't)

Only what Indira Gandhi knew on the day. Nothing in a scene mentions how the Emergency ended or how it is remembered.

### Meters

| Meter | Start | What it means | Lose condition |
|---|---|---|---|
| **Hold on office** | 35/100 | Whether you can stay Prime Minister: the courts, the party, Parliament | 0 = you are removed |
| **Order** | 30/100 | Streets, strikes, trains, prices | Below 15 drags Hold on office |
| **Public trust** | 45/100 | What people actually think of you | — |
| **Liberty** | 100/100 | Courts, press, opposition, the Constitution as you found it | — |

### The mirror mechanic

**Public trust** is shown honestly until the press is censored. After that:

- The meter is relabelled **"Public trust (as reported)"**.
- The displayed value only ever rises. The true value is tracked in secret and mostly falls.
- Advisors quote the displayed value as fact. ("The Intelligence Bureau says you would win 340 seats.")
- The true value is revealed on the election night scene, or never, if the player never calls an election.

**Liberty** is never hidden. The player always sees what they are spending.

### Flags

`stayed` (yes / stepped_aside) · `emergency` (declared / ordinary_law / none) · `cabinet` (bypassed / consulted) · `press` (censored / free) · `amendment` (passed / limited / refused) · `sanjay` (backed / reined / removed) · `election` (called / postponed / never)

### Recurring advisors

| Advisor | Role | Pushes for |
|---|---|---|
| **Sanjay Gandhi** | Your younger son. Holds no office | Never yield. Act fast, explain later |
| **Siddhartha Shankar Ray** | Chief Minister of West Bengal, barrister, old friend | A legal route to firmness |
| **P.N. Dhar** | Principal Secretary to the PM | Restraint, institutions, a way back |
| **R.K. Dhawan** | Private secretary, gatekeeper | Whatever protects you tonight |
| **The Elder** | Composite senior Cabinet minister (fictional) | The party's survival, and his own |

The Elder is a composite on purpose. Several senior ministers had doubts and said little. No single person's silence is being scripted.

---

## 2. Briefing (shown before Scene 1)

> **New Delhi, 12 June 1975.**
>
> Four years ago you won a landslide and then a war. They called you Durga.
>
> Since then: drought, an oil shock, prices rising by a quarter in a year. A railway strike broken by force. A students' movement in Gujarat and Bihar that has found a leader in Jayaprakash Narayan, an old freedom fighter who wants nothing for himself, which makes him dangerous.
>
> This morning a judge in Allahabad will rule on a petition by the man you defeated in 1971. He says you cheated.
>
> Your lawyers say it is a technical matter. You have not been sleeping well.

---

## 3. Scenes

### Scene 1 — The Verdict

**Date:** 12 June 1975 · **Place:** 1 Safdarjung Road

The teleprinter in the next room starts just after ten. Your secretary reads it twice before he brings it in.

Justice Jagmohanlal Sinha has found you guilty of electoral malpractice on two counts: a government officer worked on your campaign before his resignation took effect, and state officials built the stages you spoke from. Your election is void. You are barred from elected office for six years.

He has stayed his own order for twenty days so that you may appeal.

By afternoon, the news from Gujarat arrives. The Congress has lost the state election to an opposition front. Outside your gate, a crowd is gathering. Some of it has been brought in buses.

**Advisors**

- **P.N. Dhar:** "Step aside for a few weeks. Name someone you trust. Win the appeal and come back with your hands clean. The country will remember that you respected the court."
- **Sanjay Gandhi:** "Step aside and you will never come back. Whoever sits in that chair will like it. Look outside. The people want you."
- **The Elder:** "Whatever you decide, Prime Minister, the party is behind you." *(He does not say how far behind.)*

**Decision 1 — Do you stay?**

| | Option | Effect |
|---|---|---|
| A | **Stay in office and appeal to the Supreme Court** | `stayed=yes` · Hold +5 · Public trust −8 |
| B | **Step aside for a caretaker while the appeal is heard** | `stayed=stepped_aside` · Public trust +15 · Hold −20 · goes to Ending A after a short epilogue scene |
| C | **Stay, and call a snap general election to let the voters overrule the judge** | `stayed=yes` · Public trust +5 · Order −10 · Hold −10 |

**Consequence text**

- **A:** You tell the party you will abide by the Supreme Court. The rallies outside your house continue all week. You wave from the lawn.
- **B:** You name a caretaker. The crowd at the gate is confused, then quiet. By evening three ministers have called on him. None has called on you.
- **C:** The opposition calls it contempt of court with a ballot box. Your own party asks how it is meant to campaign with the price of wheat where it is.

---

### Scene 2 — The Conditional Stay

**Date:** 24–25 June 1975 · **Place:** Prime Minister's office

The Supreme Court is on vacation. A single judge, Justice V.R. Krishna Iyer, hears you. His order is neither victory nor defeat: you may remain Prime Minister, but you may not vote in Parliament until the appeal is decided.

A Prime Minister who cannot vote. The newspapers print it in type normally kept for wars.

Tomorrow evening, Jayaprakash Narayan will address a rally at the Ramlila Maidan. Your intelligence people say he will call on the police and the army to refuse "illegal orders". He has been quoting a poet: *vacate the throne, for the people are coming.*

Siddhartha Shankar Ray has been reading the Constitution. An emergency is already in force, declared for the war in 1971. But Article 352 also allows one for "internal disturbance". It needs only the President's signature.

**Advisors**

- **S.S. Ray:** "It is constitutional. Every power you need is there in the text. You would be using the law, not breaking it."
- **Sanjay Gandhi:** "He is telling soldiers to mutiny and you are asking lawyers for permission. I have a list of names."
- **P.N. Dhar:** "You have laws enough already. Arrest those who incite the forces, if they do. Do not suspend a democracy to stop a rally."
- **The Elder:** "JP is an old man with a microphone. The monsoon will come and people will go back to their fields."

**Decision 2 — How do you answer?**

| | Option | Effect |
|---|---|---|
| A | **Proclaim an internal Emergency** | `emergency=declared` · go to Scene 3 |
| B | **Use existing laws. Ban the rally and detain those who call for mutiny** | `emergency=ordinary_law` · Order +10 · Liberty −15 · Public trust −10 · Hold +5 · skip Scene 3 |
| C | **Let the rally happen. Go on the radio and answer him** | `emergency=none` · Liberty +0 · Order −10 · Public trust +8 · Hold −10 · skip Scene 3 |
| D | **Open talks with JP through intermediaries** | `emergency=none` · Order +5 · Hold −15 · Public trust +5 · skip Scene 3 |

**Consequence text**

- **B:** The rally is banned. It happens anyway, smaller and angrier. Forty leaders are held. The courts begin hearing their petitions the same week, and some are released. You are fighting on every front at once.
- **C:** A quarter of a million people hear him. Then they go home. The next morning nobody has mutinied, and nobody has stopped marching either.
- **D:** He will talk. His price is the dissolution of the Bihar assembly, and then, he hints, yours. Your party hears that you are negotiating and starts to do the same.

---

### Scene 3 — Before Midnight

**Date:** 25 June 1975, night · **Place:** Rashtrapati Bhavan, then 1 Safdarjung Road
**Shown only if `emergency=declared`.**

The rally is still going on across the city when you and Ray are shown in to see the President. Fakhruddin Ali Ahmed reads the draft. He asks one question: has the Cabinet approved this?

It has not. The rules say it should.

At home, Sanjay and the Minister of State for Home are going through lists. Someone asks about the newspapers. Most of Delhi's are printed on one street, Bahadur Shah Zafar Marg, and that street has one power supply.

**Advisors**

- **S.S. Ray:** "The Cabinet can ratify at dawn. But I did not advise locking up the entire opposition, and I did not advise touching the press. That is not what the Article is for."
- **Sanjay Gandhi:** "If one newspaper prints tomorrow, there will be a crowd by noon. Cut the lights. And the Chief Ministers should be told what to do, not asked."
- **R.K. Dhawan:** "The President is waiting, Madam. The letter needs your signature tonight if it is to be tonight."

**Decision 3 — How is it done?**

| | Option | Effect |
|---|---|---|
| A | **Tonight. The President signs now, the Cabinet is told at dawn. Arrest the leaders. Cut the power to the presses and impose censorship** | `cabinet=bypassed` · `press=censored` · Hold +35 · Order +30 · Liberty −45 · true Public trust −15 · **mirror mechanic begins** |
| B | **Tonight, with arrests, but leave the press alone** | `cabinet=bypassed` · `press=free` · Hold +20 · Order +15 · Liberty −25 · Public trust −20 |
| C | **Call the Cabinet first, at midnight, and proclaim it with their consent** | `cabinet=consulted` · `press=censored` · Hold +20 · Order +20 · Liberty −35 · true Public trust −10 · **mirror mechanic begins** · risk: word leaks, some leaders evade arrest |

**Consequence text**

- **A:** The President signs a little before midnight. **[verify time]** Before dawn, Jayaprakash Narayan, Morarji Desai and hundreds of others are woken and taken away. The presses on Bahadur Shah Zafar Marg go dark.

  At six, your ministers are called in and told. Nobody objects. One asks under which law the arrests were made, and does not ask again.

  At eight you speak on All India Radio. "The President has proclaimed Emergency. There is nothing to panic about."

  *The Public trust meter changes its label.*

- **B:** The arrests go as planned. So does the morning edition. The photograph of JP being led to a police car is on every front page in the country, and in London and New York by evening.
- **C:** The ministers assemble at midnight, bewildered. They agree, because the alternative is to be the one who did not. But two hours have passed and telephones have been ringing. Several names on the list are not at home when the police arrive.

---

### Scene 4 — Above the Courts

**Date:** August 1975 · **Place:** Parliament House

*If `emergency=declared`:*
The trains are running on time. Prices are falling. Offices are full at ten in the morning. A good monsoon has helped, and you have announced a Twenty-Point Programme for the poor. Visitors tell you the country needed this.

*If not:*
The marches continue. The summer has been long, and Parliament is noisy.

In either case, your appeal is still before the Supreme Court. If you lose it, none of the rest matters.

The Law Minister has a draft. A constitutional amendment would place the election of a Prime Minister beyond the reach of any court, with effect from the past. With the opposition benches *[half empty / in uproar]*, it can pass in days.

**Advisors**

- **The Elder:** "The Law Minister assures me it is watertight. The party will vote as you ask."
- **P.N. Dhar:** "Change the election law if you must, so that what you did in 1971 was never an offence. Then let the judges rule on it. If you put yourself above the court, you are admitting you would have lost in it."
- **Sanjay Gandhi:** "Five old men in robes should not decide who governs six hundred million people."

**Decision 4 — What do you put before Parliament?**

| | Option | Effect |
|---|---|---|
| A | **The full amendment: the Prime Minister's election is beyond judicial review** | `amendment=passed` · Hold +20 · Liberty −20 · true Public trust −8 |
| B | **Only amend the election law retroactively, and let the Supreme Court decide the appeal** | `amendment=limited` · Hold +10 · Liberty −8 · true Public trust −3 |
| C | **Neither. Argue the appeal on the law as it stood** | `amendment=refused` · Liberty +5 · Public trust +10 · Hold −25 |

**Consequence text**

- **A:** It passes both Houses in under a week. In November the Supreme Court upholds your election, and in the same judgment strikes down the clause that tried to take the question away from it. You have won, and been told what you tried to do.
- **B:** The law is changed. In November the Court applies it and upholds your election. Critics say you rewrote the rules after the match. But a court decided, and you can say so.
- **C:** Your lawyers are not optimistic. The hearing is set for the autumn. Every Chief Minister in your party is now doing arithmetic.

  *(If Hold on office falls to 0 here: Ending E.)*

---

### Scene 5 — The Second Son

**Date:** April 1976 · **Place:** 1 Safdarjung Road
**Shown only if `emergency=declared`.**

*If `press=censored`:* The newspapers are full of good news, because that is what they are permitted to print.

Sanjay has a programme of his own: plant trees, end dowry, teach each one to read, clear the slums, limit families. He holds no office. Chief Ministers come to the airport to receive him.

A woman you have known for thirty years asks to see you alone. She has been to Old Delhi. Near Turkman Gate, she says, bulldozers have been clearing homes, and when people resisted, the police opened fire. She does not know how many died. In the villages of the north, she says, schoolteachers and policemen are being given quotas of men to bring in for sterilisation, and they are filling them however they can.

None of this is in the files on your desk. The files say that targets are being exceeded.

**Advisors**

- **Sanjay Gandhi:** "For twenty-five years this country made plans and built nothing. I am getting things done. You cannot make a new city without moving anyone."
- **P.N. Dhar:** "I can no longer tell you what is happening in this country, because nobody will tell me. That should frighten you more than any rally."
- **R.K. Dhawan:** "There are always complaints, Madam. The reports from the states are very positive."

**Decision 5 — What do you do about Sanjay?**

| | Option | Effect |
|---|---|---|
| A | **Nothing. He is the only one who gets results** | `sanjay=backed` · Hold +5 · Order +5 · Liberty −10 · true Public trust −25 |
| B | **Speak to him privately. Tell the states to end coercion, without saying why** | `sanjay=reined` · true Public trust −12 · Liberty −3 |
| C | **Remove him from all public work and order an inquiry into the firing** | `sanjay=removed` · true Public trust +5 · Liberty +8 · Hold −15 · Order −5 |

**Consequence text**

- **A:** The targets go on being exceeded. *(Displayed Public trust rises by 5.)*
- **B:** A circular goes out about "voluntary methods". In some districts it is obeyed. Sanjay does not come to dinner for a week.
- **C:** The inquiry is the first bad news the newspapers have been allowed to print in ten months. The Youth Congress is furious. Your son does not speak to you. Several officials, seeing which way the wind blows, discover that they had concerns all along.

---

### Scene 6 — The Question

**Date:** January 1977 · **Place:** 1 Safdarjung Road, late evening

Parliament's term has already been extended once *[twice]*. The country is quiet. It has been quiet for nineteen months.

*If `press=censored`:* The Intelligence Bureau estimates that in an election the Congress would win about 340 seats. **[verify figure]**

Abroad, old friends of your father's write that they no longer know what to say about India. At home, you have begun to notice that people stop talking when you enter a room.

Nobody is asking you to hold an election. That is what makes it your decision.

**Advisors**

- **Sanjay Gandhi:** "Why now? In five years the country will be transformed and nobody will remember how. Hold an election and you hand the microphone back to the people in jail."
- **P.N. Dhar:** "You have always said this was temporary. The longer it lasts, the harder it will be to find the door."
- **The Elder:** "The reports are excellent, Prime Minister. Of course, the reports are always excellent now."

**Decision 6 — Do you ask the country?**

| | Option | Effect |
|---|---|---|
| A | **Announce a general election. Release the prisoners. Lift censorship** | `election=called` · Liberty +40 · go to the Election Night scene |
| B | **Extend Parliament's term by another year** | `election=postponed` · Liberty −10 · Hold +5 · true Public trust −10 · the scene repeats once, "January 1978", with harsher text; choosing B again sets `election=never` |
| C | **Release the prisoners and end censorship, but hold no election yet** | Liberty +25 · Order −20 · Hold −15 · mirror ends, true Public trust is revealed · then the choice between A and B is offered again |

---

### Election Night

**Date:** 20 March 1977
**Shown only if `election=called`.**

The mirror breaks here. The Public trust meter drops, in one movement, from the reported value to the true one.

The result is decided by true Public trust:

| True Public trust | Result |
|---|---|
| 50 or above | You win a reduced majority. |
| 30–49 | A hung Parliament. You lose your own seat narrowly, or hold it narrowly. |
| Below 30 | A rout. The Congress is wiped out across the north. You lose Rae Bareli. |

There is no decision on this screen. There is one line of text, and one button.

> The Cabinet Secretary asks whether there are any instructions.

**[ Accept the result ]**

> You call on the Acting President before dawn and resign. On your advice, the Emergency is revoked.

*Design note: there is deliberately no option to refuse. She did not, and the game will not invent a coup for the player to try.*

---

## 4. The free-text box ("Do something else")

Same three results as Episode 01: route to an existing option, apply a small plausible effect, or have an advisor explain why it cannot be done.

**Known cases to pre-author**

| Player tries | Result |
|---|---|
| Arrest or remove the judge | Refused in character. Ray: "I will not draft that, and you will not find a lawyer in India who will." |
| Ask the Army to take charge | Refused in character. Dhar: "The Army has stayed out of politics for twenty-eight years. The day you invite it in is the day you can no longer ask it to leave." |
| Meet JP in person | Plausible. Routes to Decision 2, option D. |
| Dissolve the Lok Sabha at once (Scene 1 or 2) | Routes to Decision 1, option C. |
| Appoint Sanjay to the Cabinet | Plausible. Hold −10, true Public trust −10. The Elder: "The party will accept it, Prime Minister. It will not forgive it." |
| Visit Turkman Gate yourself (Scene 5) | Plausible. Mirror cracks: true Public trust is shown for one scene. |
| Release only JP, on health grounds | Plausible. True Public trust +3. (He was released in November 1975, gravely ill.) |
| Any order to harm a named person or a community | Refused out of character. Options are offered again. |

**Hard limits for the AI:** no events after March 1977. No invented casualty figures. No real person shown ordering violence unless the historical record says they did. Sterilisation and demolition are reported to the player, never performed or directed by them in detail. No outcome outside the endings below.

---

## 5. Endings

### Ending A — The Caretaker
**Trigger:** `stayed=stepped_aside`.

> You watch the autumn from a smaller house. The appeal is heard. *What the Court would have decided, on the law as it then stood, is something nobody can know.*
>
> There was no Emergency. There was also, for a while, no Indira Gandhi. Whether you would have found your way back, and what the country would have looked like without those nineteen months, is the question this ending leaves with you.

### Ending B — The Verdict of the People
**Trigger:** `election=called`, true Public trust below 50.

> By the small hours the pattern is clear. Not one seat in Uttar Pradesh. Not one in Bihar. You have lost Rae Bareli to the man who took you to court.
>
> You suspended a democracy, and then you asked it a question, and when it answered you went home. Historians will argue for a long time about which of those facts matters more.

### Ending C — The Mandate
**Trigger:** `election=called`, true Public trust 50 or above. Only reachable without censorship, or with Sanjay removed and a limited amendment.

> You return with fewer seats and a quieter voice. The prisoners you released sit across the aisle and say what they think of you, and it is printed.
>
> You held on to power and gave some of it back. It is not a triumph. It may be the best ending this story has.

### Ending D — The Long Emergency
**Trigger:** `election=never`.

> The term is extended again. And again. The reports remain excellent.
>
> You are safe. The trains run on time. You no longer have any way of knowing what the country thinks, and after a while you stop wondering.
>
> *The game does not show how this ends. Governments like this one usually find out all at once.*

*Presentation note: no victory music, no share-card flourish. The card reads "I never asked."*

### Ending E — Removed
**Trigger:** Hold on office reaches 0.

> The Supreme Court upholds the Allahabad verdict. *[or]* The letter from the Congress Parliamentary Party is polite.
>
> You leave office as the law required. Within a year the men who replaced you have fallen out among themselves.

### Ending F — The Ordinary Road
**Trigger:** `emergency` is `ordinary_law` or `none`, and Hold on office stays above 0 through Scene 4.

> There is no midnight proclamation. There are eighteen more months of marches, court dates, defections and bad headlines, and then a general election on schedule.
>
> You may win it or lose it. Either way, the Constitution you inherited is the one you hand on.

---

## 6. "What really happened" screen

| Decision | What Indira Gandhi did |
|---|---|
| The verdict | Stayed in office and appealed. Accounts say she considered stepping aside and was urged against it by Sanjay Gandhi and others. **[verify]** |
| The answer to JP | Proclaimed an internal Emergency under Article 352 on the night of 25 June 1975, on the advice of S.S. Ray. |
| How it was done | The President signed that night. The Cabinet was informed at 6 a.m. Opposition leaders were arrested before dawn. Power to Delhi's newspaper offices was cut and censorship imposed. |
| Above the courts | Passed the 39th Amendment, placing the Prime Minister's election beyond judicial review. In November 1975 the Supreme Court upheld her election but struck down that clause. |
| Sanjay | Did not restrain him. Demolitions at Turkman Gate in April 1976 ended in police firing. A coercive sterilisation campaign ran through 1976. |
| The election | Extended Parliament's term twice, then on 18 January 1977 announced elections and released prisoners. Nobody knows for certain why. |

**Afterwards:** The Congress fell to 154 seats and won none in Uttar Pradesh or Bihar. Indira Gandhi lost Rae Bareli. She resigned, and the Emergency was revoked on 21 March 1977. More than 100,000 people had been detained without trial. **[verify]** A commission under Justice J.C. Shah later documented the excesses. In January 1980 she was voted back into power.

**The other view** (always shown): Her defenders argued then, and some argue now, that the country faced real disorder, that an opposition leader had publicly urged the police and army to disobey, and that inflation fell and administration improved. Her critics answer that existing laws were sufficient, that the proclamation followed a court verdict against her personally, and that the powers taken went far beyond any threat. On why she called the election, historians offer everything from faulty intelligence to conscience to her father's memory, and she never fully explained.

**Then:** "X% of players declared the Emergency. Y% of them called the election."

---

## 7. Share card

```
REWINDO · 1975
I was Indira Gandhi for nineteen months.

  Stayed in office        ✔ like Indira
  Declared the Emergency  ✔ like Indira
  Left the press free     ✘ Indira censored it
  Called the election     ✔ like Indira

Ending: THE VERDICT OF THE PEOPLE
What would you have done?
```

---

## 8. Handling a sensitive subject

This episode puts the player in the chair of a leader suspending civil liberties. These rules are part of the design, not optional.

- **Authoritarian choices are never rewarded in the framing.** They make the Hold and Order meters rise, as they did. The cost shows in Liberty, in the hidden trust meter, and in what the endings say.
- **Victims are not scenery.** Turkman Gate and the sterilisation drive reach the player as testimony from someone who was there, not as statistics and never as an action the player performs.
- **Living people and recent families.** Several people in this story have living relatives in public life. Every line of dialogue is marked as dramatised, and no real person is given invented words that accuse them of a crime.
- **Both readings are shown.** The "other view" panel is mandatory on every ending.
- **Review before release.** A historian of the period and a lawyer should read this script. So should someone whose family was affected.

## 9. Fact-check list before release

- **[verify]** The two counts in the Allahabad judgment and the 20-day stay.
- **[verify]** Wording and terms of Justice Krishna Iyer's conditional stay of 24 June 1975.
- **[verify]** What Jayaprakash Narayan said at Ramlila Maidan on 25 June about the police and army.
- **[verify]** The time the President signed, and the sequence with the Cabinet meeting.
- **[verify]** S.S. Ray's later account that he did not advise mass arrests or press censorship.
- **[verify]** Dates and vote on the 39th Amendment; the Supreme Court judgment of 7 November 1975.
- **[verify]** Dates and death toll at Turkman Gate (figures are disputed).
- **[verify]** Sterilisation figures for 1976–77.
- **[verify]** The Intelligence Bureau's seat forecast before the 1977 election.
- **[verify]** Number detained under MISA and the Defence of India Rules.
- **[verify]** 1977 seat totals; dates of resignation and revocation.

## 10. Sources to check against

- Shah Commission of Inquiry, *Interim and Final Reports* (1978)
- P.N. Dhar, *Indira Gandhi, the "Emergency", and Indian Democracy* (2000)
- Coomi Kapoor, *The Emergency: A Personal History* (2015)
- Gyan Prakash, *Emergency Chronicles* (2019)
- Christophe Jaffrelot and Pratinav Anil, *India's First Dictatorship* (2020)
- Granville Austin, *Working a Democratic Constitution* (1999)
- Katherine Frank, *Indira: The Life of Indira Nehru Gandhi* (2001)
- Kuldip Nayar, *The Judgement* (1977)
- *Indira Nehru Gandhi v. Raj Narain* (Supreme Court, 1975); *ADM Jabalpur v. Shivkant Shukla* (1976)
