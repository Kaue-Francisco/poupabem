import { apiConfig } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { Category, DecodedToken, Income } from '../types/income';

export class IncomeService {
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

    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.getCategoriasReceitas(userId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (!data.status) {
      throw new Error('Não foi possível carregar as categorias');
    }

    return data.categorias;
  }

  static async getIncomes(): Promise<Income[]> {
    const token = await this.getToken();
    const userId = await this.getUserId();

    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.listarReceitas(userId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    console.log('Resposta da API:', data);
    
    if (!data.status) {
      throw new Error('Não foi possível carregar as receitas');
    }

    // Formatar as receitas
    const formattedIncomes = data.receitas.map((income: any) => ({
      id: income.id.toString(),
      description: income.descricao,
      amount: income.valor,
      date: income.data,
      category: 'Receita', // Temporário até implementarmos as categorias
      criado_em: income.criado_em,
    }));

    // Ordenar por data de criação (mais recentes primeiro)
    return formattedIncomes.sort((a, b) => 
      new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
    );
  }

  static async createIncome(incomeData: { categoria_id: number; valor: number; data: string; descricao: string }): Promise<void> {
    const token = await this.getToken();
    const userId = await this.getUserId();

    const response = await fetch(`${apiConfig.baseUrl}${apiConfig.endpoints.criarReceita}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        usuario_id: userId,
        ...incomeData,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Não foi possível adicionar a receita');
    }
  }
} 