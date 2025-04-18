import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CreateCategoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateCategory'>;

export default function CreateCategoryScreen() {
  const [name, setName] = useState('');
  const [type, setType] = useState('despesa');
  const [limiteGasto, setLimiteGasto] = useState('');
  const navigation = useNavigation<CreateCategoryScreenNavigationProp>();

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para a categoria');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erro', 'Usuário não autenticado');
        return;
      }
      
      // Decodificar o token JWT corretamente
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        Alert.alert('Erro', 'Token inválido');
        return;
      }
      
      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.id;

      if (!userId) {
        Alert.alert('Erro', 'ID do usuário não encontrado no token');
        return;
      }

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
          limite_gasto: limiteGasto ? parseFloat(limiteGasto) : null,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', 'Categoria criada com sucesso!');
        navigation.goBack();
      } else {
        Alert.alert('Erro', data.message || 'Erro ao criar categoria');
      }
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao criar a categoria');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Categoria</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome da categoria"
      />

      <Text style={styles.label}>Tipo:</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'receita' && styles.selectedType]}
          onPress={() => setType('receita')}
        >
          <Text style={[styles.typeText, type === 'receita' && styles.selectedTypeText]}>Receita</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'despesa' && styles.selectedType]}
          onPress={() => setType('despesa')}
        >
          <Text style={[styles.typeText, type === 'despesa' && styles.selectedTypeText]}>Despesa</Text>
        </TouchableOpacity>
      </View>

      {type === 'despesa' && (
        <>
          <Text style={styles.label}>Limite de Gastos (R$):</Text>
          <TextInput
            style={styles.input}
            value={limiteGasto}
            onChangeText={setLimiteGasto}
            placeholder="Limite de gastos"
            keyboardType="numeric"
          />
        </>
      )}

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.buttonText}>Criar Categoria</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  selectedType: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeText: {
    color: '#333',
  },
  selectedTypeText: {
    color: 'white',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});