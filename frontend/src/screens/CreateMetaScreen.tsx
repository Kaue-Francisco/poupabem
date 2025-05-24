import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type RouteParams = {
  metaToEdit?: {
    id: number;
    titulo: string;
    valor_meta: number;
    data_inicio: string;
    data_fim: string;
    tipo: string;
    categoria_id?: number;
  };
};

export default function CreateMetaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const params = route.params as RouteParams;

  const [titulo, setTitulo] = useState('');
  const [valorMeta, setValorMeta] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipo, setTipo] = useState('geral');
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>([]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<'inicio' | 'fim' | null>(null);

  const isEditing = !!params?.metaToEdit;

  useEffect(() => {
    fetchCategorias();
    if (isEditing && params.metaToEdit) {
      setTitulo(params.metaToEdit.titulo);
      setValorMeta(params.metaToEdit.valor_meta.toString());
      setDataInicio(params.metaToEdit.data_inicio);
      setDataFim(params.metaToEdit.data_fim);
      setTipo(params.metaToEdit.tipo);
      setCategoriaId(params.metaToEdit.categoria_id || null);
    }
  }, []);

  const fetchCategorias = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return Alert.alert('Erro', 'Usuário não autenticado');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.listarCategorias(userId)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setCategorias(data.categorias || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!titulo.trim() || !valorMeta.trim() || !dataInicio.trim() || !dataFim.trim()) {
      return Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
    }

    if (tipo === 'categoria' && !categoriaId) {
      return Alert.alert('Erro', 'Por favor, selecione uma categoria');
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return Alert.alert('Erro', 'Usuário não autenticado');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      // Verifica se o valor contém caracteres inválidos
      if (valorMeta.includes('-')) {
        Alert.alert('Erro', 'Não utilize o sinal de menos (-) no valor');
        return;
      }
      else if (valorMeta.includes(' ')) {
        Alert.alert('Erro', 'Não utilize espaços no valor');
        return;
      }
  
      // Verifica se o valor é um número válido e maior que zero
      if (isNaN(parseFloat(valorMeta))) {
        Alert.alert('Erro', 'O valor deve ser um número válido');
        return;
      }

      if (parseFloat(valorMeta) <= 0) {
        Alert.alert('Erro', 'O valor deve ser maior que zero');
        return;
      }

      // Padroniza o valor de valorMeta para o padrão brasileiro
      const valorMetaFormatado = valorMeta.replace('.', ',');

      const body = {
        meta_id: isEditing ? params.metaToEdit?.id : undefined,
        usuario_id: userId,
        titulo,
        valor_meta: parseFloat(valorMeta),
        data_inicio: dataInicio,
        data_fim: dataFim,
        tipo,
        categoria_id: categoriaId
      };

      const endpoint = isEditing
        ? `${apiConfig.baseUrl}${apiConfig.endpoints.atualizarMeta}`
        : `${apiConfig.baseUrl}${apiConfig.endpoints.criarMeta}`;

      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', isEditing ? 'Meta atualizada com sucesso' : 'Meta criada com sucesso');
        navigation.goBack();
      } else {
        Alert.alert('Erro', data.message || 'Erro ao salvar meta');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao salvar meta');
    }
  };

  const formatDateDisplay = (dateString: string) => {
    try {
  
      // Cria um objeto Date a partir da string recebida
      const date = new Date(dateString);
  
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
  
      // Extrai os componentes da data no horário UTC
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Mês é base 0
      const year = date.getUTCFullYear();
  
      // Retorna a data formatada no padrão brasileiro (DD/MM/YYYY)
      return `${day}/${month}/${year}`;
    } catch (error) {
      return 'Data inválida';
    }
  };

  const openCalendar = (target: 'inicio' | 'fim') => {
    setCalendarTarget(target);
    setCalendarVisible(true);
  };

  const onDateSelected = (day: { dateString: string }) => {
    if (calendarTarget === 'inicio') setDataInicio(day.dateString);
    else if (calendarTarget === 'fim') setDataFim(day.dateString);
    setCalendarVisible(false);
    setCalendarTarget(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Título da Meta"
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder="Valor da Meta"
          value={valorMeta}
          onChangeText={setValorMeta}
          keyboardType="numeric"
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Tipo da Meta:</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={tipo}
              onValueChange={(itemValue) => setTipo(itemValue)}
            >
              <Picker.Item label="Geral" value="geral" />
              <Picker.Item label="Por Categoria" value="categoria" />
              <Picker.Item label="Receita" value="receita" />
              <Picker.Item label="Despesa" value="despesa" />
            </Picker>
          </View>
        </View>

        {tipo === 'categoria' && (
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Categoria:</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={categoriaId}
                onValueChange={(itemValue) => setCategoriaId(itemValue)}
              >
                <Picker.Item label="Selecione uma categoria" value={null} />
                {categorias.map((categoria) => (
                  <Picker.Item key={categoria.id} label={categoria.nome} value={categoria.id} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        <TouchableOpacity onPress={() => openCalendar('inicio')} style={styles.input}>
          <Text>{dataInicio ? formatDateDisplay(dataInicio) : 'Selecionar Data de Início'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openCalendar('fim')} style={styles.input}>
          <Text>{dataFim ? formatDateDisplay(dataFim) : 'Selecionar Data de Fim'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>{isEditing ? 'Atualizar Meta' : 'Salvar Meta'}</Text>
        </TouchableOpacity>
      </View>

      {calendarVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.calendarBox}>
            <Calendar onDayPress={onDateSelected} />
            <TouchableOpacity onPress={() => setCalendarVisible(false)} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  form: {
    backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 20, elevation: 3,
  },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, marginBottom: 10, backgroundColor: 'white',
  },
  saveButton: {
    backgroundColor: '#28A745', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#888', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  modalContainer: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  calendarBox: {
    backgroundColor: 'white', borderRadius: 10, padding: 20, width: '90%',
  },
  pickerContainer: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: 'white',
    marginBottom: 10,
  },
}); 