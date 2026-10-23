import { useEffect } from 'react';
import { T } from '../../textos/es';

export default function AvisoBloque({ aviso, onCerrar }) {
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(onCerrar, 12000);
    return () => clearTimeout(t);
  }, [aviso]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!aviso) return null;
  return (
    <div role="status" className={`fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border-2 bg-white p-3 pr-9 text-sm shadow-lg ${aviso.ok ? 'border-aprobado' : 'border-disponible'}`}>
      {aviso.texto}
      <button onClick={onCerrar} aria-label={T.bloques.cerrar} className="absolute right-2 top-1.5 rounded px-1.5 text-lg leading-none text-neutral-500 hover:bg-neutral-100">×</button>
    </div>
  );
}
