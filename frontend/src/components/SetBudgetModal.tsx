import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

type SetBudgetModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (budget: number) => void;
  currentBudget?: number;
  categoryName: string;
};

export const SetBudgetModal: React.FC<SetBudgetModalProps> = ({
  visible,
  onClose,
  onSave,
  currentBudget,
  categoryName,
}) => {
  const [budget, setBudget] = useState<string>(currentBudget ? currentBudget.toString() : '');

  const handleSave = () => {
    const budgetValue = parseFloat(budget);
    if (isNaN(budgetValue)) {
      Alert.alert('Erro', 'Por favor, insira um valor válido');
      return;
    }
    if (budgetValue <= 0) {
      Alert.alert('Erro', 'O orçamento deve ser maior que zero');
      return;
    }
    onSave(budgetValue);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Definir Orçamento para {categoryName}</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Valor do Orçamento Mensal:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Ex: 1000,00"
              value={budget}
              onChangeText={setBudget}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Orçamento</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});