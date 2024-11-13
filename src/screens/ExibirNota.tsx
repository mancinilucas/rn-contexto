import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Aluno } from "../models";

const ExibirNotas: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation
}) => {
  const { alunoId } = route.params;
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [notas, setNotas] = useState<{ valor: number; data: string }[]>([]);
  const [newNota, setNewNota] = useState("");
  const [newData, setNewData] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const storedAlunos = await AsyncStorage.getItem("alunos");
        if (storedAlunos) {
          const alunos: Aluno[] = JSON.parse(storedAlunos);
          const alunoSelecionado = alunos.find((aluno) => aluno.id === alunoId);
          if (alunoSelecionado) {
            setAluno(alunoSelecionado);
            setNotas(alunoSelecionado.notas || []);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar os dados do aluno:", error);
      }
    };

    fetchAluno();
  }, [alunoId]);

  const handleAddNota = () => {
    const novaNota = {
      valor: parseInt(newNota),
      data: newData
    };
    const updatedNotas = [...notas, novaNota];
    setNotas(updatedNotas);

    if (aluno) {
      const updatedAluno = { ...aluno, notas: updatedNotas };
      AsyncStorage.setItem("alunos", JSON.stringify([updatedAluno]))
        .then(() => {
          setNewNota("");
          setNewData("");
          setIsModalVisible(false);
          Alert.alert("Sucesso", "Nota adicionada com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao salvar a nova nota:", error);
          Alert.alert("Erro", "Não foi possível adicionar a nota.");
        });
    }
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notas de {aluno?.nome}</Text>

      <FlatList
        data={notas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.notaItem}>
            <Text style={styles.notaText}>
              Nota: {item.valor} - Data: {item.data}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhuma nota cadastrada</Text>}
      />

      <Button
        title="Adicionar Nova Nota"
        onPress={handleOpenModal}
        color="#1b7f8c"
      />

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
              onPress={handleCloseModal}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1b7f8c",
    textAlign: "center",
    marginBottom: 20
  },
  notaItem: {
    flexDirection: "row",
    backgroundColor: "#f3ba63",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  notaText: {
    fontSize: 18,
    color: "#1b7f8c"
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
    color: "#1b7f8c",
    marginBottom: 20
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
  }
});

export default ExibirNotas;
