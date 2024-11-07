import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Home = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Principal</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CadastrarTurma")}
      >
        <Text style={styles.buttonText}>Cadastrar Turma</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("GerenciarTurma")}
      >
        <Text style={styles.buttonText}>Gerenciar Turma</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("CadastrarAluno")}
      >
        <Text style={styles.buttonText}>Cadastrar Aluno</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("GerenciarAluno")}
      >
        <Text style={styles.buttonText}>Gerenciar Aluno</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff6eb" // Cor de fundo da tela
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: "#1b7f8c", // Cor do texto do título
    fontWeight: "bold"
  },
  button: {
    backgroundColor: "#f3ba63", // Cor de fundo dos botões
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#ea403f", // Cor da sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5 // Para Android
  },
  buttonText: {
    color: "#1b7f8c", // Cor do texto dos botões
    fontSize: 18,
    fontWeight: "600"
  }
});

export default Home;
