import { useRef } from 'react';
import BarraNavegacion from './BarraNavegacion';
import { T } from '../../textos/es';

export default function Encabezado({ nombre, foto, onNombre, onFoto, onInfo }) {
  const input = useRef();
  const iniciales = (nombre || '?').split(/\s+/).map((x) => x[0]).slice(0, 2).join('').toUpperCase();

  const subir = (ev) => {
    const f = ev.target.files?.[0];
    if (!f) return;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 96;
      const s = Math.min(img.width, img.height);
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 96, 96);
      onFoto(c.toDataURL('image/jpeg', 0.8));
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(f);
  };

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="h-9 w-9" />
          <span className="text-lg font-extrabold tracking-tight">{T.app}</span>
          <button onClick={onInfo} aria-label={T.info} title={T.info} className="ml-1 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-xs font-bold text-neutral-600 hover:bg-neutral-100">i</button>
        </div>
        <div className="order-3 w-full sm:order-none sm:w-auto"><BarraNavegacion /></div>
        <div className="flex items-center gap-2.5">
          <input value={nombre} onChange={(ev) => onNombre(ev.target.value)} placeholder={T.nombrePlaceholder} aria-label={T.nombrePlaceholder} className="w-36 rounded-md bg-transparent px-1 py-0.5 text-right text-sm font-bold placeholder:font-normal hover:bg-neutral-100 sm:w-44" />
          <button onClick={() => input.current.click()} aria-label={T.cambiarFoto} title={T.cambiarFoto} className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-tinta text-sm font-bold text-white">
            {foto ? <img src={foto} alt="" className="h-full w-full object-cover" /> : iniciales}
          </button>
          <input ref={input} type="file" accept="image/*" hidden onChange={subir} />
        </div>
      </div>
    </header>
  );
}
