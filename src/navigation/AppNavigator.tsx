import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "../models/Types";
import Home from "../screens/Home";
import CadastrarTurma from "../screens/CadastrarTurma";
import GerenciarTurma from "../screens/GerenciarTurma";
import CadastrarAluno from "../screens/CadastrarAluno";
import GerenciarAluno from "../screens/GerenciarAluno";
import AlunosDaTurma from "../screens/AlunosDaTurma";

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f3ba63"
        },
        headerTintColor: "#1b7f8c",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 24
        }
      }}
    >
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
      <Stack.Screen
        name="GerenciamentoDeTurmas"
        component={GerenciarTurma}
        options={{ title: "Gerenciamento de Turmas" }}
      />
      <Stack.Screen
        name="AlunosDaTurma"
        component={AlunosDaTurma}
        options={{ title: "Alunos da Turma" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
