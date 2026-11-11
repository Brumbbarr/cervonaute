// Pixel art de Cervonaute : emblèmes de rang, décors, portraits de boss, coffre. Tout est dessiné en code.
(function () {
  // ---------- outil : grille -> SVG (rectangles fusionnés par ligne)
  function grid(w, h) { return Array.from({ length: h }, () => Array(w).fill(null)); }
  function toSvg(g, cls, extra) {
    let out = '';
    g.forEach((row, y) => { let x = 0; while (x < row.length) { const c = row[x]; if (!c) { x++; continue; } let e = x; while (e + 1 < row.length && row[e + 1] === c) e++; out += `<rect x="${x}" y="${y}" width="${e - x + 1}" height="1" fill="${c}"/>`; x = e + 1; } });
    return out;
  }
  const svg = (w, h, body, cls) => `<svg class="px ${cls || ''}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;

  // ---------- EMBLÈMES (32 x 32)
  const PAL = [
    ['#f0f2f5', '#c3c8cf', '#8a9099', '#5a5f68', '#2c2f35', '#b9c2cc'],   // Fer      : clair, moyen, sombre, ombre, contour, gemme
    ['#ffe0c0', '#e8a060', '#b86a2c', '#7a3e14', '#3a1c08', '#ff9e57'],   // Bronze
    ['#ffffff', '#dfe6ef', '#a8b4c4', '#6b7a8e', '#2e3644', '#dfe9f7'],   // Argent
    ['#fff6c0', '#ffd23f', '#e0a020', '#9a6a0a', '#4a3004', '#fff08a'],   // Or
    ['#e8fffb', '#7ff0e0', '#30c0aa', '#127a6c', '#06342e', '#bffff6'],   // Platine
    ['#eef3ff', '#9cbcff', '#5a86f0', '#2a48b0', '#0e1a50', '#d6e4ff'],   // Diamant
    ['#fbeaff', '#dca0ff', '#a858e8', '#62209a', '#2a0a44', '#f2d4ff'],   // Maître
    ['#fff0f2', '#ff8aa0', '#ff3b5c', '#a8122e', '#46040f', '#ffd166']    // Légende
  ];
  const UNRANKED = ['#e6e8ec', '#b8bcc4', '#888d96', '#5d616a', '#2a2d33', '#9aa0ab'];
  const CX = 15.5;
  function shieldHalf(y) { if (y < 5 || y > 28) return -1; if (y <= 17) return 10.5; const t = (y - 17) / 11.5; return 10.5 * (1 - Math.pow(t, 1.6)); }
  function inShield(x, y) { const w = shieldHalf(y); return w > 0 && Math.abs(x - CX) <= w; }

  window.pxEmblem = function (tier, div) {
    const un = tier < 0, P = un ? UNRANKED : PAL[tier], t = un ? -1 : tier;
    const g = grid(32, 32), set = (x, y, c) => { if (x >= 0 && y >= 0 && x < 32 && y < 32) g[y][x] = c; };
    // Ailes (Diamant+) dessinées derrière
    if (t >= 5) for (let y = 7; y <= 21; y++) { const len = Math.round(8 - Math.abs(y - 11) * 0.55 + (y % 3 === 0 ? 1 : 0)); for (let k = 0; k < len; k++) { const c = k === len - 1 ? P[4] : (y % 3 === 0 ? P[3] : (k < 2 ? P[1] : P[2])); set(5 - k, y, c); set(26 + k, y, c); } }
    // Lames (Argent, Or, Platine)
    if (t >= 2 && t <= 4) for (let y = 6; y <= 15; y++) { const len = Math.max(0, 4 - Math.floor((y - 6) / 2.5)); for (let k = 0; k < len; k++) { set(4 - k, y, k === len - 1 ? P[4] : P[2]); set(27 + k, y, k === len - 1 ? P[4] : P[2]); } }
    // Lauriers (Or+)
    if (t >= 3) [[5, 26], [4, 23], [4, 20], [4, 17], [5, 14]].forEach(([x, y], i) => { [[x, y], [x + 1, y - 1], [x - 1, y + 1]].forEach(([a, b]) => { set(a, b, i % 2 ? P[2] : P[1]); set(31 - a, b, i % 2 ? P[2] : P[1]); }); set(x + 1, y + 1, P[3]); set(30 - x, y + 1, P[3]); });
    // Bouclier : remplissage, ombrage, contour
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
      if (!inShield(x, y)) continue;
      const edge = !inShield(x - 1, y) || !inShield(x + 1, y) || !inShield(x, y - 1) || !inShield(x, y + 1);
      const inner = inShield(x - 2, y) && inShield(x + 2, y) && inShield(x, y - 2) && inShield(x, y + 2);
      let c;
      if (edge) c = P[4];
      else if (!inner) c = (x < CX ? (y < 12 ? P[0] : P[1]) : (y < 12 ? P[1] : P[2]));
      else c = x < CX - 3 ? P[2] : x > CX + 3 ? P[3] : (y < 14 ? P[2] : P[3]);
      set(x, y, c);
    }
    // reflet en haut
    for (let x = 9; x <= 14; x++) set(x, 7, P[0]);
    // Rivets (Bronze+)
    if (t >= 1) [[9, 9], [22, 9], [10, 21], [21, 21]].forEach(([x, y]) => { set(x, y, P[0]); set(x + 1, y + 1, P[4]); });
    // Gemme
    if (un) { // point d'interrogation pixel
      ['.###.', '#...#', '...#.', '..#..', '.....', '..#..'].forEach((r, j) => [...r].forEach((ch, i) => { if (ch === '#') set(13 + i, 11 + j, P[0]); }));
    } else {
      const big = t >= 4, r = big ? 6 : 4, gy = big ? 15 : 15;
      for (let y = gy - r - 1; y <= gy + r + 2; y++) for (let x = 16 - r - 1; x <= 16 + r; x++) {
        const d = Math.abs(x - 15.5) + Math.abs(y - gy) * (big ? 0.85 : 1);
        if (d > r + 0.5) continue;
        const e = d > r - 0.6;
        set(x, y, e ? P[4] : (y < gy ? (x < 16 ? '#ffffff' : P[5]) : (x < 16 ? P[5] : P[2])));
      }
      set(14, gy - 2, '#ffffff'); set(13, gy - 1, '#ffffff');
    }
    // Couronne (Maître+)
    if (t >= 6) { const crown = ['#..#..#', '#######', '#######']; crown.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') set(12 + i, 1 + j, j === 0 ? P[5] : (i % 2 ? P[1] : P[2])); })); for (let i = 11; i <= 19; i++) set(i, 4, P[4]); }
    // Ruban de division
    if (!un && div > 0) {
      for (let x = 8; x <= 23; x++) { set(x, 27, P[4]); set(x, 28, P[2]); set(x, 29, P[3]); set(x, 30, P[4]); }
      [6, 7, 24, 25].forEach((x, i) => { set(x, 28, P[3]); set(x, 29, P[4]); });
      for (let k = 0; k < div; k++) { const x0 = 16 - Math.round((div - 1) * 2) + k * 4 - 1; set(x0, 28, '#fff'); set(x0 + 1, 29, '#fff'); set(x0 + 2, 28, '#fff'); }
    }
    let body = toSvg(g);
    // Effets animés
    if (t >= 4) body += `<g class="px-sparkle">${[[2, 3], [28, 4], [1, 24], [30, 20], [15, 0]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="1" height="1" fill="#fff" style="animation-delay:${i * 0.35}s"/>`).join('')}</g>`;
    if (t >= 7) {
      const fl = (seed) => { let s = seed, out = ''; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280; for (let x = 6; x <= 25; x++) { const h = 2 + Math.floor(rnd() * 4) + (Math.abs(x - 15.5) < 5 ? 2 : 0); for (let k = 0; k < h; k++) { const y = 5 - k + (Math.abs(x - 15.5) > 8 ? 3 : 0); if (y < 0) continue; out += `<rect x="${x}" y="${y}" width="1" height="1" fill="${k > h - 2 ? '#ffd166' : k > h - 4 ? '#ff7a3c' : '#ff3b5c'}"/>`; } } return out; };
      body = `<g class="px-flame f1">${fl(3)}</g><g class="px-flame f2">${fl(11)}</g>` + body;
    }
    const glow = t >= 3 ? ` style="--pg:${P[1]}"` : '';
    return `<svg class="px emb ${t >= 3 ? 'px-glow' : ''} ${t >= 7 ? 'px-leg' : ''}"${glow} viewBox="0 0 32 32" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;
  };

  // ---------- DÉCORS D'ARÈNE (160 x 72)
  function sceneGrid() { const g = grid(160, 72); const R = (x, y, w, h, c) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < 160 && j < 72) g[j][i] = c; }; return { g, R }; }
  const SC = [
    // 0 Plaine : collines, herbe, fleurs, arbre, clôture, soleil
    (R) => { R(134, 6, 10, 10, '#ffe27a'); R(136, 4, 6, 14, '#ffe27a'); R(132, 8, 14, 6, '#ffe27a');
      for (let y = 30; y < 72; y++) { const w = Math.round(Math.sqrt(Math.max(0, 900 - (y - 60) * (y - 60) * 3))); R(40 - w, y, w * 2, 1, '#2f6a2a'); R(120 - w, y + 4, w * 2, 1, '#3a7a32'); }
      R(0, 56, 160, 16, '#3f8a36'); R(0, 56, 160, 1, '#5aa848'); for (let x = 2; x < 160; x += 7) { R(x, 54, 1, 2, '#6cc058'); R(x + 3, 53, 1, 3, '#6cc058'); }
      [[14, 60, '#ff8ab0'], [36, 64, '#fff6c0'], [70, 61, '#ff8ab0'], [98, 65, '#a9c4ff'], [128, 62, '#fff6c0'], [150, 66, '#ff8ab0']].forEach(([x, y, c]) => { R(x, y, 2, 2, c); R(x, y + 2, 1, 2, '#2a6a24'); });
      R(104, 30, 4, 24, '#6a4420'); R(94, 16, 24, 16, '#2e7a2a'); R(98, 12, 16, 6, '#3a9a34'); R(96, 18, 6, 4, '#4ab040');
      for (let x = 8; x < 70; x += 10) { R(x, 48, 2, 8, '#a07a4a'); } R(8, 50, 62, 1, '#c09a6a'); R(8, 53, 62, 1, '#c09a6a'); },
    // 1 Quai : sol, caisses, chariot élévateur, camion
    (R) => { R(0, 56, 160, 16, '#22262e'); R(0, 54, 160, 2, '#3a404c'); for (let x = 0; x < 160; x += 12) R(x, 60, 6, 1, '#2e333c');
      [[18, 40, 12, 14], [31, 44, 10, 10], [24, 30, 10, 10]].forEach(([x, y, w, h]) => { R(x, y, w, h, '#9a6630'); R(x, y, w, 1, '#c08848'); R(x, y + h - 1, w, 1, '#5a3a18'); R(x + w / 2 - 1 | 0, y, 1, h, '#7a4e22'); });
      R(56, 36, 2, 18, '#e0b020'); R(58, 46, 10, 6, '#f0c030'); R(58, 42, 6, 4, '#3a4250'); R(56, 52, 2, 2, '#e0b020'); R(66, 52, 4, 2, '#e0b020'); R(59, 52, 3, 3, '#111'); R(65, 52, 3, 3, '#111');
      R(96, 28, 46, 24, '#4a5568'); R(96, 28, 46, 2, '#6a7588'); R(142, 36, 14, 16, '#5a6578'); R(145, 38, 8, 6, '#9fc4e8'); R(102, 50, 7, 5, '#111'); R(130, 50, 7, 5, '#111'); R(146, 50, 7, 5, '#111'); for (let x = 100; x < 140; x += 8) R(x, 31, 1, 18, '#3e4757'); },
    // 2 Entrepôt : rayonnages remplis
    (R) => { R(0, 58, 160, 14, '#1c130b'); for (let i = 0; i < 4; i++) { const x = 6 + i * 39; R(x, 14, 2, 44, '#7a5432'); R(x + 34, 14, 2, 44, '#7a5432'); [22, 34, 46].forEach((y) => R(x, y, 36, 2, '#8a6038')); [[x + 4, 15, 8, 7], [x + 14, 17, 10, 5], [x + 4, 27, 12, 7], [x + 20, 28, 9, 6], [x + 6, 39, 10, 7], [x + 18, 40, 12, 6], [x + 8, 50, 14, 8]].forEach(([a, b, w, h], k) => { R(a, b, w, h, k % 2 ? '#c08848' : '#a8703a'); R(a, b, w, 1, '#d8a060'); }); }
      R(150, 4, 4, 4, '#ffe080'); R(148, 8, 8, 1, '#806020'); },
    // 3 Chambre froide : rideau à lanières qui ondule, givre
    (R) => { R(0, 58, 160, 14, '#0c1c2c'); R(0, 0, 160, 58, '#10283c'); R(40, 6, 80, 4, '#a8c0d4'); R(38, 4, 84, 2, '#d0e4f0');
      R(36, 10, 4, 48, '#2a4a64'); R(120, 10, 4, 48, '#2a4a64');
      for (let x = 0; x < 160; x += 16) { R(x, 0, 6, 2, '#e8f7ff'); R(x + 2, 2, 2, 2, '#e8f7ff'); }
      R(10, 20, 14, 10, '#1a3a54'); R(12, 22, 10, 2, '#7fd0ff'); R(13, 25, 4, 3, '#7fd0ff'); },
    // 4 Salon professionnel : stands, banderoles, spots
    (R) => { R(0, 56, 160, 16, '#241c08'); [[8, '#ffcf5a'], [60, '#ff8a5a'], [112, '#7fd0ff']].forEach(([x, c]) => { R(x, 26, 40, 30, '#2e260c'); R(x, 20, 40, 7, c); R(x + 2, 22, 36, 3, '#00000033'); R(x + 12, 34, 16, 22, '#3e340f'); R(x + 14, 36, 12, 8, '#9fc4e8'); R(x + 4, 46, 6, 10, c); });
      for (let x = 0; x < 160; x += 20) R(x + 8, 0, 4, 3, '#555'); },
    // 5 Salle du conseil : baies vitrées, table, fauteuils
    (R) => { R(0, 58, 160, 14, '#04140f'); for (let i = 0; i < 5; i++) { R(8 + i * 30, 6, 26, 34, '#0e2f2a'); R(8 + i * 30, 6, 26, 1, '#6af0d8'); R(20 + i * 30, 6, 1, 34, '#1d5048'); R(8 + i * 30, 22, 26, 1, '#1d5048'); }
      R(20, 50, 120, 6, '#2a6a5e'); R(20, 50, 120, 1, '#4fa898'); for (let x = 26; x < 140; x += 18) { R(x, 44, 8, 6, '#0b2a24'); R(x + 1, 56, 6, 2, '#0b2a24'); } },
    // 6 Tour de verre : skyline de nuit, fenêtres
    (R) => { R(0, 62, 160, 10, '#060a18'); [[0, 30, 18], [20, 14, 16], [38, 36, 14], [54, 6, 20], [76, 24, 16], [94, 16, 18], [114, 34, 14], [130, 10, 16], [148, 28, 12]].forEach(([x, y, w]) => { R(x, y, w, 62 - y, '#141e48'); R(x, y, w, 1, '#3a50a0'); for (let j = y + 3; j < 60; j += 4) for (let i = x + 2; i < x + w - 2; i += 4) if ((i * 7 + j * 3) % 5) R(i, j, 2, 2, (i + j) % 3 ? '#26357a' : '#a9c4ff'); });
      R(140, 4, 6, 6, '#e8eeff'); R(141, 5, 2, 2, '#ffffff'); },
    // 7 Sommet : montagnes enneigées, drapeau
    (R) => { const peak = (cx, top, base, c, snow) => { for (let y = top; y < base; y++) { const w = Math.round((y - top) * 1.4); R(cx - w, y, w * 2 + 1, 1, c); if (y < top + 6) R(cx - w, y, w * 2 + 1, 1, snow); } };
      peak(40, 22, 64, '#3a1c58', '#f0e8ff'); peak(120, 26, 64, '#341850', '#f0e8ff'); peak(80, 8, 64, '#4a2470', '#ffffff'); R(0, 62, 160, 10, '#1a0a2c'); R(80, 0, 1, 9, '#ddd'); R(81, 0, 6, 4, '#e3a6ff'); },
    // 8 Panthéon : temple doré, colonnes
    (R) => { R(0, 60, 160, 12, '#1a060c'); R(20, 56, 120, 4, '#6a2a3a'); R(24, 52, 112, 4, '#7a3444');
      for (let y = 0; y < 14; y++) { const w = Math.round(y * 4.3); R(80 - w, 6 + y, w * 2, 1, y < 2 ? '#ffd166' : '#8a3a4c'); } R(26, 20, 108, 4, '#9a4458'); R(26, 20, 108, 1, '#ffd166');
      for (let x = 32; x < 132; x += 16) { R(x, 24, 8, 28, '#8a3a4c'); R(x + 1, 24, 2, 28, '#b05a6e'); R(x - 1, 24, 10, 2, '#9a4458'); }
      R(77, 10, 6, 4, '#ffd166'); }
  ];
  const FX = {
    0: (n) => Array.from({ length: n }, (_, i) => `<rect class="pf blink" x="${(i * 43) % 156}" y="${36 + (i * 11) % 18}" width="1" height="1" fill="#fff6c0" style="animation-delay:${(i * 0.4) % 3}s"/>`).join(''),
    3: (n) => Array.from({ length: n }, (_, i) => `<rect class="pf snow" x="${(i * 37) % 160}" y="0" width="1" height="1" fill="#e8f7ff" style="animation-delay:${(i * 0.41) % 5}s;animation-duration:${5 + (i % 4)}s"/>`).join(''),
    4: (n) => Array.from({ length: n }, (_, i) => `<rect class="pf blink" x="${8 + (i * 29) % 144}" y="${2 + (i * 7) % 16}" width="2" height="2" fill="#fff6c0" style="animation-delay:${(i * 0.3) % 2}s"/>`).join(''),
    6: (n) => Array.from({ length: n }, (_, i) => `<rect class="pf blink" x="${(i * 41) % 156}" y="${10 + (i * 13) % 46}" width="2" height="2" fill="#a9c4ff" style="animation-delay:${(i * 0.5) % 3}s"/>`).join(''),
    7: (n) => Array.from({ length: n }, (_, i) => `<rect class="pf snow" x="${(i * 31) % 160}" y="0" width="1" height="1" fill="#ffffff" style="animation-delay:${(i * 0.37) % 5}s;animation-duration:${4 + (i % 5)}s"/>`).join(''),
    8: (n) => Array.from({ length: n }, (_, i) => `<rect class="pf rise" x="${10 + (i * 23) % 140}" y="70" width="1" height="1" fill="#ffd166" style="animation-delay:${(i * 0.33) % 4}s;animation-duration:${3 + (i % 3)}s"/>`).join('')
  };
  window.pxScene = function (i) {
    i = Math.max(0, Math.min(8, i));
    const { g, R } = sceneGrid(); SC[i](R);
    let extra = FX[i] ? FX[i](i === 4 ? 10 : 22) : '';
    if (i === 3) extra += `<g class="curtain">${Array.from({ length: 10 }, (_, k) => `<rect x="${42 + k * 8}" y="10" width="7" height="48" fill="#bfe6ff" fill-opacity="${0.22 + (k % 3) * 0.08}"/><rect x="${42 + k * 8}" y="10" width="1" height="48" fill="#ffffff" fill-opacity=".35"/>`).join('')}</g>`;
    return `<svg class="px scene" viewBox="0 0 160 72" preserveAspectRatio="xMidYMax slice" shape-rendering="crispEdges" aria-hidden="true">${toSvg(g)}${extra}</svg>`;
  };

  // ---------- PORTRAITS DE BOSS (24 x 24) : visage pixel + accessoire
  const FACES = {
    client: { skin: '#e8b48a', hair: '#5a3a1a', acc: 'beard', col: '#ff8a5a' },
    stratege: { skin: '#e0b090', hair: '#222', acc: 'glasses', col: '#8ff0e0' },
    bruxelles: { skin: '#d8c8a8', hair: '#ddd', acc: 'laurel', col: '#a9c4ff' },
    diplomate: { skin: '#c89070', hair: '#111', acc: 'tophat', col: '#e3a6ff' },
    homophones: { skin: '#3fbf6a', hair: '#1e7a3e', acc: 'horns', col: '#34d27b' },
    correcteur: { skin: '#f0d0b0', hair: '#888', acc: 'monocle', col: '#ff5a6e' },
    present: { skin: '#f0c890', hair: '#ffcf5a', acc: 'crown', col: '#ffcf5a' },
    passe: { skin: '#e0b890', hair: '#ccc', acc: 'beard', col: '#f0a66a' },
    futur: { skin: '#b090e0', hair: '#5a2a9a', acc: 'hood', col: '#b05bff' },
    final: { skin: '#c03040', hair: '#300', acc: 'horns', col: '#ff2d55' }
  };
  window.pxBoss = function (id) {
    const f = FACES[id] || FACES.final, g = grid(24, 24), s = (x, y, c) => { if (x >= 0 && y >= 0 && x < 24 && y < 24) g[y][x] = c; };
    const box = (x, y, w, h, c) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) s(i, j, c); };
    box(6, 6, 12, 13, f.skin); box(5, 8, 1, 8, f.skin); box(18, 8, 1, 8, f.skin);
    box(6, 4, 12, 3, f.hair); box(5, 5, 2, 5, f.hair); box(17, 5, 2, 5, f.hair);
    box(8, 10, 3, 2, '#fff'); box(13, 10, 3, 2, '#fff'); s(9, 11, '#111'); s(14, 11, '#111'); box(8, 9, 3, 1, '#222'); box(13, 9, 3, 1, '#222');
    box(11, 13, 2, 2, '#00000022'); box(9, 16, 6, 1, '#6a2a2a');
    box(4, 19, 16, 5, f.col); box(10, 19, 4, 3, '#fff'); s(11, 20, f.col); s(12, 20, f.col);
    if (f.acc === 'beard') { box(7, 15, 10, 4, f.hair); box(9, 16, 6, 1, '#6a2a2a'); }
    if (f.acc === 'glasses') { box(7, 9, 4, 4, null); box(7, 9, 4, 1, '#111'); box(7, 12, 4, 1, '#111'); box(7, 9, 1, 4, '#111'); box(10, 9, 1, 4, '#111'); box(13, 9, 4, 1, '#111'); box(13, 12, 4, 1, '#111'); box(13, 9, 1, 4, '#111'); box(16, 9, 1, 4, '#111'); s(11, 10, '#111'); s(12, 10, '#111'); box(8, 10, 2, 2, '#9fc4e8'); box(14, 10, 2, 2, '#9fc4e8'); }
    if (f.acc === 'laurel') [[5, 4], [6, 3], [8, 2], [15, 2], [17, 3], [18, 4]].forEach(([x, y]) => { s(x, y, '#ffd166'); s(x, y + 1, '#c09030'); });
    if (f.acc === 'tophat') { box(7, 0, 10, 5, '#111'); box(5, 4, 14, 1, '#111'); box(7, 3, 10, 1, '#a050d0'); }
    if (f.acc === 'horns') { box(5, 1, 2, 4, '#eee'); box(17, 1, 2, 4, '#eee'); s(4, 0, '#eee'); s(19, 0, '#eee'); box(8, 10, 3, 2, '#ffd166'); box(13, 10, 3, 2, '#ffd166'); s(9, 11, '#c00'); s(14, 11, '#c00'); }
    if (f.acc === 'monocle') { box(13, 9, 4, 4, '#ffd166'); box(14, 10, 2, 2, '#cfe8ff'); s(16, 13, '#ffd166'); s(16, 14, '#ffd166'); }
    if (f.acc === 'crown') { box(7, 1, 10, 3, '#ffd166'); s(7, 0, '#ffd166'); s(12, 0, '#ffd166'); s(16, 0, '#ffd166'); s(11, 2, '#ff3b5c'); }
    if (f.acc === 'hood') { box(4, 3, 16, 3, f.hair); box(4, 3, 2, 16, f.hair); box(18, 3, 2, 16, f.hair); box(8, 10, 3, 2, '#e0c0ff'); box(13, 10, 3, 2, '#e0c0ff'); }
    return svg(24, 24, toSvg(g), 'boss');
  };

  // ---------- COFFRE (20 x 18), fermé ou ouvert
  window.pxChest = function (open) {
    const g = grid(20, 18), b = (x, y, w, h, c) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) g[j][i] = c; };
    b(2, 9, 16, 8, '#8a5a2a'); b(2, 9, 16, 1, '#b07a3a'); b(2, 16, 16, 1, '#4a2e12'); b(2, 9, 1, 8, '#4a2e12'); b(17, 9, 1, 8, '#4a2e12'); b(5, 9, 2, 8, '#d8a040'); b(13, 9, 2, 8, '#d8a040');
    if (open) { b(2, 2, 16, 4, '#6a4420'); b(2, 2, 16, 1, '#b07a3a'); b(4, 6, 12, 3, '#fff6c0'); b(6, 5, 8, 2, '#ffd166'); b(9, 0, 2, 3, '#ffffff'); }
    else { b(2, 4, 16, 6, '#9a6630'); b(2, 4, 16, 1, '#c08848'); b(2, 4, 1, 6, '#4a2e12'); b(17, 4, 1, 6, '#4a2e12'); b(5, 4, 2, 6, '#d8a040'); b(13, 4, 2, 6, '#d8a040'); b(9, 8, 2, 3, '#ffd166'); b(9, 10, 2, 1, '#8a6a10'); }
    return svg(20, 18, toSvg(g), 'chest-px' + (open ? ' open' : ''));
  };
})();
