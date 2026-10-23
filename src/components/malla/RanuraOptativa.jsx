import TarjetaCurso from './TarjetaCurso';
import { T } from '../../textos/es';

export default function RanuraOptativa({ curso, plan, elegidas, onElegir, ...resto }) {
  const opciones = plan.optativas[curso.optativa];
  const usadas = new Set(Object.entries(elegidas).filter(([r]) => r !== curso.codigo).map(([, c]) => c));
  return (
    <TarjetaCurso curso={curso} {...resto}>
      <select aria-label={`Curso para ${curso.nombre}`} value={elegidas[curso.codigo] ?? ''} onChange={(ev) => onElegir(curso.codigo, ev.target.value)} className="mt-1 w-full rounded-md border border-neutral-300 bg-white px-1.5 py-1 text-xs">
        <option value="">{T.elegirOptativa}</option>
        {opciones.map((o) => <option key={o.codigo} value={o.codigo} disabled={usadas.has(o.codigo)}>{o.codigo} · {o.nombre}</option>)}
      </select>
    </TarjetaCurso>
  );
}
