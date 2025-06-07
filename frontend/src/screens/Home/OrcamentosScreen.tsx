import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { OrcamentosProps } from '../../types/homeTypes';
import { useEffect, useState } from 'react';
import { apiConfig } from './../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { PieChart, BarChart } from 'react-native-chart-kit';

interface BudgetItem {
  id: number;
  nome: string;
  orcamento_mensal: number;
  gasto_atual_mes: number;
  orcamento_restante: number;
  percentual_gasto: number;
  status: boolean;
}

const screenWidth = Dimensions.get('window').width;

const OrcamentosScreen: React.FC<OrcamentosProps> = ({ formatCurrency }) => {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  const categoryColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
    '#FF9F40', '#8AC24A', '#607D8B', '#E91E63', '#00BCD4'
  ];

  // Carrega token e ID do usuário
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
        
        fetchCategories(storedToken, userId);
      } catch (error) {
        console.error('Erro ao carregar token e ID do usuário:', error);
      }
    };

    loadTokenAndUserId();
  }, []);

  // Busca categorias e orçamentos
  const fetchCategories = async (token: string, userId: number) => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.listarCategorias(userId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      const expenseCategories = data.categorias.filter((category: any) => category.tipo === 'despesa' && category.orcamento_mensal > 0);

      const budgetsPromises = expenseCategories.map(async (category: any) => {
        const budgetResponse = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.orcamentoStatus(category.id)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        return await budgetResponse.json();
      });

      const budgetsData = await Promise.all(budgetsPromises);
      
      const formattedBudgets = budgetsData.map((budget: any, index: number) => ({
        id: expenseCategories[index].id,
        nome: budget.categoria_nome || expenseCategories[index].nome,
        orcamento_mensal: budget.orcamento_mensal || 0,
        gasto_atual_mes: budget.gasto_atual_mes || 0,
        orcamento_restante: budget.orcamento_restante || 0,
        percentual_gasto: Math.min(budget.percentual_gasto || 0, 100),
        status: budget.status || false
      }));

      setBudgets(formattedBudgets);
      
      // Calcula totais para os gráficos
      const totalBudget = formattedBudgets.reduce((sum, item) => sum + item.orcamento_mensal, 0);
      const totalSpent = formattedBudgets.reduce((sum, item) => sum + item.gasto_atual_mes, 0);
      setTotalBudget(totalBudget);
      setTotalSpent(totalSpent);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
    }
  };

  // Prepara dados para o gráfico de pizza
  const getPieChartData = () => {
    return budgets.map((budget, index) => ({
      name: budget.nome, // Apenas o nome da categoria
      amount: budget.gasto_atual_mes,
      color: categoryColors[index % categoryColors.length],
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
      // Adicione estas propriedades para melhor formatação
      labelFontSize: 0, // Esconde os rótulos dentro do gráfico
      labelColor: 'transparent' // Garante que os rótulos não sejam visíveis
    }));
  };

  // Prepara dados para o gráfico de barras
  const getBarChartData = () => {
    return {
      labels: budgets.map(budget => budget.nome),
      datasets: [
        {
          data: budgets.map(budget => budget.gasto_atual_mes),
          colors: budgets.map((_, index) => (opacity = 1) => categoryColors[index % categoryColors.length]) // Cores para gasto real
        },
        {
          data: budgets.map(budget => budget.orcamento_mensal),
          colors: budgets.map((_, index) => (opacity = 1) => `${categoryColors[index % categoryColors.length]}${opacity === 1 ? '80' : Math.round(opacity * 100).toString(16)}`) // Versão transparente para orçamento
        }
      ]
    };
  };

  // Retorna cor baseada no percentual gasto
  const getColorByPercentage = (percentage: number) => {
    if (percentage > 100) return '#FF3B30';
    if (percentage > 80) return '#FF9500';
    return '#4CAF50';
  };

  return (
    <ScrollView style={styles.tabContent}>
      <View style={styles.budgetContainer}>
        <Text style={styles.sectionTitle}>Visão Geral dos Orçamentos</Text>
        
        {/* Gráfico de Pizza - Distribuição dos Gastos */}
        {budgets.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Distribuição dos Gastos por Categoria</Text>
            <PieChart
              data={getPieChartData()}
              width={screenWidth - 40}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                // Adicione esta configuração para esconder os valores
                propsForLabels: {
                  fontSize: 0 // Define o tamanho da fonte como 0 para esconder os valores
                }
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={styles.chart}
              // Adicione estas propriedades para melhorar a visualização sem os valores
              hasLegend={true}
              avoidFalseZero={true}
            />
          </View>
        )}

        {/* Gráfico de Barras - Comparação Gasto vs Orçamento */}
        {budgets.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Gasto vs Orçamento por Categoria</Text>
            <BarChart
              data={getBarChartData()}
              width={screenWidth - 40}
              height={220}
              yAxisLabel={formatCurrency(0).replace(/[0-9.,]/g, '')}
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                barPercentage: 0.5,
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                },
                // Adicione estas propriedades:
                fillShadowGradient: '#FF6384',
                fillShadowGradientOpacity: 1,
                barRadius: 4,
                // Configuração de cores para cada conjunto de barras
                barColors: budgets.map((_, index) => categoryColors[index % categoryColors.length]),
              }}
              style={styles.chart}
              fromZero
              showBarTops={false}
              withInnerLines={false}
              // Adicione esta propriedade para diferenciar os datasets
              withCustomBarColorFromData={true}
              flatColor={true}
            />
            <View style={styles.legendContainer}>
              {budgets.slice(0, 3).map((budget, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: categoryColors[index % categoryColors.length] }]} />
                  <Text style={styles.legendText}>{budget.nome}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Resumo Financeiro */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo Financeiro</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Orçado:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalBudget)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Gasto:</Text>
            <Text style={[
              styles.summaryValue,
              totalSpent > totalBudget ? styles.overBudget : styles.underBudget
            ]}>
              {formatCurrency(totalSpent)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Saldo:</Text>
            <Text style={[
              styles.summaryValue,
              totalSpent > totalBudget ? styles.overBudget : styles.underBudget
            ]}>
              {formatCurrency(totalBudget - totalSpent)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Percentual:</Text>
            <Text style={[
              styles.summaryValue,
              (totalSpent / totalBudget * 100) > 100 ? styles.overBudget : 
              (totalSpent / totalBudget * 100) > 80 ? styles.nearBudget : styles.underBudget
            ]}>
              {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
            </Text>
          </View>
        </View>

        {/* Detalhes por Categoria */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Detalhes por Categoria</Text>
        
        {budgets.map(budget => {
          const isOverLimit = budget.percentual_gasto > 100;
          const isNearLimit = budget.percentual_gasto > 80 && budget.percentual_gasto <= 100;
          
          return (
            <View key={budget.id} style={styles.budgetCard}>
              <Text style={styles.budgetTitle}>{budget.nome}</Text>
              <View style={styles.progressContainer}>
                <View style={[
                  styles.progressBar, 
                  { 
                    width: `${Math.min(budget.percentual_gasto, 100)}%`,
                    backgroundColor: getColorByPercentage(budget.percentual_gasto)
                  }
                ]} />
              </View>
              <View style={styles.budgetDetails}>
                <View style={styles.budgetDetailRow}>
                  <Text style={styles.detailLabel}>Gasto:</Text>
                  <Text style={styles.detailValue}>{formatCurrency(budget.gasto_atual_mes)}</Text>
                </View>
                <View style={styles.budgetDetailRow}>
                  <Text style={styles.detailLabel}>Orçamento:</Text>
                  <Text style={styles.detailValue}>{formatCurrency(budget.orcamento_mensal)}</Text>
                </View>
                <View style={styles.budgetDetailRow}>
                  <Text style={styles.detailLabel}>Diferença:</Text>
                  <Text style={[
                    styles.detailValue,
                    budget.orcamento_restante < 0 ? styles.overBudget : styles.underBudget
                  ]}>
                    {formatCurrency(budget.orcamento_restante)}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.budgetAlert,
                isOverLimit ? styles.overLimit : isNearLimit ? styles.nearLimit : null
              ]}>
                {isOverLimit ? 
                  `Orçamento excedido em ${formatCurrency(Math.abs(budget.orcamento_restante))}!` : 
                  `${Math.round(budget.percentual_gasto)}% do orçamento utilizado`}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  budgetContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  underBudget: {
    color: '#4CAF50',
  },
  nearBudget: {
    color: '#FF9500',
  },
  overBudget: {
    color: '#FF3B30',
  },
  budgetCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  budgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  budgetDetails: {
    marginVertical: 8,
  },
  budgetDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  budgetAlert: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  overLimit: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  nearLimit: {
    color: '#FF9500',
  },
});

export default OrcamentosScreen;