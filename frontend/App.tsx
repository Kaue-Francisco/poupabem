import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/Home/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { RootStackParamList } from './src/types/navigation';
import WelcomeScreen from './src/screens/WelcomeScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';
import IncomeScreen from './src/screens/IncomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import CreateCategoryScreen from './src/screens/CreateCategoryScreen';
import MetasFinanceirasScreen from './src/screens/MetasFinanceirasScreen';
import * as Notifications from 'expo-notifications'
import AlertScreen from './src/screens/AlertScreen';
import CreateAlertScreen from './src/screens/CreateAlertScreen';
import CreateMetaScreen from './src/screens/CreateMetaScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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
        <Stack.Screen name="Expenses" component={ExpensesScreen} options={{ headerShown: true, title: 'Adicionar Despesas', headerBackTitle: 'Voltar' }}/>
        <Stack.Screen name="Income" component={IncomeScreen} options={{ headerShown: true, title: 'Adicionar Receitas', headerBackTitle: 'Voltar' }}/>
        <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} options={{ headerShown: true,title: 'Criar Categoria',headerBackTitle: 'Voltar'}} />
        <Stack.Screen name="MetasFinanceiras" component={MetasFinanceirasScreen} options={{ headerShown: true,title: 'Criar Meta Financeira',headerBackTitle: 'Voltar'}} />
        <Stack.Screen name="Alert" component={AlertScreen} options={{ headerShown: true,title: 'Alertas',headerBackTitle: 'Voltar'}}/>
        <Stack.Screen name="CreateAlert" component={CreateAlertScreen} options={{ headerShown: true,title: 'Criar Alerta',headerBackTitle: 'Voltar'}}/>
        <Stack.Screen name="CreateMeta" component={CreateMetaScreen} options={{ headerShown: true,title: 'Criar Meta Financeira',headerBackTitle: 'Voltar'}}/>
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
} 