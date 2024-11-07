import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Importe suas telas (crie-as conforme as necessidades do projeto)
import Home from "../screens/Home";
import CadastrarTurma from "../screens/CadastrarTurma";
import GerenciarTurma from "../screens/GerenciarTurma";
import CadastrarAluno from "../screens/CadastrarAluno";
import GerenciarAluno from "../screens/GerenciarAluno";

// Crie o Stack Navigator
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: "Contexto - Gestão Educacional" }}
      />
      <Stack.Screen
        name="CadastrarTurma"
        component={CadastrarTurma}
        options={{ title: "Cadastrar Turma" }}
      />
      <Stack.Screen
        name="GerenciarTurma"
        component={GerenciarTurma}
        options={{ title: "Gerenciar Turma" }}
      />
      <Stack.Screen
        name="CadastrarAluno"
        component={CadastrarAluno}
        options={{ title: "Cadastrar Aluno" }}
      />
      <Stack.Screen
        name="GerenciarAluno"
        component={GerenciarAluno}
        options={{ title: "Gerenciar Aluno" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
