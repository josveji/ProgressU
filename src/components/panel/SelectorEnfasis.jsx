import { enfasis } from '../../data';
import { T } from '../../textos/es';

export default function SelectorEnfasis({ valor, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="font-semibold">{T.enfasis}:</span>
      <select value={valor} onChange={(ev) => onChange(ev.target.value)} className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-sm font-semibold">
        {enfasis.map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}
      </select>
    </label>
  );
}
