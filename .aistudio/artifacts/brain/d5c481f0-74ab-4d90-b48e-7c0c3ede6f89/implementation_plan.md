# «زنجیره کلمات» (Zanjireh Kalemat) — Premium Persian Word Chain Game

A production-grade, culturally authentic Persian word-chain game («زنجیره کلمات») featuring an extensive verified Persian lexical database, animated letter roulette, Web Audio sound effects, three AI difficulty tiers with lively Persian banter, and full local multiplayer support for 1, 2, 4, and 6 players with privacy pass-and-play screens.

***

### User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed Decisions from Clarification Phase:**
> - **Turn Timer:** 15 seconds standard per turn, with dynamic urgency effects and customizable timer intervals (10s, 15s, 20s, 30s, or untimed) in settings.
> - **Sound & Audio Feedback:** Procedural Web Audio API sound synthesizer with volume controls and mute toggle (zero heavy external audio asset dependencies, instantaneous latency).
> - **AI Personality:** Lively Persian banter («دارم به یک کلمه فکر میکنم...»، «این یکی رو داشته باش!») across three distinct skill tiers (آسان, متوسط, سخت) with strategic letter trapping and realistic typing simulation.

***

## 1. Overview & Core Concept

- **What It Does:** Players compete in an authentic Persian word-chain competition. Starting from a randomly selected Persian letter revealed via a spinning tile roulette, each player must input a valid Persian word beginning with that letter within the time limit. The word's final letter becomes the mandatory starting letter for the next player. Each participant starts with 3 animated hearts (lives); submitting an invalid word, a duplicate word, the wrong starting letter, or timing out loses a heart. The last surviving player wins.
- **Target Audience:** Persian speakers, Persian language learners, families, and competitive word gamers seeking a polished, fast, and intellectually stimulating RTL experience.
- **Key Value:** Eliminates the frustration of tiny mock dictionaries and AI hallucinations by providing a verified client-side Persian vocabulary index of over 30,000+ words, complete Persian character normalization (handling ی/ي, ک/ك, تنوین, نیم‌فاصله, اعراب), letter fairness rules for rare consonants (ژ, ط, ظ, etc.), and responsive multiplayer on a single device.

***

## 2. User Experience & Visual Design

### Key User Flows
1. **Title & Lobby View:**
   - Cinematic dark navy and electric blue theme with glowing Iranian calligraphy accents.
   - Quick Mode Selection: 1 Player (vs AI), 2 Players, 4 Players, 6 Players, plus Practice Mode («حالت تمرینی») and Challenge Mode («چالش حروف سخت»).
   - Player Profile & Name Setup: Persian name inputs with playful Persian avatars.
2. **Pre-Game Letter Roulette:**
   - 3D-styled animated letter spinner cycling through Persian alphabet tiles before landing on the starting letter with a radiant glow burst and audio chime.
3. **Turn-by-Turn Game Board:**
   - Prominent HUD: Round counter, match time, active player card with glowing perimeter, and 3 breakable animated hearts per player.
   - Central Glowing Letter Tile with Persian prompt: «کلمه‌ای بنویس که با این حرف شروع شود».
   - Visual Word Chain: Interactive timeline of submitted words highlighting the connection from previous last letter to next first letter.
   - Smart RTL Input Field: Auto-focused, virtual Persian helper keyboard toggles for quick letter entry, real-time letter matching indicator, and countdown progress bar.
   - Pass-the-Device Privacy Screen: In 2, 4, and 6 player modes, an optional privacy shield prevents peeking between turns.
4. **Victory & Match Summary Modal:**
   - Confetti bursts, longest word chain metric, MVP player highlight, dictionary exploration button (to view meanings and stats of every word played), and immediate rematch button.

### Visual Identity & Theme Tokens
- **Canvas (60%):** Deep Midnight Navy (`#070B19`) and Obsidian Blue (`#0B132B`).
- **Structural Surfaces (30%):** Glassmorphism cards with subtle hairline cyan borders (`rgba(56, 189, 248, 0.15)`), frosted backdrop blur, and dark slate panels (`#111C3D`).
- **Accent Budget (10%):** Electric Neon Cyan (`#00F2FE`), Radiant Gold (`#F59E0B`), and Crimson Heart Red (`#EF4444`).
- **Typography:** Persian typeface system utilizing `Vazirmatn`, `B Yekan`, or `IRANSans` system fallbacks with strict right-to-left directionality (`dir="rtl"`). Tabular numerals (`font-mono tabular-nums`) for timers and life counts.

***

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Verified Local Persian Lexical Database vs. Pure LLM Checking**
  - *Chosen Approach:* Bundle a compiled, indexed Persian word dictionary (categorized by starting letter with normalized lookup sets) containing comprehensive nouns, verbs, adjectives, cultural terms, and inflections.
  - *Why:* Pure LLM checking suffers from latency, network failures, hallucinations, and non-deterministic game rules. A local dictionary guarantees sub-millisecond validation and 100% offline gameplay. Optional server-side Gemini AI handles rich word definitions and educational explanations.
- **Decision 2: Comprehensive Persian Normalization Engine**
  - *Chosen Approach:* Custom normalization module handling Arabic/Persian letter variants (ك -> ک, ي -> ی, ة -> ه/ت, ؤ, ئ, أ, إ -> ا), stripping diacritics (َ, ِ, ُ, ً, ٍ, ٌ, ّ, ْ), handling zero-width non-joiners (ZWNJ / نیم‌فاصله), and sanitizing whitespace.
  - *Why:* Prevents players from duplicating words through trivial typography tricks and ensures fairness.
- **Decision 3: Procedural Web Audio Synthesizer**
  - *Chosen Approach:* Synthesizing letter clicks, tick-tock countdowns, life-break glass sounds, error buzzers, and victory fanfare using the native HTML5 Web Audio API.
  - *Why:* Zero latency, zero external asset downloads or broken CDN links, and full responsiveness with master volume and mute controls.
- **Decision 4: Dynamic Letter Fairness & Balance System**
  - *Chosen Approach:* Configurable fallback rule when rare letters (like ژ, ظ, ض) deplete all valid unused words or when the dictionary has no matching word remaining. Players can reroll the letter without penalty when mathematically trapped.

***

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Zanjireh Kalemat Architecture                   │
└────────────────────────────────────────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     UI & Component Layer        │       │       Core Game Engine          │
│ - MainMenu & ModeCards          │       │ - GameStateMachine              │
│ - GameBoard & HUD               │◄──────┤ - TurnManager & Timer           │
│ - LetterRouletteTile            │       │ - LifeManager (3 Hearts)        │
│ - WordInput (RTL Sanitized)     │       │ - AI Opponent Engine (3 Tiers)  │
│ - WordChainHistory              │       │ - MatchHistory & Stats Store    │
│ - SettingsModal & DictionaryView│       └────────────────┬────────────────┘
└────────────────┬────────────────┘                        │
                 │                                         ▼
                 ▼                        ┌─────────────────────────────────┐
┌─────────────────────────────────┐       │   Persian Linguistic Engine     │
│       Web Audio Synthesizer     │       │ - Persian Normalizer (ك/ی/ZWNJ) │
│ - Tile Roulette Beep            │       │ - Starting/Ending Letter Logic  │
│ - Heart Damage Chime            │       │ - 30,000+ Word Lexical Database │
│ - Urgent Countdown Audio Ticks  │       │ - Letter Fairness & Depletion   │
│ - Victory Fanfare               │       └─────────────────────────────────┘
└─────────────────────────────────┘
```

### Data Model & Game State
```typescript
type GameMode = 'AI' | 'TWO_PLAYER' | 'FOUR_PLAYER' | 'SIX_PLAYER' | 'PRACTICE' | 'CHALLENGE';
type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface Player {
  id: string;
  name: string;
  avatar: string;
  isAI: boolean;
  lives: number; // Starts at 3
  wordsSubmitted: string[];
  isEliminated: boolean;
  score: number;
}

interface GameState {
  mode: GameMode;
  difficulty: AIDifficulty;
  players: Player[];
  activePlayerIndex: number;
  currentLetter: string;
  usedWords: Set<string>; // Normalized words
  wordHistory: Array<{
    word: string;
    normalizedWord: string;
    playerId: string;
    startLetter: string;
    endLetter: string;
    timestamp: number;
  }>;
  turnDuration: number;
  remainingTime: number;
  isPaused: boolean;
  isPassingDevice: boolean;
  roundNumber: number;
  status: 'LOBBY' | 'ROULETTE' | 'PLAYING' | 'PASS_DEVICE' | 'ROUND_END' | 'GAME_OVER';
  winner: Player | null;
}
```

### Key Execution Steps
1. **Linguistic Engine & Lexical Dataset:** Construct the Persian word database with letter-indexed Sets, canonical and normalized representations, and Arabic-Persian normalizer.
2. **Audio Synthesizer:** Build a zero-dependency Web Audio API sound generator for countdown ticks, error hits, heart breaks, letter roulette spins, and victory fanfare.
3. **Game State Engine:** Implement turn transitions, elimination triggers, duplicate detection, letter fairness fallbacks, and 3-tier AI simulation with realistic Persian typing and banter.
4. **Spectacular Visual Interface:** Build the dark navy glassmorphic layout, glowing roulette tile, word chain timeline, player heart cards, settings modal, and dictionary explorer.
5. **Multiplayer Flows:** Implement 1-player vs AI, 2-player, 4-player, and 6-player pass-and-play mechanisms with privacy shield.
6. **Verification & Polish:** Compile the Next.js applet, verify zero console errors, full RTL integrity, and complete Persian copy.
