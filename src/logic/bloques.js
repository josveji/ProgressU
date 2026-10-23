import { calcularEstados } from './disponibilidad';
import { T } from '../textos/es';

// Aprueba los cursos de los semestres indicados que cumplan requisitos.
// Repite hasta que no haya más cambios, así los correquisitos y las dependencias
// dentro del bloque (o entre semestres seguidos) se aprueban en cascada.
export function aprobarBloque(cursos, aprobados, semestres) {
  const del = cursos.filter((c) => semestres.includes(c.semestre));
  const sinElegir = del.filter((c) => c.optativa && !c.elegido);
  const objetivo = del.filter((c) => !(c.optativa && !c.elegido));
  const nuevos = new Set(aprobados);
  for (let cambio = true; cambio; ) {
    cambio = false;
    const { estados } = calcularEstados(cursos, nuevos);
    for (const c of objetivo) {
      if (estados[c.codigo] === 'disponible') { nuevos.add(c.codigo); cambio = true; }
    }
  }
  const omitidos = objetivo
    .filter((c) => !nuevos.has(c.codigo))
    .map((c) => ({ codigo: c.codigo, faltan: [...c.requisitos, ...c.correquisitos].filter((k) => !nuevos.has(k)) }));
  const agregados = [...nuevos].filter((c) => !aprobados.has(c)).length;
  return { aprobados: nuevos, agregados, omitidos, sinElegir };
}

export function mensajeBloque(r) {
  const B = T.bloques;
  const partes = [];
  if (r.agregados) partes.push(B.aprobados(r.agregados));
  if (r.omitidos.length) {
    const lista = r.omitidos.slice(0, 6).map((o) => `${o.codigo} (${B.falta} ${o.faltan.join(', ')})`).join('; ');
    const mas = r.omitidos.length > 6 ? ` ${B.yMas(r.omitidos.length - 6)}` : '';
    partes.push(`${B.noAprobados}: ${lista}${mas}.`);
  }
  if (r.sinElegir.length) partes.push(B.sinElegir);
  return partes.length ? partes.join(' ') : B.ya;
}
