// Accès aux données (Supabase) partagé par l'Arène et la page Progression.
(function () {
  const cfg = window.ARENE_CONFIG || {};
  const ok = cfg.supabaseUrl && !cfg.supabaseUrl.startsWith('A_') && window.supabase;
  const sb = ok ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, { auth: { persistSession: true, detectSessionInUrl: true } }) : null;

  const Data = {
    ready: !!sb,
    sb,
    async user() { if (!sb) return null; const { data } = await sb.auth.getUser(); return data.user || null; },
    async login(email) {
      const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: location.href.split('#')[0] } });
      if (error) throw error;
    },
    async logout() { await sb.auth.signOut(); },
    onAuth(fn) { if (sb) sb.auth.onAuthStateChange((_e, s) => fn(s && s.user)); },

    // Toutes les réponses + sessions de l'utilisateur.
    async load() {
      const all = [];
      for (let from = 0; ; from += 1000) {
        const { data, error } = await sb.from('reponses').select('id,session_id,date,seance,question,notion,correct,given,attendu,source,created_at').order('date').order('id').range(from, from + 999);
        if (error) throw error;
        all.push(...data);
        if (data.length < 1000) break;
      }
      const { data: sessions, error: e2 } = await sb.from('sessions').select('*').order('at');
      if (e2) throw e2;
      const bySession = {};
      all.forEach((r) => { if (r.session_id) (bySession[r.session_id] = bySession[r.session_id] || []).push(r); });
      sessions.forEach((s) => { s.reponses = bySession[s.id] || []; });
      return { reponses: all, sessions, base: all.filter((r) => !r.session_id) };
    },
    // Catalogue des cartes (commun) + collection et récompenses du joueur. Mis en cache pour le hors-connexion.
    async cartes() {
      try {
        const [c, r, f, m, col, rec] = await Promise.all([
          sb.from('cartes').select('*').order('num'), sb.from('raretes').select('*').order('ordre'),
          sb.from('familles').select('*').order('ordre'), sb.from('matieres').select('*').order('ordre'),
          sb.from('collection').select('carte_id,exemplaires,decouverte_le'), sb.from('recompenses').select('type,ref,carte_id,rarete,neuve,cree_le').order('cree_le')]);
        for (const x of [c, r, f, m, col, rec]) if (x.error) throw x.error;
        const out = { cartes: c.data, raretes: r.data, familles: f.data, matieres: m.data, collection: col.data, recompenses: rec.data };
        try { localStorage.setItem('arene-cartes', JSON.stringify(out)); } catch (_) {}
        return out;
      } catch (e) { try { const c = JSON.parse(localStorage.getItem('arene-cartes')); if (c) return c; } catch (_) {} throw e; }
    },
    // Ouvre une récompense côté serveur : c'est lui qui vérifie et tire la carte.
    async ouvrir(type, ref) { const { data, error } = await sb.rpc('ouvrir_recompense', { p_type: type, p_ref: String(ref) }); if (error) throw error; return data; },
    async notions() { const { data, error } = await sb.from('notions').select('*'); if (error) throw error; return data; },

    async saveSession(doc) {
      const id = crypto.randomUUID();
      const { error } = await sb.from('sessions').insert({ id, at: doc.at, date: doc.date, mode: doc.mode, titre: doc.titre, boss: doc.boss, victoire: doc.victoire, combo: doc.combo, carte: doc.carte });
      if (error) throw error;
      if (!doc.reponses.length) return id;
      const rows = doc.reponses.map((r) => ({ session_id: id, date: r.date, seance: r.seance, question: r.question, notion: r.notion, correct: r.correct, given: r.given, attendu: r.attendu }));
      const { error: e2 } = await sb.from('reponses').insert(rows);
      if (e2) { await sb.from('sessions').delete().eq('id', id); throw e2; }
      return id;
    },
    async getTitre() { const { data } = await sb.from('profil').select('titre').maybeSingle(); return data ? data.titre : ''; },
    async setTitre(titre) { await sb.from('profil').upsert({ titre, updated_at: new Date().toISOString() }); }
  };

  // Sessions jouées hors connexion : gardées sur le téléphone puis envoyées.
  Data.queue = {
    add(doc) { try { const q = JSON.parse(localStorage.getItem('arene-file') || '[]'); q.push(doc); localStorage.setItem('arene-file', JSON.stringify(q)); } catch (_) {} },
    async flush() {
      let q = []; try { q = JSON.parse(localStorage.getItem('arene-file') || '[]'); } catch (_) {}
      const rest = [];
      for (const d of q) {
        try { const id = await Data.saveSession(d); if (d.coffre) { try { await Data.ouvrir(d.coffre, id); } catch (_) {} } }
        catch (_) { rest.push(d); }
      }
      try { localStorage.setItem('arene-file', JSON.stringify(rest)); } catch (_) {}
      return q.length - rest.length;
    }
  };
  window.Data = Data;
})();
