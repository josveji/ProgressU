import { useState, useEffect, useMemo } from 'react';
import { planes, enfasis } from '../data';
import { resolverPlan, calcularEstados } from '../logic/disponibilidad';
import { resumen } from '../logic/creditos';
import { cargar, guardar } from '../logic/almacenamiento';

export default function useProgreso() {
  const [e, setE] = useState(cargar);
  useEffect(() => guardar(e), [e]);

  const plan = planes[e.enfasis] ?? planes[enfasis[0].id];
  const aprobados = useMemo(() => new Set(e.aprobados), [e.aprobados]);
  const cursos = useMemo(() => resolverPlan(plan, e.optativas), [plan, e.optativas]);
  const { estados, porCodigo } = useMemo(() => calcularEstados(cursos, aprobados), [cursos, aprobados]);
  const res = useMemo(() => resumen(cursos, aprobados, plan.creditosTotales), [cursos, aprobados, plan]);

  const cambiar = (patch) => setE((p) => ({ ...p, ...patch }));
  const alternar = (cod) => setE((p) => {
    const s = new Set(p.aprobados);
    s.has(cod) ? s.delete(cod) : s.add(cod);
    return { ...p, aprobados: [...s] };
  });
  const elegirOptativa = (ranura, cod) => setE((p) => {
    const optativas = { ...p.optativas };
    cod ? (optativas[ranura] = cod) : delete optativas[ranura];
    return { ...p, optativas, aprobados: p.aprobados.filter((a) => a !== ranura) };
  });

  return { e, plan, cursos, estados, porCodigo, aprobados, res, cambiar, alternar, elegirOptativa, reemplazar: setE };
}
