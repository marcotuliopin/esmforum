const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de seis respostas', () => {
  modelo.cadastrar_resposta(0, '1');
  modelo.cadastrar_resposta(0, '2');
  modelo.cadastrar_resposta(1, '4');
  modelo.cadastrar_resposta(1, '3');
  modelo.cadastrar_resposta(1, '4');
  modelo.cadastrar_resposta(2, '4');
  const respostas = Array.from({ length: 3 }, (_, i) => modelo.get_respostas(i));
  expect(respostas[0].length).toBe(2);
  expect(respostas[1].length).toBe(3);
  expect(respostas[2].length).toBe(1);
  expect(respostas[0][0].texto).toBe('1');
  expect(respostas[0][1].texto).toBe('2');
  expect(respostas[2][0].texto).toBe('4');
});

test('Testando get', () => {
  expect(modelo.get_pergunta(0)).toBeUndefined();
  expect(modelo.get_respostas(0).length).toBe(0);
  expect(modelo.get_num_respostas(0)).toBe(0);
  modelo.cadastrar_pergunta('2 + 2 = ?');
  const pergunta = modelo.listar_perguntas(); 
  expect({
      ...modelo.get_pergunta(pergunta[0].id_pergunta),
      num_respostas: 0
  }).toEqual(pergunta[0])
  modelo.cadastrar_resposta(0, '4');
  expect(modelo.get_num_respostas(0)).toBe(1)
  expect(modelo.get_respostas(0)[0].texto).toBe('4')
});