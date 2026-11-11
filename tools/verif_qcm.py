"""Contrôle des QCM : repère les indices qui trahissent la bonne réponse.

Usage : py -I tools/verif_qcm.py           (résumé)
        py -I tools/verif_qcm.py --detail  (liste complète)

Signale un QCM quand la bonne réponse est la seule à :
  - être nettement la plus longue (plus de 25 % et 8 caractères de plus que la suivante),
  - contenir deux formulations (« a / b »), une parenthèse ou un « ou / or ».
"""
import glob, io, os, re, sys

RACINE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'js')
SEUIL_RATIO, SEUIL_CAR = 1.25, 8

def qcm():
    for f in sorted(glob.glob(os.path.join(RACINE, 'banque*.js'))):
        s = io.open(f, encoding='utf-8').read()
        for m in re.finditer(r"\{n:'([^']*)'[^{}]*?q:'((?:[^'\\]|\\.)*)',o:\[(.*?)\],a:(\d+)", s):
            o = [x.replace("\\'", "'") for x in re.findall(r"'((?:[^'\\]|\\.)*)'", m.group(3))]
            a = int(m.group(4))
            if a < len(o):
                yield os.path.basename(f), s.count('\n', 0, m.start()) + 1, m.group(1), m.group(2).replace("\\'", "'"), o, a

def indices(o, a):
    out = []
    L = sorted((len(x), i) for i, x in enumerate(o))
    if L[-1][1] == a and len(o) > 1:
        suiv = L[-2][0]
        if len(o[a]) > suiv * SEUIL_RATIO and len(o[a]) - suiv >= SEUIL_CAR:
            out.append('plus longue')
    for nom, t in (('double', lambda x: '/' in x), ('parenthèse', lambda x: '(' in x), ('ou', lambda x: len(x.split()) > 2 and re.search(r'\b(ou|or)\b', x))):
        h = [bool(t(x)) for x in o]
        if h[a] and sum(h) == 1:
            out.append(nom)
    return out

if __name__ == '__main__':
    tot, mauvais = 0, []
    for f, ligne, n, q, o, a in qcm():
        tot += 1
        i = indices(o, a)
        if i: mauvais.append((f, ligne, n, q, o, a, i))
    # « seule plus longue » : une égalité ne trahit rien
    plus_longue = sum(1 for *_, o, a in qcm() if all(len(o[a]) > len(x) for i, x in enumerate(o) if i != a))
    print(f'{tot} QCM analysés, {len(mauvais)} avec un indice.')
    print(f'La bonne réponse est la plus longue dans {plus_longue} QCM ({100 * plus_longue // max(1, tot)} %, le hasard donnerait environ 25 %).')
    if '--detail' in sys.argv:
        for f, ligne, n, q, o, a, i in mauvais:
            print(f'\n{f}:{ligne} [{n}] {", ".join(i)}\n  Q: {q}')
            for k, x in enumerate(o): print(('  * ' if k == a else '    ') + x)
    sys.exit(1 if mauvais else 0)
