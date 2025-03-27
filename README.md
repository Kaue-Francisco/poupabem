# PoupaBem - Aplicativo de Gestão Financeira Pessoal

## Sobre o Projeto
O PoupaBem é um aplicativo mobile desenvolvido para ajudar usuários a gerenciarem suas finanças pessoais de forma eficiente e inteligente. O aplicativo oferece funcionalidades completas para controle de despesas, receitas, orçamentos e metas financeiras, com foco em uma experiência de usuário intuitiva e segura.

## Tecnologias Utilizadas
- React Native
- Firebase (Autenticação e Banco de Dados)
- Redux (Gerenciamento de Estado)
- React Navigation
- React Native Charts
- React Native Camera
- React Native Maps
- React Native Notifications

## Entregas MVP

### Sprint 1 - Fundamentos e Autenticação
**Duração: 2 semanas**
**Requisitos a serem entregues:**
1. O aplicativo deve permitir que o usuário crie uma conta pessoal com autenticação via e-mail e senha.
2. O aplicativo deve permitir que o usuário registre e categorize suas despesas diárias, mensais e anuais.
3. O aplicativo deve permitir que o usuário defina e acompanhe um orçamento mensal para diferentes categorias de despesas.
6. O aplicativo deve permitir o cadastro de receitas, como salários, ganhos extra, e outros tipos de entrada financeira.

**Funcionalidades implementadas:**
- Implementação da autenticação com e-mail e senha
- Criação do perfil do usuário
- Cadastro básico de despesas e receitas
- Categorização manual de transações
- Interface principal do aplicativo
- Dashboard básico com saldo atual
- Sistema de categorias personalizadas
- Configuração de limites por categoria

### Sprint 2 - Gestão Financeira Básica
**Duração: 2 semanas**
**Requisitos a serem entregues:**
4. O aplicativo deve permitir que o usuário crie categorias personalizadas para suas despesas e receitas.
5. O aplicativo deve permitir que o usuário defina um limite de gastos para cada categoria e receba alertas quando estiver prestes a ultrapassar esse limite.
7. O aplicativo deve permitir que o usuário insira despesas e receitas de forma manual ou via integração com contas bancárias.
8. O aplicativo deve oferecer integração com o GPS para registrar as despesas realizadas em diferentes locais.
9. O aplicativo deve permitir que o usuário adicione imagens de recibos ou comprovantes de pagamentos utilizando a câmera do dispositivo.

**Funcionalidades implementadas:**
- Definição e acompanhamento de orçamento mensal por categoria
- Gráficos básicos de gastos mensais
- Sistema de notificações para limites de gastos
- Cadastro de contas bancárias
- Upload de comprovantes via câmera
- Integração com GPS para localização de despesas
- Integração com cartões de crédito
- Gerenciamento de múltiplas contas bancárias

### Sprint 3 - Recursos Avançados
**Duração: 2 semanas**
**Requisitos a serem entregues:**
12. O aplicativo deve permitir que o usuário defina metas financeiras, como economizar para uma viagem ou pagar dívidas, e acompanhe o progresso.
13. O aplicativo deve gerar relatórios mensais e anuais detalhados, com a opção de exportá-los em formatos como PDF ou Excel.
14. O aplicativo deve permitir a criação de lembretes de pagamento de contas, com opção de configurar alertas para não esquecer os vencimentos.
15. O aplicativo deve permitir que o usuário visualize sua evolução financeira ao longo do tempo com gráficos e indicadores.
16. O aplicativo deve oferecer dicas de finanças e sugestões para melhorar a gestão do dinheiro, com base no comportamento do usuário.
17. O aplicativo deve usar a câmera do dispositivo para permitir o escaneamento de faturas e adicionar automaticamente aos registros de despesas.
18. O aplicativo deve permitir que o usuário visualize sua pontuação de crédito e sugira ações para melhorar a saúde financeira.
19. O aplicativo deve fornecer gráficos e relatórios detalhados sobre os gastos mensais e comparações com o orçamento definido.
20. O usuário deve poder configurar alertas e notificações sobre o limite de despesas estabelecido para cada categoria.

**Funcionalidades implementadas:**
- Sistema de metas financeiras
- Geração de relatórios mensais e anuais
- Exportação de relatórios em PDF e Excel
- Sistema de lembretes de pagamento
- Gráficos de evolução financeira
- Sistema de dicas financeiras personalizadas
- Escaneamento de faturas
- Visualização de pontuação de crédito
- Gráficos comparativos de gastos
- Sistema de notificações avançado

## Estrutura do Projeto
```
src/
  ├── components/     # Componentes reutilizáveis
  ├── screens/        # Telas do aplicativo
  ├── navigation/     # Configuração de navegação
  ├── services/       # Serviços e APIs
  ├── store/         # Gerenciamento de estado
  ├── utils/         # Funções utilitárias
  └── assets/        # Recursos estáticos
```

## Como Executar o Projeto
1. Clone o repositório
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente
4. Execute o projeto: `npm start`

## Contribuição
Para contribuir com o projeto, siga estas etapas:
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça commit das alterações
4. Push para a branch
5. Abra um Pull Request

## Licença
Este projeto está sob a licença MIT.