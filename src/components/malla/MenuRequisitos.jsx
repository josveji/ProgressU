import { useState, useRef, useEffect } from 'react';
import { T } from '../../textos/es';

export default function MenuRequisitos({ curso, porCodigo, aprobados }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!abierto) return;
    const cerrar = (ev) => { if (ev.type === 'keydown' ? ev.key === 'Escape' : !ref.current?.contains(ev.target)) setAbierto(false); };
    document.addEventListener('mousedown', cerrar);
    document.addEventListener('keydown', cerrar);
    return () => { document.removeEventListener('mousedown', cerrar); document.removeEventListener('keydown', cerrar); };
  }, [abierto]);

  const lista = (titulo, codigos) => codigos.length > 0 && (
    <div className="mt-1.5 first:mt-0">
      <p className="text-xs font-bold">{titulo}</p>
      <ul className="mt-0.5 space-y-0.5">
        {codigos.map((c) => (
          <li key={c} className="flex gap-1.5 text-xs"><span aria-hidden>{aprobados.has(c) ? '✓' : '○'}</span><span><b>{c}</b> {porCodigo[c]?.nombre}</span></li>
        ))}
      </ul>
    </div>
  );
  const vacio = curso.requisitos.length + curso.correquisitos.length === 0;

  return (
    <div ref={ref} className="relative shrink-0">
      <button onClick={() => setAbierto((a) => !a)} aria-expanded={abierto} aria-label={`${T.verRequisitos}: ${curso.nombre}`} className="rounded-md px-1.5 text-lg font-bold leading-none text-neutral-500 hover:bg-neutral-100">···</button>
      {abierto && (
        <div role="dialog" className="absolute right-0 top-7 z-20 w-64 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg">
          {vacio ? <p className="text-xs">{curso.optativa && !curso.elegido ? T.estados.sinElegir : T.sinRequisitos}</p> : <>{lista(T.requisitos, curso.requisitos)}{lista(T.correquisitos, curso.correquisitos)}</>}
        </div>
      )}
    </div>
  );
}
