// =====================================================================
// DA « V8 » : icônes et illustrations (affichage seulement, aucune logique)
// Les couleurs viennent des variables de css/theme.css.
// =====================================================================
(function () {
  const ic = (d, w = 20, sw = 1.7, extra = '') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
  const P = {
    accueil: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
    jouer: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/>',
    epees: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="M9.5 6.5 21 18v3h-3L6.5 9.5"/>',
    salle: '<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4z"/><path d="M20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>',
    profil: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    progression: '<path d="M3 20h18"/><path d="m5 15 5-5 4 4 6-7"/>',
    son: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/>',
    muet: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6"/><path d="m21 9-5 6"/>',
    carte: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14"/><path d="M15 6v14"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    cadenas: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    livre: '<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4z"/><path d="M20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>',
    cadeau: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v7h14v-7"/><path d="M12 8v12"/><path d="M12 8c-2-4-6-4-6-1.5S9 8 12 8c3 0 6-.5 6-1.5S14 4 12 8z"/>',
    trophee: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4"/><path d="M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v4"/><path d="M8 20h8"/><path d="M9.5 17h5"/>',
    retour: '<path d="m15 6-6 6 6 6"/>',
    croix: '<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
    coeur: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    chrono: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2"/><path d="M10 2h4"/>',
    ampoule: '<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
    punaise: '<path d="M9 3h6l-1 6 3 3H7l3-3z"/><path d="M12 12v9"/>',
    bulle: '<path d="M4 5h16v11H9l-5 4z"/>',
    alerte: '<path d="M12 3 2 20h20z"/><path d="M12 10v4"/><path d="M12 17h.01"/>',
    traduction: '<path d="M4 6h9"/><path d="M8.5 4v2c0 4-2 7-4.5 8"/><path d="M6 10c1 2 3 3.5 5 4"/><path d="m13 20 4-9 4 9"/><path d="M14.5 17h5"/>',
    couronne: '<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
    cible: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    eclair: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    drapeau: '<path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/>',
    cerveau: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 0V6a2 2 0 0 0-3-2z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 0"/>',
    tete: '<circle cx="12" cy="9" r="5"/><path d="M9 9h.01"/><path d="M15 9h.01"/><path d="M9.5 12c1.5 1 3.5 1 5 0"/><path d="M7 21v-2a5 5 0 0 1 10 0v2"/>',
    sortie: '<path d="M10 4H5v16h5"/><path d="M14 8l4 4-4 4"/><path d="M18 12H9"/>'
  };
  // Portraits de boss : pictogrammes au trait (pas d'emoji)
  const BOSS_IC = { client: 'tete', stratege: 'cible', bruxelles: 'drapeau', diplomate: 'bulle', homophones: 'alerte', correcteur: 'check', present: 'chrono', passe: 'retour', futur: 'eclair', final: 'couronne' };
  const portrait = id => ic(P[BOSS_IC[id] || 'epees'], 24, 1.8);
  const MODE_IC = { warm: 'eclair', ranked: 'cible', marathon: 'drapeau' };
  const modeIc = id => ic(P[MODE_IC[id] || 'jouer'], 22, 1.9);
  const flamme = (w = 14, cls = 'v8-a-flame') => `<svg class="${cls}" width="${w}" height="${w}" viewBox="0 0 24 24" fill="var(--copper)" aria-hidden="true"><path d="M12 2c1.2 4.5 6 5.8 6 11.2A6 6 0 0 1 6 13.2c0-3.4 2.3-4.6 2.3-8 1.8 1.1 2.9 2.4 3.4 3.6C12.3 6.6 12 4.3 12 2z"/></svg>`;

  // Illustration d'arène (style V8 : ciel, soleil cuivre, collines pétrole).
  // La Plaine reproduit la maquette ; les autres arènes auront leur propre dessin plus tard.
  function areneSvg(i, nom) {
    const plaine = i === 0;
    return `<svg viewBox="0 0 354 230" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration de l'arène ${nom}">
<defs>
<linearGradient id="v8sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--cyan-sky)"/><stop offset=".6" stop-color="var(--cyan-sky-2)"/><stop offset="1" stop-color="var(--copper-tint-2)"/></linearGradient>
<radialGradient id="v8sunGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="var(--copper-sun)"/><stop offset="1" stop-color="var(--copper-sun)" stop-opacity="0"/></radialGradient>
<linearGradient id="v8h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--petrol-pale-2)"/><stop offset="1" stop-color="var(--petrol-pale)"/></linearGradient>
<linearGradient id="v8h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--petrol-pale-3)"/><stop offset="1" stop-color="var(--petrol-pale-3)"/></linearGradient>
<linearGradient id="v8h3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--petrol-mid)"/><stop offset="1" stop-color="var(--petrol-mid-2)"/></linearGradient>
</defs>
<rect width="354" height="230" fill="url(#v8sky)"/>
<g class="v8-a-rays" fill="var(--copper-sun)"><path d="M268 100 160 0h20z"/><path d="M268 100 236 0h16z"/><path d="M268 100 318 0h14z"/><path d="M268 100 354 36v16z"/></g>
<circle cx="268" cy="100" r="54" fill="url(#v8sunGlow)"/>
<circle class="v8-a-sun" cx="268" cy="100" r="22" fill="var(--copper)"/>
<g fill="var(--surface)" opacity=".9"><path class="v8-a-drift" d="M150 46h44c-1-7-8-10-14-8-4-7-14-8-21-2-5 0-9 5-9 10z"/></g>
<path d="M-10 158C60 132 120 136 190 150S300 132 364 140V230H-10z" fill="url(#v8h1)"/>
<path d="M-10 180C70 160 150 170 230 178S330 162 364 168V230H-10z" fill="url(#v8h2)"/>
${plaine ? `<g class="v8-a-sway"><rect x="190" y="126" width="6" height="40" rx="2" fill="var(--petrol-mid-2)"/><path d="M193 88c-16 10-20 28-12 42h24c8-14 4-32-12-42z" fill="var(--petrol-mid)"/></g>
<g><rect x="220" y="146" width="4" height="26" rx="2" fill="var(--petrol-mid-2)"/><path d="M222 120c-10 7-13 19-8 28h16c5-9 2-21-8-28z" fill="var(--petrol-mid)"/></g>
<g stroke="var(--petrol-mid-2)" stroke-width="2" stroke-linecap="round"><path d="M262 184v-12"/><path d="M278 184v-12"/><path d="M294 185v-12"/><path d="M310 186v-12"/><path d="M258 176h56"/></g>` : ''}
<path d="M-10 204C80 192 180 200 260 204S340 198 364 200V230H-10z" fill="url(#v8h3)"/>
<g fill="var(--copper)"><circle class="v8-a-tw1" cx="150" cy="118" r="2.5"/><circle class="v8-a-tw2" cx="330" cy="150" r="2"/><circle class="v8-a-tw3" cx="120" cy="140" r="2"/></g>
</svg>`;
  }

  function badge(label) {
    return `<svg viewBox="0 0 134 152" role="img" aria-label="Insigne de rang ${label}">
<defs>
<linearGradient id="v8rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--copper-tint)"/><stop offset=".4" stop-color="var(--copper)"/><stop offset=".65" stop-color="var(--copper-text)"/><stop offset=".85" stop-color="var(--copper-light)"/><stop offset="1" stop-color="var(--copper-dark)"/></linearGradient>
<linearGradient id="v8core" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--cyan-light-2)"/><stop offset=".55" stop-color="var(--cyan)"/><stop offset="1" stop-color="var(--petrol-strong)"/></linearGradient>
<linearGradient id="v8sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="v8clip"><path d="M67 4 124 24v45c0 39-24 65-57 80C34 134 10 108 10 69V24z"/></clipPath>
</defs>
<path d="M67 4 124 24v45c0 39-24 65-57 80C34 134 10 108 10 69V24z" fill="url(#v8rim)"/>
<path d="M67 13 115 30v39c0 33-20 56-48 69C39 125 19 102 19 69V30z" fill="var(--petrol-strong)"/>
<path d="M67 21 107 35v34c0 27-16 47-40 58-24-11-40-31-40-58V35z" fill="url(#v8core)"/>
<path d="M67 44 85 74 67 104 49 74z" fill="var(--surface)" opacity=".95"/>
<path d="M67 44 85 74H49z" fill="var(--surface)" opacity=".55"/>
<g clip-path="url(#v8clip)"><rect x="-60" y="-20" width="28" height="200" fill="url(#v8sheen)" transform="rotate(22 67 76)"><animate attributeName="x" values="-60;-60;180" keyTimes="0;0.6;1" dur="4s" repeatCount="indefinite"/></rect></g>
</svg>`;
  }

  function anneau(n, total) {
    const c = 2 * Math.PI * 23, v = c * Math.min(1, n / total);
    return `<svg viewBox="0 0 56 56" role="img" aria-label="Objectif du jour : ${n} questions sur ${total}">
<circle cx="28" cy="28" r="23" fill="none" stroke="var(--cyan-tint-2)" stroke-width="6"/>
<circle cx="28" cy="28" r="23" fill="none" stroke="var(--cyan)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${v.toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 28 28)"/>
<text x="28" y="32" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="${n >= 100 ? 10 : 12}" font-weight="600" fill="var(--petrol)">${n}/${total}</text></svg>`;
  }

  function coffre() {
    return `<svg viewBox="0 0 78 70" aria-hidden="true" style="left:0;bottom:0;width:62px;height:56px;top:auto">
<defs><linearGradient id="v8chest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--copper-light)"/><stop offset="1" stop-color="var(--copper-text)"/></linearGradient>
<linearGradient id="v8chestLid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--copper-tint)"/><stop offset="1" stop-color="var(--copper)"/></linearGradient></defs>
<path d="M8 32h62v28a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5z" fill="url(#v8chest)"/>
<g class="v8-a-lid"><path d="M8 32c0-14 14-22 31-22s31 8 31 22z" fill="url(#v8chestLid)"/></g>
<rect x="34" y="32" width="10" height="33" fill="var(--petrol-strong)" opacity=".25"/>
<rect x="32" y="30" width="14" height="14" rx="3" fill="var(--cyan)"/></svg>
<svg viewBox="0 0 64 58" aria-hidden="true"><path class="v8-a-tw1" d="M58 2l1.3 3.7L63 7l-3.7 1.3L58 12l-1.3-3.7L53 7l3.7-1.3z" fill="var(--copper)"/><path class="v8-a-tw3" d="M6 8l1 2.8 2.8 1-2.8 1L6 15.6l-1-2.8-2.8-1 2.8-1z" fill="var(--cyan)"/></svg>`;
  }

  // Courbe 7 jours (mêmes valeurs que l'ancienne, seul le dessin change)
  function courbe(pts, tendance) {
    const vs = pts.map(p => p.v), lo = Math.min(...vs), hi = Math.max(...vs);
    const x = i => 6 + i * 20, y = v => hi === lo ? 40 : 62 - (v - lo) / (hi - lo) * 46;
    const l = pts.map((p, i) => x(i) + ',' + y(p.v).toFixed(1)).join(' ');
    const J = ['D', 'L', 'M', 'M', 'J', 'V', 'S'], ex = x(pts.length - 1), ey = y(vs[vs.length - 1]).toFixed(1);
    return `<svg viewBox="0 0 133 86" role="img" aria-label="Courbe des points sur 7 jours, ${tendance.toLowerCase()}">
<defs><linearGradient id="v8area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--cyan)" stop-opacity=".3"/><stop offset="1" stop-color="var(--cyan)" stop-opacity="0"/></linearGradient></defs>
<polygon points="${l} ${ex},70 6,70" fill="url(#v8area)"/>
<polyline points="${l}" fill="none" stroke="var(--cyan)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="${ex}" cy="${ey}" r="4" fill="var(--copper)"/>
<g font-family="IBM Plex Mono, monospace" font-size="9" fill="var(--petrol-text-2)" text-anchor="middle">${pts.map((p, i) => `<text x="${x(i)}" y="84"${i === pts.length - 1 ? ' fill="var(--petrol)" font-weight="600"' : ''}>${J[new Date(p.d + 'T12:00').getDay()]}</text>`).join('')}</g></svg>`;
  }

  const i = (k, w = 16, sw = 1.9) => `<span class="ico">${ic(P[k], w, sw)}</span>`;
  const coeurs = (n, total) => Array.from({ length: total }, (_, j) => `<svg width="15" height="15" viewBox="0 0 24 24" fill="${j < n ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true">${P.coeur}</svg>`).join('');
  const coffreGrand = () => `<svg viewBox="0 0 78 70" aria-hidden="true"><path d="M8 32h62v28a5 5 0 0 1-5 5H13a5 5 0 0 1-5-5z" fill="var(--copper-text)"/><g class="v8-a-lid"><path d="M8 32c0-14 14-22 31-22s31 8 31 22z" fill="var(--copper)"/></g><rect x="32" y="30" width="14" height="14" rx="3" fill="var(--cyan)"/></svg>`;
  window.V8 = { ic, P, i, flamme, areneSvg, badge, anneau, coffre, coffreGrand, courbe, portrait, modeIc, coeurs };
})();
