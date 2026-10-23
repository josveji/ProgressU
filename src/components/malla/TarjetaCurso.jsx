import MenuRequisitos from './MenuRequisitos';
import { T } from '../../textos/es';

const BORDE = { aprobado: 'border-aprobado', disponible: 'border-disponible', bloqueado: 'border-bloqueado', sinElegir: 'border-bloqueado border-dashed' };

export default function TarjetaCurso({ curso, estado, onToggle, porCodigo, aprobados, children }) {
  const bloqueado = estado === 'bloqueado' || estado === 'sinElegir';
  const codigo = curso.optativa ? curso.elegido?.codigo ?? '—' : curso.codigo;
  return (
    <article className={`flex flex-col gap-1 rounded-2xl border-[3px] bg-white p-3.5 ${BORDE[estado]}`}>
      <div className="flex items-start justify-between gap-1">
        <h3 className="text-[15px] font-bold leading-tight">{curso.nombre}</h3>
        <MenuRequisitos curso={curso} porCodigo={porCodigo} aprobados={aprobados} />
      </div>
      {children}
      <p className="text-xs"><b>{T.codigo}:</b> {codigo}</p>
      <p className="text-xs"><b>{T.creditos}:</b> {curso.creditos}</p>
      <div className="mt-2 flex items-center justify-between">
        <button role="switch" aria-checked={estado === 'aprobado'} aria-label={`Aprobado: ${curso.nombre}`} disabled={bloqueado} title={bloqueado ? T.faltanRequisitos : undefined} onClick={onToggle}
          className={`relative h-5 w-9 rounded-full transition-colors disabled:cursor-not-allowed ${estado === 'aprobado' ? 'bg-aprobado' : 'bg-neutral-300'}`}>
          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-[left] ${estado === 'aprobado' ? 'left-[18px]' : 'left-0.5'}`} />
        </button>
        <span className="text-[11px] font-semibold text-neutral-600">{T.estados[estado]}</span>
      </div>
    </article>
  );
}
