import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

type MetaFinanceira = {
  id: number;
  titulo: string;
  valor_meta: number;
  valor_atual: number;
  data_inicio: string;
  data_fim: string;
  tipo: string;
  categoria_id?: number;
  categoria_nome?: string;
  meta_batida: boolean;
};

export default function MetasFinanceirasScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [metas, setMetas] = useState<MetaFinanceira[]>([]);

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
        // Garantir que os valores numéricos sejam tratados corretamente
        const metasFormatadas = (data.metas || []).map((meta: any) => ({
          ...meta,
          valor_meta: Number(meta.valor_meta) || 0,
          valor_atual: Number(meta.valor_atual) || 0
        }));
        setMetas(metasFormatadas);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMetas();
    }, [])
  );

  const handleDelete = async (metaId: number) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return Alert.alert('Erro', 'Usuário não autenticado');

      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.deletarMeta(metaId)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Meta deletada com sucesso');
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

  const getProgresso = (meta: MetaFinanceira) => {
    if (!meta.valor_meta || meta.valor_meta === 0) return 0;
    
    if (meta.tipo === 'despesa' || meta.tipo === 'categoria') {
      const progresso = (meta.valor_atual / meta.valor_meta) * 100;
      return Math.min(progresso, 100);
    } else {
      const progresso = (meta.valor_atual / meta.valor_meta) * 100;
      return Math.min(progresso, 100);
    }
  };

  const isMetaBatida = (meta: MetaFinanceira) => {
    if (!meta.valor_meta || meta.valor_meta === 0) return false;
    
    if (meta.tipo === 'despesa' || meta.tipo === 'categoria') {
      return meta.valor_atual <= meta.valor_meta;
    } else {
      return meta.valor_atual >= meta.valor_meta;
    }
  };

  const formatDateDisplay = (dateString: string) => {
    try {
      // Verifica se a string está no formato esperado
      if (!dateString || typeof dateString !== 'string') {
        return 'Data inválida';
      }

      // Extrai os componentes da data diretamente da string
      const dateParts = dateString.split(' ');
      if (dateParts.length < 4) {
        return 'Data inválida';
      }

      const day = parseInt(dateParts[1], 10);
      const month = getMonthNumber(dateParts[2]);
      const year = parseInt(dateParts[3], 10);

      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return 'Data inválida';
      }

      // Formata a data no padrão brasileiro (DD/MM/YYYY)
      const formattedDay = day.toString().padStart(2, '0');
      const formattedMonth = month.toString().padStart(2, '0');
      return `${formattedDay}/${formattedMonth}/${year}`;
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getMonthNumber = (monthName: string): number => {
    const months = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    return months[monthName as keyof typeof months] || 0;
  };

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  const metasBatidas = metas.filter(meta => isMetaBatida(meta));
  const metasEmAndamento = metas.filter(meta => !isMetaBatida(meta));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {metasBatidas.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Metas Alcançadas 🎉</Text>
            {metasBatidas.map((meta) => (
              <View key={meta.id} style={[styles.metaCard, styles.metaBatidaCard]}>
                <View style={styles.metaHeader}>
                  <Text style={styles.metaTitle}>{meta.titulo}</Text>
                  <View style={styles.metaActions}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('CreateMeta', { metaToEdit: meta })}
                      style={styles.editButton}
                    >
                      <Icon name="edit" size={20} color="#1461de" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(meta.id)}
                      style={styles.deleteButton}
                    >
                      <Icon name="trash" size={20} color="#FF6347" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.metaInfo}>
                  <Text style={styles.metaValue}>
                    Valor Atual: {formatCurrency(meta.valor_atual)}
                  </Text>
                  <Text style={styles.metaValue}>
                    Meta: {formatCurrency(meta.valor_meta)}
                  </Text>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${getProgresso(meta)}%`,
                          backgroundColor: isMetaBatida(meta) ? '#28A745' : '#007AFF',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{getProgresso(meta).toFixed(1)}%</Text>
                </View>

                <View style={styles.metaDates}>
                  <Text style={styles.dateText}>
                    Início: {formatDateDisplay(meta.data_inicio)}
                  </Text>
                  <Text style={styles.dateText}>
                    Fim: {formatDateDisplay(meta.data_fim)}
                  </Text>
                </View>

                {meta.categoria_nome && (
                  <Text style={styles.categoryText}>
                    Categoria: {meta.categoria_nome}
                  </Text>
                )}

                {isMetaBatida(meta) && (
                  <Text style={styles.successText}>Meta alcançada! 🎉</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {metasEmAndamento.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Metas em Andamento</Text>
            {metasEmAndamento.map((meta) => (
              <View key={meta.id} style={styles.metaCard}>
                <View style={styles.metaHeader}>
                  <Text style={styles.metaTitle}>{meta.titulo}</Text>
                  <View style={styles.metaActions}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('CreateMeta', { metaToEdit: meta })}
                      style={styles.editButton}
                    >
                      <Icon name="edit" size={20} color="#1461de" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(meta.id)}
                      style={styles.deleteButton}
                    >
                      <Icon name="trash" size={20} color="#FF6347" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.metaInfo}>
                  <Text style={styles.metaValue}>
                    Valor Atual: {formatCurrency(meta.valor_atual)}
                  </Text>
                  <Text style={styles.metaValue}>
                    Meta: {formatCurrency(meta.valor_meta)}
                  </Text>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${getProgresso(meta)}%`,
                          backgroundColor: isMetaBatida(meta) ? '#28A745' : '#007AFF',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{getProgresso(meta).toFixed(1)}%</Text>
                </View>

                <View style={styles.metaDates}>
                  <Text style={styles.dateText}>
                    Início: {formatDateDisplay(meta.data_inicio)}
                  </Text>
                  <Text style={styles.dateText}>
                    Fim: {formatDateDisplay(meta.data_fim)}
                  </Text>
                </View>

                {meta.categoria_nome && (
                  <Text style={styles.categoryText}>
                    Categoria: {meta.categoria_nome}
                  </Text>
                )}

                {isMetaBatida(meta) && (
                  <Text style={styles.successText}>Meta alcançada! 🎉</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateMeta')}
      >
        <Text style={styles.addButtonText}>+ Nova Meta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  metaCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  metaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  metaActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 5,
    marginRight: 5,
  },
  deleteButton: {
    padding: 5,
  },
  metaInfo: {
    marginBottom: 10,
  },
  metaValue: {
    fontSize: 16,
    marginBottom: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  metaDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  successText: {
    color: '#28A745',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  metaBatidaCard: {
    borderColor: '#28A745',
    borderWidth: 2,
    backgroundColor: '#f0fff0',
  },
});
