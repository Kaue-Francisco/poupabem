import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const GraficosScreen: React.FC = () => {
  return (
    <ScrollView style={styles.tabContent}>
      <View style={styles.chartsContainer}>
        <Text style={styles.sectionTitle}>Análise de Gastos</Text>
        
        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>Gráfico de Categorias</Text>
        </View>
        
        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>Gráfico Mensal</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
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
  chartPlaceholder: {
    backgroundColor: '#fff',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
});

export default GraficosScreen;