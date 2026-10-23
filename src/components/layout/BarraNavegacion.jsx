import { NavLink } from 'react-router-dom';
import { T } from '../../textos/es';

const enlaces = [{ a: '/', texto: T.plan }, { a: '/carreras', texto: T.cambiarCarrera }, { a: '/proximamente', texto: T.proximamente }];

export default function BarraNavegacion() {
  return (
    <nav aria-label="Secciones" className="flex gap-1">
      {enlaces.map(({ a, texto }) => (
        <NavLink key={a} to={a} end className={({ isActive }) => `border-b-[3px] px-3 py-1.5 text-sm font-bold ${isActive ? 'border-tinta' : 'border-transparent text-neutral-500 hover:text-tinta'}`}>
          {texto}
        </NavLink>
      ))}
    </nav>
  );
}
