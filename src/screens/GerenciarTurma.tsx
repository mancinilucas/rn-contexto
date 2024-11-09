import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Turma } from "../models";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../models/Types";

type GerenciamentoDeTurmasNavigationProp = StackNavigationProp<
  RootStackParamList,
  "GerenciamentoDeTurmas"
>;

interface GerenciamentoDeTurmasProps {
  navigation: GerenciamentoDeTurmasNavigationProp;
}

const GerenciarTurmas: React.FC<GerenciamentoDeTurmasProps> = ({
  navigation
}) => {
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

  const handleTurmaSelect = (turmaId: number) => {
    navigation.navigate("AlunosDaTurma", { turmaId });
  };

  return (
    <View>
      <Text style={styles.title}>Gerenciamento de Turmas</Text>
      <FlatList
        data={turmas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleTurmaSelect(item.id)}
            style={styles.turmaItem}
          >
            <Text style={styles.turmaName}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1b7f8c",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20
  },
  turmaItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f3ba63",
    borderRadius: 5,
    alignItems: "center",
    borderColor: "#1b7f8c"
  },
  turmaName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b7f8c"
  }
});

export default GerenciarTurmas;
