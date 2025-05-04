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

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({
  visible,
  onClose,
  expense,
}) => {
  const [imageExpanded, setImageExpanded] = useState(false);
  if (!expense) {
    return null; // Retorna null se não houver despesa
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
            <Text>Descrição: {expense.description}</Text>
            <Text>Valor: R$ {expense.amount.toFixed(2)}</Text>
            <Text>Categoria: {expense.category}</Text>
            <Text>Data: {expense.date}</Text>
          </ScrollView>

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
  content: {
    flex: 1,
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
    color: '#27ae60',
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