import { growGenome, genomeSummary } from "./genetics.js";
import { renderCreature } from "./creature.js";
import { composeGiggle, playGiggle } from "./giggle.js";

const params = new URLSearchParams(window.location.search);
const seedParam = params.get("seed");
const showGenome = params.has("genome");

const seed =
  seedParam !== null && seedParam !== ""
    ? Number.parseInt(seedParam, 10) >>> 0
    : (Math.random() * 0xffffffff) >>> 0;

const genome = growGenome(Number.isFinite(seed) ? seed : (Math.random() * 0xffffffff) >>> 0);

const svg = document.getElementById("creature-svg");
const btn = document.getElementById("creature-btn");
const cloud = document.getElementById("giggle-cloud");
const nameEl = document.getElementById("creature-name");
const genomePanel = document.getElementById("genome-panel");
const genomeList = document.getElementById("genome-list");

nameEl.textContent = genome.name;
svg.setAttribute("aria-label", `${genome.name}, a generated creature. Click to poke.`);
btn.setAttribute("aria-label", `Poke ${genome.name}`);
svg.innerHTML = renderCreature(genome);

document.documentElement.style.setProperty("--creature-bounce", String(genome.bounce));
svg.style.animationDuration = `${3.6 / genome.bounce}s`;

if (showGenome) {
  genomePanel.hidden = false;
  for (const [key, value] of genomeSummary(genome)) {
    const dt = document.createElement("dt");
    dt.textContent = key;
    const dd = document.createElement("dd");
    dd.textContent = value;
    genomeList.append(dt, dd);
  }
}

let pokeCount = 0;
let pokeLock = false;

async function poke() {
  if (pokeLock) return;
  pokeLock = true;
  pokeCount += 1;

  btn.classList.remove("is-poked");
  // Force reflow so the squash animation can replay.
  void btn.offsetWidth;
  btn.classList.add("is-poked");

  const text = composeGiggle(genome, pokeCount);
  cloud.textContent = text;
  cloud.classList.remove("is-visible");
  void cloud.offsetWidth;
  cloud.classList.add("is-visible");

  try {
    await playGiggle(genome);
  } catch {
    // Audio may be blocked; visual giggle still works.
  }

  window.setTimeout(() => {
    btn.classList.remove("is-poked");
    pokeLock = false;
  }, 560);
}

btn.addEventListener("click", () => {
  poke();
});

btn.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    poke();
  }
});
