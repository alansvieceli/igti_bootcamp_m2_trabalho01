import {
  criarArquivosEstados,
  imprimirCincoEstadosComMaisCidades,
  imprimirCincoEstadosComMenosCidades,
  imprimirMaioresNomesDeCidadePorEstado,
  imprimirMenoresNomesDeCidadePorEstado,
  imprimirMaiorNomeDeCidadeEntreOsEstados,
  imprimirMenorNomeDeCidadeEntreOsEstados,
} from './modules/brasil.js';

const init = async () => {
  await criarArquivosEstados('Estados.json', 'Cidades.json');

  console.log('## UF dos cinco estados que MAIS possuem cidades. ##');
  await imprimirCincoEstadosComMaisCidades();

  console.log('');
  console.log('## UF dos cinco estados que MENOS possuem cidades. ##');
  await imprimirCincoEstadosComMenosCidades();

  console.log('');
  console.log('## Lista de cidades de MAIOR nome de cada estado. ##');
  await imprimirMaioresNomesDeCidadePorEstado();

  console.log('');
  console.log('## Lista de cidades de MENOR nome de cada estado. ##');
  await imprimirMenoresNomesDeCidadePorEstado();

  console.log('');
  console.log('## cidade de MAIOR nome entre todos os estados. ##');
  await imprimirMaiorNomeDeCidadeEntreOsEstados();

  console.log('');
  console.log('## cidade de MENOR nome entre todos os estados. ##');
  await imprimirMenorNomeDeCidadeEntreOsEstados();
};

init();
