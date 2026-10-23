import fs from 'fs';
const dir = new URL('../src/data/', import.meta.url);
const lista = JSON.parse(fs.readFileSync(new URL('enfasis.json', dir)));
let errores = 0;
const err = (m) => { console.error('✗', m); errores++; };

for (const { id } of lista) {
  const p = JSON.parse(fs.readFileSync(new URL(`${id}.json`, dir)));
  const por = new Map();
  p.semestres.forEach((s) => s.cursos.forEach((c) => { if (por.has(c.codigo)) err(`${id}: código duplicado ${c.codigo}`); por.set(c.codigo, c); }));
  const existe = (cod, de) => { if (!por.has(cod)) err(`${id}: ${de} referencia a un curso inexistente (${cod})`); };
  por.forEach((c) => { [...c.requisitos, ...c.correquisitos].forEach((r) => existe(r, c.codigo)); });
  Object.values(p.optativas).forEach((ops) => ops.forEach((o) => o.requisitos.forEach((r) => existe(r, `optativa ${o.codigo}`))));
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
  if (!errores) console.log(`✓ ${id}: ${por.size} cursos, ${total} créditos, sin errores`);
}
process.exit(errores ? 1 : 0);
