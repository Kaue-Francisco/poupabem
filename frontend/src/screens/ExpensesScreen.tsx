import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string; // Agora a categoria armazena o nome da categoria, não apenas o ID
  criado_em: string;
};

type Categoria = {
  id: number;
  nome: string;
};

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
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Erro', 'Token de autenticação não encontrado');
          return;
        }

        let decodedToken: DecodedToken;
        try {
          decodedToken = jwtDecode(token) as DecodedToken;
        } catch (error) {
          Alert.alert('Erro', 'Token inválido ou expirado');
          return;
        }

        if (!decodedToken || !decodedToken.id) {
          Alert.alert('Erro', 'Token não contém informações válidas');
          return;
        }

        const userId = parseInt(decodedToken.id, 10);
        if (isNaN(userId)) {
          Alert.alert('Erro', 'ID do usuário inválido no token');
          return;
        }

        // Buscar categorias
        const categoriesResponse = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.getCategoriasDespesas(userId)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });

        const categoriesData = await categoriesResponse.json();
        if (categoriesData.status) {
          setCategories(categoriesData.categorias);
        } else {
          Alert.alert('Erro', 'Não foi possível carregar as categorias');
        }

        // Buscar despesas
        const expensesResponse = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.listarDespesas(userId)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });

        const expensesData = await expensesResponse.json();
        if (expensesData.status) {
          const formattedExpenses = expensesData.despesas
          .map((expense: any) => {
            const categoriaEncontrada = categoriesData.categorias.find((cat: Categoria) => cat.id === expense.categoria_id);
            return {
              id: expense.id.toString(),
              description: expense.descricao,
              amount: expense.valor,
              date: expense.data,
              category: categoriaEncontrada ? categoriaEncontrada.nome : 'Sem Categoria',
              criado_em: expense.criado_em, // Para ordenação
            };
          })
          .sort((a: Expense, b: Expense) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()); // Ordenar por data de criação

          setExpenses(formattedExpenses);
        } else {
          Alert.alert('Erro', 'Não foi possível carregar as despesas');
        }
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro ao buscar os dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddExpense = async () => {
    if (!description.trim() || !amount.trim() || !category) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado');
        return;
      }

      let decodedToken: DecodedToken;
      try {
        decodedToken = jwtDecode(token) as DecodedToken;
      } catch (error) {
        Alert.alert('Erro', 'Token inválido ou expirado');
        return;
      }

      if (!decodedToken || !decodedToken.id) {
        Alert.alert('Erro', 'Token não contém informações válidas');
        return;
      }

      const userId = parseInt(decodedToken.id, 10);
      if (isNaN(userId)) {
        Alert.alert('Erro', 'ID do usuário inválido no token');
        return;
      }

      console.log(userId, category, amount, description);
      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.criarDespesa}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuario_id: userId,
          categoria_id: parseInt(category),
          valor: parseFloat(amount),
          data: new Date().toISOString().split('T')[0],
          descricao: description,
        }),
      });

      const data = await response.json();
      console.log('Status da resposta:', response.status);
      console.log('Resposta da API:', data);

      if (response.ok) {
        // Buscar a categoria selecionada
        const categoriaEncontrada = categories.find((cat) => cat.id === parseInt(category));
        if (!categoriaEncontrada) {
          Alert.alert('Erro', 'Categoria não encontrada');
          return;
        }

        // Buscar a lista atualizada de despesas
        const expensesResponse = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.listarDespesas(userId)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });

        const expensesData = await expensesResponse.json();
        if (expensesResponse.ok) {
          const formattedExpenses = expensesData.despesas
            .map((expense: any) => {
              const categoriaEncontrada = categories.find((cat: Categoria) => cat.id === expense.categoria_id);
              return {
                id: expense.id.toString(),
                description: expense.descricao,
                amount: expense.valor,
                date: expense.data,
                category: categoriaEncontrada ? categoriaEncontrada.nome : 'Sem Categoria',
                criado_em: expense.criado_em,
              };
            })
            .sort((a: Expense, b: Expense) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime());

          setExpenses(formattedExpenses);
        }

        // Limpar os campos
        setDescription('');
        setAmount('');
        setCategory('');

        // Mostrar mensagem de sucesso
        Alert.alert('Sucesso', 'Despesa adicionada com sucesso');
      } else {
        console.error('Erro na resposta:', data);
        Alert.alert('Erro', data.message || 'Não foi possível adicionar a despesa');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao adicionar a despesa');
    }
  };

  const renderItem = ({ item }: { item: Expense }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseDescription}>{item.description}</Text>
        <Text style={styles.expenseAmount}>R$ {item.amount}</Text>
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
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)} // Agora armazena o ID da categoria
            style={styles.picker}
            dropdownIconColor="#3498DB"
          >
            <Picker.Item label="Selecione uma categoria" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.nome} value={cat.id.toString()} /> // O valor agora é o ID da categoria
            ))}
          </Picker>
        </View>
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
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 15 },
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
    overflow: 'hidden', // Garante que o conteúdo fique dentro dos limites
  },
  picker: {
    height: 45,
    color: '#34495E', // Cor do texto selecionado
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
  listContainer: { flexGrow: 1, paddingBottom: 20 },
  expenseItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  expenseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  expenseDescription: { fontSize: 16, fontWeight: 'bold', color: '#34495E' },
  expenseAmount: { fontSize: 16, fontWeight: 'bold', color: '#E74C3C' },
  expenseFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  expenseCategory: { fontSize: 14, color: '#7F8C8D' },
  expenseDate: { fontSize: 14, color: '#7F8C8D' },
});
