import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { OrcamentosProps } from '../../types/homeTypes';

const OrcamentosScreen: React.FC<OrcamentosProps> = ({ 
  budgets, 
  formatCurrency 
}) => {
  return (
    <ScrollView style={styles.tabContent}>
      <View style={styles.budgetContainer}>
        <Text style={styles.sectionTitle}>Seus Orçamentos Mensais</Text>
        
        {budgets.map(budget => {
          const percentage = (budget.spent / budget.limit) * 100;
          const isOverLimit = percentage > 100;
          
          return (
            <View key={budget.id} style={styles.budgetCard}>
              <Text style={styles.budgetTitle}>{budget.category}</Text>
              <View style={styles.progressContainer}>
                <View style={[
                  styles.progressBar, 
                  { 
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: isOverLimit ? '#FF3B30' : percentage > 80 ? '#FF9500' : '#4CAF50'
                  }
                ]} />
              </View>
              <Text style={styles.budgetText}>
                {formatCurrency(budget.spent)} de {formatCurrency(budget.limit)}
              </Text>
              <Text style={[
                styles.budgetAlert,
                isOverLimit ? styles.overLimit : percentage > 80 ? styles.nearLimit : null
              ]}>
                {isOverLimit ? 'Orçamento excedido!' : `${Math.round(percentage)}% do orçamento utilizado`}
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
  budgetText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  budgetAlert: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
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