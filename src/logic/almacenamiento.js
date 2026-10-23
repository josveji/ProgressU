const CLAVE = 'progressu_v1';
const BIENVENIDA = 'progressu_welcome_seen';

export const defecto = { enfasis: 'computadoras-y-redes', aprobados: [], optativas: {}, cita: '', nombre: '', foto: '' };

export function cargar() {
  try { return { ...defecto, ...JSON.parse(localStorage.getItem(CLAVE) || '{}') }; } catch { return { ...defecto }; }
}
export function guardar(estado) {
  try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch { /* almacenamiento no disponible */ }
}
export const bienvenidaVista = () => { try { return localStorage.getItem(BIENVENIDA) === '1'; } catch { return false; } };
export const marcarBienvenida = () => { try { localStorage.setItem(BIENVENIDA, '1'); } catch { /* ignorar */ } };

export function exportar(estado) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: 'progressu-progreso.json' });
  a.click();
  URL.revokeObjectURL(url);
}
export async function importar(archivo) {
  const d = JSON.parse(await archivo.text());
  if (!Array.isArray(d.aprobados)) throw new Error('Archivo inválido');
  return { ...defecto, ...d };
}
