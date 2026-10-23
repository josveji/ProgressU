import { T, ROMANOS } from '../../textos/es';

export default function SeccionSemestre({ numero, abierto, onToggle, resumen, accion, children }) {
  const id = `sem-${numero}`;
  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <button onClick={onToggle} aria-expanded={abierto} aria-controls={id} className="flex items-center gap-2 text-lg font-extrabold">
          {T.semestre} {ROMANOS[numero - 1]}
          <span aria-hidden className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 text-sm leading-none">{abierto ? '−' : '+'}</span>
          <span className="text-xs font-semibold text-neutral-500">{resumen}</span>
        </button>
        {accion && <button onClick={accion.onClick} className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-bold hover:bg-neutral-100">{accion.texto}</button>}
      </div>
      {abierto && <div id={id} className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">{children}</div>}
    </section>
  );
}
