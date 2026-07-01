# Emerald Guide

A local web app that helps you play through Pokémon Emerald. Open it in your browser while you play the game on a GBA, emulator, or cartridge — it tells you what to do next, shows you annotated maps of each area, and lets you look up any Pokémon's wild locations, stats, and evolutions.

This is a **guide only**. It does not run the game, does not need a ROM, and does not connect to your save file.

---

## What this app does

When you open Emerald Guide, you see a navigation bar across the top with six sections. Here is what each one is for and how you use it.

### Story Walkthrough

This is the main playthrough guide. It covers the full game from choosing your starter in Littleroot Town through beating the Elite Four.

The screen is split into two parts:

- **Left side** — a scrollable list of every guide step, grouped into chapters (for example "Early Game — Littleroot to Rustboro", "Dewford, Slateport & Mt. Chimney"). You can type in the search box to filter steps by title, location, or keyword.
- **Right side** — the currently selected step. Each step shows:
  - A **title** and **location** (for example "Stone Badge — Roxanne" at Rustboro City Gym)
  - A short **summary** of what happens at that point in the game
  - An **annotated map** of the area (when one exists for that step) — see below
  - A **What to do** checklist with the specific actions you should take
  - Optional **tips** (starter advice, item locations, battle strategy)
  - A **wild encounter table** listing Pokémon you can catch in that area, with level ranges, encounter method (grass, surf, fishing rod, etc.), and time of day

Use the **Previous** and **Next** buttons at the bottom to move between steps, or press the **left** and **right arrow keys** on your keyboard.

If a step is tied to a place on the world map, a **Show on Hoenn map** button appears so you can see where that step takes place in the region.

### Annotated maps

Many walkthrough steps include a screenshot of the in-game area with colored markers placed on it. Marker types include:

- **Trainer battles** — trainers you will fight on that map
- **Items** — visible and hidden items on the ground
- **Important NPCs** — story characters and key people
- **Buildings** — Pokémon Centers, Marts, gyms, houses
- **Points of interest** — exits to other routes, story events, signs
- **Wild Pokémon** — grass patches and surf spots

You can **click a map** to open it in a larger lightbox view. In the lightbox (and on full-size inline maps) you can:

- **Scroll** the mouse wheel to zoom in and out
- **Click and drag** to pan around the map
- Use the **reset button** in the bottom-right corner to return to the default view

Marker positions are calibrated against the [pokeemerald](https://github.com/pret/pokeemerald) decompilation data so they line up with the actual game maps.

### Pokédex

The Pokédex section lets you look up any of the **387 Pokémon** in Emerald.

At the top you choose a scope:

- **Hoenn** — the 202 Pokémon in the regional dex
- **National** — the 185 additional species unlocked after beating the game
- **All** — every species in one list

You can search by name. Each Pokémon appears as a card showing its dex number, which encounter methods apply (grass, surf, rods, etc.), level range, and how many locations it appears in.

Click a card to open the full detail view:

- Sprite, types, and type-colored chips
- Base stats with visual stat bars and BST total
- Abilities (including hidden ability when applicable)
- Evolution chain
- Flavor text
- **Every wild location** in Emerald where that Pokémon can be caught, with encounter method, level, rate, and an annotated map preview for that area

Pokémon that cannot be caught in the wild (starters, gift Pokémon, trade evolutions) are still listed but marked as "Not in the wild."

**Note:** The first time you open the Pokédex, the app downloads wild encounter data from the pokeemerald GitHub repository and species details from [PokéAPI](https://pokeapi.co/). You need an internet connection for this. After loading, data is cached in your browser for the rest of the session.

### Secrets & Hidden Items

A separate guide section for things that are easy to miss: hidden items behind trees, optional areas, Secret Base tips, and rewards you might skip on a first playthrough. It uses the same step-by-step layout as the main walkthrough.

### Legendaries

Step-by-step instructions for catching every legendary Pokémon available on a normal Emerald cartridge — Groudon, Kyogre, Rayquaza, the Regis, Latios/Latias, and the rest. Each entry covers unlock requirements, location, and what to bring to the fight.

### Tips & Team Building

General strategy reference: type matchups, recommended HM slaves, when to evolve Pokémon, economy tips, and team-building advice for different stages of the game.

### Hoenn Map

A clickable overworld map of the entire Hoenn region. Each town, route, and dungeon has a pin. Click a pin to jump directly to the relevant walkthrough step for that area. You can also open this map from individual walkthrough steps via **Show on Hoenn map**.

---

## What you need to install

Emerald Guide is a web app built with React and Vite. To run it on your own computer you need three things installed first. None of them are part of the game — they are standard developer tools used to download and serve the app.

### 1. Node.js (version 18 or newer)

**What it is:** A JavaScript runtime. The app is written in TypeScript/React and needs Node.js to install its dependencies and start a local web server.

**Where to get it:** https://nodejs.org — download the **LTS** (Long Term Support) version.

**How to check if you already have it:** Open a terminal and run:

```
node --version
```

You should see `v18.x.x` or higher (for example `v20.11.0`). If the command is not found or the version is below 18, install Node.js from the link above.

Node.js includes **npm** (Node Package Manager), which you also need. Check it with:

```
npm --version
```

### 2. Git

**What it is:** A version control tool. You use it once to download (clone) the project files from GitHub.

**Where to get it:** https://git-scm.com/downloads

**How to check if you already have it:**

```
git --version
```

You should see `git version 2.x.x`. If not, install Git from the link above.

### 3. A web browser

Any modern browser works: Chrome, Firefox, Edge, or Safari. You will open the app at `http://localhost:5173` in your browser after starting it.

### Also required

- **Internet connection** — needed the first time you use the Pokédex (to download encounter and species data). The walkthrough, maps, secrets, legendaries, and tips work offline once the app is running.
- **About 500 MB of free disk space** — for Node.js, the project files, and installed dependencies.

### You do NOT need

- Python, Java, Docker, or any database
- A Pokémon ROM or emulator (the guide runs separately from the game)
- Administrator/root access (except when installing Node.js and Git themselves)

---

## How to install — Windows

These steps use **PowerShell**, which is built into Windows 10 and 11. Press the Windows key, type `PowerShell`, and open it.

### Step 1: Install Node.js

1. Go to https://nodejs.org in your web browser.
2. Click the big green button for the **LTS** version (for example "20.x.x LTS").
3. Run the downloaded `.msi` installer.
4. Click **Next** through the wizard. Keep all default options checked, especially **"Add to PATH"**.
5. Click **Install**, then **Finish**.
6. **Close PowerShell completely** and open a new PowerShell window. This is required so Windows picks up the new PATH.

Verify Node.js is installed:

```powershell
node --version
```

Expected output: something like `v20.11.0`.

```powershell
npm --version
```

Expected output: something like `10.2.4`.

If either command says "not recognized", Node.js did not install correctly. Re-run the installer or restart your computer and try again.

### Step 2: Install Git

1. Go to https://git-scm.com/download/win
2. The download should start automatically. Run the installer.
3. Click **Next** through every screen — the defaults are fine for this project.
4. Click **Install**, then **Finish**.
5. Close and reopen PowerShell if it was already open.

Verify Git is installed:

```powershell
git --version
```

Expected output: something like `git version 2.43.0.windows.1`.

### Step 3: Download the project

In PowerShell, navigate to where you want the project folder. For example, your Documents folder:

```powershell
cd $HOME\Documents
```

Download the project from GitHub:

```powershell
git clone https://github.com/nickelz34/Emerald-Guide.git
```

This creates a folder called `Emerald-Guide` containing all the project files. It should take a few seconds.

Go into that folder:

```powershell
cd Emerald-Guide
```

### Step 4: Install the app's dependencies

The project depends on libraries like React and Vite. Install them with:

```powershell
npm install
```

This reads `package.json` and downloads everything into a `node_modules` folder. The first run takes one to three minutes depending on your internet speed.

You will see a lot of text scroll by. When it finishes, you should be back at the command prompt with no error messages. If you see `npm ERR!` lines, read the error — usually it is a network problem. Check your internet connection and run `npm install` again.

### Step 5: Start the app

```powershell
npm run dev
```

After a few seconds you will see output like:

```
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

**This is the app running.** Do not close this PowerShell window while you use the app.

1. Open your web browser (Chrome, Edge, Firefox).
2. Go to **http://localhost:5173**
3. You should see the Emerald Guide home page with the navigation bar at the top (Story Walkthrough, Pokédex, Secrets, Legendaries, Tips, Hoenn Map).

If the page does not load, make sure the PowerShell window is still open and shows the Vite "ready" message. If port 5173 is already in use by another program, stop the other program or run:

```powershell
npm run dev -- --port 5174
```

Then open `http://localhost:5174` instead.

### Step 6: Stop the app

When you are done, click on the PowerShell window and press **Ctrl+C**. The server stops and the page will no longer load.

### Step 7 (optional): Build a standalone copy

If you want a production build (for example to host on a website):

```powershell
npm run build
```

This creates a `dist` folder with static HTML/JS/CSS files. To preview it locally:

```powershell
npm run preview
```

Open the URL shown (usually `http://localhost:4173`).

---

## How to install — Linux

These steps use a terminal (`bash` or `zsh`). Open your system's terminal application.

### Step 1: Install Node.js (version 18+)

The install command depends on your Linux distribution.

**Debian / Ubuntu / Linux Mint:**

```bash
sudo apt update
sudo apt install -y nodejs npm
```

**Fedora:**

```bash
sudo dnf install -y nodejs npm
```

**Arch Linux / Manjaro:**

```bash
sudo pacman -S nodejs npm
```

After installing, check the version:

```bash
node --version
```

If the version is **below 18** (some older distro packages ship Node 12 or 16), install a newer version using **nvm** (Node Version Manager):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Close the terminal, open a new one, then:

```bash
nvm install --lts
nvm use --lts
node --version
```

You should now see `v18.x.x` or higher.

Also verify npm:

```bash
npm --version
```

### Step 2: Install Git

**Debian / Ubuntu / Linux Mint:**

```bash
sudo apt install -y git
```

**Fedora:**

```bash
sudo dnf install -y git
```

**Arch Linux / Manjaro:**

```bash
sudo pacman -S git
```

Verify:

```bash
git --version
```

Expected output: `git version 2.x.x`.

### Step 3: Download the project

Choose a directory for the project. For example:

```bash
mkdir -p ~/projects
cd ~/projects
```

Clone the repository:

```bash
git clone https://github.com/nickelz34/Emerald-Guide.git
```

Go into the project folder:

```bash
cd Emerald-Guide
```

### Step 4: Install the app's dependencies

```bash
npm install
```

Wait for it to finish. You should return to the prompt with no `npm ERR!` messages. Packages are installed into `node_modules/`.

If you get permission errors, do **not** use `sudo npm install`. Instead, fix npm's global directory permissions:

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
```

Add `export PATH=~/.npm-global/bin:$PATH` to your `~/.bashrc` or `~/.zshrc`, reopen the terminal, and run `npm install` again.

### Step 5: Start the app

```bash
npm run dev
```

Look for:

```
  ➜  Local:   http://localhost:5173/
```

**Leave this terminal open** while using the app.

1. Open your browser.
2. Navigate to **http://localhost:5173**
3. The Emerald Guide interface should appear.

The dev server listens on `localhost` only, so no firewall changes are needed for local use.

If port 5173 is busy:

```bash
npm run dev -- --port 5174
```

Then open `http://localhost:5174`.

### Step 6: Stop the app

Press **Ctrl+C** in the terminal where the dev server is running.

### Step 7 (optional): Build a standalone copy

```bash
npm run build
npm run preview
```

Open the URL printed by `npm run preview` (usually `http://localhost:4173`).

---

## Quick reference

| What you want to do | Command |
|---|---|
| Install dependencies (first time only) | `npm install` |
| Start the app for daily use | `npm run dev` |
| Open the app in your browser | Go to `http://localhost:5173` |
| Stop the app | Press `Ctrl+C` in the terminal |
| Build for production | `npm run build` |
| Preview the production build | `npm run preview` |

---

## Troubleshooting

**`node` or `git` command not found**
The tool is not installed or not on your PATH. Install it using the steps above, then close and reopen your terminal. On Windows, you may need to restart the computer after installing Node.js.

**`npm install` fails with network or timeout errors**
Check your internet connection. If you are behind a corporate proxy, you may need to configure npm: `npm config set proxy http://your-proxy:port`.

**Blank white page in the browser**
Make sure you ran both `npm install` and `npm run dev` from inside the `Emerald-Guide` folder. Open the browser developer tools (press F12), check the Console tab for error messages.

**Pokédex stays on "Loading…" forever**
The Pokédex needs internet access to fetch data from pokeemerald and PokéAPI. Check your connection and refresh the page. The rest of the app (walkthrough, maps, secrets) does not need internet.

**Port 5173 already in use**
Another application is using that port. Either close the other application, or start on a different port: `npm run dev -- --port 5174`.

**Maps or screenshots do not appear**
Make sure you cloned the full repository (not just downloaded a zip of `src/`). The `public/screenshots/` and `public/maps/` folders must exist and contain PNG files.

---

## License

MIT — see [LICENSE](LICENSE).

## Disclaimer

Pokémon and Pokémon Emerald are © Nintendo / Game Freak / The Pokémon Company. This is an unofficial fan project and is not affiliated with or endorsed by them.
