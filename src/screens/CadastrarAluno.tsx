import React from "react";
import { View, Text, Button } from "react-native";

const CadastrarAluno = ({ navigation }: any) => {
  return (
    <View>
      <Text>Tela de Cadastro de Aluno</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default CadastrarAluno;
