import React from "react";
import { View, Text, Button } from "react-native";

const GerenciarTurma = ({ navigation }: any) => {
  return (
    <View>
      <Text>Tela de Gerenciamento de Turmas</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default GerenciarTurma;
