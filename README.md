# Emerald Guide

**A free, ad-free, offline-friendly Pokémon Emerald walkthrough web app — clear maps, Prima-style story prose, and everything you need to beat Hoenn (and clean it up afterward).**

**Live site (beta):** [https://nickelz34.github.io/Emerald-Guide/](https://nickelz34.github.io/Emerald-Guide/)

Current app version: **1.26.24**

---

Hi — I’m Nicholas. I built this guide by myself after long factory shifts because I love Emerald and wanted something clearer than cluttered wikis or ad-heavy pages. Use it however you like. Happy gaming!

---

## Table of contents

1. [What Emerald Guide is](#what-emerald-guide-is)
2. [What you get — full feature guide](#what-you-get--full-feature-guide)
3. [Requirements](#requirements)
4. [How to install — Linux](#how-to-install--linux)
5. [How to install — Windows](#how-to-install--windows)
6. [How to install — macOS](#how-to-install--macos)
7. [Daily use cheat sheet](#daily-use-cheat-sheet)
8. [Troubleshooting](#troubleshooting)
9. [License & disclaimer](#license--disclaimer)

---

## What Emerald Guide is

Emerald Guide is a **local web app** you open in a browser while you play Pokémon Emerald on a GBA, cartridge, or emulator. It does **not** run the game, does **not** need a ROM, and does **not** read your save file.

It tells you what to do next, shows annotated area maps and Hoenn overworld crops, lists trainer parties and wild encounters, and includes postgame, contests, Battle Frontier, and Mystery Gift island content.

You can:

- Use the **hosted beta** at the link above (no install), or
- **Clone and run it locally** with Node.js so everything works on your machine (all guide data and Pokédex data are bundled — no PokéAPI fetch required at runtime).

---

## What you get — full feature guide

The top navigation has **three sections**:

| Tab | What it’s for |
|---|---|
| **Walkthrough** | The full playthrough guide (pregame → story → postgame) |
| **Pokédex** | All 387 Gen 3 species — stats, evolutions, wild locations |
| **Hoenn Map** | Interactive region map; jump to walkthrough steps, routes, gyms, marts, trainers |

Older versions of this project had separate “Secrets,” “Legendaries,” and “Tips” tabs. Those topics are now **woven into the walkthrough** (and into map/route panels) so you follow one path instead of hopping between sections.

You can also open an in-app **changelog** by clicking the version badge (`v1.26.24`) next to the Emerald Guide title.

### Layout: Mobile vs Desktop

A **Mobile / Desktop** toggle in the header switches the chrome intentionally (not only by screen width). Your choice is remembered in the browser (`localStorage`).

- **Desktop** — side-by-side step list + event detail; left/right arrow keys to change events
- **Mobile** — compact nav, collapsible **Steps** drawer, swipe left/right between events, sticky search, tap-outside or Escape to close the Steps menu

---

### Story Walkthrough

This is the heart of the app.

#### First-time Guide settings

The first time you open **Walkthrough**, you get a setup screen (**How do you want to play?**). You can reopen it anytime with **Guide settings**.

**Pregame chapters**

- Checkbox: **Skip Battles, Catching, Evolution & Breeding prep**
- Off (default): start with interactive Battles & Training, Catching/Travel/Trading, Evolution, and Breeding reference chapters
- On: jump straight to Littleroot Town (`littleroot-1`)

**Walkthrough mode**

- **Main storyline** — required story events only (gyms, rivals, plot). Optional chapters and optional side events are hidden.
- **Completionist** (default) — main story **plus** every optional side quest, activity, and bonus area.

**Continue with save code**

- Enter a **4-letter** code previously created on **this same browser** to restore mode, pregame skip, and your place in the guide.

#### What the walkthrough covers

The guide is organized into three **bands**:

1. **Pregame**
   - Battles & Training (battle commands, move targets, types/multipliers, strategies, battle messages, status cures, all 25 natures, vitamins/EVs, full TM01–TM50 & HM catalog)
   - Catching, Surf/Dive, fishing, caves, every Poké Ball, and trading (including FireRed/LeafGreen National Dex gates)
   - Evolution methods (stones, trades, friendship, unique forms) with charts
   - Breeding (Day Care, egg groups, incense babies, IVs/natures/abilities, egg moves, hatching) plus a **Breeding lookup** tool
2. **Main story**
   - Littleroot → Hall of Fame, chapter-by-chapter (towns, routes, dungeons, gyms, League)
   - Optional chapters (hidden in Storyline mode), for example Trick House, Contest prep, Lilycove Contests, Abandoned Ship, Shoal Cave, Sealed Chamber & Regis
   - Optional in-chapter events (Safari Zone, Mirage Island, legendary catches you can delay, Battle Tents, etc.)
3. **Postgame**
   - Opening (S.S. Ticket, Latias/Latios TV, National Dex / Scott)
   - Battle Frontier
   - Postgame Hoenn (Beldum, Desert Underpass, Trainer Hill, Johto starters, Safari expansion, Match Call rematches, Steven, diplomas/stars, and more)
   - Contest mastery
   - Mystery Gift & event islands (Eon / Mystic / Aurora Ticket / Old Sea Map content)

Legendaries are **not** a separate tab — they appear at the story/postgame beats where you unlock them (Groudon, Kyogre, Rayquaza, Regis, Latios/Latias, ticket islands, etc.).

#### What each walkthrough event shows

A selected event can include:

- **Title**, **location**, and short **summary**
- **Optional** badge when the event is skippable for the main story
- **Mark complete / Completed** toggle (story & postgame only — pregame tips cannot be marked complete)
  - Completing is **manual**. Opening or browsing an event does **not** auto-complete it or earlier events
- **Story prose** — Prima-style narrative paragraphs retelling that beat of the game
- **Annotated maps / screenshots**
  - Area maps with sprite markers (trainers, items, NPCs, shops, entrances, wild spots, and more)
  - Baked **face-off cutscenes** for rival battles, gym leaders, Elite Four, and the Champion
  - Multi-room gym layouts (for example Petalburg Gym shown room-by-room)
  - Click a map to open a **lightbox**: zoom (scroll / pinch), pan (drag), reset/fit controls, prev/next when a step has multiple images
- **Contextual helper panels** when the event calls for them:
  - **Starter comparison** (Treecko / Torchic / Mudkip) — difficulty, abilities, evolutions, stats, early gym matchups
  - **Gym guide** — leader, specialty, badge, puzzle notes, junior trainers, full leader party
  - **Rival guide** — choose your gender + starter to see the correct rival party
  - **Trainer detail** — party sprites, types, moves, held items, prize money, battle tips
  - **Mart / shop stock** — item icons, prices, unlock notes (including multi-floor department stores)
  - **HM unlock table** — which badge unlocks which field move
  - **Key items table**
  - **Scott sightings** checklist (Battle Frontier BP bonuses)
  - **Match Call** rematch finder + rematch location rules
  - **Evolution / breeding charts** and **breeding species lookup**
- **What to do** — numbered objectives checklist
- **Tips** — strategy, items, timing
- **Secrets, Extras, & Hidden Items** — missables merged from the step and the area data
- **Wild Pokémon** table for the linked area(s) — methods (grass, surf, rods, rock smash, cave), levels, rates, species sprites
- **Show on Hoenn map** — jump to that place on the regional map
- **Tags** for search/filtering context

#### Step list, search, and navigation

- Left rail (desktop) or **Steps** drawer (mobile): chapters → numbered events
- **Search** filters by title, location, story text, checklist, tips, secrets, tags, and chapter name
- Sticky search on mobile with a clear (×) control; match count stays visible while you scroll
- **Previous / Next** buttons; desktop **← / →** keys; mobile **swipe** between events
- Counter showing your place among visible steps

#### Story progress bar

Above the walkthrough content:

- Markers for all **8 gym badges**, plus **Elite Four**, **Champion**, and **Hall of Fame**
- Badge / league markers light up from events you **Mark complete** (not from merely visiting a step)
- Click a marker to jump to that milestone’s step
- Status text tells you the next badge or league goal

#### Save progress

- **Save progress** creates a random **4-letter save code** and tries to copy it to the clipboard
- Codes store your walkthrough mode, pregame preference, and current step in **this browser’s `localStorage` only**
  - They are **not** cloud-synced and **not** tied to a Pokémon Emerald cart/emulator save
- Use **Continue with save code** on the Guide settings screen to resume

Preferences also auto-persist: setup choices, active step, and completed step IDs survive page reloads in the same browser.

---

### Annotated maps (deep dive)

Many events ship pokeemerald-calibrated maps so pins line up with real in-game layouts.

**Marker kinds you will see**

- Towns, routes, gyms, landmarks
- Visible items, hidden items, berries
- Entrances / exits
- Shops / marts
- Trainers and important NPCs (often with authentic Emerald overworld / trainer sprites)
- Wild encounter spots

**Interaction**

- Hover / tap a pin for callouts
- Open trainers → full party panel
- Open shops → stock list
- Open routes / areas → wilds, items, trainers, secrets
- Zoom and pan on large maps; pinch on touch devices
- Face-off cutscenes often appear **above** the floor plan for that battle

---

### Pokédex

Fully **bundled offline** — wild encounter data, species info, and Emerald sprites ship with the app. You do **not** need an internet connection to use the Pokédex after the site/app has loaded (runtime PokéAPI / GitHub fetches are gone).

**Scopes**

- **Hoenn** — 202 regional dex entries
- **National** — 185 additional species (includes the Deoxys / glitch edge cases the data covers)
- **All** — 387 entries in one list

**Browse & search**

- Search by name, dex number, encounter method, or location name
- Cards show sprite, methods, level range, and location count — or “Not in the wild” for gifts / trades / evolutions

**Detail view**

- Types, genus, flavor text
- Abilities (including hidden ability when present)
- Height / weight, egg groups
- Emerald-accurate evolution methods
- Base stats with bars + BST
- **Where to find** — every wild location with method, levels, rate, and a clickable annotated map preview

Emerald wild tables in this guide do **not** vary encounters by time of day (tide-based Shoal Cave notes are handled where relevant).

---

### Hoenn Map

A full-region map of Hoenn you can zoom, pan, and pinch.

- **Layer toggles** for pin categories (towns, routes, shops, trainers, items, etc.)
- Filter trainers (for example rematchable-only where supported)
- **Area switcher** for interior / dungeon maps with their own pins
- Click pins to:
  - Jump into the matching **walkthrough** step
  - Open a **route guide** (wilds, items/berries, trainers, secrets)
  - Open a **gym** detail / guide panel
  - Open a **mart** stock list
  - Open a **trainer** battle panel
- Opening the map from **Show on Hoenn map** or the Map tab restores your last pan/zoom for the **current browser session** (a fresh session starts at the normal full-map framing — it no longer auto-pops the current walkthrough town)

---

### The everything included list

A quick look at what ships with the guide:

- Full story walkthrough from Littleroot through the Elite Four & Hall of Fame
- Postgame: Frontier, Hoenn cleanup, contests, Mystery Gift islands
- Pregame Catching/Travel/Trading, Evolution, and Breeding chapters with interactive tools
- Storyline vs Completionist mode filtering
- Manual Mark complete + gym / league progress bar
- 4-letter local save codes
- Searchable step list (desktop rail + mobile Steps drawer)
- Prima-style story prose + checklist + tips + secrets per event
- Annotated area maps with sprite pins
- Rival, gym leader, and League face-off cutscenes
- Multi-room gym maps (including Petalburg)
- Trainer parties, moves, items, and battle tips
- Gym guides, rival party resolver, starter comparison
- Mart inventories and shop pins
- HM unlock + key item reference tables
- Scott sightings + Match Call rematch tools
- Wild encounter tables on steps and route guides
- Offline Pokédex (387) with location maps
- Interactive Hoenn overworld map with layers
- Mobile and Desktop layouts, swipe + keyboard navigation
- In-app changelog from the version badge
- No ROM required; guide-only fan project

---

## Requirements

To run Emerald Guide **on your own computer** you need:

| Requirement | Details |
|---|---|
| **Node.js 18+** (20 LTS or 22 LTS recommended) | Vite 6 used by this project requires Node `^18 \|\| ^20 \|\| >=22` |
| **npm** | Ships with Node.js — used to install dependencies and start the app |
| **Git** | Used once to download (`clone`) the project from GitHub |
| **A modern browser** | Chrome, Firefox, Edge, or Safari |
| **Disk space** | Roughly **300–500 MB** free for Node.js, the repo (~70 MB+), and `node_modules` |
| **Internet** | Needed to clone the repo and run `npm install`. After that, the guide and Pokédex run locally without runtime API downloads |

### You do **not** need

- Python, Java, Docker, or a database  
- A Pokémon ROM, emulator, or cartridge connection  
- Admin/root for day-to-day running (only when installing Node.js / Git system-wide)

### Prefer zero install?

Open the hosted beta: [https://nickelz34.github.io/Emerald-Guide/](https://nickelz34.github.io/Emerald-Guide/)

---

## How to install — Linux

These steps use a normal terminal (`bash` or `zsh`). Distro package names differ — pick the block that matches your system, then follow the common clone / install / run steps.

### Best Linux operating systems for this guide

Emerald Guide is a small Node.js / Vite web app. It does **not** need a special “gaming Linux” or GPU drivers. Any modern desktop distro works if you can install **Git** and **Node.js 18+**. Some systems are simply smoother for first-time setup:

| Priority | Distro | Why it’s a good fit |
|---|---|---|
| **Best for most people** | **Ubuntu LTS** (22.04 / 24.04) | Huge documentation, predictable `apt`, easy recovery if something breaks. Use **nvm** for Node — Ubuntu’s packaged `nodejs` is often too old. |
| **Best Ubuntu-like (polished desktop)** | **Linux Mint** (Cinnamon) or **Pop!_OS** | Same Debian/Ubuntu package commands as below, friendlier desktop defaults, great if you’re coming from Windows. |
| **Best “just works + fresh packages”** | **Fedora Workstation** | Current Node/Git are usually available via `dnf` without fighting ancient packages. Excellent if you want a modern Red Hat–family system. |
| **Best rolling / power-user** | **Arch Linux**, **EndeavourOS**, or **Manjaro** | `pacman` Node is typically new enough; EndeavourOS is the gentler Arch entry point. Still fine to use nvm if you prefer a user-local Node. |
| **Also solid** | **openSUSE Leap / Tumbleweed**, **Debian Testing/Sid** (or Debian Stable **with nvm**) | Fully supported by the commands below; on Debian Stable prefer nvm so you don’t get stuck on an old Node. |

**Practical recommendation**

1. If you’re new to Linux or just want the path of least resistance: **Ubuntu LTS**, **Linux Mint**, or **Pop!_OS**, then install Node with **nvm** (see step 2).  
2. If you already like Fedora: stay on **Fedora Workstation**.  
3. If you already know Arch: stay there — don’t switch distros just for this guide.

**What to avoid / treat carefully**

- **Very old LTS releases** that only ship Node 12/16 in the default repos — still usable, but **you must use nvm** (or another current Node source).  
- **Container-only or headless servers** without a browser on the same machine — you can still run Vite, but you’ll want a browser somewhere (`localhost` or the printed Network URL).  
- **WSL on Windows** — follow the Linux commands inside WSL if you choose that workflow, but for a dedicated Windows machine the [Windows install section](#how-to-install--windows) is usually simpler.  
- You do **not** need SteamOS, specialized gaming spins, or Wayland-specific tweaks for Emerald Guide.

Pick whichever distro above you’re comfortable with, then continue from step 0.

### 0. Open a terminal

- **GNOME / Ubuntu / Pop!_OS / Linux Mint:** `Ctrl+Alt+T`, or Applications → Terminal  
- **KDE / Fedora Workstation:** Konsole / System → Terminal  
- **Arch / Sway / i3:** your usual terminal emulator  

Confirm you’re in a normal user shell (not a broken `PATH`):

```bash
echo "$SHELL"
whoami
pwd
```

---

### 1. Install Git

**Debian / Ubuntu / Linux Mint / Pop!_OS**

```bash
sudo apt update
sudo apt install -y git
```

**Fedora / RHEL / CentOS Stream**

```bash
sudo dnf install -y git
```

**Arch Linux / Manjaro / EndeavourOS**

```bash
sudo pacman -Syu --needed git
```

**openSUSE**

```bash
sudo zypper refresh
sudo zypper install -y git
```

Verify:

```bash
git --version
```

You want something like `git version 2.x.x`. If you see `command not found`, the package did not install — re-run the install command and fix any apt/dnf/pacman errors first.

---

### 2. Install Node.js 18+ (and npm)

Many distros ship an **old** Node packaged as `nodejs`. Emerald Guide needs **18 or newer**. Prefer **nvm** (Node Version Manager) unless you know your distro package is current.

#### Recommended on every distro: nvm (Node Version Manager)

nvm installs Node in your home directory — no fighting system packages.

1. Install nvm (check [nvm releases](https://github.com/nvm-sh/nvm/releases) if you want a newer install script tag; `v0.40.1` is commonly used):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

If `curl` is missing:

```bash
# Debian/Ubuntu
sudo apt install -y curl
# Fedora
sudo dnf install -y curl
# Arch
sudo pacman -S --needed curl
```

2. Load nvm in **this** terminal (or close the terminal and open a new one):

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

3. Install and activate the current LTS:

```bash
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'
```

4. Verify:

```bash
node --version
npm --version
which node
```

Expected: `node` reports `v18…`, `v20…`, or `v22…` (or newer LTS), and `which node` points under `~/.nvm/…`.

**Important:** Every new terminal must load nvm. The install script usually appends lines to `~/.bashrc` or `~/.zshrc`. If `node` disappears after closing the terminal, open your shell config and confirm those lines exist, then run `source ~/.bashrc` (or `source ~/.zshrc`).

#### Alternative A — Debian / Ubuntu packages (only if version ≥ 18)

```bash
sudo apt update
sudo apt install -y nodejs npm
node --version
```

If `node --version` is **below 18**, do **not** continue with that package — use **nvm** above instead (or install from [NodeSource](https://github.com/nodesource/distributions) following their current docs for your Ubuntu/Debian version).

#### Alternative B — Fedora

```bash
sudo dnf install -y nodejs npm
node --version
```

Fedora’s packages are usually recent enough. If still below 18, use nvm.

#### Alternative C — Arch

```bash
sudo pacman -Syu --needed nodejs npm
node --version
```

Arch’s `nodejs` package is typically current.

#### Alternative D — Snap (Ubuntu-like systems)

```bash
sudo snap install node --classic
node --version
npm --version
```

---

### 3. Choose a folder and clone the repository

```bash
mkdir -p ~/projects
cd ~/projects
git clone https://github.com/nickelz34/Emerald-Guide.git
cd Emerald-Guide
```

Confirm you are in the project root (you should see `package.json`, `src/`, `public/`):

```bash
ls
test -f package.json && echo "OK: package.json present"
```

**SSH alternative** (if you use GitHub SSH keys):

```bash
git clone git@github.com:nickelz34/Emerald-Guide.git
```

**Updating an existing clone later:**

```bash
cd ~/projects/Emerald-Guide
git pull origin main
npm install
```

---

### 4. Install project dependencies

Still inside `Emerald-Guide`:

```bash
npm install
```

What this does:

- Reads `package.json` / `package-lock.json`
- Downloads React, Vite, TypeScript, and other packages into `node_modules/`
- Usually takes 1–3 minutes depending on your connection

Success looks like returning to a prompt **without** `npm ERR!` lines.

**Do not use `sudo npm install`.** If npm complains about permissions for **global** installs, fix your npm prefix instead:

```bash
mkdir -p ~/.npm-global
npm config set prefix "$HOME/.npm-global"
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

(Use `~/.zshrc` instead of `~/.bashrc` if you use zsh.)

Then run `npm install` again **without** sudo.

Optional: install exactly from the lockfile (CI-style):

```bash
npm ci
```

`npm ci` requires a clean `node_modules` and an existing `package-lock.json`. Prefer it when you want a bit-for-bit dependency match; `npm install` is fine for normal use.

---

### 5. Start the development server

```bash
npm run dev
```

You should see output similar to:

```text
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

This project’s Vite config sets `server.host = true`, so it listens on all interfaces. For local use, open:

**http://localhost:5173/**

**Leave this terminal open** while you use the app. Closing it (or pressing Ctrl+C) stops the server.

Then:

1. Open Chrome, Firefox, or another modern browser  
2. Go to `http://localhost:5173/`  
3. You should see Emerald Guide with Walkthrough / Pokédex / Hoenn Map  

If port **5173** is already taken:

```bash
npm run dev -- --port 5174
```

Open `http://localhost:5174/` instead.

---

### 6. Stop the app

Focus the terminal running Vite and press:

```text
Ctrl+C
```

If it asks to confirm, press `Ctrl+C` again or answer yes.

---

### 7. (Optional) Production build and local preview

```bash
npm run build
npm run preview
```

`npm run build` runs asset/map verification scripts, TypeScript (`tsc -b`), and Vite’s production bundle into `dist/`.

`npm run preview` serves that folder (often at `http://localhost:4173/`).

The hosted GitHub Pages site builds with `VITE_BASE_PATH=/Emerald-Guide/` so assets load under that subpath. For a **local** clone you usually leave the base path alone (Vite defaults to `/` when that env var is unset).

---

### 8. Linux firewall note

For **localhost-only** use you normally change nothing. If you intentionally open the Network URL from another device on your LAN, you may need to allow TCP port 5173 in your firewall (`ufw`, `firewalld`, etc.). Prefer localhost when unsure.

---

## How to install — Windows

These steps target **Windows 10** and **Windows 11**. Use **Windows PowerShell** (or Windows Terminal → PowerShell).

### 0. Open PowerShell

1. Press the **Windows** key  
2. Type `PowerShell`  
3. Open **Windows PowerShell** or **Terminal**  

Optional: confirm execution policy won’t block normal npm scripts (you usually do **not** need to change this for `npm run dev`):

```powershell
Get-ExecutionPolicy
```

If scripts are blocked later, opening PowerShell as your user and running `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` is a common fix — only do this if npm/scripts clearly fail with an execution-policy error.

---

### 1. Install Node.js (LTS)

#### Option A — Official installer (recommended for most people)

1. Open https://nodejs.org in your browser  
2. Download the **LTS** Windows installer (`.msi`, 64-bit)  
3. Run the installer  
4. Click through the wizard. Keep defaults, especially:
   - **Add to PATH** (must stay enabled)
   - Optional “Tools for Native Modules” is fine either way for this project (we don’t require a global C++ toolchain for day-to-day `npm run dev`)
5. Finish the installer  
6. **Close every PowerShell / Terminal window** and open a **new** one so PATH updates apply  

Verify:

```powershell
node --version
npm --version
```

Expected examples: `v20.19.0` / `v22.14.0` and an npm like `10.x`. Both must work. If PowerShell says the command is not recognized, see [Troubleshooting — Windows](#windows-troubleshooting).

#### Option B — winget (Windows Package Manager)

In an **elevated-or-normal** PowerShell (winget usually works for the current user):

```powershell
winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
```

Close and reopen PowerShell, then run `node --version` and `npm --version`.

#### Option C — Chocolatey (if you already use it)

In an **Administrator** PowerShell:

```powershell
choco install nodejs-lts -y
```

Close and reopen PowerShell afterward.

---

### 2. Install Git for Windows

#### Option A — Official installer

1. Open https://git-scm.com/download/win  
2. Run the downloaded installer  
3. Click **Next** through the screens — defaults are fine for this project  
   - Editor can stay Neo/Vim/Notepad++/VS Code — unused for simply running the guide  
   - “Git from the command line and also from 3rd-party software” is the usual PATH choice  
4. Finish, then **close and reopen PowerShell**

Verify:

```powershell
git --version
```

Expected: `git version 2.x.x.windows.x`

#### Option B — winget

```powershell
winget install Git.Git --accept-package-agreements --accept-source-agreements
```

Reopen PowerShell and verify with `git --version`.

---

### 3. Clone the repository

Pick a folder (Documents is fine):

```powershell
cd $HOME\Documents
git clone https://github.com/nickelz34/Emerald-Guide.git
cd Emerald-Guide
```

Confirm contents:

```powershell
dir
Test-Path .\package.json
```

`Test-Path` should return `True`.

**Updating later:**

```powershell
cd $HOME\Documents\Emerald-Guide
git pull origin main
npm install
```

---

### 4. Install project dependencies

From inside `Emerald-Guide`:

```powershell
npm install
```

First run can take several minutes. Watch for a clean return to the prompt.

If you see `npm ERR!` network errors, check internet / VPN / proxy (see troubleshooting). Do **not** run PowerShell “as Administrator” just for `npm install` unless a permissions error explicitly requires it for your machine policy.

Optional lockfile-exact install:

```powershell
npm ci
```

---

### 5. Start the app

```powershell
npm run dev
```

Look for:

```text
  ➜  Local:   http://localhost:5173/
```

**Keep this PowerShell window open.**

1. Open Edge, Chrome, or Firefox  
2. Visit **http://localhost:5173/**  
3. You should see Emerald Guide  

If 5173 is busy:

```powershell
npm run dev -- --port 5174
```

Then open `http://localhost:5174/`.

**Note on file watching:** this project’s Vite config enables polling and ignores `public/` so Windows file locks on PNGs under `public/` don’t crash the watcher with `EBUSY`. You normally don’t need to change anything for that.

---

### 6. Stop the app

Click the PowerShell window running Vite and press **Ctrl+C**. If Windows asks `Terminate batch job (Y/N)?`, type `Y` and Enter.

---

### 7. (Optional) Production build and preview

```powershell
npm run build
npm run preview
```

Open the URL printed by preview (commonly `http://localhost:4173/`).

---

### 8. Windows extras that help

- **Windows Terminal** (from Microsoft Store) gives better tabs/fonts for long npm logs  
- If SmartScreen blocks the Node or Git installer, choose **More info → Run anyway** only when you downloaded from the official sites above  
- Corporate proxies: configure npm before `npm install` (see troubleshooting)

---

## How to install — macOS

These steps target **macOS** on both **Apple silicon** (M1 / M2 / M3 / M4) and **Intel** Macs. You will use **Terminal** (or iTerm2 if you already have it). The commands below are the same for Apple silicon and Intel once Node and Git are installed correctly for your chip.

Supported for this guide: recent macOS releases that can run a current **Node.js LTS** and a modern browser (Safari, Chrome, Firefox, Edge, Arc, etc.).

### 0. Open Terminal and check your Mac

1. Press **Cmd + Space**, type `Terminal`, press **Return**  
   Or open **Applications → Utilities → Terminal**  
2. Optional but useful — learn your chip and macOS version:

```bash
uname -m
sw_vers
```

- `arm64` → Apple silicon  
- `x86_64` → Intel (or an Intel Terminal under Rosetta)

Confirm you have a normal user shell:

```bash
echo "$SHELL"
whoami
pwd
```

Most modern Macs default to **zsh**. Either `zsh` or `bash` is fine for the rest of these steps.

---

### 1. Install Apple’s Command Line Tools (includes Git)

On macOS, the cleanest way to get a working `git` (and the compilers some Node install methods expect) is Apple’s **Command Line Tools**.

In Terminal:

```bash
xcode-select --install
```

A system dialog should appear — choose **Install** (you do **not** need the full Xcode app from the App Store for Emerald Guide).

Wait until it finishes, then verify Git:

```bash
git --version
```

Expected: something like `git version 2.x.x` (Apple’s build is fine).

If you already installed CLT / Xcode earlier and get `xcode-select: error: command line tools are already installed`, you’re done with this step — just confirm `git --version` works.

**Optional — Homebrew’s Git**

If you prefer Homebrew’s newer Git after installing Homebrew (step 2 options below):

```bash
brew install git
hash -r
git --version
which git
```

Either Apple Git or Homebrew Git works for cloning this repo.

---

### 2. Install Node.js 18+ (and npm)

Emerald Guide needs **Node.js 18+** (20 LTS or 22 LTS recommended). Pick **one** method below — don’t mix them randomly in the same shell until you know which `node` is active (`which node`).

#### Option A — Official Node.js installer (simplest for many people)

1. Open [https://nodejs.org](https://nodejs.org) in Safari/Chrome  
2. Download the **LTS** macOS installer  
   - Apple silicon → the **ARM64** / Apple installer  
   - Intel → the **x64** installer  
3. Open the `.pkg` and click through **Continue → Agree → Install** (you’ll need an admin password)  
4. **Quit Terminal completely** (Cmd+Q) and open a new Terminal window  

Verify:

```bash
node --version
npm --version
which node
```

You want `v18…` / `v20…` / `v22…` (or newer LTS) and an npm like `10.x`.

#### Option B — nvm (excellent if you want multiple Node versions)

nvm keeps Node in your home folder and is easy to upgrade later.

1. Install nvm ([nvm releases](https://github.com/nvm-sh/nvm/releases) if you want a newer tag; `v0.40.1` is commonly used):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

2. Load nvm in this Terminal (or open a new tab/window):

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

On zsh, the installer usually appends lines to `~/.zshrc`. Confirm:

```bash
grep -n nvm ~/.zshrc || true
```

3. Install LTS and make it default:

```bash
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'
node --version
npm --version
which node
```

`which node` should point under `~/.nvm/...`.

#### Option C — Homebrew

If you already use Homebrew (or want it):

1. Install Homebrew if needed — follow the current one-liner at [https://brew.sh](https://brew.sh) (it will ask for an admin password and may install CLT).  
2. Install Node:

```bash
brew update
brew install node
node --version
npm --version
which node
```

Homebrew’s `node` formula tracks current releases and usually satisfies Vite’s engine range. If `brew` itself isn’t found in a new Terminal after install, follow Homebrew’s printed “Next steps” (often adding `/opt/homebrew/bin` on Apple silicon or `/usr/local/bin` on Intel to your `PATH` in `~/.zprofile` / `~/.zshrc`).

**PATH tip for Apple silicon + Homebrew**

If `brew` works in one Terminal but not another, add this and reopen Terminal:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

---

### 3. Choose a folder and clone the repository

```bash
mkdir -p ~/Projects
cd ~/Projects
git clone https://github.com/nickelz34/Emerald-Guide.git
cd Emerald-Guide
```

Confirm you’re in the project root:

```bash
ls
test -f package.json && echo "OK: package.json present"
```

You should see `package.json`, `src/`, and `public/`.

**SSH alternative** (if your GitHub account uses SSH keys):

```bash
git clone git@github.com:nickelz34/Emerald-Guide.git
```

**Updating an existing clone later:**

```bash
cd ~/Projects/Emerald-Guide
git pull origin main
npm install
```

**macOS Gatekeeper / quarantine note**

Cloning with Git does not quarantine files the way random downloaded `.app` bundles do. You should **not** need to right-click → Open anything for this project. If a security dialog ever appears for a terminal helper, cancel and verify you cloned from the official GitHub URL above.

---

### 4. Install project dependencies

Still inside `Emerald-Guide`:

```bash
npm install
```

This creates `node_modules/` and usually takes 1–3 minutes.

Success = back at a prompt with no `npm ERR!` lines.

**Do not use `sudo npm install`.** If you previously used sudo with npm and hit permission errors:

```bash
sudo chown -R "$(whoami)" ~/.npm
cd ~/Projects/Emerald-Guide
rm -rf node_modules
npm install
```

Optional lockfile-exact install:

```bash
npm ci
```

---

### 5. Start the development server

```bash
npm run dev
```

Look for output like:

```text
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

**Leave this Terminal window open** while you use the guide.

1. Open Safari, Chrome, Firefox, or Edge  
2. Go to **http://localhost:5173/**  
3. You should see Emerald Guide (Walkthrough / Pokédex / Hoenn Map)  

If something else is already using port 5173:

```bash
npm run dev -- --port 5174
```

Then open `http://localhost:5174/`.

**Safari tip:** if the page looks blank after an update, do a hard refresh (**Cmd + Option + R**) or clear cached data for `localhost`.

---

### 6. Stop the app

Focus the Terminal running Vite and press:

```text
Ctrl+C
```

(Note: that’s **Control+C**, not Cmd+C — Cmd+C copies text on macOS.)

---

### 7. (Optional) Production build and local preview

```bash
npm run build
npm run preview
```

Open the URL printed by preview (often `http://localhost:4173/`).

For day-to-day local playthrough use, `npm run dev` is enough.

---

### 8. macOS extras that help

- **iTerm2** or **Warp** are nice alternatives to Terminal if you keep many tabs open  
- Keep the project under your home folder (`~/Projects/...`) — avoid iCloud Desktop/Documents sync folders if you see flaky `node_modules` file locks  
- Apple silicon users: install the **ARM64** Node build (official pkg, Homebrew under `/opt/homebrew`, or nvm’s arm64 binary). Avoid forcing x64 Node under Rosetta unless you know you need it  
- Firewall: for `localhost` you normally need no changes. System Settings → Network → Firewall only matters if you intentionally use the Network URL from another device  

---

## Daily use cheat sheet

| Goal | Command / action |
|---|---|
| Install dependencies (first time / after pulls) | `npm install` |
| Start local guide | `npm run dev` |
| Open in browser | http://localhost:5173/ |
| Stop server | `Ctrl+C` in the terminal |
| Production build | `npm run build` |
| Preview production build | `npm run preview` |
| Use hosted beta (no install) | https://nickelz34.github.io/Emerald-Guide/ |
| Update local clone | `git pull origin main` then `npm install` |

---

## Troubleshooting

Issues are split into **Linux**, **Windows**, and **macOS**. Read the section for your OS first; shared app-behavior issues are at the end.

---

### Linux troubleshooting

#### `git: command not found`

Git isn’t installed or isn’t on `PATH`.

```bash
# Debian/Ubuntu
sudo apt update && sudo apt install -y git
# Fedora
sudo dnf install -y git
# Arch
sudo pacman -S --needed git
```

Close and reopen the terminal, then `git --version`.

#### `node: command not found` or Node version below 18

Symptoms:

```text
node: command not found
# or
v12.x.x / v16.x.x
```

Fix with nvm (most reliable):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts
node --version
```

If nvm itself isn’t found in new terminals, add/load it from `~/.bashrc` or `~/.zshrc`, then `source` that file.

#### `npm install` fails with `EACCES` / permission denied

You used sudo with npm earlier, or global prefix points at a root-owned path.

```bash
sudo chown -R "$(whoami)" ~/.npm
mkdir -p ~/.npm-global
npm config set prefix "$HOME/.npm-global"
# ensure PATH includes ~/.npm-global/bin
cd ~/projects/Emerald-Guide
rm -rf node_modules
npm install
```

Never fix this with `sudo npm install` inside the project.

#### `npm install` fails with network / certificate / timeout errors

- Confirm general connectivity: `ping -c 2 registry.npmjs.org` or open https://registry.npmjs.org in a browser  
- Temporarily disable VPN and retry  
- Clear npm cache and retry:

```bash
npm cache clean --force
npm install
```

- Behind an HTTP proxy:

```bash
npm config set proxy http://PROXY_HOST:PORT
npm config set https-proxy http://PROXY_HOST:PORT
```

#### `npm ERR! engine` / Vite refuses to start because Node is too old

Upgrade to Node 18+ (nvm `nvm install --lts` is easiest). Confirm with `node --version` in the **same** terminal you use for `npm run dev`.

#### Port 5173 already in use (`EADDRINUSE`)

Find and stop the other process, or pick a new port:

```bash
# see what holds 5173 (extra packages may be needed on some distros)
ss -ltnp | grep 5173
# or
lsof -i :5173

npm run dev -- --port 5174
```

#### Blank white page at localhost

1. Confirm the terminal still shows Vite “ready”  
2. Confirm you ran commands from the **project root** (`package.json` present)  
3. Hard-refresh the browser (`Ctrl+Shift+R`)  
4. Open DevTools → Console (`F12`) and note any red errors  
5. Re-install cleanly:

```bash
cd ~/projects/Emerald-Guide
rm -rf node_modules
npm install
npm run dev
```

#### Maps / sprites missing

Make sure the full repo was cloned (not a partial copy). Required folders include `public/screenshots/`, `public/maps/` (or published map assets), and `public/sprites/`.

```bash
ls public
git status
```

If you deleted large assets, re-clone or restore from git.

#### `npm run build` fails on verify scripts

The production build runs integrity checks (`verify-local-assets`, map pins, encounter coverage, etc.). Read the first error line — it usually names a missing asset or mismatched pin. For personal local play, `npm run dev` is enough; fix/build failures matter if you’re deploying.

#### Flatpak / Snap browser can’t reach localhost

Rare sandbox issue: try a distro-native browser package, or open the Network URL Vite prints. Prefer `http://127.0.0.1:5173/` over a hostname misfire.

#### SELinux / corporate lockdown blocks `npm`

Run `npm install` from your home directory project path (as documented). If your environment blocks executing binaries under `node_modules`, ask your admin for a developer exception — the Vite binary must be executable.

---

### Windows troubleshooting

#### `node` / `npm` not recognized in PowerShell

Node didn’t land on PATH, or the terminal wasn’t restarted.

1. Close **all** PowerShell / Terminal windows  
2. Reopen PowerShell  
3. Run:

```powershell
node --version
npm --version
where.exe node
```

If still missing:

1. Re-run the Node.js LTS `.msi`  
2. Ensure **Add to PATH** is checked  
3. Reboot Windows  
4. Or install via `winget install OpenJS.NodeJS.LTS` and reopen PowerShell  

Manual PATH check: Settings → System → About → Advanced system settings → Environment Variables → Path should include something like `C:\Program Files\nodejs\`.

#### `git` not recognized

Install Git for Windows, reopen PowerShell, run `git --version`.  
If you use Git only inside “Git Bash,” either call Git Bash or ensure “Git from the command line…” was selected during install.

#### `npm install` fails with `EPERM` / file lock / antivirus

Windows antivirus sometimes locks files under `node_modules` mid-extract.

1. Close editors/IDEs that have the folder open  
2. Delete and retry:

```powershell
cd $HOME\Documents\Emerald-Guide
Remove-Item -Recurse -Force .\node_modules -ErrorAction SilentlyContinue
Remove-Item -Force .\package-lock.json -ErrorAction SilentlyContinue
# Prefer keeping package-lock.json — only delete it if it's corrupt; better:
git checkout -- package-lock.json
npm cache clean --force
npm install
```

3. Add an antivirus exclusion for the project folder if your security tools keep quarantining Vite/node binaries  
4. Avoid installing onto synced-only OneDrive placeholder folders if you see flaky locks — a local `Documents` or `C:\dev\` path is more reliable  

#### Execution policy blocks scripts

Error text mentions `Running scripts is disabled on this system`.

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Close and reopen PowerShell, then retry `npm run dev`.

#### `EBUSY` / watcher errors under `public\`

This repo already sets Vite `usePolling: true` and ignores `public/**` for watching because Windows locks PNGs. Pull the latest `main` if your clone is old. You should not need to disable antivirus solely for this if you’re on current source.

#### Port 5173 already in use

```powershell
netstat -ano | findstr :5173
npm run dev -- --port 5174
```

Optionally end the old PID via Task Manager → Details if you know it’s a leftover Node process.

#### Browser shows “Unable to connect”

- Confirm PowerShell still shows Vite ready  
- Try `http://127.0.0.1:5173/` instead of `localhost`  
- Disable VPN / reverse proxies temporarily  
- Check Windows Firewall prompts — allow Node.js on **private** networks if you clicked Block earlier  

#### `npm ERR! network` / `CERT_HAS_EXPIRED` / proxy errors

```powershell
npm config delete proxy
npm config delete https-proxy
npm cache clean --force
npm install
```

If you **must** use a corporate proxy:

```powershell
npm config set proxy http://PROXY_HOST:PORT
npm config set https-proxy http://PROXY_HOST:PORT
```

#### Spaces or weird characters in the project path

If the project lives in a deeply nested path with odd characters and tools misbehave, move/clone to something simple:

```powershell
mkdir C:\dev
cd C:\dev
git clone https://github.com/nickelz34/Emerald-Guide.git
cd Emerald-Guide
npm install
npm run dev
```

#### `npm run build` fails after a fresh clone

Read the first script error. Dev use only needs `npm run dev`. If verify scripts fail, ensure `git clone` finished completely and no `public` assets were excluded by a sparse checkout.

#### Long path issues (rare)

Enable Windows long paths, or keep the repo near `C:\dev\Emerald-Guide` so nested `node_modules` paths stay shorter.

---

### macOS troubleshooting

#### `xcode-select: note: No developer tools were found` / `git: command not found`

Install Apple’s Command Line Tools:

```bash
xcode-select --install
```

Complete the GUI installer, then open a **new** Terminal and run `git --version`.

If the install appears stuck, reboot and run `xcode-select --install` again, or install/update CLT from Apple’s developer downloads page while signed into your Apple ID.

#### `node: command not found` after installing the `.pkg`

Terminal was already open during install and never reloaded `PATH`.

1. Quit Terminal fully (**Cmd+Q**)  
2. Open a new Terminal  
3. Run:

```bash
node --version
npm --version
which node
```

If still missing, reinstall the **correct** Node LTS `.pkg` for your chip (ARM64 vs x64), or switch to **nvm** / **Homebrew** from the macOS install section.

#### Wrong CPU architecture (Apple silicon running x64 Node under Rosetta)

Symptoms can include odd install failures or surprisingly slow `npm install`.

```bash
uname -m
node -p "process.arch"
```

On Apple silicon you want `arm64` for both. If `node` prints `x64`, reinstall Node with the ARM64/official Apple silicon build, or with Homebrew/`nvm` natively on arm64 — don’t keep an Intel-only Node as your default.

#### Homebrew’s `brew` or `node` not found in new Terminal windows

On Apple silicon, Homebrew usually lives in `/opt/homebrew`. Add it to your login shell and reload:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
brew --version
node --version
```

Intel Homebrew is typically `/usr/local/bin` — follow whatever `brew doctor` prints if paths look wrong.

#### nvm works in one tab but not after restart

The nvm init lines never landed in your shell config (or you’re using a different shell than you think).

```bash
echo "$SHELL"
grep -n nvm ~/.zshrc ~/.bashrc ~/.zprofile 2>/dev/null || true
```

Re-run the nvm install script or manually append the `NVM_DIR` / `nvm.sh` lines to `~/.zshrc`, then:

```bash
source ~/.zshrc
nvm use --lts
```

#### `npm install` fails with `EACCES` / permission denied

Usually from an old `sudo npm` habit.

```bash
sudo chown -R "$(whoami)" ~/.npm
cd ~/Projects/Emerald-Guide
rm -rf node_modules
npm install
```

Never use `sudo npm install` or `sudo npm run dev` for this project.

#### `npm install` network / certificate errors (school/work network)

```bash
npm cache clean --force
npm install
```

If you’re behind a mandatory proxy, set it with `npm config set proxy` / `https-proxy` (same pattern as Linux/Windows). Corporate SSL inspection sometimes requires IT’s certificate setup for Node — if only Node fails while Safari works, ask IT for the Node/`NODE_EXTRA_CA_CERTS` guidance they recommend.

#### Port 5173 already in use

```bash
lsof -i :5173
npm run dev -- --port 5174
```

If `lsof` shows a leftover `node` process you started earlier, quit that Terminal or stop the process, then retry.

#### Blank page in Safari on `localhost`

1. Confirm Terminal still shows Vite “ready”  
2. Hard refresh: **Cmd + Option + R**  
3. Try `http://127.0.0.1:5173/`  
4. Try Chrome/Firefox to see if it’s Safari cache only  
5. Clean reinstall deps:

```bash
cd ~/Projects/Emerald-Guide
rm -rf node_modules
npm install
npm run dev
```

#### Project lives in iCloud Desktop/Documents and files “vanish” or lock

iCloud Drive sync can fight large `node_modules` trees. Move/clone the repo to a local non-synced folder:

```bash
mkdir -p ~/Projects
cd ~/Projects
git clone https://github.com/nickelz34/Emerald-Guide.git
cd Emerald-Guide
npm install
npm run dev
```

#### Full Disk Access / privacy prompts

Emerald Guide does not need Full Disk Access, Screen Recording, or special TCC permissions. If macOS prompts you, you can deny those — only Terminal needs normal file access to your project folder.

#### `npm run build` fails but `npm run dev` works

Same as other platforms: the production build runs verify scripts. For playing along with the guide locally, `npm run dev` is enough. Fix missing assets / pull latest `main` if you’re trying to deploy.

---

### App / guide behavior troubleshooting (all platforms)

#### Progress didn’t restore after refresh

Preferences live in **browser `localStorage`** for that origin (`localhost` vs the GitHub Pages URL are **different** stores). Clearing site data, using Private/Incognito, or switching browsers resets Guide settings, completed events, and save codes.

#### Save code says invalid / not found

- Codes are **4 letters A–Z**, generated on **that browser**  
- A code created on your PC will **not** work on your phone unless you somehow synced the same browser storage (normally you didn’t)  
- Re-create a save with **Save progress** on the device you’ll continue on  

#### Pokédex empty or sprites missing

Unlike older README versions, the Pokédex is bundled. If sprites fail, confirm `public/sprites/` exists in your clone and hard-refresh. Offline mode still works once assets are present.

#### Walkthrough missing optional chapters

You’re in **Main storyline** mode. Open **Guide settings** and switch to **Completionist** to show optional side content.

#### Started in Littleroot but wanted Evolution / Breeding prep

Open **Guide settings**, uncheck **Skip Battles, Catching, Evolution & Breeding prep**, start again (or navigate to the pregame chapters if they are visible for your settings).

#### Hosted beta looks old / cached (especially iOS Safari)

Hard-refresh or clear site data for `nickelz34.github.io`. The app sets cache-busting meta tags to help mobile Safari pick up new deploys; a stubborn cache still occasionally needs a manual clear.

#### “Is this cheating / illegal?”

This is an unofficial **fan guide** — text, maps, and reference data for people who already own the game. It does not distribute ROMs.

---

## License & disclaimer

**License:** MIT — see [LICENSE](LICENSE).

**Disclaimer:** Pokémon and Pokémon Emerald are © Nintendo / Game Freak / The Pokémon Company. Emerald Guide is an unofficial fan project and is not affiliated with or endorsed by them.
