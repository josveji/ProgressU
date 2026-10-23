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

- `src/data/`: planes de estudio en JSON (`enfasis.json` alimenta el selector).
- `src/logic/`: cálculo de estados, créditos y almacenamiento (sin React).
- `src/hooks/useProgreso.js`: conecta la lógica con la interfaz.
- `src/components/` y `src/pages/`: interfaz.
- `src/textos/es.js`: todos los textos en español.

## Agregar un énfasis

1. Crea `src/data/<id>.json` con el mismo formato que `computadoras-y-redes.json`.
2. Regístralo en `src/data/enfasis.json` y en `src/data/index.js`.
3. Ejecuta `npm run validar` para detectar errores de transcripción.

El progreso se guarda por código de curso: los cursos compartidos entre énfasis siguen aprobados al cambiar de uno a otro.

## Despliegue en GitHub Pages

1. Sube el proyecto a `josveji/ProgressU` (rama `main`).
2. En **Settings → Pages**, elige **GitHub Actions** como fuente.
3. Cada `push` a `main` compila y publica en `https://josveji.github.io/ProgressU/`.

`base: '/ProgressU/'` en `vite.config.js` debe coincidir con el nombre del repositorio.

## Pendiente

- Los códigos de Actividad Deportiva (`EF-`) y Curso de Arte (`EG-`) aparecen incompletos en el PDF del plan. Corrígelos en `src/data/computadoras-y-redes.json`.
- El progreso solo vive en el navegador: usa **Exportar progreso** para respaldarlo.
