################################################################
# Imports

from flask import request, jsonify                       # Registrar as rotas e métodos HTTP
from services.receita_service import ReceitaService      # Serviço de receita
from database_instance import database_config            # Instância do banco de dados

################################################################
# Defined

db_conn = database_config.get_db()
receita_service = ReceitaService(db_conn=db_conn)

################################################################
# Main

class ReceitaController:

    def create_receita(self, data: dict) -> jsonify:
        """ Método para criar uma nova receita """

        # Coleta os dados enviados pelo usuário
        usuario_id = data.get('usuario_id')
        categoria_id = data.get('categoria_id')
        valor = data.get('valor')
        data_receita = data.get('data')
        descricao = data.get('descricao')

        # Valida os dados obrigatórios
        if not all([usuario_id, categoria_id, valor, data_receita, descricao]):
            return jsonify({'message': 'Todos os campos são obrigatórios.'}), 400

        # Chama o método para criar a receita
        response = receita_service.create_receita(
            usuario_id=usuario_id,
            categoria_id=categoria_id,
            valor=valor,
            data=data_receita,
            descricao=descricao
        )

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 201

    ################################################################
    def get_receitas_by_usuario(self, usuario_id: str) -> jsonify:
        """ Método para buscar receitas de um usuário """

        # Chama o método para buscar as receitas
        response = receita_service.get_receitas_by_usuario(usuario_id=usuario_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200

    ################################################################
    def delete_receita(self, receita_id: str) -> jsonify:
        """ Método para deletar uma receita """

        # Chama o método para deletar a receita
        response = receita_service.delete_receita(receita_id=receita_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        if response.get('status') == False:
            return jsonify({'message': response['message']}), 404

        return jsonify(response), 200
    
    ################################################################
    def total_receitas(self, usuario_id: str) -> jsonify:
        """ Método para calcular o total de receitas de um usuário """
        
        # Chama o método para calcular o total
        response = receita_service.total_receitas(usuario_id=usuario_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200
    
    ################################################################
    def get_categorias_receitas(self, usuario_id: str) -> jsonify:
        """ Método para buscar categorias de receitas de um usuário """
        
        # Chama o método para buscar as categorias
        response = receita_service.get_categorias_receitas(usuario_id=usuario_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200
    
    def get_receitas_by_categoria(self, categoria_id: str) -> jsonify:
        """ Método para buscar receitas de um usuário por categoria """
        
        # Chama o método para buscar as receitas por categoria
        response = receita_service.get_receitas_by_categoria(categoria_id=categoria_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200

################################################################