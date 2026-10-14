function bodyPath(shape) {
  switch (shape) {
    case "oval":
      return "M160 54 C222 54 262 104 262 168 C262 236 214 274 160 274 C106 274 58 236 58 168 C58 104 98 54 160 54 Z";
    case "blob":
      return "M160 50 C210 48 250 90 258 140 C268 198 230 250 178 268 C130 284 78 250 64 196 C50 142 72 78 118 58 C132 52 146 50 160 50 Z";
    case "squat":
      return "M160 78 C230 78 270 128 270 180 C270 240 220 270 160 270 C100 270 50 240 50 180 C50 128 90 78 160 78 Z";
    case "tall":
      return "M160 42 C210 42 246 90 246 150 C246 220 210 278 160 278 C110 278 74 220 74 150 C74 90 110 42 160 42 Z";
    default:
      return "M160 58 C224 58 268 108 268 168 C268 232 220 270 160 270 C100 270 52 232 52 168 C52 108 96 58 160 58 Z";
  }
}

function earPaths(type, outline, fill) {
  if (type === "none") return "";
  if (type === "round") {
    return `
      <ellipse cx="92" cy="96" rx="22" ry="26" fill="${fill}" stroke="${outline}" stroke-width="4"/>
      <ellipse cx="228" cy="96" rx="22" ry="26" fill="${fill}" stroke="${outline}" stroke-width="4"/>
    `;
  }
  if (type === "pointy") {
    return `
      <path d="M98 118 L78 52 L128 96 Z" fill="${fill}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M222 118 L242 52 L192 96 Z" fill="${fill}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    `;
  }
  if (type === "flop") {
    return `
      <path d="M104 110 C70 96 58 128 78 148 C96 166 118 140 104 110 Z" fill="${fill}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M216 110 C250 96 262 128 242 148 C224 166 202 140 216 110 Z" fill="${fill}" stroke="${outline}" stroke-width="4" stroke-linejoin="round"/>
    `;
  }
  return `
    <ellipse cx="100" cy="108" rx="14" ry="16" fill="${fill}" stroke="${outline}" stroke-width="4"/>
    <ellipse cx="220" cy="108" rx="14" ry="16" fill="${fill}" stroke="${outline}" stroke-width="4"/>
  `;
}

function hornPaths(type, accent, outline) {
  if (type === "none") return "";
  if (type === "uni") {
    return `<path d="M160 78 L150 28 L170 28 Z" fill="${accent}" stroke="${outline}" stroke-width="3" stroke-linejoin="round"/>`;
  }
  if (type === "nubs") {
    return `
      <circle cx="132" cy="72" r="10" fill="${accent}" stroke="${outline}" stroke-width="3"/>
      <circle cx="188" cy="72" r="10" fill="${accent}" stroke="${outline}" stroke-width="3"/>
    `;
  }
  return `
    <path d="M128 86 C118 50 108 40 118 28" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="118" cy="26" r="6" fill="${accent}"/>
    <path d="M192 86 C202 50 212 40 202 28" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="202" cy="26" r="6" fill="${accent}"/>
  `;
}

function eyes(genome) {
  const { eyeStyle, eyeSize, eyeSpacing, eyeY, outline } = genome;
  const cy = 148 + eyeY;
  const left = 160 - eyeSpacing / 2;
  const right = 160 + eyeSpacing / 2;
  const r = eyeSize / 2;

  if (eyeStyle === "sleepy") {
    return `
      <path d="M${left - r} ${cy} Q${left} ${cy - r * 0.6} ${left + r} ${cy}" fill="none" stroke="${outline}" stroke-width="5" stroke-linecap="round"/>
      <path d="M${right - r} ${cy} Q${right} ${cy - r * 0.6} ${right + r} ${cy}" fill="none" stroke="${outline}" stroke-width="5" stroke-linecap="round"/>
    `;
  }

  if (eyeStyle === "oval") {
    return `
      <ellipse cx="${left}" cy="${cy}" rx="${r * 0.75}" ry="${r * 1.15}" fill="${outline}"/>
      <ellipse cx="${right}" cy="${cy}" rx="${r * 0.75}" ry="${r * 1.15}" fill="${outline}"/>
      <circle cx="${left + 2}" cy="${cy - 3}" r="${r * 0.28}" fill="#fff"/>
      <circle cx="${right + 2}" cy="${cy - 3}" r="${r * 0.28}" fill="#fff"/>
    `;
  }

  if (eyeStyle === "spark") {
    return `
      <circle cx="${left}" cy="${cy}" r="${r}" fill="${outline}"/>
      <circle cx="${right}" cy="${cy}" r="${r}" fill="${outline}"/>
      <circle cx="${left + 3}" cy="${cy - 3}" r="${r * 0.35}" fill="#fff"/>
      <circle cx="${right + 3}" cy="${cy - 3}" r="${r * 0.35}" fill="#fff"/>
      <circle cx="${left - 3}" cy="${cy + 2}" r="${r * 0.15}" fill="#fff"/>
      <circle cx="${right - 3}" cy="${cy + 2}" r="${r * 0.15}" fill="#fff"/>
    `;
  }

  return `
    <circle cx="${left}" cy="${cy}" r="${r}" fill="${outline}"/>
    <circle cx="${right}" cy="${cy}" r="${r}" fill="${outline}"/>
    <circle cx="${left + 2}" cy="${cy - 2}" r="${Math.max(2, r * 0.28)}" fill="#fff"/>
    <circle cx="${right + 2}" cy="${cy - 2}" r="${Math.max(2, r * 0.28)}" fill="#fff"/>
  `;
}

function mouth(genome) {
  const { mouthStyle, outline } = genome;
  const y = 188 + genome.eyeY * 0.25;
  if (mouthStyle === "grin") {
    return `<path d="M128 ${y} Q160 ${y + 28} 192 ${y}" fill="none" stroke="${outline}" stroke-width="5" stroke-linecap="round"/>`;
  }
  if (mouthStyle === "o") {
    return `<ellipse cx="160" cy="${y + 6}" rx="10" ry="12" fill="none" stroke="${outline}" stroke-width="4"/>`;
  }
  if (mouthStyle === "wavy") {
    return `<path d="M130 ${y} Q145 ${y - 8} 160 ${y} Q175 ${y + 8} 190 ${y}" fill="none" stroke="${outline}" stroke-width="4" stroke-linecap="round"/>`;
  }
  if (mouthStyle === "cat") {
    return `<path d="M145 ${y} Q160 ${y + 10} 175 ${y}" fill="none" stroke="${outline}" stroke-width="4" stroke-linecap="round"/>`;
  }
  return `<path d="M134 ${y} Q160 ${y + 18} 186 ${y}" fill="none" stroke="${outline}" stroke-width="4.5" stroke-linecap="round"/>`;
}

function patternMarks(genome) {
  const { pattern, accentColor, outline } = genome;
  if (pattern === "none") return "";
  if (pattern === "dots") {
    return `
      <circle cx="118" cy="168" r="7" fill="${accentColor}" opacity="0.85"/>
      <circle cx="198" cy="158" r="9" fill="${accentColor}" opacity="0.85"/>
      <circle cx="176" cy="198" r="6" fill="${accentColor}" opacity="0.75"/>
    `;
  }
  if (pattern === "freckles") {
    return `
      <circle cx="126" cy="172" r="3" fill="${outline}" opacity="0.35"/>
      <circle cx="138" cy="180" r="2.5" fill="${outline}" opacity="0.3"/>
      <circle cx="184" cy="172" r="3" fill="${outline}" opacity="0.35"/>
      <circle cx="196" cy="180" r="2.5" fill="${outline}" opacity="0.3"/>
    `;
  }
  if (pattern === "stripes") {
    return `
      <path d="M110 150 Q160 138 210 150" fill="none" stroke="${accentColor}" stroke-width="6" opacity="0.55" stroke-linecap="round"/>
      <path d="M108 172 Q160 160 212 172" fill="none" stroke="${accentColor}" stroke-width="6" opacity="0.45" stroke-linecap="round"/>
    `;
  }
  return `
    <ellipse cx="122" cy="168" rx="14" ry="9" fill="${accentColor}" opacity="0.45"/>
    <ellipse cx="198" cy="168" rx="14" ry="9" fill="${accentColor}" opacity="0.45"/>
  `;
}

function limbs(genome) {
  const { limbCount, bodyColor, outline } = genome;
  const footY = 268;
  if (limbCount === 2) {
    return `
      <ellipse cx="132" cy="${footY}" rx="20" ry="12" fill="${bodyColor}" stroke="${outline}" stroke-width="4"/>
      <ellipse cx="188" cy="${footY}" rx="20" ry="12" fill="${bodyColor}" stroke="${outline}" stroke-width="4"/>
    `;
  }
  if (limbCount === 6) {
    return `
      <ellipse cx="108" cy="${footY}" rx="14" ry="10" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5"/>
      <ellipse cx="144" cy="${footY + 2}" rx="14" ry="10" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5"/>
      <ellipse cx="176" cy="${footY + 2}" rx="14" ry="10" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5"/>
      <ellipse cx="212" cy="${footY}" rx="14" ry="10" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5"/>
      <ellipse cx="86" cy="210" rx="12" ry="9" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5"/>
      <ellipse cx="234" cy="210" rx="12" ry="9" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5"/>
    `;
  }
  return `
    <ellipse cx="118" cy="${footY}" rx="16" ry="11" fill="${bodyColor}" stroke="${outline}" stroke-width="4"/>
    <ellipse cx="202" cy="${footY}" rx="16" ry="11" fill="${bodyColor}" stroke="${outline}" stroke-width="4"/>
    <ellipse cx="78" cy="200" rx="13" ry="10" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5"/>
    <ellipse cx="242" cy="200" rx="13" ry="10" fill="${bodyColor}" stroke="${outline}" stroke-width="3.5"/>
  `;
}

function tail(genome) {
  const { tailType, accentColor, outline, bodyColor } = genome;
  if (tailType === "none") return "";
  if (tailType === "stub") {
    return `<ellipse cx="248" cy="210" rx="16" ry="12" fill="${bodyColor}" stroke="${outline}" stroke-width="4"/>`;
  }
  if (tailType === "curl") {
    return `<path d="M240 200 C270 190 278 220 250 230 C230 238 236 210 250 208" fill="none" stroke="${accentColor}" stroke-width="8" stroke-linecap="round"/>`;
  }
  return `
    <path d="M236 206 C262 188 276 210 258 228 C248 238 236 224 236 206 Z" fill="${accentColor}" stroke="${outline}" stroke-width="3" stroke-linejoin="round"/>
  `;
}

function fluff(genome) {
  if (!genome.fluff) return "";
  const c = genome.bellyColor;
  return `
    <circle cx="120" cy="120" r="8" fill="${c}" opacity="0.9"/>
    <circle cx="140" cy="108" r="10" fill="${c}" opacity="0.9"/>
    <circle cx="164" cy="104" r="9" fill="${c}" opacity="0.9"/>
    <circle cx="186" cy="110" r="10" fill="${c}" opacity="0.9"/>
    <circle cx="204" cy="122" r="8" fill="${c}" opacity="0.9"/>
  `;
}

/**
 * Render the creature SVG markup from its genome.
 */
export function renderCreature(genome) {
  const scale = genome.size;
  const blush = genome.blush
    ? `
      <ellipse cx="${160 - genome.eyeSpacing / 2 - 8}" cy="${160 + genome.eyeY}" rx="10" ry="6" fill="${genome.accentColor}" opacity="0.35"/>
      <ellipse cx="${160 + genome.eyeSpacing / 2 + 8}" cy="${160 + genome.eyeY}" rx="10" ry="6" fill="${genome.accentColor}" opacity="0.35"/>
    `
    : "";

  return `
    <g transform="translate(160 170) scale(${scale}) translate(-160 -170)">
      ${tail(genome)}
      ${earPaths(genome.earType, genome.outline, genome.bodyColor)}
      ${hornPaths(genome.hornType, genome.accentColor, genome.outline)}
      ${limbs(genome)}
      <path d="${bodyPath(genome.bodyShape)}" fill="${genome.bodyColor}" stroke="${genome.outline}" stroke-width="5" stroke-linejoin="round"/>
      <ellipse cx="160" cy="198" rx="48" ry="36" fill="${genome.bellyColor}" opacity="0.9"/>
      ${fluff(genome)}
      ${patternMarks(genome)}
      ${blush}
      ${eyes(genome)}
      ${mouth(genome)}
    </g>
  `;
}
