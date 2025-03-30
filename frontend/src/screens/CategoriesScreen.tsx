import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

type Category = {
  id: string;
  name: string;
  color: string;
  type: string;
};

type CategoriesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Categories'>;

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totals, setTotals] = useState<{ [key: string]: string }>({});
  const navigation = useNavigation<CategoriesScreenNavigationProp>();

  // Função para buscar categorias
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
        const mappedCategories = data.categorias.map((cat: any) => ({
          id: cat.id.toString(),
          name: cat.nome,
          color: cat.tipo === 'despesa' ? '#FF6347' : '#32CD32',
          type: cat.tipo,
        }));

        setCategories(mappedCategories);
        fetchTotals(mappedCategories, token); // Buscar os totais das categorias
      } else {
        console.error('Erro ao buscar categorias: Dados inválidos');
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  // Função para buscar o total por categoria
  const fetchTotals = async (categories: Category[], token: string) => {
    const totalsMap: { [key: string]: string } = {};
    try {
      for (const category of categories) {
        const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.totalPorCategoria(category.id)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.status) {
          totalsMap[category.id] = data.total;
        } else {
          console.error(`Erro ao buscar total da categoria ${category.name}`);
          totalsMap[category.id] = '0.00';
        }
      }
      setTotals(totalsMap);
    } catch (error) {
      console.error('Erro ao buscar totais:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('Token não encontrado');
          return;
        }
        fetchCategories(token);
      } catch (error) {
        console.error('Erro ao inicializar CategoriesScreen:', error);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }: { item: Category }) => (
    <View style={[styles.categoryItem, { borderLeftColor: item.color }]}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('EditCategory', { categoryId: item.id })}>
            <Icon name="pencil" size={20} color="#007AFF" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Excluir', 'Função de exclusão ainda não implementada')}>
            <Icon name="trash" size={20} color="#FF6347" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryType}>Tipo: {item.type}</Text>
        <Text style={styles.categoryTotal}>Total: R$ {totals[item.id]}</Text>
      </View>
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
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  categoryInfo: {
    flex: 1,
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
  categoryTotal: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
    fontWeight: 'bold',
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
