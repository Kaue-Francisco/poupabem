import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Category } from '../types/expense';

type ExpenseFormProps = {
  description: string;
  amount: string;
  category: string;
  categories: Category[];
  loading: boolean;
  onDescriptionChange: (text: string) => void;
  onAmountChange: (text: string) => void;
  onCategoryChange: (value: string) => void;
  onSubmit: () => void;
};

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  description,
  amount,
  category,
  categories,
  loading,
  onDescriptionChange,
  onAmountChange,
  onCategoryChange,
  onSubmit,
}) => {
  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Adicionar Despesa</Text>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={onDescriptionChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={amount}
        onChangeText={onAmountChange}
        keyboardType="numeric"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#3498DB" />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={onCategoryChange}
            style={styles.picker}
            dropdownIconColor="#3498DB"
          >
            <Picker.Item label="Selecione uma categoria" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.nome} value={cat.id.toString()} />
            ))}
          </Picker>
        </View>
      )}
      <TouchableOpacity style={styles.addButton} onPress={onSubmit}>
        <Text style={styles.addButtonText}>Adicionar Despesa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#BDC3C7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#ECF0F1',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    backgroundColor: '#ECF0F1',
    marginBottom: 10,
    overflow: 'hidden',
    paddingHorizontal: 5, // Adicionado para evitar corte no texto
  },
  picker: {
    height: 50, // Aumentado para evitar corte
    color: '#34495E',
    fontSize: 16, // Adicionado para melhorar a legibilidade
  },
  addButton: {
    backgroundColor: '#3498DB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 