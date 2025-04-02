import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: string;
};

type CategoryTransactionsModalProps = {
  visible: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
  categoryType: string;
};

export default function CategoryTransactionsModal({
  visible,
  onClose,
  categoryId,
  categoryName,
  categoryType,
}: CategoryTransactionsModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchTransactions();
    }
  }, [visible, categoryId]);

  const fetchTransactions = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token não encontrado');
        return;
      }
  
      const endpoint =
        categoryType === 'despesa'
          ? apiConfig.endpoints.despesasPorCategoria(categoryId)
          : apiConfig.endpoints.receitasPorCategoria(categoryId);
  
      const response = await fetch(`${apiConfig.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        console.log(response)
        console.error('Erro na resposta da API:', response.status);
        return;
      }
  
      const data = await response.json();
  
      const dados = data.despesas || data.receitas;

      if (data.status && dados) {
        const mappedTransactions = dados.map((trans: any) => ({
          id: trans.id.toString(),
          description: trans.descricao,
          amount: trans.valor,
          date: new Date(trans.data).toLocaleDateString('pt-BR'),
          type: 'despesa', // Adicionado manualmente, já que o tipo não está no retorno
        }));
        setTransactions(mappedTransactions);
      } else {
        console.warn('Dados inesperados no retorno da API:', data);
      }
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: categoryType === 'despesa' ? '#FF6347' : '#32CD32' },
        ]}
      >
        R$ {item.amount.toFixed(2)}
      </Text>
    </View>
  );

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
            <Text style={styles.modalTitle}>
              Transações - {categoryName}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <FlatList
              data={transactions}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={styles.transactionList}
            />
          )}
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
    height: '80%',
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
  transactionList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    color: '#333',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 