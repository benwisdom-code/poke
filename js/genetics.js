/** Mulberry32 PRNG — deterministic from a seed. */
export function createRng(seed) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rng, list) {
  return list[Math.floor(rng() * list.length)];
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function hsl(h, s, l) {
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`;
}

const NAME_A = ["bo", "zi", "lu", "pe", "mi", "ta", "nu", "ki", "fo", "ra", "we", "jo"];
const NAME_B = ["bble", "p", "nk", "ff", "xo", "mi", "do", "chi", "lo", "ssa", "vee", "bun"];
const NAME_C = ["", "", "i", "o", "a", "u", "ee", "y"];

const BODY_SHAPES = ["round", "oval", "blob", "squat", "tall"];
const EYE_STYLES = ["dot", "oval", "sleepy", "spark"];
const MOUTH_STYLES = ["smile", "grin", "o", "wavy", "cat"];
const EAR_TYPES = ["none", "round", "pointy", "flop", "nub"];
const HORN_TYPES = ["none", "none", "none", "uni", "nubs", "antenna"];
const PATTERNS = ["none", "dots", "freckles", "stripes", "cheeks"];
const TAIL_TYPES = ["none", "stub", "curl", "fluff"];
const GIGGLE_STYLES = ["hee", "teehee", "snort", "wheeze", "squeak", "chortle"];

/**
 * Grow a full genome from a seed. Refresh = new seed = new creature.
 */
export function growGenome(seed = (Math.random() * 0xffffffff) >>> 0) {
  const rng = createRng(seed);

  const bodyHue = rng() * 360;
  const accentHue = (bodyHue + lerp(24, 80, rng())) % 360;
  const bodySat = lerp(42, 72, rng());
  const bodyLight = lerp(52, 72, rng());
  const bellyLight = Math.min(92, bodyLight + lerp(12, 24, rng()));

  const syllableCount = 2 + Math.floor(rng() * 2);
  let name = pick(rng, NAME_A) + pick(rng, NAME_B);
  if (syllableCount > 2) name += pick(rng, NAME_C);
  name = name.charAt(0).toUpperCase() + name.slice(1);

  return {
    seed,
    name,
    bodyShape: pick(rng, BODY_SHAPES),
    bodyColor: hsl(bodyHue, bodySat, bodyLight),
    bellyColor: hsl(bodyHue, bodySat * 0.55, bellyLight),
    accentColor: hsl(accentHue, lerp(50, 75, rng()), lerp(48, 68, rng())),
    outline: hsl(bodyHue, bodySat * 0.4, lerp(18, 28, rng())),
    size: lerp(0.86, 1.12, rng()),
    eyeStyle: pick(rng, EYE_STYLES),
    eyeSize: lerp(10, 22, rng()),
    eyeSpacing: lerp(28, 52, rng()),
    eyeY: lerp(-8, 18, rng()),
    blush: rng() > 0.35,
    mouthStyle: pick(rng, MOUTH_STYLES),
    earType: pick(rng, EAR_TYPES),
    hornType: pick(rng, HORN_TYPES),
    pattern: pick(rng, PATTERNS),
    limbCount: pick(rng, [2, 2, 4, 4, 6]),
    tailType: pick(rng, TAIL_TYPES),
    fluff: rng() > 0.55,
    bounce: lerp(0.85, 1.25, rng()),
    giggle: {
      style: pick(rng, GIGGLE_STYLES),
      pitch: lerp(220, 720, rng()),
      tempo: lerp(0.7, 1.45, rng()),
      bursts: 2 + Math.floor(rng() * 4),
      wobble: lerp(0.05, 0.28, rng()),
      softness: rng(),
    },
  };
}

export function genomeSummary(genome) {
  return [
    ["name", genome.name],
    ["seed", String(genome.seed)],
    ["body", genome.bodyShape],
    ["eyes", genome.eyeStyle],
    ["mouth", genome.mouthStyle],
    ["ears", genome.earType],
    ["horns", genome.hornType],
    ["pattern", genome.pattern],
    ["limbs", String(genome.limbCount)],
    ["tail", genome.tailType],
    ["giggle", genome.giggle.style],
  ];
}
