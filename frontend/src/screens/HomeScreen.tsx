import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, BackHandler } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const handleExitApp = () => {
    BackHandler.exitApp(); // Fecha o aplicativo
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao PoupaBem</Text>
      <Text style={styles.subtitle}>Sua aplicação de finanças pessoais</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Acessar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.exitButton} onPress={handleExitApp}>
        <Text style={styles.exitText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3333fd', // Fundo azul
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // Texto branco
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF', // Texto branco
    marginBottom: 20,
  },
  button: {
    position: 'absolute',
    bottom: 80, // Posiciona o botão na parte inferior
    width: width * 0.8, // 80% da largura da tela
    backgroundColor: '#FFFFFF', // Botão branco
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#3333fd', // Texto azul
    fontSize: 16,
    fontWeight: 'bold',
  },
  exitButton: {
    position: 'absolute',
    bottom: 20, // Move o botão "Sair" mais para baixo
    width: width * 0.8, // 80% da largura da tela
    alignItems: 'center',
    paddingVertical: 10,
  },
  exitText: {
    color: '#FFFFFF', // Texto branco
    fontSize: 16,
    fontWeight: 'bold',
  },
});