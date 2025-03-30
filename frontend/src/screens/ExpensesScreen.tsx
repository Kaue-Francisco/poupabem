import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode'; // Fix import

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
};

type Categoria = {
  id: number;
  nome: string;
};

// Define a custom type for the decoded token
type DecodedToken = {
  id: string;
  exp: number;
  iat: number;
};

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);

      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Erro', 'Token de autenticação não encontrado');
          return;
        }

        const decodedToken: DecodedToken = jwtDecode(token);
        const userId = parseInt(decodedToken?.id, 10); // Convert userId to a number
        
        if (isNaN(userId)) { // Check if the conversion was successful
          Alert.alert('Erro', 'ID do usuário inválido no token');
          return;
        }
        
        const response = await fetch(
          `${apiConfig.baseUrl}${apiConfig.endpoints.getCategoriasDespesas(userId)}`, // Pass userId as a number
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.status) {
          setCategories(data.categorias);
        } else {
          Alert.alert('Erro', 'Não foi possível carregar as categorias');
        }
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao buscar as categorias');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddExpense = () => {
    if (!description.trim() || !amount.trim() || !category.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const expense: Expense = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      date: new Date().toLocaleDateString(),
      category: category.trim(),
    };

    setExpenses([...expenses, expense]);
    setDescription('');
    setAmount('');
    setCategory('');
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseDescription}>{item.description}</Text>
        <Text style={styles.expenseAmount}>R$ {item.amount.toFixed(2)}</Text>
      </View>
      <View style={styles.expenseFooter}>
        <Text style={styles.expenseCategory}>{item.category}</Text>
        <Text style={styles.expenseDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Adicionar Despesa</Text>
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
        {loading ? (
          <ActivityIndicator size="large" color="#3498DB" />
        ) : (
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione uma categoria" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.nome} value={cat.nome} />
            ))}
          </Picker>
        )}
        <TouchableOpacity style={styles.addButton} onPress={handleAddExpense}>
          <Text style={styles.addButtonText}>Adicionar Despesa</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F0F2',
    padding: 10,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F7F9FA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D9E0',
  },
  picker: {
    backgroundColor: '#F7F9FA',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D1D9E0',
  },
  addButton: {
    backgroundColor: '#3498DB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  expenseItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495E',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseCategory: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  expenseDate: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});