import { T } from '../../textos/es';

export default function CitaMotivacional({ valor, onChange }) {
  return <input value={valor} onChange={(ev) => onChange(ev.target.value)} placeholder={T.cita} aria-label={T.cita} maxLength={140} className="w-full max-w-xl rounded-md bg-transparent px-1 py-0.5 text-sm italic placeholder:text-neutral-500 hover:bg-white" />;
}
