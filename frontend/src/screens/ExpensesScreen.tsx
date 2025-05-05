import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { ExpenseForm } from '../components/ExpenseForm';
import { ExpenseItem } from '../components/ExpenseItem';
import { ExpenseDetailModal } from '../components/ExpenseDetailModal';
import { ExpenseService } from '../services/expenseService';
import { Category, Expense } from '../types/expense';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ExpensesScreen() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    image: '',
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

  const handleUploadImage = async (imageUri: string) => {
    try {
      // Criar diretório se não existir
      const directory = `${FileSystem.documentDirectory}images`;
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      // Gerar nome único para o arquivo
      const fileName = `image_${Date.now()}.jpg`;
      const newPath = `${directory}/${fileName}`;

      // Copiar a imagem para o diretório local
      await FileSystem.copyAsync({
        from: imageUri,
        to: newPath
      });

      return newPath;
    } catch (error) {
      console.error('Erro ao salvar imagem localmente:', error);
      throw error;
    }
  };

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
      let imagePath = '';
      if (formData.image) {
        imagePath = await handleUploadImage(formData.image);
      }

      await ExpenseService.createExpense({
        categoria_id: parseInt(formData.category),
        valor: parseFloat(formData.amount),
        data: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
        descricao: formData.description,
        image: imagePath,
      });

      setFormData({ description: '', amount: '', category: '', image: '' });
      setImage(null);
      await fetchData();
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

  const handleExpensePress = (expense: Expense) => {
    setSelectedExpense(expense);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ExpenseForm
        description={formData.description}
        imageUrl={formData.image}
        amount={formData.amount}
        category={formData.category}
        categories={categories}
        loading={loading}
        onDescriptionChange={(text) => setFormData({ ...formData, description: text })}
        onAmountChange={(text) => setFormData({ ...formData, amount: text })}
        onCategoryChange={(value) => setFormData({ ...formData, category: value })}
        onImageChange={(uri) => setFormData({ ...formData, image: uri || '' })}
        onSubmit={handleAddExpense}
      />

      <FlatList
        data={expenses}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleExpensePress(item)}
            onLongPress={() => handleDeleteExpense(item.id)}
          >
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

      <ExpenseDetailModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense}
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
  cameraButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 8,
  },
});
