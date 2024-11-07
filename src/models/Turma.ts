import { Aluno } from "./Aluno";

export interface Turma {
  id: string;
  nome: string;
  alunos: Aluno[];
}
