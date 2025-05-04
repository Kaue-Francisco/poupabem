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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { Category } from '../types/expense';

type ExpenseFormProps = {
  description: string;
  imageUrl: string | null;
  amount: string;
  category: string;
  categories: Category[];
  loading: boolean;
  onDescriptionChange: (text: string) => void;
  onAmountChange: (text: string) => void;
  onCategoryChange: (value: string) => void;
  onImageChange: (uri: string | null) => void;
  onSubmit: () => void;
};

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  description,
  imageUrl,
  amount,
  category,
  categories,
  loading,
  onDescriptionChange,
  onAmountChange,
  onCategoryChange,
  onImageChange,
  onSubmit,
}) => {
  const [image, setImage] = useState<string | null>(null);

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
          setImage(null); // Limpa a imagem
          onImageChange(null); // Reseta a imagem no estado pai
        }}
      >
        <Text style={styles.addButtonText}>Adicionar Despesa</Text>
      </TouchableOpacity>
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
  input: {
    height: 45,
    borderColor: '#BDC3C7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#ECF0F1',
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
});