// Para agregar un énfasis: crea su JSON, impórtalo aquí y regístralo en enfasis.json.
import lista from './enfasis.json';
import computadorasYRedes from './computadoras-y-redes.json';
import electronicaYTelecomunicaciones from './electronica-y-telecomunicaciones.json';
import sistemasDeEnergia from './sistemas-de-energia.json';

export const enfasis = lista;
export const planes = {
  'computadoras-y-redes': computadorasYRedes,
  'electronica-y-telecomunicaciones': electronicaYTelecomunicaciones,
  'sistemas-de-energia': sistemasDeEnergia,
};
