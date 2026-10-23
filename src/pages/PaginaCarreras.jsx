import { useNavigate } from 'react-router-dom';
import { listaCarreras } from '../data';
import { avanceCarrera } from '../logic/carreras';
import { T } from '../textos/es';

export default function PaginaCarreras({ p }) {
  const navigate = useNavigate();
  const elegir = (id) => { p.elegirCarrera(id); navigate('/'); };
  return (
    <section>
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{T.carreras.titulo}</h1>
      <p className="mt-1 text-sm text-neutral-600">{T.carreras.texto}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listaCarreras.map((c) => {
          const av = avanceCarrera(c, p.e);
          const actual = p.e.carrera === c.id;
          return (
            <button key={c.id} onClick={() => elegir(c.id)} className={`flex flex-col gap-2 rounded-2xl border-[3px] bg-white p-5 text-left transition-shadow hover:shadow-md ${actual ? 'border-tinta' : 'border-bloqueado'}`}>
              <h2 className="text-lg font-extrabold leading-tight">{c.nombre}</h2>
              {c.planes.length > 1 && <p className="text-xs text-neutral-600">{T.carreras.opciones(c.planes.length)}</p>}
              {actual && <p className="text-xs font-bold">{T.carreras.actual}</p>}
              {av && (
                <div className="mt-1">
                  <div role="progressbar" aria-valuenow={av.porcentaje} aria-valuemin={0} aria-valuemax={100} aria-label={`Avance en ${c.nombre}`} className="h-2.5 overflow-hidden rounded-full bg-bloqueado/70">
                    <div className="h-full rounded-full bg-aprobado" style={{ width: `${av.porcentaje}%` }} />
                  </div>
                  <p className="mt-1 text-xs font-semibold">{T.carreras.avance(av.porcentaje, av.aprobados, av.total)}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
