// Detecta solo todos los planes: basta con soltar un JSON nuevo en esta carpeta.
// Cada plan debe traer id (igual al nombre del archivo), carreraId, carrera y enfasis.
const modulos = import.meta.glob('./*.json', { eager: true, import: 'default' });

export const planes = Object.fromEntries(
  Object.values(modulos).filter((p) => p?.semestres && p?.carreraId).map((p) => [p.id, p])
);

const porCarrera = {};
for (const p of Object.values(planes)) {
  (porCarrera[p.carreraId] ??= { id: p.carreraId, nombre: p.carrera, planes: [] }).planes.push(p);
}
// Un plan con "porDefecto": true aparece primero y es el que se abre al elegir la carrera.
// "orden" (opcional) acomoda los planes; "carreraNombre" (opcional) da el nombre común de la carrera.
for (const c of Object.values(porCarrera)) {
  c.planes.sort((a, b) => Number(!!b.porDefecto) - Number(!!a.porDefecto) || (a.orden ?? 0) - (b.orden ?? 0) || a.enfasis.localeCompare(b.enfasis, 'es'));
  c.nombre = c.planes.find((p) => p.carreraNombre)?.carreraNombre ?? c.planes[0].carrera;
}

export const carreras = porCarrera;
export const listaCarreras = Object.values(porCarrera).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
