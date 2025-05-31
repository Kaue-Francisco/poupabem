import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Expense } from '../types/expense';

type ExpenseDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  expense: Expense | null;
};

const { width } = Dimensions.get('window');

// Função para formatar valores monetários
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({
  visible,
  onClose,
  expense,
}) => {
  const [imageExpanded, setImageExpanded] = useState(false);
  if (!expense) {
    return null;
  }

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
            <Text style={styles.modalTitle}>Detalhes da Despesa</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Descrição:</Text>
              <Text style={styles.value}>{expense.description}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.label}>Valor:</Text>
              <Text style={[styles.value, styles.amount]}>
                {formatCurrency(expense.amount)}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.label}>Categoria:</Text>
              <Text style={styles.value}>{expense.category}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Text style={styles.label}>Data:</Text>
              <Text style={styles.value}>{expense.date}</Text>
            </View>

            {expense.image && expense.image !== 'null' && (
              <View style={styles.imageContainer}>
                <Text style={styles.label}>Comprovante:</Text>
                <TouchableOpacity
                  onPress={() => setImageExpanded(!imageExpanded)}
                  style={styles.imageWrapper}
                >
                  <Image
                    source={{ uri: expense.image }}
                    style={[
                      styles.image,
                      imageExpanded ? styles.expandedImage : null,
                    ]}
                    resizeMode={imageExpanded ? 'contain' : 'cover'}
                  />
                  {!imageExpanded && (
                    <View style={styles.expandIcon}>
                      <Icon name="expand" size={24} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailItem: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  amount: {
    color: '#E74C3C', // Vermelho para despesas
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: width * 0.8,
    height: 200,
    borderRadius: 8,
    alignSelf: 'center',
  },
  expandedImage: {
    width: width * 0.9,
    height: 300,
  },
  expandIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 5,
  },
});

export default ExpenseDetailModal;