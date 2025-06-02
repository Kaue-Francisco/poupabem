export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  image: string;
  latitude: number;
  longitude: number;
  criado_em: string;
};

export type Category = {
  id: number;
  nome: string;
};

export type DecodedToken = {
  id: string;
  exp: number;
  iat: number;
};

export type ExpenseFormData = {
  description: string;
  amount: string;
  category: string;
}; 