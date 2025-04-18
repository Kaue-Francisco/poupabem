import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

type EditCategoryModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: {
    id: string;
    name: string;
    type: string;
    limite_gasto?: number;
  };
};

export default function EditCategoryModal({
  visible,
  onClose,
  onSuccess,
  category,
}: EditCategoryModalProps) {
  const [name, setName] = useState(category.name);
  const [type, setType] = useState(category.type);
  const [limiteGasto, setLimiteGasto] = useState(category.limite_gasto?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Atualizar o estado quando o componente recebe uma nova categoria
  useEffect(() => {
    setName(category.name);
    setType(category.type);
    setLimiteGasto(category.limite_gasto?.toString() || '');
    setShowWarning(false);
  }, [category]);

  // Verificar se o tipo está sendo alterado
  useEffect(() => {
    setShowWarning(type !== category.type);
  }, [type, category.type]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome da categoria é obrigatório');
      return;
    }

    // Verificar se nada foi alterado
    if (name === category.name && type === category.type && limiteGasto === category.limite_gasto?.toString()) {
      Alert.alert('Informação', 'Nenhuma alteração foi feita');
      onClose();
      return;
    }

    // Se o tipo está sendo alterado, confirmar com o usuário
    if (type !== category.type) {
      Alert.alert(
        'Atenção',
        `Você está alterando o tipo da categoria de ${category.type} para ${type}. Todas as transações relacionadas serão convertidas automaticamente. Deseja continuar?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Continuar',
            onPress: () => saveChanges(),
          },
        ]
      );
    } else {
      saveChanges();
    }
  };

  const saveChanges = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }

      const response = await fetch(`${apiConfig.baseUrl}/categoria/update/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: name,
          tipo: type,
          limite_gasto: limiteGasto ? parseFloat(limiteGasto) : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', data.message || 'Categoria atualizada com sucesso!');
        onSuccess();
        onClose();
      } else {
        console.error('Erro ao atualizar categoria:', data.message);
        Alert.alert('Erro', data.message || 'Não foi possível atualizar a categoria');
      }
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Categoria</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nome da categoria"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={type}
                onValueChange={(itemValue) => setType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Receita" value="receita" />
                <Picker.Item label="Despesa" value="despesa" />
              </Picker>
            </View>
          </View>

          {type === 'despesa' && (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Limite de Gastos (R$)</Text>
                <TextInput
                  style={styles.input}
                  value={limiteGasto}
                  onChangeText={setLimiteGasto}
                  placeholder="Limite de gastos"
                  keyboardType="numeric"
                />
              </View>
            </>
          )}

          {showWarning && (
            <View style={styles.warningContainer}>
              <Icon name="exclamation-triangle" size={16} color="#f0ad4e" style={styles.warningIcon} />
              <Text style={styles.warningText}>
                Alterar o tipo da categoria irá converter todas as transações relacionadas.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9e6',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#f0ad4e',
    marginVertical: 10,
  },
  warningIcon: {
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 