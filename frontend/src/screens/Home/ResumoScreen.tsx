import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ResumoProps } from '../../types/homeTypes';

const ResumoScreen: React.FC<ResumoProps> = ({
  receitas,
  despesas,
  dicas,
  hasTodayAlerts,
  showReceitasTooltip,
  showDespesasTooltip,
  handleShowReceitasTooltip,
  handleShowDespesasTooltip,
  handleCategorias,
  handleDespesas,
  handleReceitas,
  handleMetasFinanceiras,
  handleAlert,
  formatCurrency
}) => {
  return (
    <ScrollView>
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
};

const styles = StyleSheet.create({
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
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
});

export default ResumoScreen;