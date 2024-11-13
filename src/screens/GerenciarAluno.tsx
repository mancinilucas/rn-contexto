import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  FlatList,
  StyleSheet,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Aluno } from "../models";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../models/types";

type GerenciamentoDeTurmasNavigationProp = StackNavigationProp<
  RootStackParamList,
  "GerenciamentoDeTurmas"
>;

interface GerenciamentoDeTurmasProps {
  navigation: GerenciamentoDeTurmasNavigationProp;
}

const GerenciarAluno: React.FC<GerenciamentoDeTurmasProps> = ({
  navigation
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newNota, setNewNota] = useState<string>("");
  const [newData, setNewData] = useState<string>("");

  useEffect(() => {
    if (searchQuery.length > 0) {
      const fetchAlunos = async () => {
        try {
          const storedAlunos = await AsyncStorage.getItem("alunos");
          if (storedAlunos) {
            const alunos: Aluno[] = JSON.parse(storedAlunos);
            const result = alunos.filter((aluno) =>
              aluno.nome.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredAlunos(result);
          }
        } catch (error) {
          console.error("Erro ao buscar alunos:", error);
        }
      };
      fetchAlunos();
    } else {
      setFilteredAlunos([]);
    }
  }, [searchQuery]);

  const handleSelectAluno = (aluno: Aluno) => {
    setSelectedAluno(aluno);
  };

  const handleAddNota = async () => {
    if (selectedAluno && newNota && newData) {
      try {
        const notaInt = parseInt(newNota);
        if (isNaN(notaInt) || notaInt < 0 || notaInt > 1000) {
          Alert.alert("Erro", "Insira uma nota válida entre 0 e 1000.");
          return;
        }

        const updatedAluno = {
          ...selectedAluno,
          notas: [
            ...(selectedAluno.notas || []),
            { valor: notaInt, data: newData }
          ]
        };

        const storedAlunos = await AsyncStorage.getItem("alunos");
        if (storedAlunos) {
          const alunos: Aluno[] = JSON.parse(storedAlunos);
          const updatedAlunos = alunos.map((aluno) =>
            aluno.id === selectedAluno.id ? updatedAluno : aluno
          );
          await AsyncStorage.setItem("alunos", JSON.stringify(updatedAlunos));
          setSelectedAluno(updatedAluno);
          Alert.alert("Sucesso", "Nota adicionada com sucesso!");
          setIsModalVisible(false);
          setNewNota("");
          setNewData("");
        }
      } catch (error) {
        console.error("Erro ao adicionar nota:", error);
        Alert.alert("Erro", "Não foi possível adicionar a nota.");
      }
    } else {
      Alert.alert("Erro", "Preencha todos os campos.");
    }
  };

  const handleOpenAlunoDetails = (alunoId: number) => {
    navigation.navigate("ExibirNota", { alunoId });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do aluno"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredAlunos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.alunoItem}>
            <Text style={styles.alunoName}>{item.nome}</Text>
            <TouchableOpacity onPress={() => handleOpenAlunoDetails(item.id)}>
              <Text style={styles.actionText}>Ver Notas</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum aluno encontrado</Text>}
      />
      {selectedAluno && (
        <View>
          <Text style={styles.title}>Notas de {selectedAluno.nome}</Text>
          {selectedAluno.notas && selectedAluno.notas.length > 0 ? (
            <FlatList
              data={selectedAluno.notas}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.notaItem}>
                  Nota: {item.valor} - Data: {item.data}
                </Text>
              )}
            />
          ) : (
            <Text>Nenhuma nota cadastrada.</Text>
          )}
          <Button
            color="#1b7f8c"
            title="Adicionar Nova Nota"
            onPress={() => setIsModalVisible(true)}
          />
        </View>
      )}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Adicionar Nova Nota</Text>

          <TextInput
            style={styles.input}
            placeholder="Nota (0 a 1000)"
            value={newNota}
            onChangeText={setNewNota}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Data (dd/MM/AAAA)"
            value={newData}
            onChangeText={setNewData}
          />

          <View style={styles.modalButtonsContainer}>
            <Button
              title="Cancelar"
              onPress={() => setIsModalVisible(false)}
              color="#ea403f"
            />
            <Button title="Adicionar" onPress={handleAddNota} />
          </View>
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
    marginBottom: 20,
    color: "#1b7f8c"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff6eb"
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },
  notaItem: {
    fontSize: 18,
    marginBottom: 10,
    color: "#1b7f8c"
  }
});

export default GerenciarAluno;
