import { useState, useEffect, useMemo } from 'react';
import { carreras, planes } from '../data';
import { resolverPlan, calcularEstados } from '../logic/disponibilidad';
import { resumen } from '../logic/creditos';
import { cargar, guardar, progresoVacio } from '../logic/almacenamiento';

export default function useProgreso() {
  const [e, setE] = useState(cargar);
  useEffect(() => guardar(e), [e]);

  const carrera = carreras[e.carrera] ?? null;
  const prog = carrera ? e.carreras[carrera.id] ?? progresoVacio(carrera.planes[0].id) : null;
  const plan = carrera ? carrera.planes.find((x) => x.id === prog.enfasis) ?? carrera.planes[0] : null;
  const aprobados = useMemo(() => new Set(prog?.aprobados ?? []), [prog?.aprobados]);
  const cursos = useMemo(() => (plan ? resolverPlan(plan, prog.optativas ?? {}) : []), [plan, prog?.optativas]);
  const { estados, porCodigo } = useMemo(() => calcularEstados(cursos, aprobados), [cursos, aprobados]);
  const res = useMemo(() => resumen(cursos, aprobados, plan?.creditosTotales ?? 0), [cursos, aprobados, plan]);

  // Un plan con planBase usa requisitos de cursos del plan base: se necesitan sus nombres para mostrarlos.
  const base = plan?.planBase ? planes[plan.planBase] : null;
  const todosPorCodigo = useMemo(() => {
    const deBase = base ? Object.fromEntries(resolverPlan(base, prog.optativas ?? {}).map((c) => [c.codigo, c])) : {};
    return { ...deBase, ...porCodigo };
  }, [base, prog?.optativas, porCodigo]);

  // Datos globales: nombre, foto y cita.
  const cambiar = (patch) => setE((p) => ({ ...p, ...patch }));
  // Progreso de la carrera activa.
  const actualizar = (fn) => setE((p) => {
    const c = carreras[p.carrera];
    if (!c) return p;
    const actual = p.carreras[c.id] ?? progresoVacio(c.planes[0].id);
    return { ...p, carreras: { ...p.carreras, [c.id]: fn(actual) } };
  });
  const cambiarProg = (patch) => actualizar((a) => ({ ...a, ...patch }));
  const alternar = (cod) => actualizar((a) => {
    const s = new Set(a.aprobados);
    s.has(cod) ? s.delete(cod) : s.add(cod);
    return { ...a, aprobados: [...s] };
  });
  const elegirOptativa = (ranura, cod) => actualizar((a) => {
    const optativas = { ...(a.optativas ?? {}) };
    cod ? (optativas[ranura] = cod) : delete optativas[ranura];
    return { ...a, optativas, aprobados: a.aprobados.filter((x) => x !== ranura) };
  });
  const elegirCarrera = (id) => setE((p) => ({
    ...p, carrera: id,
    carreras: p.carreras[id] ? p.carreras : { ...p.carreras, [id]: progresoVacio(carreras[id].planes[0].id) },
  }));

  return { e, carrera, prog, plan, cursos, estados, porCodigo: todosPorCodigo, aprobados, res, cambiar, cambiarProg, alternar, elegirOptativa, elegirCarrera, reemplazar: setE };
}
