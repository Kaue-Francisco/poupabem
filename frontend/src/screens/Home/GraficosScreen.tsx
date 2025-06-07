import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { apiConfig } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import { PieChart, LineChart } from 'react-native-chart-kit';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

const getMonthName = (monthNumber: string) => {
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  const monthIndex = parseInt(monthNumber) - 1;
  return months[monthIndex] || monthNumber;
};

const GraficosScreen: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [allExpenses, setAllExpenses] = useState<any[]>([]);
  const [allIncomes, setAllIncomes] = useState<any[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [totalIncomes, setTotalIncomes] = useState<number>(0);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date>(moment().startOf('month').toDate());
  const [endDate, setEndDate] = useState<Date>(moment().endOf('month').toDate());
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [hasData, setHasData] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  const categoryColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
    '#FF9F40', '#8AC24A', '#607D8B', '#E91E63', '#00BCD4'
  ];

  useEffect(() => {
    const loadTokenAndUserId = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (!storedToken) {
          console.error('Token não encontrado');
          return;
        }
        setToken(storedToken);
        
        const decodedToken = jwtDecode(storedToken) as { id: string };
        const userId = parseInt(decodedToken.id);
        
        if (isNaN(userId)) {
          console.error('ID do usuário inválido no token');
          return;
        }
        setUserId(userId);
        
        // Carregar categorias primeiro
        const categoriasResponse = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.listarCategorias(userId)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`,
          },
        });
        const todasCategorias = await categoriasResponse.json();
        setCategories(todasCategorias.categorias || []);
        
        // Depois carregar despesas e receitas
        fetchData(storedToken, userId);
      } catch (error) {
        console.error('Erro ao carregar token e ID do usuário:', error);
      }
    };

    loadTokenAndUserId();
  }, []);

  useEffect(() => {
    if (allExpenses.length > 0 || allIncomes.length > 0) {
      filterDataByPeriod();
    }
  }, [startDate, endDate, allExpenses, allIncomes, categories]);

  const fetchData = async (token: string, userId: number) => {
    try {
      const [despesasResponse, receitasResponse] = await Promise.all([
        fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.listarDespesas(userId)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.listarReceitas(userId)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
      ]);

      const despesas = await despesasResponse.json();
      const receitas = await receitasResponse.json();
      
      setAllExpenses(despesas.despesas || []);
      setAllIncomes(receitas.receitas || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const filterDataByPeriod = () => {
    const start = moment(startDate).startOf('day');
    const end = moment(endDate).endOf('day');

    // Filtrar despesas e receitas pelo período
    const filteredExpenses = allExpenses.filter((expense: any) => {
      const expenseDate = moment(expense.data);
      return expenseDate.isBetween(start, end, null, '[]');
    });

    const filteredIncomes = allIncomes.filter((income: any) => {
      const incomeDate = moment(income.data);
      return incomeDate.isBetween(start, end, null, '[]');
    });

    const hasDataToShow = filteredExpenses.length > 0 || filteredIncomes.length > 0;
    setHasData(hasDataToShow);

    if (hasDataToShow) {
      // Calcular totais
      const totalExpensesValue = filteredExpenses.reduce((sum: number, expense: any) => sum + expense.valor, 0);
      const totalIncomesValue = filteredIncomes.reduce((sum: number, income: any) => sum + income.valor, 0);
      
      setTotalExpenses(totalExpensesValue);
      setTotalIncomes(totalIncomesValue);
      
      // Processar categorias de despesas
      const expenseCategories = categories.filter((cat: any) => cat.tipo === 'despesa');
      
      // Agrupar despesas por categoria_id
      const expensesByCategoryId = new Map();
      filteredExpenses.forEach((expense: any) => {
        const categoryId = expense.categoria_id;
        expensesByCategoryId.set(
          categoryId, 
          (expensesByCategoryId.get(categoryId) || 0) + expense.valor
        );
      });

      // Preparar dados para o gráfico
      const expensesByCat = [];
      
      // Adicionar categorias encontradas nas despesas
      expensesByCategoryId.forEach((amount, categoryId) => {
        const category = categories.find(cat => cat.id === categoryId);
        if (category) {
          expensesByCat.push({
            name: category.nome,
            amount: amount,
            color: categoryColors[categoryId % categoryColors.length],
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
          });
        } else {
          // Se a categoria não for encontrada (pode ser deletada)
          expensesByCat.push({
            name: `Categoria ${categoryId} (não encontrada)`,
            amount: amount,
            color: categoryColors[categoryId % categoryColors.length],
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
          });
        }
      });

      // Ordenar por valor decrescente
      expensesByCat.sort((a, b) => b.amount - a.amount);
      
      setExpensesByCategory(expensesByCat);
      
      // Calcular evolução mensal
      const monthlyExpenses: Record<string, number> = {};
      const monthlyIncomes: Record<string, number> = {};
      
      filteredExpenses.forEach((expense: any) => {
        const month = expense.data.substring(0, 7);
        monthlyExpenses[month] = (monthlyExpenses[month] || 0) + expense.valor;
      });
      
      filteredIncomes.forEach((income: any) => {
        const month = income.data.substring(0, 7);
        monthlyIncomes[month] = (monthlyIncomes[month] || 0) + income.valor;
      });
      
      const allMonths = Array.from(new Set([
        ...Object.keys(monthlyExpenses),
        ...Object.keys(monthlyIncomes)
      ])).sort();
      
      const monthlyChartData = allMonths.map(month => ({
        month,
        expenses: monthlyExpenses[month] || 0,
        incomes: monthlyIncomes[month] || 0
      }));
      
      setMonthlyData(monthlyChartData);
    } else {
      setExpensesByCategory([]);
      setTotalExpenses(0);
      setTotalIncomes(0);
      setMonthlyData([]);
    }
  };

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date: Date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date: Date) => {
    setEndDate(date);
    hideEndDatePicker();
  };

  const renderNoDataMessage = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataText}>Nenhum dado disponível para o período selecionado</Text>
    </View>
  );

  return (
    <ScrollView style={styles.tabContent}>
      <View style={styles.chartsContainer}>
        <Text style={styles.sectionTitle}>Análise Financeira</Text>
        
        {/* Seletor de Período */}
        <View style={styles.dateSelectorContainer}>
          <TouchableOpacity onPress={showStartDatePicker} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              De: {moment(startDate).format('DD/MM/YYYY')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={showEndDatePicker} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              Até: {moment(endDate).format('DD/MM/YYYY')}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isStartDatePickerVisible}
          mode="date"
          onConfirm={handleStartDateConfirm}
          onCancel={hideStartDatePicker}
          maximumDate={endDate}
        />

        <DateTimePickerModal
          isVisible={isEndDatePickerVisible}
          mode="date"
          onConfirm={handleEndDateConfirm}
          onCancel={hideEndDatePicker}
          minimumDate={startDate}
          maximumDate={new Date()}
        />

        {!hasData ? (
          renderNoDataMessage()
        ) : (
          <>
            {/* 1. Gráfico de Receitas vs Despesas */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Receitas vs Despesas</Text>
              {totalIncomes > 0 || totalExpenses > 0 ? (
                <PieChart
                  data={[
                    {
                      name: 'Receitas',
                      amount: totalIncomes,
                      color: '#4CAF50',
                      legendFontColor: '#7F7F7F',
                      legendFontSize: 12
                    },
                    {
                      name: 'Despesas',
                      amount: totalExpenses,
                      color: '#F44336',
                      legendFontColor: '#7F7F7F',
                      legendFontSize: 12
                    }
                  ]}
                  width={screenWidth - 40}
                  height={200}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForLabels: { fontSize: 0 }
                  }}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                  style={styles.chart}
                  hasLegend={true}
                  avoidFalseZero={true}
                  formatLegendLabel={(value, name) => `${name}: R$ ${value.toFixed(2)}`}
                />
              ) : (
                <Text style={styles.noDataText}>Nenhuma transação no período</Text>
              )}
            </View>
            
            {/* 2. Gráfico de Despesas por Categoria */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Despesas por Categoria</Text>
              {totalExpenses > 0 ? (
                expensesByCategory.length > 0 ? (
                  <PieChart
                    data={expensesByCategory}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={{
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      propsForLabels: { fontSize: 0 }
                    }}
                    accessor="amount"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                    style={styles.chart}
                    hasLegend={true}
                    avoidFalseZero={true}
                    formatLegendLabel={(value, name) => `${name}: R$ ${value.toFixed(2)}`}
                  />
                ) : (
                  <Text style={styles.noDataText}>Despesas encontradas, mas não foi possível agrupar por categoria</Text>
                )
              ) : (
                <Text style={styles.noDataText}>Nenhuma despesa no período</Text>
              )}
            </View>
            
            {/* 3. Gráfico de Evolução Mensal */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Evolução Mensal</Text>
              {monthlyData.length > 0 ? (
                <View style={styles.lineChartContainer}>
                  <LineChart
                    data={{
                      labels: monthlyData.map(item => getMonthName(item.month.split('-')[1]) + '/' + item.month.split('-')[0].substring(2)),
                      datasets: [
                        {
                          data: monthlyData.map(item => item.incomes),
                          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                          strokeWidth: 2
                        },
                        {
                          data: monthlyData.map(item => item.expenses),
                          color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
                          strokeWidth: 2
                        }
                      ],
                      legend: ["Receitas", "Despesas"]
                    }}
                    width={screenWidth - 40}
                    height={220}
                    yAxisLabel="R$ "
                    yAxisInterval={1}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: { borderRadius: 16 },
                      propsForDots: {
                        r: '4',
                        strokeWidth: '2',
                        stroke: '#ffa726'
                      },
                      propsForHorizontalLabels: {
                        fontSize: 10,
                        fontWeight: 'bold'
                      },
                      propsForVerticalLabels: {
                        fontSize: 10
                      }
                    }}
                    bezier
                    style={styles.chart}
                    withHorizontalLabels={true}
                    withVerticalLabels={true}
                    verticalLabelRotation={0}
                    horizontalLabelRotation={0}
                    fromZero
                  />
                </View>
              ) : (
                <Text style={styles.noDataText}>Nenhum dado mensal disponível</Text>
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chartsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  dateSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  lineChartContainer: {
    position: 'relative',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
  noDataContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 20,
    fontSize: 16,
  },
});

export default GraficosScreen;