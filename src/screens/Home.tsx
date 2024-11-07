import React from "react";
import { View, Text, Button } from "react-native";

const Home = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Menu Principal</Text>
      <Button
        title="Cadastrar Turma"
        onPress={() => navigation.navigate("CadastrarTurma")}
      />
      <View style={{ marginTop: 10 }}>
        <Button
          title="Gerenciar Turma"
          onPress={() => navigation.navigate("GerenciarTurma")}
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <Button
          title="Cadastrar Aluno"
          onPress={() => navigation.navigate("CadastrarAluno")}
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <Button
          title="Gerenciar Aluno"
          onPress={() => navigation.navigate("GerenciarAluno")}
        />
      </View>
    </View>
  );
};

export default Home;
