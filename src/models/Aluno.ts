import { Nota } from "./Nota";
export interface Aluno {
  id: number;
  nome: string;
  notas?: Nota[];
  turmaId: number;
}
