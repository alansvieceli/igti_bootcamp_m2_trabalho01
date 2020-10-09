import fs, { promises as fsp } from 'fs';

const PATH_DATA = './data/';
const PATH_DATA_GENERATED = 'generated/';

const ORDER_BY = {
  ASC: 'ASC ',
  DESC: 'DESC',
};

const doOrderAsc = (a, b) => {
  if (a.Nome.length > b.Nome.length) {
    return 1;
  }

  if (a.Nome.length < b.Nome.length) {
    return -1;
  }
  /*
  em caso de empate no tamanho entre várias cidades, você deve considerar a ordem alfabética para
  ordenar as cidades pelo seu nome, e então retornar a primeira cidade.
  */
  if (a.Nome > b.Nome) {
    return 1;
  }
  if (a.Nome < b.Nome) {
    return -1;
  }

  return 0;
};

const doOrderDesc = (a, b) => {
  if (a.Nome.length > b.Nome.length) {
    return -1;
  }

  if (a.Nome.length < b.Nome.length) {
    return 1;
  }
  /*
  em caso de empate no tamanho entre várias cidades, você deve considerar a ordem alfabética para
  ordenar as cidades pelo seu nome, e então retornar a primeira cidade.
  */
  if (a.Nome > b.Nome) {
    return 1;
  }
  if (a.Nome < b.Nome) {
    return -1;
  }

  return 0;
};

const doRemoverArquivosEstados = estados => {
  estados.forEach(obj => {
    const file = `.${PATH_DATA}${PATH_DATA_GENERATED}${obj.Sigla}.json`;
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
};

const doCriarArquivosEstados = (estados, cidades) => {
  estados.forEach(estado => {
    const file = `./data/generated/${estado.Sigla}.json`;
    const filteredCidades = cidades.filter(c => c.Estado === estado.ID);
    const obj = { cidades: filteredCidades };
    fsp.writeFile(file, JSON.stringify(obj));
  });
};

const doTotalCidadesPorEstado = async () => {
  const data = await fsp.readdir(`${PATH_DATA}${PATH_DATA_GENERATED}`);
  const arrayResult = [];
  for (const file of data) {
    const uf = file.substring(0, 2);
    const total = await quantidadeCidadesPorEstado(uf);
    arrayResult.push({ UF: uf, Cidades: total });
  }
  return arrayResult;
};

/*
1. Criar uma função que irá criar um arquivo JSON para cada estado representado no
arquivo Estados.json, e o seu conteúdo será um array das cidades pertencentes a
aquele estado, de acordo com o arquivo Cidades.json. O nome do arquivo deve ser
o UF do estado, por exemplo: MG.json.
*/
export const criarArquivosEstados = async (fileEstados, fileCidades) => {
  try {
    const estados = JSON.parse(
      await fsp.readFile(`${PATH_DATA}${fileEstados}`)
    );
    const cidades = JSON.parse(
      await fsp.readFile(`${PATH_DATA}${fileCidades}`)
    );

    doRemoverArquivosEstados(estados);
    doCriarArquivosEstados(estados, cidades);
  } catch (err) {
    console.log('--- ERRO AO CRIAR ARQUIVOS DOS ESTADOS ---');
    console.log(err);
  }
};

/*
2. Criar uma função que recebe como parâmetro o UF do estado, realize a leitura do
arquivo JSON correspondente e retorne a quantidade de cidades daquele estado.
*/
const quantidadeCidadesPorEstado = async estado => {
  const file = `${PATH_DATA}${PATH_DATA_GENERATED}${estado}.json`;
  if (fs.existsSync(file)) {
    const data = JSON.parse(await fsp.readFile(file));
    return data.cidades.length;
  }
  return 0;
};

const doPrimeiroNomeDaCidade = async (estado, orderBy) => {
  const file = `${PATH_DATA}${PATH_DATA_GENERATED}${estado}.json`;
  if (fs.existsSync(file)) {
    const data = JSON.parse(await fsp.readFile(file));
    data.cidades.sort((a, b) =>
      orderBy === ORDER_BY.DESC ? doOrderDesc(a, b) : doOrderAsc(a, b)
    );
    return data.cidades[0].Nome;
  }
  return '';
};

/*
3. Criar um método que imprima no console um array com o UF dos cinco estados
que mais possuem cidades, seguidos da quantidade, em ordem decrescente. Você
pode usar a função criada no tópico 2. Exemplo de impressão: [“UF - 93”, “UF - 82”,
“UF - 74”, “UF - 72”, “UF - 65”]
*/
export const imprimirCincoEstadosComMaisCidades = async () => {
  const arrayResult = await doTotalCidadesPorEstado();
  //ordenar
  arrayResult.sort((x, y) => y.Cidades - x.Cidades);

  //imprimir somente os 5 com mais quantidade
  const arrayPrint = [];
  for (let i = 0; i < 5; i++) {
    let estado = arrayResult[i];
    arrayPrint.push(`${estado.UF} - ${estado.Cidades}`);
  }
  console.log(arrayPrint);
};

/*
4. Criar um método que imprima no console um array com o UF dos cinco estados
que menos possuem cidades, seguidos da quantidade, em ordem decrescente.
Você pode usar a função criada no tópico 2. Exemplo de impressão: [“UF - 30”, “UF
- 27”, “UF - 25”, “UF - 23”, “UF - 21”]
*/
export const imprimirCincoEstadosComMenosCidades = async () => {
  const arrayResult = await doTotalCidadesPorEstado();
  //ordenar
  arrayResult.sort((x, y) => x.Cidades - y.Cidades);

  //imprimir somente os 5 com menos quantidade
  const arrayPrint = [];
  for (let i = 4; i >= 0; i--) {
    let estado = arrayResult[i];
    arrayPrint.push(`${estado.UF} - ${estado.Cidades}`);
  }
  console.log(arrayPrint);
};

/*
5. Criar um método que imprima no console um array com a cidade de maior nome de
cada estado, seguida de seu UF. Por exemplo: [“Nome da Cidade – UF”, “Nome da
Cidade – UF”, ...].
*/
const doTamanhoNomeDeCidadePorEstado = async orderBy => {
  const data = await fsp.readdir(`${PATH_DATA}${PATH_DATA_GENERATED}`);
  const arrayResult = [];
  for (const file of data) {
    const uf = file.substring(0, 2);
    const cidade = await doPrimeiroNomeDaCidade(uf, orderBy);
    arrayResult.push({ Nome: cidade, UF: uf });
  }
  return arrayResult;
};

export const imprimirMaioresNomesDeCidadePorEstado = async () => {
  const arrayCidades = await doTamanhoNomeDeCidadePorEstado(ORDER_BY.DESC);
  const arrayResult = [];
  arrayCidades.forEach(obj => {
    arrayResult.push(`${obj.Nome} - ${obj.UF}`);
  });
  console.log(arrayResult);
};

/*
6. Criar um método que imprima no console um array com a cidade de menor nome
de cada estado, seguida de seu UF. Por exemplo: [“Nome da Cidade – UF”, “Nome
da Cidade – UF”, ...].
*/

export const imprimirMenoresNomesDeCidadePorEstado = async () => {
  const arrayCidades = await doTamanhoNomeDeCidadePorEstado(ORDER_BY.ASC);
  const arrayResult = [];
  arrayCidades.forEach(obj => {
    arrayResult.push(`${obj.Nome} - ${obj.UF} `);
  });
  console.log(arrayResult);
};

/*
7. Criar um método que imprima no console a cidade de maior nome entre todos os
estados, seguido do seu UF. Exemplo: “Nome da Cidade - UF".
*/
export const imprimirMaiorNomeDeCidadeEntreOsEstados = async () => {
  const arrayCidades = await doTamanhoNomeDeCidadePorEstado(ORDER_BY.DESC);
  const arrayOrdenado = arrayCidades.sort((a, b) => doOrderDesc(a, b));
  console.log(`${arrayOrdenado[0].Nome} - ${arrayOrdenado[0].UF}`);
};

/*
8. Criar um método que imprima no console a cidade de menor nome entre todos os
estados, seguido do seu UF. Exemplo: “Nome da Cidade - UF".
*/
export const imprimirMenorNomeDeCidadeEntreOsEstados = async () => {
  const arrayCidades = await doTamanhoNomeDeCidadePorEstado(ORDER_BY.ASC);
  const arrayOrdenado = arrayCidades.sort((a, b) => doOrderAsc(a, b));
  console.log(`${arrayOrdenado[0].Nome} - ${arrayOrdenado[0].UF}`);
};
