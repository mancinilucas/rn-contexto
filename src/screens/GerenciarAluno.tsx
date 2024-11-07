import React from "react";
import { View, Text, Button } from "react-native";

const GerenciarAluno = ({ navigation }: any) => {
  return (
    <View>
      <Text>Tela de Gerenciamento de Aluno</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default GerenciarAluno;
