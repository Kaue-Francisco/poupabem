################################################################
# Imports

from flask import request, jsonify                       # Registrar as rotas e métodos HTTP
from services.despesa_service import DespesaService      # Serviço de despesa
from database_instance import database_config            # Instância do banco de dados

################################################################
# Defined

db_conn = database_config.get_db()
despesa_service = DespesaService(db_conn=db_conn)

################################################################
# Main

class DespesaController:

    def create_despesa(self, data: dict) -> jsonify:
        """ Método para criar uma nova despesa """

        # Coleta os dados enviados pelo usuário
        usuario_id = data.get('usuario_id')
        categoria_id = data.get('categoria_id')
        valor = data.get('valor')
        data_despesa = data.get('data')
        descricao = data.get('descricao')

        # Valida os dados obrigatórios
        if not all([usuario_id, categoria_id, valor, data_despesa, descricao]):
            return jsonify({'message': 'Todos os campos são obrigatórios.'}), 400

        # Chama o método para criar a despesa
        response = despesa_service.create_despesa(
            usuario_id=usuario_id,
            categoria_id=categoria_id,
            valor=valor,
            data=data_despesa,
            descricao=descricao
        )

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 201

    ################################################################
    def get_despesas_by_usuario(self, usuario_id: str) -> jsonify:
        """ Método para buscar despesas de um usuário """

        # Chama o método para buscar as despesas
        response = despesa_service.get_despesas_by_usuario(usuario_id=usuario_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200

    ################################################################
    def delete_despesa(self, despesa_id: str) -> jsonify:
        """ Método para deletar uma despesa """

        # Chama o método para deletar a despesa
        response = despesa_service.delete_despesa(despesa_id=despesa_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        if response.get('status') == False:
            return jsonify({'message': response['message']}), 404

        return jsonify(response), 200
    
    ################################################################
    def total_despesa(self, usuario_id: str) -> jsonify:
        """ Método para buscar o total de despesas de um usuário """
        
        # Chama o método para buscar o total de despesas
        response = despesa_service.total_despesa(usuario_id=usuario_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200
    
    ################################################################
    def get_categorias_despesas(self, usuario_id: str) -> jsonify:
        """ Método para buscar categorias de despesas de um usuário """
        
        # Chama o método para buscar as categorias de despesas
        response = despesa_service.get_categorias_despesas(usuario_id=usuario_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200
    
    def get_despesas_by_categoria(self, categoria_id: str) -> jsonify:
        """ Método para buscar despesas de um usuário por categoria """
        
        # Chama o método para buscar as despesas por categoria
        response = despesa_service.get_despesas_by_categoria(categoria_id=categoria_id)
        
        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200

################################################################