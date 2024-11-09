import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  Alert,
  StyleSheet
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Turma, Aluno } from "../models";

const CadastrarAluno = ({ navigation }: any) => {
  const [turmas, setTurmas] = useState<Turma[]>([]);

  const [nomeAluno, setNomeAluno] = useState<string>("");

  const [selectedTurmaId, setSelectedTurmaId] = useState<number | undefined>(
    undefined
  );

  const [modalVisible, setModalVisible] = useState<boolean>(false);

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

  const adicionarAluno = async () => {
    if (nomeAluno.trim() === "") {
      Alert.alert("Erro", "Por favor, insira o nome do aluno.");
      return;
    }

    if (selectedTurmaId === undefined) {
      Alert.alert("Erro", "Por favor, selecione uma turma.");
      return;
    }

    try {
      const storedAlunos = await AsyncStorage.getItem("alunos");
      const alunos: Aluno[] = storedAlunos ? JSON.parse(storedAlunos) : [];

      const novoAluno: Aluno = {
        id: alunos.length + 1,
        nome: nomeAluno.trim(),
        turmaId: selectedTurmaId
      };

      const novosAlunos = [...alunos, novoAluno];
      await AsyncStorage.setItem("alunos", JSON.stringify(novosAlunos));

      Alert.alert("Sucesso", "Aluno cadastrado com sucesso!");

      setNomeAluno("");
      setSelectedTurmaId(undefined);
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao salvar novo aluno:", error);

      Alert.alert(
        "Erro",
        "Não foi possível cadastrar o aluno. Tente novamente."
      );
    }
  };

  const cancelarCadastro = () => {
    setNomeAluno("");
    setSelectedTurmaId(undefined);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Alunos</Text>

      {/* Botão para abrir o modal de cadastro de aluno */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Cadastrar Novo Aluno</Text>
      </TouchableOpacity>

      {/* Modal para cadastrar aluno */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={cancelarCadastro}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cadastrar Novo Aluno</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do aluno"
              value={nomeAluno}
              onChangeText={setNomeAluno}
            />
            <Picker
              selectedValue={selectedTurmaId}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedTurmaId(itemValue)}
            >
              <Picker.Item label="Selecione a Turma" value={undefined} />
              {turmas.map((turma) => (
                <Picker.Item
                  key={turma.id}
                  label={turma.nome}
                  value={turma.id}
                />
              ))}
            </Picker>

            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={cancelarCadastro}
                color="#ea403f"
              />
              <Button
                title="Confirmar"
                onPress={adicionarAluno}
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
  picker: {
    height: 50,
    borderColor: "#1b7f8c",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16
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

export default CadastrarAluno;
