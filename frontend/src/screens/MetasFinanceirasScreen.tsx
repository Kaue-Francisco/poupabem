import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';

interface MetaFinanceira {
  id: number;
  usuario_id: number;
  titulo: string;
  valor_meta: number;
  data_inicio: string;
  data_fim: string;
}

export default function MetasFinanceirasScreen() {
  const [metas, setMetas] = useState<MetaFinanceira[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [valorMeta, setValorMeta] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [editingMetaId, setEditingMetaId] = useState<number | null>(null);

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState<'inicio' | 'fim' | null>(null);

  useEffect(() => {
    fetchMetas();
  }, []);

  const fetchMetas = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return Alert.alert('Erro', 'Usuário não autenticado');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.listarMetas(userId)}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setMetas(data.metas || []);
      } else {
        Alert.alert('Erro', data.message || 'Erro ao listar metas');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao listar metas');
    }
  };

  const handleSave = async () => {
    if (!titulo.trim() || !valorMeta.trim() || !dataInicio.trim() || !dataFim.trim()) {
      return Alert.alert('Erro', 'Por favor, preencha todos os campos');
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return Alert.alert('Erro', 'Usuário não autenticado');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.id;

      const body = {
        usuario_id: userId,
        titulo,
        valor_meta: parseFloat(valorMeta),
        data_inicio: dataInicio,
        data_fim: dataFim,
        ...(editingMetaId !== null && { id: editingMetaId }),
      };

      const endpoint = editingMetaId !== null
        ? `${apiConfig.baseUrl}${apiConfig.endpoints.atualizarMeta}`
        : `${apiConfig.baseUrl}${apiConfig.endpoints.criarMeta}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', editingMetaId !== null ? 'Meta atualizada' : 'Meta criada');
        resetForm();
        fetchMetas();
      } else {
        Alert.alert('Erro', data.message || 'Erro ao salvar meta');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao salvar meta');
    }
  };

  const handleDelete = async (metaId: number) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return Alert.alert('Erro', 'Usuário não autenticado');

      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.deletarMeta(metaId)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Meta deletada');
        fetchMetas();
      } else {
        const data = await response.json();
        Alert.alert('Erro', data.message || 'Erro ao deletar meta');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao deletar meta');
    }
  };

  const resetForm = () => {
    setTitulo('');
    setValorMeta('');
    setDataInicio('');
    setDataFim('');
    setEditingMetaId(null);
    setShowForm(false);
  };

  const handleEdit = (meta: MetaFinanceira) => {
    setTitulo(meta.titulo);
    setValorMeta(meta.valor_meta.toString());
    setDataInicio(formatDateInput(meta.data_inicio));
    setDataFim(formatDateInput(meta.data_fim));
    setEditingMetaId(meta.id);
    setShowForm(true);
  };

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatDateInput = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

      {showForm && (
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

          <TouchableOpacity onPress={() => openCalendar('inicio')} style={styles.input}>
            <Text>{dataInicio ? formatDateDisplay(dataInicio) : 'Selecionar Data de Início'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openCalendar('fim')} style={styles.input}>
            <Text>{dataFim ? formatDateDisplay(dataFim) : 'Selecionar Data de Fim'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>{editingMetaId !== null ? 'Atualizar Meta' : 'Salvar Meta'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={metas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text>Valor da Meta: R$ {item.valor_meta}</Text>
            <Text>Início: {formatDateDisplay(item.data_inicio)}</Text>
            <Text>Fim: {formatDateDisplay(item.data_fim)}</Text>
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma meta financeira encontrada.</Text>}
      />

      <TouchableOpacity style={styles.createButton} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.buttonText}>{showForm ? 'Cancelar' : 'Criar Nova Meta'}</Text>
      </TouchableOpacity>

      <Modal visible={calendarVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.calendarBox}>
            <Calendar onDayPress={onDateSelected} />
            <TouchableOpacity onPress={() => setCalendarVisible(false)} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  createButton: {
    backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#28A745', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#888', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  form: {
    backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 20, elevation: 3,
  },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 5, padding: 10, marginBottom: 10, backgroundColor: 'white',
  },
  card: {
    backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardActions: {
    flexDirection: 'row', marginTop: 10, justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#FFC107', padding: 10, borderRadius: 5, flex: 1, marginRight: 5, alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#DC3545', padding: 10, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: 'center',
  },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#777' },
  modalContainer: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  calendarBox: {
    backgroundColor: 'white', borderRadius: 10, padding: 20, width: '90%',
  },
});
