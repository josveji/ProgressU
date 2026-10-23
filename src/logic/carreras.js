import { resolverPlan } from './disponibilidad';
import { resumen } from './creditos';

// Avance de una carrera según lo guardado; null si aún no tiene cursos aprobados.
export function avanceCarrera(carrera, estado) {
  const prog = estado.carreras[carrera.id];
  if (!prog) return null;
  const plan = carrera.planes.find((p) => p.id === prog.enfasis) ?? carrera.planes[0];
  const r = resumen(resolverPlan(plan, prog.optativas ?? {}), new Set(prog.aprobados), plan.creditosTotales);
  return r.aprobados > 0 ? r : null;
}
