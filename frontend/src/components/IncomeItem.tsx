import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Income } from '../types/income';

type IncomeItemProps = {
  income: Income;
};

export const IncomeItem: React.FC<IncomeItemProps> = ({ income }) => {
  return (
    <View style={styles.incomeItem}>
      <View style={styles.incomeHeader}>
        <Text style={styles.incomeDescription}>{income.description}</Text>
        <Text style={styles.incomeAmount}>R$ {income.amount}</Text>
      </View>
      <View style={styles.incomeFooter}>
        <Text style={styles.incomeCategory}>{income.category}</Text>
        <Text style={styles.incomeDate}>{income.date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  incomeItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  incomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  incomeDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495E',
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  incomeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incomeCategory: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  incomeDate: {
    fontSize: 14,
    color: '#7F8C8D',
  },
}); 