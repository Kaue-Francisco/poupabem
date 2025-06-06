import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { Category, DecodedToken, Expense } from '../types/expense';
import * as Notifications from 'expo-notifications'

export class ExpenseService {
  private static async getToken(): Promise<string> {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    return token;
  }

  private static async getUserId(): Promise<number> {
    const token = await this.getToken();
    const decodedToken = jwtDecode(token) as DecodedToken;

    if (!decodedToken || !decodedToken.id) {
      throw new Error('Token não contém informações válidas');
    }

    const userId = parseInt(decodedToken.id, 10);
    if (isNaN(userId)) {
      throw new Error('ID do usuário inválido no token');
    }

    return userId;
  }

  static async getCategories(): Promise<Category[]> {
    const token = await this.getToken();
    const userId = await this.getUserId();

    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.getCategoriasDespesas(userId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!data.status) {
      throw new Error('Não foi possível carregar as categorias');
    }

    return data.categorias;
  }

  static async getExpenses(): Promise<Expense[]> {
    const token = await this.getToken();
    const userId = await this.getUserId();

    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.listarDespesas(userId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!data.status) {
      throw new Error('Não foi possível carregar as despesas');
    }

    // Buscar categorias para mapear os nomes
    const categories = await this.getCategories();

    // Formatar as despesas
    const formattedExpenses = data.despesas.map((expense: any) => {
      const categoriaEncontrada = categories.find(cat => cat.id === expense.categoria_id);
      return {
        id: expense.id.toString(),
        description: expense.descricao,
        amount: expense.valor,
        date: expense.data,
        category: categoriaEncontrada ? categoriaEncontrada.nome : 'Sem Categoria',
        image: expense.image,
        criado_em: expense.criado_em,
        latitude: expense.latitude || 0,
        longitude: expense.longitude || 0,
      };
    });

    return formattedExpenses.sort((a: Expense, b: Expense) =>
      new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
    );
  }

  static async createExpense(expenseData: { categoria_id: number; valor: number; data: string; descricao: string; image: string, latitude: number, longitude: number }): Promise<void> {    const token = await this.getToken();
    const userId = await this.getUserId();
  
    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.criarDespesa}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        usuario_id: userId,
        ...expenseData,
      }),
    });
  
    const data = await response.json();
  
    if (data.limite) {
      ExpenseService.handleCallNotification(data.message, data.title);
    }

    if (!response.ok) {
      throw new Error(data.message || 'Não foi possível adicionar a despesa');
    }
  }

  static async handleCallNotification(message: string, title: string): Promise<void> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
  
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  
    if (finalStatus !== 'granted') {
      return;
    }
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: message,
      },
      trigger: null,
    });
  }

  static async deleteExpense(expenseId: string): Promise<void> {
    const token = await this.getToken();
    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.deletarDespesa(expenseId)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Não foi possível deletar a despesa');
    }
  }
}