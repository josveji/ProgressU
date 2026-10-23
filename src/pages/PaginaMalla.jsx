import { useState, useRef } from 'react';
import ResumenProgreso from '../components/panel/ResumenProgreso';
import SeccionSemestre from '../components/malla/SeccionSemestre';
import TarjetaCurso from '../components/malla/TarjetaCurso';
import RanuraOptativa from '../components/malla/RanuraOptativa';
import HitoCreditos from '../components/malla/HitoCreditos';
import { estadoHito } from '../logic/creditos';
import { exportar, importar } from '../logic/almacenamiento';
import { T } from '../textos/es';

export default function PaginaMalla({ p }) {
  const { e, plan, cursos, estados, porCodigo, aprobados, res } = p;
  const archivo = useRef();
  // Abre por defecto el primer semestre con cursos pendientes.
  const [abiertos, setAbiertos] = useState(() => {
    const pendiente = plan.semestres.find((s) => s.cursos.some((c) => !aprobados.has(c.codigo)));
    return new Set([pendiente?.numero ?? 1]);
  });
  const alternarSem = (n) => setAbiertos((a) => { const s = new Set(a); s.has(n) ? s.delete(n) : s.add(n); return s; });

  const alImportar = async (ev) => {
    const f = ev.target.files?.[0];
    ev.target.value = '';
    if (!f) return;
    try { p.reemplazar(await importar(f)); } catch { alert(T.importarError); }
  };

  return (
    <>
      <ResumenProgreso plan={plan} res={res} enfasisId={e.enfasis} cita={e.cita} onEnfasis={(enfasis) => p.cambiar({ enfasis })} onCita={(cita) => p.cambiar({ cita })} />
      {plan.semestres.map((s) => {
        const hechos = s.cursos.filter((c) => aprobados.has(c.codigo)).length;
        return (
          <SeccionSemestre key={s.numero} numero={s.numero} abierto={abiertos.has(s.numero)} onToggle={() => alternarSem(s.numero)} resumen={`${hechos}/${s.cursos.length}`}>
            {s.cursos.map((c) => {
              const curso = cursos.find((x) => x.codigo === c.codigo);
              const props = { curso, estado: estados[c.codigo], onToggle: () => p.alternar(c.codigo), porCodigo, aprobados };
              return c.optativa
                ? <RanuraOptativa key={c.codigo} plan={plan} elegidas={e.optativas} onElegir={p.elegirOptativa} {...props} />
                : <TarjetaCurso key={c.codigo} {...props} />;
            })}
            {plan.hitos.filter((h) => h.despuesDeSemestre === s.numero).map((h) => <HitoCreditos key={h.id} hito={h} estado={estadoHito(h, res.aprobados, aprobados)} />)}
          </SeccionSemestre>
        );
      })}
      <div className="mt-10 flex flex-wrap gap-3">
        <button onClick={() => exportar(e)} className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-neutral-100">{T.exportar}</button>
        <button onClick={() => archivo.current.click()} className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-neutral-100">{T.importar}</button>
        <input ref={archivo} type="file" accept="application/json" hidden onChange={alImportar} />
      </div>
    </>
  );
}
