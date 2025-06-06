import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
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
    date: new Date().toISOString().split('T')[0], // Data padrão: hoje
  });
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

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
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'É necessário permitir o acesso à localização.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    }
  };

  const handleUploadImage = async (imageUri: string) => {
    try {
      const directory = `${FileSystem.documentDirectory}images`;
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      const fileName = `image_${Date.now()}.jpg`;
      const newPath = `${directory}/${fileName}`;

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
    if (!formData.description.trim() || !formData.amount.trim() || !formData.category || !formData.date) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (formData.amount.includes('-')) {
      Alert.alert('Erro', 'Não utilize o sinal de menos (-) no valor');
      return;
    }
    else if (formData.amount.includes(' ')) {
      Alert.alert('Erro', 'Não utilize espaços no valor');
      return;
    }

    if (isNaN(parseFloat(formData.amount))) {
      Alert.alert('Erro', 'O valor deve ser um número válido');
      return;
    }
    if (parseFloat(formData.amount) <= 0) {
      Alert.alert('Erro', 'O valor deve ser maior que zero');
      return;
    }

    // Validação da data (não pode ser futura)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      Alert.alert('Erro', 'Não é possível adicionar despesas com data futura');
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
        data: formData.date,
        descricao: formData.description,
        image: imagePath,
        latitude: currentLocation?.latitude || 0,
        longitude: currentLocation?.longitude || 0,
      });

      setFormData({ 
        description: '', 
        amount: '', 
        category: '', 
        image: '',
        date: new Date().toISOString().split('T')[0] // Reset para data atual
      });
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
        date={formData.date}
        categories={categories}
        loading={loading}
        onDescriptionChange={(text) => setFormData({ ...formData, description: text })}
        onAmountChange={(text) => setFormData({ ...formData, amount: text })}
        onCategoryChange={(value) => setFormData({ ...formData, category: value })}
        onDateChange={(date) => setFormData({ ...formData, date })}
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
  mapContainer: {
    height: 200,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});