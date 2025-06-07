import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import Icon from 'react-native-vector-icons/FontAwesome';
import { apiConfig } from '../../config/api';
import ResumoScreen from './ResumoScreen';
import OrcamentosScreen from './OrcamentosScreen';
import GraficosScreen from './GraficosScreen';
import { BudgetItem, DicaItem, HomeScreenNavigationProp } from '../../types/homeTypes';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [receitas, setReceitas] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [showReceitasTooltip, setShowReceitasTooltip] = useState(false);
  const [showDespesasTooltip, setShowDespesasTooltip] = useState(false);
  const [dicas, setDicas] = useState<DicaItem>({});
  const [hasTodayAlerts, setHasTodayAlerts] = useState(false);
  const [activeTab, setActiveTab] = useState<'resumo' | 'orcamentos' | 'graficos'>('resumo');

  const handleCategorias = () => navigation.navigate('Categories');
  const handleDespesas = () => navigation.navigate('Expenses');
  const handleReceitas = () => navigation.navigate('Income');
  const handleMetasFinanceiras = () => navigation.navigate('MetasFinanceiras');
  const handleAlert = () => navigation.navigate('Alert');

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

  const handleShowReceitasTooltip = () => {
    setShowReceitasTooltip(true);
    setTimeout(() => setShowReceitasTooltip(false), 2000);
  };

  const handleShowDespesasTooltip = () => {
    setShowDespesasTooltip(true);
    setTimeout(() => setShowDespesasTooltip(false), 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;
        
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

  return (
    <View style={styles.container}>
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

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'resumo' && styles.activeTab]}
          onPress={() => setActiveTab('resumo')}
        >
          <Text style={styles.tabText}>Resumo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'orcamentos' && styles.activeTab]}
          onPress={() => setActiveTab('orcamentos')}
        >
          <Text style={styles.tabText}>Orçamentos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'graficos' && styles.activeTab]}
          onPress={() => setActiveTab('graficos')}
        >
          <Text style={styles.tabText}>Gráficos</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'resumo' && (
        <ResumoScreen
          receitas={receitas}
          despesas={despesas}
          dicas={dicas}
          hasTodayAlerts={hasTodayAlerts}
          showReceitasTooltip={showReceitasTooltip}
          showDespesasTooltip={showDespesasTooltip}
          handleShowReceitasTooltip={handleShowReceitasTooltip}
          handleShowDespesasTooltip={handleShowDespesasTooltip}
          handleCategorias={handleCategorias}
          handleDespesas={handleDespesas}
          handleReceitas={handleReceitas}
          handleMetasFinanceiras={handleMetasFinanceiras}
          handleAlert={handleAlert}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'orcamentos' && (
        <OrcamentosScreen 
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'graficos' && <GraficosScreen />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3333fd',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  headerIcon: {
    marginLeft: 'auto',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#3333fd',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
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

export default HomeScreen;