import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Icon from 'react-native-vector-icons/FontAwesome';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [showReceitasTooltip, setShowReceitasTooltip] = useState(false);
  const [showDespesasTooltip, setShowDespesasTooltip] = useState(false);
  const [dicas, setDicas] = useState<{ [key: string]: number }>({});
  const [hasTodayAlerts, setHasTodayAlerts] = useState(false);

  const handleCategorias = () => {
    navigation.navigate('Categories');
  };

  const handleDespesas = () => {
    navigation.navigate('Expenses');
  };

  const handleReceitas = () => {
    navigation.navigate('Income');
  };

  const handleMetasFinanceiras = () => {
    navigation.navigate('MetasFinanceiras');
  };

  const handleAlert = () => {
    navigation.navigate('Alert');
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const fetchReceitas = async (token: string, userId: number) => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.totalReceita(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status) {
        setReceitas(Number(data.total));
      } else {
        console.error('Erro ao buscar receitas: Dados inválidos');
      }
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    }
  };

  const fetchDespesas = async (token: string, userId: number) => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.totalDespesa(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status) {
        setDespesas(Number(data.total));
      } else {
        console.error('Erro ao buscar despesas: Dados inválidos');
      }
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
    }
  };

  const fetchDicas = async (token: string, userId: number) => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.dicas(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status) {
        setDicas(data.dicas);
      }
    } catch (error) {
      console.error('Erro ao buscar dicas:', error);
    }
  };

  const checkTodayAlerts = async (token: string, userId: number) => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.verificarAlerta(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setHasTodayAlerts(data.alertas_disparados && data.alertas_disparados.length > 0);
    } catch (error) {
      console.error('Erro ao verificar alertas:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('Token not found');
          return;
        }
        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.id;
        await fetchReceitas(token, userId);
        await fetchDespesas(token, userId);
        await fetchDicas(token, userId);
        await checkTodayAlerts(token, userId);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchData);

    return unsubscribe;
  }, [navigation]);

  const handleShowReceitasTooltip = () => {
    setShowReceitasTooltip(true);
    setTimeout(() => setShowReceitasTooltip(false), 2000); // Oculta o balão após 2 segundos
  };

  const handleShowDespesasTooltip = () => {
    setShowDespesasTooltip(true);
    setTimeout(() => setShowDespesasTooltip(false), 2000); // Oculta o balão após 2 segundos
  };

  return (
    <ScrollView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>PoupaBem</Text>
      <TouchableOpacity onPress={handleAlert}>
        <View style={styles.bellContainer}>
          <Icon 
            name="bell" 
            size={20} 
            color={hasTodayAlerts ? '#FF9800' : '#fff'} 
            style={styles.headerIcon}
          />
          {hasTodayAlerts && <View style={styles.bellBadge} />}
        </View>
      </TouchableOpacity>
    </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Receitas</Text>
          <TouchableOpacity onPress={handleShowReceitasTooltip}>
            <Text
              style={[styles.summaryValue, styles.incomeValue]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formatCurrency(receitas)}
            </Text>
          </TouchableOpacity>
          {showReceitasTooltip && (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>{formatCurrency(receitas)}</Text>
            </View>
          )}
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Despesas</Text>
          <TouchableOpacity onPress={handleShowDespesasTooltip}>
            <Text
              style={[styles.summaryValue, styles.expenseValue]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formatCurrency(despesas)}
            </Text>
          </TouchableOpacity>
          {showDespesasTooltip && (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>{formatCurrency(despesas)}</Text>
            </View>
          )}
        </View>
      </View>

      {Object.keys(dicas).length > 0 && (
        <View style={styles.dicasContainer}>
          <Text style={styles.dicasTitle}>Dicas</Text>
          {Object.entries(dicas).map(([data, quantidade]) => (
            <View key={data} style={styles.dicaItem}>
              <Text style={styles.dicaText}>
                Você registrou {quantidade} despesas em {new Date(data).toLocaleDateString('pt-BR')}
              </Text>
              <Text style={styles.dicaAviso}>
                {quantidade > 3 ? 'Cuidado! Você está gastando muito hoje.' : 'Continue controlando seus gastos!'}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleCategorias}>
          <Text style={styles.menuItemTitle}>Categorias</Text>
          <Text style={styles.menuItemDescription}>Gerencie suas categorias</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleDespesas}>
          <Text style={styles.menuItemTitle}>Despesas</Text>
          <Text style={styles.menuItemDescription}>Registre suas despesas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleReceitas}>
          <Text style={styles.menuItemTitle}>Receitas</Text>
          <Text style={styles.menuItemDescription}>Registre suas receitas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleMetasFinanceiras}>
          <Text style={styles.menuItemTitle}>Metas Financeiras</Text>
          <Text style={styles.menuItemDescription}>Gerencie as suas metas</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Garante que o texto e o ícone fiquem nos extremos
    backgroundColor: '#3333fd',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1, // Permite que o texto ocupe o espaço central
  },
  headerIcon: {
    marginLeft: 'auto', // Garante que o ícone fique no canto direito
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 5,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  incomeValue: {
    color: '#34C759',
  },
  expenseValue: {
    color: '#FF3B30',
  },
  tooltip: {
    position: 'absolute',
    top: -30,
    left: 10,
    backgroundColor: '#333',
    padding: 5,
    borderRadius: 5,
    zIndex: 1,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  dicasContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dicasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  dicaItem: {
    marginBottom: 10,
  },
  dicaText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dicaAviso: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  bellContainer: {
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
});