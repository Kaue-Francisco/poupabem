import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Expense } from '../types/expense';

type ExpenseItemProps = {
  expense: Expense;
};

// Função para formatar valores monetários
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense }) => {
  return (
    <View style={styles.expenseItem}>
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseDescription}>{expense.description}</Text>
        <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
      </View>
      <View style={styles.expenseFooter}>
        <Text style={styles.expenseCategory}>{expense.category}</Text>
        <Text style={styles.expenseDate}>{expense.date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  expenseItem: {
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
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495E',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseCategory: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  expenseDate: {
    fontSize: 14,
    color: '#7F8C8D',
  },
});