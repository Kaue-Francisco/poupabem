import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.textWhite}>Poupa</Text>
        <Text style={styles.textWhite}>Bem</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3333fd', // Fundo azul
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 46, // Aumenta o tamanho do texto
    fontWeight: 'bold',
  },
  textWhite: {
    color: '#FFFFFF', // Texto branco
  },
});
