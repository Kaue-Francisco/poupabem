import Constants from 'expo-constants';

// Função para obter a URL base da API
export const getApiUrl = () => {
  // Se estiver em desenvolvimento, use o IP da máquina local
  if (__DEV__) {
    return 'http://192.168.15.101:5000';
  }
  // Se estiver em produção, use a URL de produção
  return 'https://seu-servidor-producao.com';
};

// Configurações da API
export const apiConfig = {
  baseUrl: getApiUrl(),
  endpoints: {
    // Autenticação
    login: '/user/login',
    register: '/user/register',
    
    // Categorias
    criarCategoria: '/categoria/create',
    getCategoriasDespesas: (id: number) => `/despesa/categorias/${id}`,
    getCategoriasReceitas: (id: number) => `/receita/categorias/${id}`,
    deletarCategoria: (id: number) => `/categoria/delete/${id}`,
    totalPorCategoria: (id: number) => `/categoria/total/${id}`,
    listarCategorias: (id: number) => `/categoria/${id}`,
    
    // Receitas
    criarReceita: '/receita/create',
    receitasPorCategoria: (id: number) => `/receita/por-categoria/${id}`, 
    deletarReceita: (receitaId: number) => `/receita/delete/${receitaId}`,
    listarReceitas: (id: number) => `/receita/${id}`,
    totalReceita: (id: number) => `/receita/total/${id}`,
    
    // Despesas
    criarDespesa: '/despesa/create',
    despesasPorCategoria: (id: number) => `/despesa/por-categoria/${id}`,
    deletarDespesa: (despesaId: number) => `/despesa/delete/${despesaId}`,
    listarDespesas: (id: number) => `/despesa/${id}`,
    totalDespesa: (id: number) => `/despesa/total/${id}`,
    dicas: (usuarioId: number) => `/despesa/dicas/${usuarioId}`,
    
    // Metas Financeiras
    listarMetas: (metaId: number) => `/meta_financeira/${metaId}`,
    criarMeta: '/meta_financeira/create',
    deletarMeta: (metaId: number) => `/meta_financeira/delete/${metaId}`,
    atualizarMeta: '/meta_financeira/update',

    // Alertas
    criarAlerta: '/alert/create',
    verificarAlerta: (usuarioId: number) => `/alert/${usuarioId}`,
    atualizarAlerta: '/alert/update',
    deletarAlerta: (alertaId: number) => `/alert/delete/${alertaId}`,
    listarAlertas: '/alert/all',
  },
};