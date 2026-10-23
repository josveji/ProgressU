import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import useProgreso from './hooks/useProgreso';
import { bienvenidaVista, marcarBienvenida } from './logic/almacenamiento';
import Encabezado from './components/layout/Encabezado';
import Pie from './components/layout/Pie';
import VentanaBienvenida from './components/bienvenida/VentanaBienvenida';
import PaginaMalla from './pages/PaginaMalla';
import PaginaCarreras from './pages/PaginaCarreras';
import { T } from './textos/es';

export default function App() {
  const p = useProgreso();
  const [bienvenida, setBienvenida] = useState(() => !bienvenidaVista());
  const cerrar = () => { marcarBienvenida(); setBienvenida(false); };

  return (
    <HashRouter>
      <Encabezado nombre={p.e.nombre} foto={p.e.foto} onNombre={(nombre) => p.cambiar({ nombre })} onFoto={(foto) => p.cambiar({ foto })} onInfo={() => setBienvenida(true)} />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        <Routes>
          <Route path="/" element={p.plan ? <PaginaMalla p={p} /> : <Navigate to="/carreras" replace />} />
          <Route path="/carreras" element={<PaginaCarreras p={p} />} />
          <Route path="/proximamente" element={<div className="py-20 text-center"><h1 className="text-2xl font-extrabold">{T.proximamente}</h1><p className="mt-2 text-neutral-600">{T.proximamenteTexto}</p></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Pie />
      {bienvenida && <VentanaBienvenida onCerrar={cerrar} />}
    </HashRouter>
  );
}
