import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export default function CreateCategoryScreen() {
  const [name, setName] = useState('');
  const [type, setType] = useState<'despesa' | 'receita' | null>(null);
  const navigation = useNavigation();

  const handleCreateCategory = async () => {
    const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('Token not found');
          return;
        }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    if (name.trim() && type) {
      try {
        const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.criarCategoria}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            usuario_id: userId,
            nome: name,
            tipo: type,
          }),
        }
        );

        if (response.ok) {
          alert('Categoria criada com sucesso!');
          navigation.goBack();
        } else {
          alert('Erro ao criar categoria.');
        }
      } catch (error) {
        console.error('Erro ao criar categoria:', error);
      }
    } else {
      alert('Preencha todos os campos.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome da Categoria</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Tipo</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'despesa' && styles.selectedType]}
          onPress={() => setType('despesa')}
        >
          <Text style={styles.typeButtonText}>Despesa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'receita' && styles.selectedType]}
          onPress={() => setType('receita')}
        >
          <Text style={styles.typeButtonText}>Receita</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateCategory}>
        <Text style={styles.createButtonText}>Criar</Text>
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selectedType: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});