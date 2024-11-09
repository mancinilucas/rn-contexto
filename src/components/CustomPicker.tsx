import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

interface CustomPickerProps {
  turmas: { id: number; nome: string }[];
  selectedValue: number | undefined;
  onValueChange: (value: number | undefined) => void;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  turmas,
  selectedValue,
  onValueChange
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {selectedValue === undefined
            ? "Selecione a Turma"
            : turmas.find((t) => t.id === selectedValue)?.nome}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {turmas.map((turma) => (
              <TouchableOpacity
                key={turma.id}
                style={styles.modalItem}
                onPress={() => {
                  onValueChange(turma.id);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalItemText}>{turma.nome}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalItemText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  button: {
    padding: 15,
    backgroundColor: "#1b7f8c",
    borderRadius: 5,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  modalContainer: {
    width: 250,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10
  },
  modalItem: {
    paddingVertical: 10,
    alignItems: "center"
  },
  modalItemText: {
    fontSize: 16,
    color: "#1b7f8c"
  }
});

export default CustomPicker;
