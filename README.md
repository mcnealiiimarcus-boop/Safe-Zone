# 🛡️ Safe Zone — Personal Safety & Emergency Response Engine

**Safe Zone** is a modern, privacy-first personal safety web application designed for students, commuters, night-shift workers, and anyone navigating unfamiliar or vulnerable environments.

Safe Zone provides instant distress signaling, verified safe haven navigation, journey tracking with an automated dead man's switch, and discreet de-escalation tools.

---

## 🌟 Core Features

### 🚨 1. Tactical SOS Distress Beacon
- **3-Second Abort Guard**: Prevents accidental false alarms with an audible countdown and quick-cancel button.
- **Web Audio Siren Synthesizer**: Pure browser-native, multi-frequency European/police emergency pitch sweep oscillator that operates reliably without requiring external audio assets.
- **High-Visibility Emergency Strobe**: Alternating full-screen red/white flash pattern to attract immediate attention in dark alleys or low-visibility situations.
- **One-Touch Dispatch**: Direct dial button for `911` alongside instant SMS broadcast generation containing live GPS coordinates, accuracy radius, and Google Maps pin links for ICE contacts.

### 🛡️ 2. Verified Safe Havens Radar & Route Navigation
- **Perimeter Radar Map**: Tactical radar interface mapping the user's current GPS location relative to local safe havens.
- **Verified 24/7 Havens Directory**:
  - Police precinct lobbies & armed security points
  - University campus escort hubs & Blue Light kiosks
  - 24/7 Trauma Emergency Rooms & urgent clinics
  - Major transit stations with concourse security
  - Well-lit 24/7 commercial stores and pharmacies
- **Walking Time Estimator**: Live distance in miles and estimated pedestrian arrival times.
- **Direct Navigation & Dialing**: Jump directly to external GPS navigation or call haven reception desks with one tap.

### 🚶 3. "Walk With Me" Journey Guardian (Dead Man's Switch)
- **Safety Timer**: Set your expected walking duration (e.g., 5m, 10m, 15m, 30m) and destination.
- **Automated Check-In Switch**: Prompts user with audible chimes at set intervals (e.g., every 5 minutes).
- **Grace-Period Escalation**: If the user fails to tap "I am Safe" within the 60-second grace window, the emergency distress alarm and contact broadcast automatically arm.
- **Companion Share Link**: Pre-fills an SMS tracker link to send to a friend or partner before embarking.

### 📱 4. Stealth Disguise Mode (Calculator Camouflage)
- **Instant Camouflage**: Instantly swaps the entire safety UI for a realistic, fully functioning calculator.
- **Functional Math Engine**: Supports addition, subtraction, multiplication, division, percentages, and sign changes.
- **Secret Unlock Mechanism**: Entering PIN code `1234` followed by `=`, or tapping the subtle top-left mode indicator three times immediately reveals the Safe Zone interface.

### 📞 5. Escape Call Simulator
- **Discreet De-Escalation**: Generates a realistic incoming telephone call to politely excuse oneself from uncomfortable encounters or dates.
- **Customizable Personas**: Choose from "Campus Security Escort", "Mom", "Roommate Alex", or "Dad".
- **Realistic Ringtone & Script**: Uses synthesized dual-tone telephone frequencies (`440Hz` + `480Hz`) with on-screen script prompts to simulate a natural conversation.

### ⚠️ 6. Community Hazard Reporting
- **Crowdsourced Warnings**: Report and view neighborhood hazards such as broken streetlighting, dark corridors, sidewalk blockages, and suspicious activity.
- **Community Validation**: Upvote system to verify active hazards and prioritize well-lit walking alternatives.

### 🏥 7. First Responder Emergency Medical ID
- **Offline EMT Card**: Formatted for first responders displaying blood type, severe allergies, current medications, chronic conditions, and emergency notes.
- **Local Device Storage**: Stored exclusively on-device in LocalStorage without external server uploads.

### 📖 8. Crisis Resources & Offline First Aid
- **Interactive 5-4-3-2-1 Sensory Grounding Tool**: Step-by-step checklist to de-escalate acute panic attacks and shock.
- **One-Touch Emergency Hotlines**: 
  - `911` (Immediate Emergency Dispatch)
  - `988` (Suicide & Crisis Lifeline — 24/7 Free & Confidential)
  - `1-800-799-SAFE` (National Domestic Violence Hotline)
  - `1-800-222-1222` (Poison Control Center)
  - `1-866-488-7386` (The Trevor Project)
- **Medical Flashcards**: Hands-only CPR rhythm guide (100–120 BPM), Stop the Bleed protocol, and Run-Hide-Fight active threat procedures.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 SPA |
| **Build Tool** | Vite 6 |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS v4 |
| **Audio Synthesis** | HTML5 Web Audio API (Synthesizers, Oscillators, GainNodes) |
| **Location Engine** | W3C Geolocation API (`navigator.geolocation`) |
| **Persistence** | LocalStorage API |
| **Iconography** | Lucide React |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 20+ or 22+
- **npm**: Version 9+

### Installation & Local Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mcnealiiimarcus-boop/Safe-Zone.git
   cd Safe-Zone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Verify TypeScript & linting:**
   ```bash
   npm run lint
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```
   Production assets will be emitted to `dist/`.

---

## 🔒 Privacy & Security Architecture

1. **Client-Side Privacy**: Safe Zone does not transmit your real-time GPS coordinates to any unauthorized third-party tracking servers.
2. **Local Storage Only**: Medical profile data, custom ICE contacts, and user hazard reports are stored securely in your browser's private `localStorage`.
3. **No External Sound Assets**: Siren and ringtone generation are synthesized in-memory via the Web Audio API, enabling rapid offline audio execution without network latency.

---

## 📂 Project Directory Structure

```
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore patterns
├── index.html                # App entry point with safety metadata
├── metadata.json             # AI Studio applet specifications
├── package.json              # App dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite & Tailwind configuration
├── src/
│   ├── main.tsx              # React DOM root mounting point
│   ├── App.tsx               # Main application controller & modal orchestration
│   ├── index.css             # Tailwind v4 directives & keyframe animations
│   ├── types/
│   │   └── index.ts          # Core TypeScript types & data schemas
│   ├── utils/
│   │   ├── geo.ts            # Haversine distance, Safe Havens database & coordinates
│   │   ├── siren.ts          # Web Audio API emergency siren & ringtone synthesizer
│   │   └── storage.ts        # LocalStorage wrapper & defaults
│   └── components/
│       ├── Header.tsx            # Live GPS status, battery monitor & quick tools
│       ├── SosModal.tsx          # 3-second abort countdown, siren & SMS dispatcher
│       ├── WalkWithMe.tsx        # Dead Man's Switch journey guardian & check-in switch
│       ├── SafeZonesMap.tsx      # Tactical radar map, safe havens & hazard reports
│       ├── EmergencyContacts.tsx # ICE contact roster & sample SMS sender
│       ├── FakeCallModal.tsx     # Simulated escape call generator
│       ├── SafetyGuides.tsx      # 5-4-3-2-1 grounding, hotlines & first aid cards
│       ├── MedicalIdModal.tsx    # First responder emergency medical ID
│       └── DisguiseMode.tsx      # Working calculator disguise with secret PIN
└── README.md                 # Project documentation
```

---

## 📄 License

This project is licensed under the MIT License.
