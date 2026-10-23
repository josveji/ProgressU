import { T } from '../../textos/es';

export default function HitoCreditos({ hito, estado }) {
  return (
    <div className={`col-span-full flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-dashed px-4 py-2.5 text-sm ${estado.habilitado ? 'border-aprobado bg-white' : 'border-bloqueado bg-white/60'}`}>
      <div><p className="font-bold">{hito.nombre}</p><p className="text-xs text-neutral-600">{hito.detalle}</p></div>
      <p className="text-xs font-bold">{estado.habilitado ? T.hitoListo : [estado.faltan > 0 && T.faltanCreditos(estado.faltan), ...estado.faltanReq].filter(Boolean).join(' · ')}</p>
    </div>
  );
}
