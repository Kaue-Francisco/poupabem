import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Text, TouchableOpacity } from 'react-native';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseItem } from '../components/ExpenseItem';
import { ExpenseService } from '../services/expenseService';
import { Category, Expense } from '../types/expense';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesData, expensesData] = await Promise.all([
        ExpenseService.getCategories(),
        ExpenseService.getExpenses(),
      ]);

      setCategories(categoriesData);
      setExpenses(expensesData);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Ocorreu um erro ao buscar os dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpense = async () => {
    
    if (!formData.description.trim() || !formData.amount.trim() || !formData.category) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Verifica se o valor contém caracteres inválidos
    if (formData.amount.includes('-')) {
      Alert.alert('Erro', 'Não utilize o sinal de menos (-) no valor');
      return;
    }
    else if (formData.amount.includes(' ')) {
      Alert.alert('Erro', 'Não utilize espaços no valor');
      return;
    }

    // Verifica se o valor é um número válido e maior que zero
    if (isNaN(parseFloat(formData.amount))) {
      Alert.alert('Erro', 'O valor deve ser um número válido');
      return;
    }
    if (parseFloat(formData.amount) <= 0) {
      Alert.alert('Erro', 'O valor deve ser maior que zero');
      return;
    }

    try {
      await ExpenseService.createExpense({
        categoria_id: parseInt(formData.category),
        valor: parseFloat(formData.amount),
        data: new Date().toISOString().split('T')[0],
        descricao: formData.description,
      });

      setFormData({ description: '', amount: '', category: '' });
      await fetchData();
      Alert.alert('Sucesso', 'Despesa adicionada com sucesso');
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      Alert.alert('Erro', error instanceof Error ? error.message : 'Ocorreu um erro ao adicionar a despesa');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta despesa?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await ExpenseService.deleteExpense(expenseId);
              await fetchData();
              Alert.alert('Sucesso', 'Despesa excluída com sucesso');
            } catch (error) {
              console.error('Erro ao excluir despesa:', error);
              Alert.alert('Erro', error instanceof Error ? error.message : 'Ocorreu um erro ao excluir a despesa');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ExpenseForm
        description={formData.description}
        amount={formData.amount}
        category={formData.category}
        categories={categories}
        loading={loading}
        onDescriptionChange={(text) => setFormData({ ...formData, description: text })}
        onAmountChange={(text) => setFormData({ ...formData, amount: text })}
        onCategoryChange={(value) => setFormData({ ...formData, category: value })}
        onSubmit={handleAddExpense}
      />

      <FlatList
        data={expenses}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleDeleteExpense(item.id)}>
            <ExpenseItem expense={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma despesa encontrada</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 15,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
});
