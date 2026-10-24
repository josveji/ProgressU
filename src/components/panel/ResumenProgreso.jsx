import SelectorEnfasis from './SelectorEnfasis';
import CitaMotivacional from './CitaMotivacional';
import { T } from '../../textos/es';

export default function ResumenProgreso({ carrera, plan, res, cita, onEnfasis, onCita }) {
  return (
    <section className="space-y-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{plan.carrera}</h1>
        <div className="mt-2"><SelectorEnfasis planes={carrera.planes} valor={plan.id} etiqueta={carrera.planes.find((x) => x.etiquetaSelector)?.etiquetaSelector} onChange={onEnfasis} /></div>
      </div>
      <div className="flex max-w-xl items-center gap-3">
        <div role="progressbar" aria-valuenow={res.porcentaje} aria-valuemin={0} aria-valuemax={100} aria-label="Avance general" className="h-4 flex-1 overflow-hidden rounded-full bg-bloqueado/70">
          <div className="h-full rounded-full bg-aprobado transition-[width] duration-500" style={{ width: `${res.porcentaje}%` }} />
        </div>
        <span className="w-12 text-sm font-bold">{res.porcentaje}%</span>
      </div>
      <p className="text-sm"><b>{T.creditosAprobados}:</b> {res.aprobados}</p>
      <p className="text-sm"><b>{T.creditosTotales}:</b> {res.total}</p>
      <CitaMotivacional valor={cita} onChange={onCita} />
    </section>
  );
}
