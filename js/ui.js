// Habillage de Cervonaute : décors d'arène, effets, sons, portraits de boss.
(function () {
  // ---------- Décors SVG des 8 arènes (paysage en bas de bannière)
  const SCENES = [
    // 0 Plaine : collines, herbe, arbre, clôture, soleil
    (c) => `<circle cx="345" cy="38" r="18" fill="#ffe27a" opacity=".9"/><path d="M0 150 Q80 90 170 140 T400 120 L400 200 L0 200 Z" fill="#2f6a2a"/><path d="M0 160 Q120 120 240 155 T400 150 L400 200 L0 200 Z" fill="#3f8a36"/>
      <rect x="250" y="80" width="10" height="60" fill="#6a4420"/><circle cx="255" cy="72" r="28" fill="#2e7a2a"/><circle cx="238" cy="82" r="18" fill="#3a9a34"/><circle cx="272" cy="84" r="16" fill="#3a9a34"/>
      <g stroke="#a07a4a" stroke-width="4">${[20,50,80,110,140].map((x)=>`<line x1="${x}" y1="128" x2="${x}" y2="158"/>`).join('')}<line x1="20" y1="136" x2="140" y2="136"/><line x1="20" y1="148" x2="140" y2="148"/></g>
      ${[[40,175,'#ff8ab0'],[110,182,'#fff6c0'],[190,176,'#ff8ab0'],[320,180,'#a9c4ff']].map(([x,y,f])=>`<circle cx="${x}" cy="${y}" r="4" fill="${f}"/>`).join('')}`,
    // 1 Quai de chargement : quai, caisses, camion
    (c) => `<rect x="0" y="150" width="400" height="50" fill="#1b1e25"/><rect x="0" y="140" width="400" height="12" fill="#2b2f38"/>
      <g fill="#8a5a2b" stroke="#5a3a1a" stroke-width="2"><rect x="40" y="100" width="40" height="40"/><rect x="82" y="110" width="30" height="30"/><rect x="58" y="70" width="30" height="30"/></g>
      <rect x="230" y="78" width="120" height="62" rx="4" fill="#3a4250"/><rect x="350" y="98" width="38" height="42" rx="4" fill="#4a5260"/><circle cx="260" cy="146" r="11" fill="#111"/><circle cx="360" cy="146" r="11" fill="#111"/>
      <g stroke="${c}" stroke-width="3" opacity=".7"><line x1="150" y1="60" x2="150" y2="140"/><line x1="140" y1="60" x2="200" y2="60"/><line x1="195" y1="60" x2="195" y2="90"/></g>`,
    // 2 Entrepôt : rayonnages
    (c) => `<rect x="0" y="150" width="400" height="50" fill="#1a120b"/>${[20, 140, 260].map((x) => `<g><rect x="${x}" y="50" width="110" height="100" fill="none" stroke="#6b4a2a" stroke-width="4"/>${[75, 100, 125].map((y) => `<line x1="${x}" y1="${y}" x2="${x + 110}" y2="${y}" stroke="#6b4a2a" stroke-width="3"/>`).join('')}<rect x="${x + 10}" y="55" width="26" height="18" fill="#a0703a"/><rect x="${x + 60}" y="80" width="34" height="18" fill="#c0884a"/><rect x="${x + 20}" y="105" width="30" height="18" fill="#a0703a"/></g>`).join('')}
      <circle cx="350" cy="30" r="10" fill="${c}" opacity=".8"/>`,
    // 3 Chambre froide : rideau à lanières PVC + givre
    (c) => `<rect x="0" y="150" width="400" height="50" fill="#0b1a28"/><rect x="110" y="30" width="180" height="10" fill="#9fb6c8"/>
      ${Array.from({ length: 12 }, (_, i) => `<rect x="${112 + i * 15}" y="40" width="16" height="110" fill="#bfe6ff" opacity="${0.18 + (i % 3) * 0.06}" stroke="#e8f7ff" stroke-opacity=".35"/>`).join('')}
      <g fill="#e8f7ff" opacity=".8"><path d="M30 60 l6 10 l-12 0 Z"/><path d="M360 80 l6 10 l-12 0 Z"/></g><text x="200" y="22" text-anchor="middle" font-size="11" fill="${c}" opacity=".8" font-family="sans-serif">-18 °C</text>`,
    // 4 Salon professionnel : stands et spots
    (c) => `<rect x="0" y="150" width="400" height="50" fill="#1a1405"/>${[30, 160, 290].map((x, i) => `<g><rect x="${x}" y="80" width="90" height="70" fill="#2a2208"/><rect x="${x}" y="70" width="90" height="16" fill="${['#ffcf5a', '#ff8a5a', '#8fd8ff'][i]}"/><rect x="${x + 25}" y="100" width="40" height="50" fill="#3a300c"/></g>`).join('')}
      ${[75, 205, 335].map((x) => `<path d="M${x} 0 L${x - 30} 70 L${x + 30} 70 Z" fill="${c}" opacity=".08"/>`).join('')}`,
    // 5 Salle du conseil : grande table et fenêtres
    (c) => `<rect x="0" y="150" width="400" height="50" fill="#04130f"/>${[40, 120, 200, 280].map((x) => `<rect x="${x}" y="25" width="60" height="80" fill="#0e2f2a" stroke="${c}" stroke-opacity=".4"/>`).join('')}
      <ellipse cx="200" cy="140" rx="150" ry="16" fill="#1d4a42"/>${[80, 140, 200, 260, 320].map((x) => `<rect x="${x - 8}" y="118" width="16" height="22" rx="4" fill="#0b211d"/>`).join('')}`,
    // 6 Tour de verre : skyline
    (c) => `<rect x="0" y="150" width="400" height="50" fill="#060a18"/>${[[10, 70], [50, 40], [95, 90], [130, 20], [180, 60], [225, 35], [270, 80], [310, 50], [355, 75]].map(([x, y]) => `<rect x="${x}" y="${y}" width="38" height="${150 - y}" fill="#14204a" stroke="${c}" stroke-opacity=".35"/>${Array.from({ length: Math.floor((150 - y) / 16) }, (_, k) => `<rect x="${x + 8}" y="${y + 8 + k * 16}" width="6" height="6" fill="${c}" opacity="${(k + x) % 3 ? 0.15 : 0.7}"/><rect x="${x + 22}" y="${y + 8 + k * 16}" width="6" height="6" fill="${c}" opacity="${(k * 7 + x) % 4 ? 0.12 : 0.6}"/>`).join('')}`).join('')}`,
    // 7 Sommet : montagnes
    (c) => `<path d="M0 150 L80 60 L130 110 L200 30 L270 100 L320 70 L400 150 Z" fill="#2a1240"/><path d="M200 30 L222 52 L210 50 L200 60 L190 50 L178 52 Z" fill="#fff" opacity=".85"/><path d="M80 60 L95 77 L80 72 L68 78 Z" fill="#fff" opacity=".7"/><rect x="0" y="150" width="400" height="50" fill="#120720"/><path d="M200 30 L200 8 L222 14 L200 20" fill="${c}"/>`,
    // 8 Panthéon : colonnes et couronne
    (c) => `<rect x="0" y="150" width="400" height="50" fill="#16050a"/><path d="M60 50 L200 10 L340 50 Z" fill="#4a1a24" stroke="${c}" stroke-opacity=".5"/><rect x="60" y="50" width="280" height="10" fill="#5a2230"/>${[80, 130, 180, 230, 280, 320].map((x) => `<rect x="${x}" y="60" width="16" height="90" fill="#5a2230" stroke="${c}" stroke-opacity=".25"/>`).join('')}<text x="200" y="42" text-anchor="middle" font-size="20">👑</text>`
  ];
  window.sceneSvg = (i, color) => `<svg class="scene" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${SCENES[Math.max(0, Math.min(8, i))](color)}</svg>`;
  // Effet animé par arène : flocons (3), étincelles (4), fenêtres qui clignotent (6), poussière d'or (8)
  window.sceneFx = (i) => {
    const kind = { 0: 'spark', 3: 'snow', 4: 'spark', 6: 'spark', 7: 'snow', 8: 'gold' }[i];
    if (!kind) return '';
    return `<div class="fx fx-${kind}" aria-hidden="true">${Array.from({ length: 18 }, (_, k) => `<i style="left:${(k * 53) % 100}%;animation-delay:${(k * 0.37) % 4}s;animation-duration:${4 + (k % 5)}s"></i>`).join('')}</div>`;
  };

  // ---------- Portraits et répliques des boss
  window.BOSS_LOOK = {
    client: { emoji: '🧔', col: '#ff8a5a', line: '« Your price is too high. Convince me… in English! »' },
    stratege: { emoji: '🕴️', col: '#8ff0e0', line: '« Ton plan d\'action tient la route ? Prouve-le. »' },
    bruxelles: { emoji: '🏛️', col: '#a9c4ff', line: '« Nul ne passe sans connaître les 27. »' },
    diplomate: { emoji: '🎩', col: '#e3a6ff', line: '« Chaque culture a ses codes. Les connais-tu ? »' },
    homophones: { emoji: '🐉', col: '#34d27b', line: '« A ou à ? Ces ou ses ? Une erreur, et je repousse ! »' },
    correcteur: { emoji: '🖋️', col: '#ff5a6e', line: '« Pas une faute ne m\'échappe. Pas une. »' },
    present: { emoji: '⏳', col: '#ffcf5a', line: '« Right now or every day? Choose wisely. »' },
    passe: { emoji: '🕰️', col: '#f0a66a', line: '« Yesterday… or ever? Le passé ne pardonne pas. »' },
    futur: { emoji: '🔮', col: '#b05bff', line: '« Will you win? Or are you going to lose? »' },
    final: { emoji: '👹', col: '#ff2d55', line: '« Tous les temps à la fois. Bonne chance. »' }
  };

  // ---------- Sons (Web Audio, coupables)
  let ctx = null, muted = false;
  try { muted = localStorage.getItem('arene-son') === 'off'; } catch (_) {}
  function tone(freqs, dur = 0.12, type = 'sine', gain = 0.08) {
    if (muted) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + i * dur;
        o.type = type; o.frequency.value = f; g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 1.6);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur * 1.7);
      });
    } catch (_) {}
  }
  window.SFX = {
    good: () => tone([660, 880]),
    bad: () => tone([220, 160], 0.14, 'square', 0.04),
    combo: () => tone([660, 880, 1100, 1320], 0.07),
    win: () => tone([523, 659, 784, 1046], 0.14, 'triangle', 0.1),
    lose: () => tone([392, 330, 262], 0.2, 'sawtooth', 0.04),
    chest: () => tone([440, 554, 659, 880, 1108], 0.06, 'triangle', 0.09),
    get muted() { return muted; },
    toggle() { muted = !muted; try { localStorage.setItem('arene-son', muted ? 'off' : 'on'); } catch (_) {} return muted; }
  };

  // ---------- Petit texte qui s'envole (+12 pts)
  window.floatText = (txt, good) => {
    const el = document.createElement('div');
    el.className = 'floaty ' + (good ? 'up' : 'down'); el.textContent = txt;
    document.body.appendChild(el); setTimeout(() => el.remove(), 1100);
    document.body.classList.remove('flash-good', 'flash-bad'); void document.body.offsetWidth;
    document.body.classList.add(good ? 'flash-good' : 'flash-bad');
  };
})();
