################################################################################
# Imports

from flask import request, jsonify
from services.meta_financeira_service import MetaFinanceiraService  # Serviço de meta financeira
from database_instance import database_config  # Instância do banco de dados
from controllers.receita_controller import ReceitaController  # Controller de receita
from controllers.despesa_controller import DespesaController  # Controller de despesa

################################################################################
# Defined

db_conn = database_config.get_db()
meta_financeira_service = MetaFinanceiraService(db_conn=db_conn)
receita_controller = ReceitaController()
despesa_controller = DespesaController()

################################################################################
# Main

class MetaFinanceiraController:
    
    def pegar_valor_atual(self, usuario_id) -> float:
        # Obtém a resposta do total de receitas
        response_receitas, status_code = receita_controller.total_receitas(usuario_id=usuario_id)
        
        # Verifica se a resposta foi bem-sucedida
        if status_code != 200:
            raise ValueError("Erro ao obter o total de receitas")

        # Extrai o conteúdo JSON da resposta
        response_data = response_receitas.get_json()  # Converte o conteúdo para um dicionário
        total_receitas = response_data.get('total', 0)  # Substitua 'total' pela chave correta
        
        # Obtém o total de despesas
        response_despesas, status_code = despesa_controller.total_despesa(usuario_id=usuario_id)

        if status_code != 200:
            raise ValueError("Erro ao obter o total de despesas")
        
        # Extrai o conteúdo JSON da resposta
        response_data = response_despesas.get_json()
        total_despesas = response_data.get('total', 0)

        # Calcula o valor atual
        valor_atual = float(total_receitas) - float(total_despesas)
        
        return valor_atual


    def create_meta_financeira(self, data: dict) -> jsonify:
        """ Método para criar uma nova meta financeira """

        # Coleta os dados enviados pelo usuário
        usuario_id = data.get('usuario_id')
        titulo = data.get('titulo')
        valor_meta = data.get('valor_meta')
        data_inicio = data.get('data_inicio')
        data_fim = data.get('data_fim')
        valor_atual = self.pegar_valor_atual(usuario_id)

        # Valida os dados obrigatórios
        if not all([usuario_id, titulo, valor_atual, valor_meta, data_inicio, data_fim]):
            return jsonify({'message': 'Usuário, título, valor atual, valor meta, data de início e data de fim são campos obrigatórios.'}), 400

        # Chama o método para criar a meta financeira
        response = meta_financeira_service.create_meta_financeira(
            usuario_id=usuario_id,
            titulo=titulo,
            valor_atual=valor_atual,
            valor_meta=valor_meta,
            data_inicio=data_inicio,
            data_fim=data_fim
        )

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 201