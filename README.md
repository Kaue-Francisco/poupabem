# 💸 Aplicativo de Finanças Pessoais 💸

## 📝 Sobre o Projeto

Este é um aplicativo de Finanças Pessoais desenvolvido como parte da disciplina de **Desenvolvimento Mobile** no curso de **Desenvolvimento de Software Multiplataforma** da Fatec.

## 📱 Requisitos do Aplicativo

| **#** | **Requisito**                                                                 | **Descrição**                                                                                           |
|-------|-------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| 1     | **Cadastro e Autenticação**                                                   | Permitir que o usuário crie uma conta pessoal com autenticação via e-mail e senha.                      |
| 2     | **Registro de Despesas**                                                      | Registrar e categorizar despesas diárias, mensais e anuais.                                             |
| 3     | **Orçamento Mensal**                                                          | Definir e acompanhar um orçamento mensal para diferentes categorias de despesas.                        |
| 4     | **Gráficos e Relatórios**                                                     | Fornecer gráficos e relatórios detalhados sobre os gastos mensais e comparações com o orçamento.        |
| 5     | **Alertas de Limite de Gastos**                                               | Configurar alertas e notificações sobre o limite de despesas estabelecido para cada categoria.          |
| 6     | **Cadastro de Receitas**                                                      | Registrar receitas como salários, ganhos extras e outros tipos de entrada financeira.                   |
| 7     | **Integração Bancária**                                                       | Inserir despesas e receitas manualmente ou via integração com contas bancárias.                         |
| 8     | **Registro por Localização**                                                  | Usar GPS para registrar despesas realizadas em diferentes locais, como restaurantes e supermercados.    |
| 9     | **Metas Financeiras**                                                         | Definir metas financeiras e acompanhar o progresso.                                                     |
| 10    | **Exportação de Relatórios**                                                  | Gerar relatórios detalhados com opção de exportação em formatos como PDF ou Excel.                      |
| 11    | **Gerenciamento de Contas Bancárias**                                         | Registrar transações de diferentes contas bancárias.                                                    |
| 12    | **Imagens de Recibos**                                                        | Adicionar imagens de recibos ou comprovantes de pagamento utilizando a câmera do dispositivo.           |
| 13    | **Lembretes de Pagamento**                                                    | Criar lembretes de pagamento de contas com alertas para evitar esquecimentos.                           |
| 14    | **Evolução Financeira**                                                       | Visualizar a evolução financeira ao longo do tempo com gráficos e indicadores.                          |
| 15    | **Categorias Personalizadas**                                                 | Criar categorias personalizadas para despesas e receitas.                                               |
| 16    | **Dicas de Finanças**                                                         | Oferecer dicas e sugestões para melhorar a gestão do dinheiro com base no comportamento do usuário.     |
| 17    | **Escaneamento de Faturas**                                                   | Usar a câmera do dispositivo para escanear faturas e adicioná-las automaticamente aos registros.        |
| 18    | **Limite de Gastos por Categoria**                                            | Definir limites de gastos para cada categoria e receber alertas ao se aproximar do limite.              |
| 19    | **Integração com Cartões de Crédito**                                         | Registrar automaticamente despesas feitas com cartões de crédito.                                       |
| 20    | **Pontuação de Crédito**                                                      | Visualizar a pontuação de crédito e receber sugestões para melhorar a saúde financeira.                 |

---


## 📓 Backlog do Projeto

O projeto será realizado em 3 sprints.

| **Rank** | **Prioridade** | **User Story**                                                                                     | **Sprint** | **Req** |
|----------|----------------|----------------------------------------------------------------------------------------------------|------------|---------|
| 1        | Alta           | Como usuário, quero que seja possível realizar o cadastro de uma conta e fazer login com e-mail e senha. | 1 | REQ-1 |
| 2        | Alta           | Como usuário quero poder criar categorias para registrar minhas despesas ou receitas | 1 | REQ-6 |
| 3        | Alta           | Como usuário quero poder cadastrar minhas receitas e vincular a uma categoria | 1 | REQ-6 |
| 4        | Alta           | Como usuário quero poder cadastrar minhas despesas e vincular a uma categoria | 1 | REQ-7 |
| 5        | Alta           | Como usuário quero poder visualizar o total de minhas despesas e receitas na tela princial | 1 | REQ-15 |
| 6        | Alta           | Como usuário quero poder apagar alguma receita ou despesa que cadastrei | 1 | REQ-7 |
| 7        | Alta           | Como usuário quero poder apagar alguma categoria e junto a ela as despesas vinculadas a ela | 1 | REQ-7 |
| 8        | Média           | Como usuário quero poder editar alguma categoria | 2 | REQ-15 |
| 9        | Média          | Como usuário ao selecionar a categoria quero poder visualizar todas as receitas ou despesas vinculadas a ela | 2 | REQ-15 |
| 10       | Média          | Como usuário quero poder adicionar imagens de comprovantes em minhas despesas | 2 | REQ-12 |
| 11       | Média          | Como usuário quero poder configurar alertas quando meus gastos se aproximarem do limite definido | 2 | REQ-18 |
| 12       | Média          | Como usuário quero poder criar lembretes de pagamento de contas | 2 | REQ-13 |
| 23       | Média          | Como usuário quero receber dicas personalizadas de finanças baseadas no meu comportamento | 2 | REQ-16 |
| 14       | Média          | Como usuário quero poder definir metas financeiras e acompanhar seu progresso | 2 | REQ-9 |
| 15       | Baixa          | Como usuário quero poder registrar a localização das minhas despesas | 3 | REQ-8 |
| 16       | Baixa          | Como usuário quero poder visualizar gráficos de gastos por categoria | 3 | REQ-4 |
| 17       | Baixa          | Como usuário quero poder definir um orçamento mensal para cada categoria | 3 | REQ-3 |
| 18       | Baixa          | Como usuário quero poder exportar relatórios anuais das minhas finanças em PDF | 3 | REQ-10 |
| 19       | Baixa          | Como usuário quero que chegue uma notificação em meu celular quando tiver algum lembrate no dia | 3 | REQ-13 |
| 20       | Baixa          | Como usuário quero poder registrar minhas despesas/receitas diárias, mensai e anuais. | 3 | REQ-2 |
| 21       | Baixa          | Como usuário eu quero poder tirar foto de uma fatura e ele adicionar automaticamente como despesa | 3 | REQ-17 |


## 💻 Tecnologias
- React Native
- Python
- Flask
- PostgreSQL
- TypeScript

## 🧑‍💻 Como Executar?
``` bash
# Clone o repositório
git clone https://github.com/Kaue-Francisco/poupabem.git

# Acesse o repositório
cd poupabem

# Acesse a pasta do frontend e baixe as dependências.
cd frontend
npm install

# Volte a pasta, acesse a pasta do backend e crie um ambiente virtual
cd ..
cd backend
python -m venv venv

# Acesse o ambiente virtual e instale as dependências

# Windows
.\venv\Scripts\activate

# Linux
source venv/bin/activate

pip install -r requeriments.txt

# Agora com as dependências instaladas é necessário criar o banco de dados postgreSQL com o script na pasta database.
# E também modificar a conexão com o banco de dados no arquivo config_database.py para a sua conexão com o banco de dados.
self.app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://<seunomedousuario>:<suasenha>@localhost:5432/poupabem'

# E no frontend é necessário você alterar no arquivo api.ts o ip para o ip de sua máquina local.
  if (__DEV__) {
    return 'http://192.168.15.103:5000';
  }

# Fazendo tudo isso acesse 2 terminais, 1 na pasta frontend e outro na pasta backend e execute os seguintes comandos para iniciar o sistema.

# Frontend
npm start

# Backend
flask run --debug --host=0.0.0.0

```

## 👤 Desenvolvedor
Kauê dos Santos Francisco
