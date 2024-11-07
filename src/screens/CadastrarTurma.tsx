import React from "react";
import { View, Text, Button } from "react-native";

const CadastrarTurma = ({ navigation }: any) => {
  return (
    <View>
      <Text>Tela de Cadastro de Turma</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default CadastrarTurma;
