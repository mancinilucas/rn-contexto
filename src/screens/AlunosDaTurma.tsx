import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Aluno, Turma } from "../models";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../models/Types";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import CustomPicker from "../components/CustomPicker";

type RouteParams = {
  turmaId: number;
};

type AlunosDaTurmaNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AlunosDaTurma"
>;
type AlunosDaTurmaRouteProp = RouteProp<RootStackParamList, "AlunosDaTurma">;

interface AlunosDaTurmaProps {
  navigation: AlunosDaTurmaNavigationProp;
  route: AlunosDaTurmaRouteProp;
}

const AlunosDaTurma: React.FC<AlunosDaTurmaProps> = ({ navigation }) => {
  const route = useRoute();
  const { turmaId } = route.params as RouteParams;
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [turma, setTurma] = useState<Turma | null>(null); // Definindo o estado para armazenar a turma

  useEffect(() => {
    const fetchTurmaAndAlunos = async () => {
      try {
        const storedTurmas = await AsyncStorage.getItem("turmas");
        if (storedTurmas) {
          const turmas: Turma[] = JSON.parse(storedTurmas);
          const turmaSelecionada = turmas.find((t) => t.id === turmaId);
          if (turmaSelecionada) {
            setTurma(turmaSelecionada); // Define a turma selecionada
            setAlunos(turmaSelecionada.alunos); // Define os alunos dessa turma
          }
        }
      } catch (error) {
        console.error("Erro ao carregar turma ou alunos:", error);
      }
    };

    fetchTurmaAndAlunos();
  }, [turmaId]);

  if (!turma) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando dados da turma...</Text>
      </View>
    );
  }

  const handleExcluirAluno = async (alunoId: number) => {
    // Confirmação de exclusão
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este aluno?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              // Filtra os alunos, removendo o aluno com o id correspondente
              const alunosAtualizados = alunos.filter(
                (aluno) => aluno.id !== alunoId
              );

              // Atualiza o estado com a lista de alunos sem o aluno excluído
              setAlunos(alunosAtualizados);

              // Atualiza os dados da turma no AsyncStorage
              const storedTurmas = await AsyncStorage.getItem("turmas");
              if (storedTurmas) {
                const turmas: Turma[] = JSON.parse(storedTurmas);
                const turmaIndex = turmas.findIndex(
                  (turma) => turma.id === turmaId
                );
                if (turmaIndex > -1) {
                  // Atualiza a lista de alunos na turma específica
                  turmas[turmaIndex].alunos = alunosAtualizados;
                  // Salva novamente as turmas no AsyncStorage
                  await AsyncStorage.setItem("turmas", JSON.stringify(turmas));
                  Alert.alert("Sucesso", "Aluno excluído com sucesso!");
                }
              }
            } catch (error) {
              console.error("Erro ao excluir aluno:", error);
              Alert.alert("Erro", "Não foi possível excluir o aluno.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alunos da Turma: {turma.nome}</Text>
      <FlatList
        data={alunos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.alunoItem}>
            <Text style={styles.alunoName}>{item.nome}</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EditarAluno", { alunoId: item.id })
              }
            >
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleExcluirAluno(item.id)}>
              <Text style={styles.actionText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff6eb"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1b7f8c",
    textAlign: "center",
    marginBottom: 20
  },
  alunoItem: {
    backgroundColor: "#f3ba63",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1b7f8c"
  },
  alunoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b7f8c"
  },
  actionText: {
    color: "#ea403f",
    marginTop: 5,
    fontSize: 16
  }
});

export default AlunosDaTurma;
