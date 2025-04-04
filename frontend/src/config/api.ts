import Constants from 'expo-constants';

// Função para obter a URL base da API
export const getApiUrl = () => {
  // Se estiver em desenvolvimento, use o IP da máquina local
  if (__DEV__) {
    return 'http://192.168.15.103:5000';
  }
  // Se estiver em produção, use a URL de produção
  return 'https://seu-servidor-producao.com';
};

// Configurações da API
export const apiConfig = {
  baseUrl: getApiUrl(),
  endpoints: {
    login: '/user/login',
    register: '/user/register',
    criarCategoria: '/categoria/create',
    listarCategorias: (id: number) => `/categoria/${id}`,
    totalReceita: (id: number) => `/receita/total/${id}`,
    totalDespesa: (id: number) => `/despesa/total/${id}`,
    totalPorCategoria: (id: number) => `/categoria/total/${id}`,
    getCategoriasDespesas: (id: number) => `/despesa/categorias/${id}`,
    getCategoriasReceitas: (id: number) => `/receita/categorias/${id}`,
    criarDespesa: '/despesa/create',
    criarReceita: '/receita/create',
    listarDespesas: (id: number) => `/despesa/${id}`,
    listarReceitas: (id: number) => `/receita/${id}`,
    deletarCategoria: (id: number) => `/categoria/delete/${id}`,
    deletarDespesa: (despesaId: number) => `/despesa/delete/${despesaId}`,
    deletarReceita: (receitaId: number) => `/receita/delete/${receitaId}`,
    despesasPorCategoria: (id: number) => `/despesa/por-categoria/${id}`,
    receitasPorCategoria: (id: number) => `/receita/por-categoria/${id}`, 
  },
};