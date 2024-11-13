import AsyncStorage from "@react-native-async-storage/async-storage";

// Função para limpar todos os dados no AsyncStorage
const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear(); // Limpa todos os dados armazenados
    console.log("Todos os dados do AsyncStorage foram removidos");
  } catch (error) {
    console.error("Erro ao limpar o AsyncStorage:", error);
  }
};

export default clearAsyncStorage;
