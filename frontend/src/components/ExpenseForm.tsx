import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { Category } from '../types/expense';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Configuração da localização
LocaleConfig.locales['pt'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
};

LocaleConfig.defaultLocale = 'pt';

type ExpenseFormProps = {
  description: string;
  imageUrl: string | null;
  amount: string;
  category: string;
  date: string;
  categories: Category[];
  loading: boolean;
  onDescriptionChange: (text: string) => void;
  onAmountChange: (text: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (date: string) => void;
  onImageChange: (uri: string | null) => void;
  onSubmit: () => void;
};

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  description,
  imageUrl,
  amount,
  category,
  date,
  categories,
  loading,
  onDescriptionChange,
  onAmountChange,
  onCategoryChange,
  onDateChange,
  onImageChange,
  onSubmit,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return 'Selecionar Data';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR');
  };

  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'É necessário permitir o acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    onImageChange(result.assets ? result.assets[0].uri : null);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      setImage(null);
    }
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Adicionar Despesa</Text>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={onDescriptionChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={amount}
        onChangeText={onAmountChange}
        keyboardType="numeric"
      />
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setCalendarVisible(true)}
      >
        <Text>{formatDateDisplay(date)}</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#3498DB" />
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={onCategoryChange}
            style={styles.picker}
            dropdownIconColor="#3498DB"
          >
            <Picker.Item label="Selecione uma categoria" value="" />
            {categories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.nome} value={cat.id.toString()} />
            ))}
          </Picker>
        </View>
      )}
      
      <TouchableOpacity style={styles.cameraButton} onPress={handleOpenCamera}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Adicionar Imagem</Text>
        <Icon name="camera" size={24} color="#fff" />
      </TouchableOpacity>
      
      {image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.previewImage}
          />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => {
              setImage(null);
              onImageChange(null);
            }}
          >
            <Icon name="close" size={24} color="#E74C3C" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          onSubmit();
          setImage(null);
          onImageChange(null);
        }}
      >
        <Text style={styles.addButtonText}>Adicionar Despesa</Text>
      </TouchableOpacity>

      <Modal visible={calendarVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.calendarBox}>
            <Calendar
              onDayPress={(day) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selectedDate = new Date(day.dateString);
                selectedDate.setHours(0, 0, 0, 0);

                if (selectedDate > today) {
                  Alert.alert('Erro', 'Não é possível selecionar uma data futura');
                  return;
                }

                onDateChange(day.dateString);
                setCalendarVisible(false);
              }}
              monthFormat={'MMMM yyyy'}
              hideArrows={false}
              hideExtraDays={true}
              firstDay={0}
              enableSwipeMonths={true}
              markedDates={{
                [date]: {selected: true, selectedColor: '#3498DB'}
              }}
              theme={{
                textMonthFontWeight: 'bold',
                textMonthFontSize: 16,
                monthTextColor: '#3498DB',
                textSectionTitleColor: '#3498DB',
                todayTextColor: '#FF0000',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                arrowColor: '#3498DB',
              }}
            />
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginVertical: 10,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 1,
    borderRadius: 12,
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#7F8C8D',
  },
  input: {
    height: 45,
    borderColor: '#BDC3C7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#ECF0F1',
    justifyContent: 'center',
  },
  cameraButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#3498DB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#BDC3C7',
    borderRadius: 8,
    backgroundColor: '#ECF0F1',
    marginBottom: 10,
    overflow: 'hidden',
    paddingHorizontal: 5,
  },
  picker: {
    height: 50,
    color: '#34495E',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#3498DB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  cancelButton: {
    backgroundColor: '#888',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});