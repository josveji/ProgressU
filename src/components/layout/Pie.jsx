import { LINKEDIN, GITHUB, PIE } from '../../textos/es';

const enlace = 'font-bold underline underline-offset-2 hover:text-neutral-600';

export default function Pie() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-5 text-sm sm:px-6">
        <p>© {new Date().getFullYear()} {PIE.autor} · {PIE.derechos}</p>
        <nav aria-label="Enlaces del autor" className="flex gap-4">
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className={enlace}>{PIE.linkedin}</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className={enlace}>{PIE.github}</a>
        </nav>
      </div>
    </footer>
  );
}
