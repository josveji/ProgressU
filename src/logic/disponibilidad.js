// Sustituye cada ranura de optativa por el curso elegido (o la deja "sin elegir").
export function resolverPlan(plan, elegidas) {
  return plan.semestres.flatMap((s) =>
    s.cursos.map((c) => {
      if (!c.optativa) return { ...c, semestre: s.numero };
      const op = plan.optativas[c.optativa].find((o) => o.codigo === elegidas[c.codigo]);
      return { ...c, semestre: s.numero, elegido: op || null, requisitos: op ? op.requisitos : [], correquisitos: [] };
    })
  );
}

// Estados: aprobado | disponible | bloqueado | sinElegir
// Un correquisito se cumple si está aprobado o si ya se podría llevar en el mismo ciclo.
export function calcularEstados(cursos, aprobados) {
  const porCodigo = Object.fromEntries(cursos.map((c) => [c.codigo, c]));
  const reqOk = (c) => c.requisitos.every((r) => aprobados.has(r));
  const estados = {};
  for (const c of cursos) {
    if (c.optativa && !c.elegido) estados[c.codigo] = 'sinElegir';
    else if (aprobados.has(c.codigo)) estados[c.codigo] = 'aprobado';
    else {
      const coOk = c.correquisitos.every((k) => aprobados.has(k) || !porCodigo[k] || reqOk(porCodigo[k]));
      estados[c.codigo] = reqOk(c) && coOk ? 'disponible' : 'bloqueado';
    }
  }
  return { estados, porCodigo };
}
