import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import IncomeScreen from '../screens/IncomeScreen';
import { RootStackParamList } from '../types/navigation';
import MetasFinanceirasScreen from '../screens/MetasFinanceirasScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ title: 'Criar Conta' }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'PoupaBem' }}
        />
        <Stack.Screen 
          name="Categories" 
          component={CategoriesScreen} 
          options={{ title: 'Categorias' }}
        />
        <Stack.Screen 
          name="Expenses" 
          component={ExpensesScreen} 
          options={{ title: 'Despesas' }}
        />
        <Stack.Screen 
          name="Income" 
          component={IncomeScreen} 
          options={{ title: 'Receitas' }}
        />
        <Stack.Screen 
          name="MetasFinanceiras" 
          component={MetasFinanceirasScreen} 
          options={{ title: 'Receitas' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 