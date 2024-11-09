import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Turma } from "../models";

const GerenciamentoDeTurmas = ({ navigation }: any) => {
  const [turmas, setTurmas] = useState<Turma[]>([]);

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Turmas</Text>
      <FlatList
        data={turmas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.turmaItem}
            onPress={() =>
              navigation.navigate("AlunosDaTurma", { turmaId: item.id })
            }
          >
            <Text style={styles.turmaText}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8"
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center"
  },
  turmaItem: {
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    marginBottom: 10
  },
  turmaText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center"
  }
});

export default GerenciamentoDeTurmas;
