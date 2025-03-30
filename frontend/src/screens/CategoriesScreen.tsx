import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiConfig } from '../config/api';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Category = {
  id: string;
  name: string;
  color: string;
  type: string;
  createdAt: string;
};

type CategoriesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Categories'>;

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigation = useNavigation<CategoriesScreenNavigationProp>();

  // Function to fetch categories
  const fetchCategories = async (token: string) => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.listarCategorias}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status && data.categorias) {
        // Map the data to match the expected format
        const mappedCategories = data.categorias.map((cat: any) => ({
          id: cat.id.toString(),
          name: cat.nome,
          color: cat.tipo === 'despesa' ? '#FF6347' : '#32CD32', // Example colors
          type: cat.tipo,
          createdAt: cat.criado_em,
        }));
        setCategories(mappedCategories);
      } else {
        console.error('Erro ao buscar categorias: Dados inválidos');
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('Token not found');
          return;
        }
        fetchCategories(token);
      } catch (error) {
        console.error('Error initializing CategoriesScreen:', error);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Category }) => (
    <View style={[styles.categoryItem, { borderLeftColor: item.color }]}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryType}>Tipo: {item.type}</Text>
      <Text style={styles.categoryDate}>
        Criado em: {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(item.createdAt))}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateCategory')}
      >
        <Text style={styles.createButtonText}>Criar Categoria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  list: {
    flex: 1,
  },
  categoryItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryType: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  categoryDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});