import fs from 'fs';
const dir = new URL('../src/data/', import.meta.url);
let errores = 0;
const err = (m) => { console.error('✗', m); errores++; };

// Primero se leen todos los planes, porque un plan puede apoyarse en otro (planBase).
const leidos = {};
for (const archivo of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const p = JSON.parse(fs.readFileSync(new URL(archivo, dir)));
  if (p.semestres) leidos[archivo.replace('.json', '')] = p; // el resto no son planes
}

for (const [id, p] of Object.entries(leidos)) {
  const antes = errores;
  if (p.id !== id) err(`${id}.json: el id ("${p.id}") debe coincidir con el nombre del archivo`);
  ['carreraId', 'carrera', 'enfasis'].forEach((c) => { if (!p[c]) err(`${id}: falta el campo "${c}"`); });
  if (p.semestres.length > 12) err(`${id}: máximo 12 semestres`);

  const base = p.planBase ? leidos[p.planBase] : null;
  if (p.planBase && !base) err(`${id}: planBase "${p.planBase}" no existe`);
  if (base && base.carreraId !== p.carreraId) err(`${id}: planBase debe ser de la misma carrera`);
  const externos = new Set(base ? base.semestres.flatMap((s) => s.cursos.map((c) => c.codigo)) : []);

  const por = new Map();
  p.semestres.forEach((s) => s.cursos.forEach((c) => {
    if (por.has(c.codigo)) err(`${id}: código duplicado ${c.codigo}`);
    por.set(c.codigo, c);
    if (c.optativa && !p.optativas?.[c.optativa]) err(`${id}: ${c.codigo} usa la lista de optativas inexistente "${c.optativa}"`);
  }));
  const existe = (cod, de) => { if (!por.has(cod) && !externos.has(cod)) err(`${id}: ${de} referencia a un curso inexistente (${cod})`); };
  por.forEach((c) => [...c.requisitos, ...c.correquisitos].forEach((r) => existe(r, c.codigo)));
  Object.values(p.optativas ?? {}).forEach((ops) => ops.forEach((o) => o.requisitos.forEach((r) => existe(r, `optativa ${o.codigo}`))));
  (p.hitos ?? []).forEach((h) => {
    if (!p.semestres.some((s) => s.numero === h.despuesDeSemestre)) err(`${id}: el hito "${h.id}" necesita despuesDeSemestre con el número de un semestre del plan`);
    if (h.creditosMinimos != null && typeof h.creditosMinimos !== 'number') err(`${id}: el hito "${h.id}" tiene creditosMinimos inválido`);
    (h.requisitos ?? []).forEach((r) => existe(r, `hito ${h.id}`));
  });
  if (p.creditosPorSemestre.length !== p.semestres.length) err(`${id}: creditosPorSemestre tiene ${p.creditosPorSemestre.length} valores y hay ${p.semestres.length} semestres`);
  p.semestres.forEach((s, i) => {
    const suma = s.cursos.reduce((t, c) => t + c.creditos, 0);
    if (suma !== p.creditosPorSemestre[i]) err(`${id}: semestre ${s.numero} suma ${suma}, se esperaban ${p.creditosPorSemestre[i]}`);
  });
  const total = [...por.values()].reduce((t, c) => t + c.creditos, 0);
  if (total !== p.creditosTotales) err(`${id}: total ${total}, se esperaban ${p.creditosTotales}`);

  const estado = new Map();
  const visitar = (cod, ruta) => {
    if (estado.get(cod) === 2 || !por.has(cod)) return;
    if (estado.get(cod) === 1) return err(`${id}: ciclo de requisitos ${[...ruta, cod].join(' → ')}`);
    estado.set(cod, 1);
    por.get(cod).requisitos.forEach((r) => visitar(r, [...ruta, cod]));
    estado.set(cod, 2);
  };
  por.forEach((_, cod) => visitar(cod, []));
  if (errores === antes) console.log(`✓ ${id}: ${por.size} cursos, ${total} créditos, sin errores`);
}
process.exit(errores ? 1 : 0);
