export function resumen(cursos, aprobados, total) {
  const ap = cursos.filter((c) => aprobados.has(c.codigo)).reduce((s, c) => s + c.creditos, 0);
  return { aprobados: ap, total, porcentaje: total ? Math.min(100, Math.round((ap / total) * 100)) : 0 };
}

export function estadoHito(h, creditosAprobados, aprobados) {
  const faltan = Math.max(0, h.creditosMinimos - creditosAprobados);
  const faltanReq = (h.requisitos || []).filter((r) => !aprobados.has(r));
  return { habilitado: faltan === 0 && faltanReq.length === 0, faltan, faltanReq };
}
