import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  Button,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { Aluno, Turma } from "../models";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../models/types";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";

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
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turma, setTurma] = useState<Turma | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [editedNome, setEditedNome] = useState<string>("");
  const [editedTurmaId, setEditedTurmaId] = useState<number>(turmaId);

  useEffect(() => {
    const fetchTurmasAndAlunos = async () => {
      try {
        const storedTurmas = await AsyncStorage.getItem("turmas");
        if (storedTurmas) {
          const parsedTurmas: Turma[] = JSON.parse(storedTurmas);
          setTurmas(parsedTurmas);
          const turmaSelecionada = parsedTurmas.find((t) => t.id === turmaId);
          if (turmaSelecionada) {
            setTurma(turmaSelecionada);
            const storedAlunos = await AsyncStorage.getItem("alunos");
            if (storedAlunos) {
              const parsedAlunos: Aluno[] = JSON.parse(storedAlunos);
              const alunosDaTurma = parsedAlunos.filter(
                (aluno) => aluno.turmaId === turmaId
              );
              setAlunos(alunosDaTurma);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar turma ou alunos:", error);
      }
    };

    fetchTurmasAndAlunos();
  }, [turmaId]);

  const handleOpenEditModal = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setEditedNome(aluno.nome);
    setEditedTurmaId(aluno.turmaId);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (selectedAluno) {
      try {
        const updatedAlunos = alunos.map((aluno) =>
          aluno.id === selectedAluno.id
            ? { ...aluno, nome: editedNome, turmaId: editedTurmaId }
            : aluno
        );
        setAlunos(updatedAlunos);
        await AsyncStorage.setItem("alunos", JSON.stringify(updatedAlunos));
        Alert.alert("Sucesso", "Alterações salvas com sucesso!");
        setIsModalVisible(false);
      } catch (error) {
        console.error("Erro ao salvar alterações:", error);
        Alert.alert("Erro", "Não foi possível salvar as alterações.");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  if (!turma) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando dados da turma...</Text>
      </View>
    );
  }

  const handleExcluirAluno = async (alunoId: number) => {
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
              const alunosAtualizados = alunos.filter(
                (aluno) => aluno.id !== alunoId
              );
              setAlunos(alunosAtualizados);

              const storedTurmas = await AsyncStorage.getItem("turmas");
              if (storedTurmas) {
                const turmas: Turma[] = JSON.parse(storedTurmas);
                const turmaIndex = turmas.findIndex(
                  (turma) => turma.id === turmaId
                );
                if (turmaIndex > -1) {
                  turmas[turmaIndex].alunos = alunosAtualizados;
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
            <TouchableOpacity onPress={() => handleOpenEditModal(item)}>
              <Text style={styles.actionText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleExcluirAluno(item.id)}>
              <Text style={styles.actionText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum aluno encontrado</Text>}
      />

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Aluno</Text>
          <TextInput
            style={styles.input}
            value={editedNome}
            onChangeText={setEditedNome}
            placeholder="Nome do Aluno"
          />
          <Picker
            selectedValue={editedTurmaId}
            onValueChange={(itemValue) => setEditedTurmaId(itemValue)}
          >
            {turmas.map((turma) => (
              <Picker.Item key={turma.id} label={turma.nome} value={turma.id} />
            ))}
          </Picker>
          <Button title="Salvar" onPress={handleSaveEdit} />
          <Button title="Cancelar" onPress={handleCloseModal} color="#ea403f" />
        </View>
      </Modal>
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
    flexDirection: "row",
    backgroundColor: "#f3ba63",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between"
  },
  alunoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b7f8c",
    flex: 1,
    marginRight: 10
  },
  actionText: {
    color: "#ea403f",
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 10
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff"
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20
  }
});

export default AlunosDaTurma;
