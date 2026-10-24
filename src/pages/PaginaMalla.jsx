import { useState, useRef } from 'react';
import { planes } from '../data';
import ResumenProgreso from '../components/panel/ResumenProgreso';
import SeccionSemestre from '../components/malla/SeccionSemestre';
import TarjetaCurso from '../components/malla/TarjetaCurso';
import RanuraOptativa from '../components/malla/RanuraOptativa';
import HitoCreditos from '../components/malla/HitoCreditos';
import AvisoBloque from '../components/malla/AvisoBloque';
import { estadoHito } from '../logic/creditos';
import { aprobarBloque, mensajeBloque } from '../logic/bloques';
import { exportar, importar } from '../logic/almacenamiento';
import { T, ROMANOS } from '../textos/es';

const boton = 'rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-neutral-100';

export default function PaginaMalla({ p }) {
  const { e, prog, carrera, plan, cursos, estados, porCodigo, aprobados, res } = p;
  const B = T.bloques;
  const archivo = useRef();
  // Abre por defecto el primer semestre con cursos pendientes.
  const [abiertos, setAbiertos] = useState(() => {
    const pendiente = plan.semestres.find((s) => s.cursos.some((c) => !aprobados.has(c.codigo)));
    return new Set([pendiente?.numero ?? plan.semestres[0].numero]);
  });
  const [hasta, setHasta] = useState(plan.semestres[0].numero);
  const [aviso, setAviso] = useState(null);
  const alternarSem = (n) => setAbiertos((a) => { const s = new Set(a); s.has(n) ? s.delete(n) : s.add(n); return s; });

  const aprobarSemestres = (nums) => {
    const r = aprobarBloque(cursos, aprobados, nums);
    p.cambiarProg({ aprobados: [...r.aprobados] });
    setAviso({ texto: mensajeBloque(r), ok: !r.omitidos.length && !r.sinElegir.length });
  };
  const quitarSemestre = (n) => {
    const codigos = new Set(cursos.filter((c) => c.semestre === n).map((c) => c.codigo));
    p.cambiarProg({ aprobados: prog.aprobados.filter((a) => !codigos.has(a)) });
    setAviso(null);
  };

  const alImportar = async (ev) => {
    const f = ev.target.files?.[0];
    ev.target.value = '';
    if (!f) return;
    try { p.reemplazar(await importar(f)); } catch { alert(T.importarError); }
  };

  return (
    <>
      <ResumenProgreso carrera={carrera} plan={plan} res={res} cita={e.cita} onEnfasis={(enfasis) => p.cambiarProg({ enfasis })} onCita={(cita) => p.cambiar({ cita })} />

      {plan.planBase && planes[plan.planBase] && (
        <div className="mt-4 flex max-w-xl flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm">
          <p>{T.planBase.texto(planes[plan.planBase].enfasis)}</p>
          <button onClick={() => p.cambiarProg({ enfasis: plan.planBase })} className={boton}>{T.planBase.ir(planes[plan.planBase].enfasis)}</button>
        </div>
      )}

      <section aria-labelledby="rapida-titulo" className="mt-6 max-w-xl rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 id="rapida-titulo" className="text-sm font-extrabold">{B.rapidaTitulo}</h2>
        <p className="mt-0.5 text-xs text-neutral-600">{B.rapidaTexto}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{B.hasta}</span>
            <select value={hasta} onChange={(ev) => setHasta(Number(ev.target.value))} className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm font-semibold">
              {plan.semestres.map((s) => <option key={s.numero} value={s.numero}>{ROMANOS[s.numero - 1]}</option>)}
            </select>
          </label>
          <button onClick={() => aprobarSemestres(plan.semestres.filter((s) => s.numero <= hasta).map((s) => s.numero))} className="rounded-lg bg-tinta px-3 py-1.5 text-sm font-bold text-white">{B.aprobarHasta}</button>
        </div>
      </section>

      {plan.semestres.map((s) => {
        const hechos = s.cursos.filter((c) => aprobados.has(c.codigo)).length;
        const reales = cursos.filter((c) => c.semestre === s.numero && !(c.optativa && !c.elegido));
        const completo = reales.length > 0 && reales.every((c) => aprobados.has(c.codigo));
        const accion = completo
          ? { texto: B.quitarSemestre, onClick: () => quitarSemestre(s.numero) }
          : { texto: B.aprobarSemestre, onClick: () => aprobarSemestres([s.numero]) };
        return (
          <SeccionSemestre key={s.numero} numero={s.numero} abierto={abiertos.has(s.numero)} onToggle={() => alternarSem(s.numero)} resumen={`${hechos}/${s.cursos.length}`} accion={accion}>
            {s.cursos.map((c) => {
              const curso = cursos.find((x) => x.codigo === c.codigo);
              const props = { curso, estado: estados[c.codigo], onToggle: () => p.alternar(c.codigo), porCodigo, aprobados };
              return c.optativa
                ? <RanuraOptativa key={c.codigo} plan={plan} elegidas={prog.optativas ?? {}} onElegir={p.elegirOptativa} {...props} />
                : <TarjetaCurso key={c.codigo} {...props} />;
            })}
            {plan.hitos.filter((h) => h.despuesDeSemestre === s.numero).map((h) => <HitoCreditos key={h.id} hito={h} estado={estadoHito(h, res.aprobados, aprobados)} />)}
          </SeccionSemestre>
        );
      })}

      <div className="mt-10 flex flex-wrap gap-3">
        <button onClick={() => exportar(e)} className={boton}>{T.exportar}</button>
        <button onClick={() => archivo.current.click()} className={boton}>{T.importar}</button>
        <input ref={archivo} type="file" accept="application/json" hidden onChange={alImportar} />
      </div>
      <AvisoBloque aviso={aviso} onCerrar={() => setAviso(null)} />
    </>
  );
}
