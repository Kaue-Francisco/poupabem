import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { RootStackParamList } from './src/types/navigation';
import WelcomeScreen from './src/screens/WelcomeScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import IncomeScreen from './src/screens/IncomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import CreateCategoryScreen from './src/screens/CreateCategoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: true,title: 'Criar Conta',headerBackTitle: 'Voltar'}} />
        <Stack.Screen name="Categories" component={CategoriesScreen} options={{ headerShown: true,title: 'Categorias',headerBackTitle: 'Voltar' }}/>
        <Stack.Screen name="Expenses" component={ExpensesScreen} />
        <Stack.Screen name="Income" component={IncomeScreen} />
        <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} options={{ headerShown: true,title: 'Criar Categoria',headerBackTitle: 'Voltar'}} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
} 