import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Text, TouchableOpacity } from 'react-native';
import { IncomeForm } from '../components/IncomeForm';
import { IncomeItem } from '../components/IncomeItem';
import { IncomeService } from '../services/incomeService';
import { Category, Income } from '../types/income';

export default function IncomeScreen() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0], // Data padrão: hoje
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [categoriesData, incomesData] = await Promise.all([
        IncomeService.getCategories(),
        IncomeService.getIncomes(),
      ]);
      setIncomes(incomesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      Alert.alert('Erro', error instanceof Error ? error.message : 'Ocorreu um erro ao buscar os dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddIncome = async () => {
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
      await IncomeService.createIncome({
        categoria_id: parseInt(formData.category),
        valor: parseFloat(formData.amount),
        data: formData.date,
        descricao: formData.description,
      });

      setFormData({ description: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] }); // Reset form data
      await fetchData();
      Alert.alert('Sucesso', 'Receita adicionada com sucesso');
    } catch (error) {
      console.error('Erro ao criar receita:', error);
      Alert.alert('Erro', error instanceof Error ? error.message : 'Ocorreu um erro ao adicionar a receita');
    }
  };

  const handleDeleteIncome = async (incomeId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta receita?',
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
              await IncomeService.deleteIncome(incomeId);
              await fetchData();
              Alert.alert('Sucesso', 'Receita excluída com sucesso');
            } catch (error) {
              console.error('Erro ao excluir receita:', error);
              Alert.alert('Erro', error instanceof Error ? error.message : 'Ocorreu um erro ao excluir a receita');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <IncomeForm
        description={formData.description}
        amount={formData.amount}
        category={formData.category}
        categories={categories}
        loading={loading}
        date={formData.date}
        onDescriptionChange={(text) => setFormData({ ...formData, description: text })}
        onAmountChange={(text) => setFormData({ ...formData, amount: text })}
        onCategoryChange={(value) => setFormData({ ...formData, category: value })}
        onDateChange={(date) => setFormData({ ...formData, date })}
        onSubmit={handleAddIncome}
      />

      <FlatList
        data={incomes}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleDeleteIncome(item.id)}>
            <IncomeItem income={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma receita encontrada</Text>
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