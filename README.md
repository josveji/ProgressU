# ProgressU

Seguimiento visual del avance en el plan de estudios. Marca los cursos aprobados y la malla muestra cuáles están disponibles (amarillo) o bloqueados (gris). Sin backend: el progreso se guarda en `localStorage`.

## Desarrollo

```bash
npm install
npm run dev        # servidor local
npm run validar    # revisa los JSON de datos (requisitos, créditos, ciclos)
npm run build      # valida y compila a dist/
```

## Estructura

- `src/data/`: planes de estudio en JSON (detectados automáticamente).
- `src/logic/`: cálculo de estados, créditos y almacenamiento (sin React).
- `src/hooks/useProgreso.js`: conecta la lógica con la interfaz.
- `src/components/` y `src/pages/`: interfaz.
- `src/textos/es.js`: todos los textos en español.

## Agregar una carrera, un énfasis o un plan

1. Crea `src/data/<id>.json` con el mismo formato que los existentes. El `id` debe coincidir con el nombre del archivo.
2. Incluye `carreraId` y `carrera` (los planes con el mismo `carreraId` se agrupan en una carrera) y `enfasis` (el nombre que aparece en el selector).
3. Opcional: `etiquetaSelector` cambia la palabra del selector (por ejemplo "Plan" en vez de "Énfasis").
   También es opcional `"porDefecto": true`, que hace que ese plan sea el primero y el que se abre al elegir la carrera.
4. Ejecuta `npm run validar`. No hay que registrar nada más: la app detecta el archivo sola.

El progreso se guarda por carrera. Dentro de una carrera, los cursos con el mismo código se comparten entre sus énfasis o planes. Los códigos de las ranuras de optativa deben ser únicos por plan.

## Despliegue en GitHub Pages

1. Sube el proyecto a `josveji/ProgressU` (rama `main`).
2. En **Settings → Pages**, elige **GitHub Actions** como fuente.
3. Cada `push` a `main` compila y publica en `https://josveji.github.io/ProgressU/`.

`base: '/ProgressU/'` en `vite.config.js` debe coincidir con el nombre del repositorio.

## Pendiente

- Los códigos de Actividad Deportiva (`EF-`) y Curso de Arte (`EG-`) aparecen incompletos en el PDF del plan. Corrígelos en `src/data/computadoras-y-redes.json`.
- El progreso solo vive en el navegador: usa **Exportar progreso** para respaldarlo.
