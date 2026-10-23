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
for (const c of Object.values(porCarrera)) c.planes.sort((a, b) => a.enfasis.localeCompare(b.enfasis, 'es'));

export const carreras = porCarrera;
export const listaCarreras = Object.values(porCarrera).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
