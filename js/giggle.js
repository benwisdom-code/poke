import { createRng } from "./genetics.js";

const SYLLABLES = {
  hee: ["hee", "heehee", "hee-hee", "hehe"],
  teehee: ["teehee", "tehee", "tii", "tee-hee"],
  snort: ["pff", "hnk", "pfft", "hrnf"],
  wheeze: ["wheeze", "hwoo", "ffff", "haa"],
  squeak: ["eep", "pip", "squee", "ik"],
  chortle: ["ho", "har", "hoo", "hmhm"],
};

/**
 * Build a written giggle from the creature's giggle genes.
 */
export function composeGiggle(genome, pokeIndex = 0) {
  const { style, bursts, wobble } = genome.giggle;
  const rng = createRng((genome.seed ^ (pokeIndex * 2654435761)) >>> 0);
  const pool = SYLLABLES[style] || SYLLABLES.hee;
  const parts = [];
  const count = Math.max(2, Math.min(6, Math.round(bursts + (rng() - 0.5) * 2)));

  for (let i = 0; i < count; i += 1) {
    let bit = pool[Math.floor(rng() * pool.length)];
    if (rng() < wobble) {
      bit = bit.toUpperCase();
    } else if (rng() < 0.35) {
      bit = bit + "!";
    }
    parts.push(bit);
  }

  if (rng() > 0.55) {
    parts.push(rng() > 0.5 ? "!" : "~");
  }

  return parts.join(rng() > 0.4 ? " " : "");
}

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Play a short synthesized giggle shaped by pitch, tempo, and softness genes.
 */
export async function playGiggle(genome) {
  const ctx = getCtx();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  const { pitch, tempo, bursts, wobble, softness, style } = genome.giggle;
  const now = ctx.currentTime;
  const notes = Math.max(2, Math.min(6, bursts));
  const step = 0.09 / tempo;

  for (let i = 0; i < notes; i += 1) {
    const t = now + i * step;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    const styleSkew =
      style === "snort" || style === "wheeze"
        ? 0.55
        : style === "squeak"
          ? 1.35
          : 1;

    osc.type = softness > 0.55 ? "sine" : softness > 0.3 ? "triangle" : "square";
    const freq =
      pitch *
      styleSkew *
      (1 + Math.sin(i * 1.7) * wobble) *
      (1 + (i % 2 === 0 ? 0.08 : -0.05));
    osc.frequency.setValueAtTime(freq, t);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(900 + softness * 1400, t);

    const peak = 0.09 + (1 - softness) * 0.05;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + step * 0.85);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + step);
  }
}
