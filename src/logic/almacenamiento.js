const CLAVE = 'progressu_v2';
const VIEJA = 'progressu_v1';
const BIENVENIDA = 'progressu_welcome_seen';

// Datos globales (perfil) + progreso separado por carrera.
export const defecto = { nombre: '', foto: '', cita: '', carrera: null, carreras: {} };
export const progresoVacio = (enfasis) => ({ enfasis, aprobados: [], optativas: {} });

// Acepta el formato actual y el anterior (un solo plan, que pasa a Ingeniería Eléctrica).
export function normalizar(d) {
  if (!d || typeof d !== 'object') return null;
  if (d.carreras && typeof d.carreras === 'object') return { ...defecto, ...d };
  if (Array.isArray(d.aprobados)) {
    return {
      ...defecto, nombre: d.nombre || '', foto: d.foto || '', cita: d.cita || '', carrera: 'ingenieria-electrica',
      carreras: { 'ingenieria-electrica': { enfasis: d.enfasis || 'computadoras-y-redes', aprobados: d.aprobados, optativas: d.optativas || {} } },
    };
  }
  return null;
}

const leer = (clave) => { try { return normalizar(JSON.parse(localStorage.getItem(clave) || 'null')); } catch { return null; } };
export const cargar = () => leer(CLAVE) ?? leer(VIEJA) ?? { ...defecto };
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
  const d = normalizar(JSON.parse(await archivo.text()));
  if (!d) throw new Error('Archivo inválido');
  return d;
}
