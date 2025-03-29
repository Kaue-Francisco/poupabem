import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';

type Income = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
};

export default function IncomeScreen() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleAddIncome = () => {
    if (!description.trim() || !amount.trim() || !category.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const income: Income = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      date: new Date().toLocaleDateString(),
      category: category.trim(),
    };

    setIncomes([...incomes, income]);
    setDescription('');
    setAmount('');
    setCategory('');
  };

  const renderItem = ({ item }: { item: Income }) => (
    <View style={styles.incomeItem}>
      <View style={styles.incomeHeader}>
        <Text style={styles.incomeDescription}>{item.description}</Text>
        <Text style={styles.incomeAmount}>R$ {item.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.incomeFooter}>
        <Text style={styles.incomeCategory}>{item.category}</Text>
        <Text style={styles.incomeDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Categoria"
          value={category}
          onChangeText={setCategory}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddIncome}>
          <Text style={styles.addButtonText}>Adicionar Receita</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={incomes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  form: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  incomeItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  incomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  incomeDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
  },
  incomeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incomeCategory: {
    fontSize: 14,
    color: '#666',
  },
  incomeDate: {
    fontSize: 14,
    color: '#666',
  },
});