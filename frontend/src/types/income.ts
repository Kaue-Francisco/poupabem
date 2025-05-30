export type Income = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
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

export type IncomeFormData = {
  description: string;
  amount: string;
  category: string;
}; 