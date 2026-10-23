import { T } from '../../textos/es';

export default function SelectorEnfasis({ planes, valor, etiqueta, onChange }) {
  if (planes.length < 2) return null;
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="font-semibold">{etiqueta ?? T.enfasis}:</span>
      <select value={valor} onChange={(ev) => onChange(ev.target.value)} className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-sm font-semibold">
        {planes.map((x) => <option key={x.id} value={x.id}>{x.enfasis}</option>)}
      </select>
    </label>
  );
}
