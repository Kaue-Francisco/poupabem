export type BudgetItem = {
  id: string;
  category: string;
  spent: number;
  limit: number;
};

export type DicaItem = {
  [key: string]: number;
};

export type HomeScreenNavigationProp = {
  navigate: (screen: string) => void;
  addListener: (event: string, callback: () => void) => () => void;
};

export type ResumoProps = {
  receitas: number;
  despesas: number;
  dicas: DicaItem;
  hasTodayAlerts: boolean;
  showReceitasTooltip: boolean;
  showDespesasTooltip: boolean;
  handleShowReceitasTooltip: () => void;
  handleShowDespesasTooltip: () => void;
  handleCategorias: () => void;
  handleDespesas: () => void;
  handleReceitas: () => void;
  handleMetasFinanceiras: () => void;
  handleAlert: () => void;
  formatCurrency: (value: number) => string;
};

export type OrcamentosProps = {
  budgets: BudgetItem[];
  formatCurrency: (value: number) => string;
};