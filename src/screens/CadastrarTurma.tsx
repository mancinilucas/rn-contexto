import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  Button
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Turma } from "../models";

const CadastrarTurma = ({ navigation }: any) => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [nomeTurma, setNomeTurma] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const storedTurmas = await AsyncStorage.getItem("turmas");
        if (storedTurmas) {
          setTurmas(JSON.parse(storedTurmas));
        }
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
      }
    };

    fetchTurmas();
  }, []);

  const adicionarTurma = async () => {
    if (nomeTurma.trim() === "") {
      Alert.alert("Erro", "Por favor, insira o nome da turma.");
      return;
    }

    const nomeExistente = turmas.some(
      (turma) => turma.nome.toLowerCase() === nomeTurma.trim().toLowerCase()
    );
    if (nomeExistente) {
      Alert.alert("Erro", "Já existe uma turma com esse nome.");
      return;
    }

    if (turmas.length >= 10) {
      Alert.alert(
        "Limite de Turmas",
        "O número máximo de 10 turmas já foi atingido."
      );
      return;
    }

    const novaTurma: Turma = {
      id: turmas.length + 1,
      nome: nomeTurma.trim(),
      alunos: []
    };

    const novasTurmas = [...turmas, novaTurma];
    setTurmas(novasTurmas);
    setNomeTurma("");

    try {
      await AsyncStorage.setItem("turmas", JSON.stringify(novasTurmas));
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar nova turma:", error);
    }
  };

  const excluirTurma = async (id: number) => {
    const novasTurmas = turmas.filter((turma) => turma.id !== id);
    setTurmas(novasTurmas);

    try {
      await AsyncStorage.setItem("turmas", JSON.stringify(novasTurmas));
    } catch (error) {
      console.error("Erro ao excluir turma:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Turmas</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Adicionar Nova Turma</Text>
      </TouchableOpacity>

      <FlatList
        data={turmas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>
              {item.id}. {item.nome}
            </Text>

            <TouchableOpacity
              onPress={() => excluirTurma(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cadastrar Nova Turma</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome da turma"
              value={nomeTurma}
              onChangeText={setNomeTurma}
            />
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                color="#ea403f"
              />
              <Button
                title="Confirmar"
                onPress={adicionarTurma}
                color="#1b7f8c"
              />
            </View>
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
    marginBottom: 20,
    color: "#1b7f8c",
    fontWeight: "bold",
    textAlign: "center"
  },
  button: {
    backgroundColor: "#ea403f",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },
  listItem: {
    padding: 15,
    backgroundColor: "#f3ba63",
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  listText: {
    fontSize: 18,
    color: "#1b7f8c"
  },
  deleteButton: {
    backgroundColor: "#ea403f",
    padding: 5,
    borderRadius: 5
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14
  },
  input: {
    height: 40,
    borderColor: "#1b7f8c",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#1b7f8c"
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center"
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: "#1b7f8c"
  },
  modalButtons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default CadastrarTurma;
