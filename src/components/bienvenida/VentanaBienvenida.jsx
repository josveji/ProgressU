import { useEffect, useRef } from 'react';
import { T, LINKEDIN } from '../../textos/es';

export default function VentanaBienvenida({ onCerrar }) {
  const boton = useRef();
  const t = T.bienvenida;

  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    boton.current?.focus();
    const tecla = (ev) => {
      if (ev.key === 'Escape') onCerrar();
      if (ev.key === 'Tab') { // el foco se queda dentro de la ventana
        const f = [...document.querySelectorAll('[data-modal] a, [data-modal] button')];
        const i = f.indexOf(document.activeElement);
        if (ev.shiftKey && i <= 0) { ev.preventDefault(); f.at(-1).focus(); }
        else if (!ev.shiftKey && i === f.length - 1) { ev.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener('keydown', tecla);
    return () => { document.body.style.overflow = previo; document.removeEventListener('keydown', tecla); };
  }, [onCerrar]);

  return (
    <div onMouseDown={(ev) => ev.target === ev.currentTarget && onCerrar()} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-md">
      <div data-modal role="dialog" aria-modal="true" aria-labelledby="bienvenida-titulo" className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="bienvenida-titulo" className="text-2xl font-extrabold tracking-tight">{t.titulo}</h2>
        <p className="mt-3 text-sm leading-relaxed">{t.texto}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">{t.puntos.map((x) => <li key={x}>{x}</li>)}</ul>
        <p className="mt-3 text-xs text-neutral-600">{t.aviso}</p>
        <p className="mt-4 text-sm">{t.creado} · <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="font-bold underline">{t.linkedin}</a></p>
        <button ref={boton} onClick={onCerrar} className="mt-5 w-full rounded-xl bg-tinta py-2.5 text-sm font-bold text-white">{t.boton}</button>
      </div>
    </div>
  );
}
