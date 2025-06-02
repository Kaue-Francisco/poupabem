import React, { useEffect, useState } from 'react';
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
import { WebView } from 'react-native-webview';
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
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (expense) {
      console.log('Dados de localização:', {
        expense
      });
      
      // Convertendo as strings para números
      const lat = expense.latitude ? parseFloat(String(expense.latitude)) : 0;
      const lng = expense.longitude ? parseFloat(String(expense.longitude)) : 0;
      
      setCurrentLocation({
        latitude: lat,
        longitude: lng
      });

      console.log('Localização convertida:', {
        latitude: lat,
        longitude: lng
      });
    }
  }, [expense]);

  const getMapHTML = () => {
    if (!currentLocation || currentLocation.latitude === 0 || currentLocation.longitude === 0) {
      return '';
    }
    
    return `
      <html>
        <body style="margin:0;">
          <iframe 
            src="https://maps.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}&z=15&output=embed&markers=color:red%7C${currentLocation.latitude},${currentLocation.longitude}"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </body>
      </html>
    `;
  };

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

            {currentLocation && currentLocation.latitude !== 0 && currentLocation.longitude !== 0 && (
              <View style={styles.mapContainer}>
                <Text style={styles.label}>Localização:</Text>
                <View style={styles.mapWrapper}>
                  <WebView
                    source={{ html: getMapHTML() }}
                    style={styles.map}
                    scrollEnabled={false}
                    javaScriptEnabled={true}
                  />
                </View>
                <Text style={styles.coordinatesText}>
                  Lat: {currentLocation.latitude.toFixed(6)}, Long: {currentLocation.longitude.toFixed(6)}
                </Text>
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
  coordinatesText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
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
  mapContainer: {
    marginTop: 15,
  },
  mapWrapper: {
    height: 200,
    marginTop: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});

export default ExpenseDetailModal;