export type RootStackParamList = {
  Home: undefined;
  CadastrarTurma: undefined;
  GerenciarTurma: undefined;
  CadastrarAluno: undefined;
  GerenciarAluno: undefined;
  GerenciamentoDeTurmas: undefined;
  AlunosDaTurma: { turmaId: number };
  EditarAluno: { alunoId: number };
  ExibirNota: { alunoId: number };
};
