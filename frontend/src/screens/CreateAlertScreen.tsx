import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { jwtDecode } from 'jwt-decode';

type CreateAlertScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateAlert'>;
type RouteParams = {
    alertToEdit?: {
        id: number;
        titulo: string;
        descricao: string;
        data_alerta: string;
    };
};

export default function CreateAlertScreen() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataAlerta, setDataAlerta] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation<CreateAlertScreenNavigationProp>();
  const route = useRoute();
  const params = route.params as RouteParams;

  useEffect(() => {
    if (params?.alertToEdit) {
      setIsEditing(true);
      setTitulo(params.alertToEdit.titulo);
      setDescricao(params.alertToEdit.descricao);
      setDataAlerta(params.alertToEdit.data_alerta);
    }
  }, [params]);

  const handleCreate = async () => {
    if (!titulo.trim() || !descricao.trim() || !dataAlerta.trim()) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas a data

    const selectedDate = new Date(dataAlerta);
    // Ajustar o horário para compensar o fuso horário
    selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset());
    selectedDate.setHours(0, 0, 0, 0);

    console.log('Selected Date:', selectedDate);
    console.log('Today:', today);

    if (selectedDate < today) {
        Alert.alert('Erro', 'Não é possível criar alertas para dias anteriores');
        return;
    }

    try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
            Alert.alert('Erro', 'Usuário não autenticado');
            return;
        }
        
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.id;

        const endpoint = isEditing 
            ? `${apiConfig.baseUrl}${apiConfig.endpoints.atualizarAlerta}`
            : `${apiConfig.baseUrl}${apiConfig.endpoints.criarAlerta}`;

        const method = isEditing ? 'PUT' : 'POST';

        const body = isEditing
            ? {
                alert_id: params.alertToEdit?.id,
                usuario_id: userId,
                titulo,
                descricao,
                data_alerta: dataAlerta,
            }
            : {
                usuario_id: userId,
                titulo,
                descricao,
                data_alerta: dataAlerta,
            };

        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        if (response.ok) {
            Alert.alert('Sucesso', `Alerta ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
            navigation.goBack();
        } else {
            Alert.alert('Erro', data.message || `Erro ao ${isEditing ? 'atualizar' : 'criar'} alerta`);
        }
    } catch (error) {
        console.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} alerta:`, error);
        Alert.alert('Erro', `Ocorreu um erro ao ${isEditing ? 'atualizar' : 'criar'} o alerta`);
    }
};

  const formatDateDisplay = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditing ? 'Editar Alerta' : 'Criar Novo Alerta'}</Text>

      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Título do alerta"
      />

      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Descrição do alerta"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Data do Alerta:</Text>
      <TouchableOpacity 
        style={styles.input} 
        onPress={() => setCalendarVisible(true)}
      >
        <Text>{dataAlerta ? formatDateDisplay(dataAlerta) : 'Selecionar Data'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.buttonText}>{isEditing ? 'Atualizar Alerta' : 'Criar Alerta'}</Text>
      </TouchableOpacity>

      <Modal visible={calendarVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.calendarBox}>
            <Calendar onDayPress={(day) => {
              setDataAlerta(day.dateString);
              setCalendarVisible(false);
            }} />
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
}); 