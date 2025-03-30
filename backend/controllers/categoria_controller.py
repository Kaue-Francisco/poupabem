################################################################
# Imports

from flask import request, jsonify                       # Registrar as rotas e métodos HTTP
from services.categoria_service import CategoriaService  # Serviço de categoria
from database_instance import database_config            # Instância do banco de dados

################################################################
# Defined

db_conn = database_config.get_db()
categoria_service = CategoriaService(db_conn=db_conn)

################################################################
# Main

class CategoriaController:

    def create_categoria(self, data: dict) -> jsonify:
        """ Método para criar uma nova categoria """

        # Coleta os dados enviados pelo usuário
        usuario_id, nome, tipo = data['usuario_id'], data['nome'], data['tipo']

        # Valida o tipo da categoria
        if tipo not in ['receita', 'despesa']:
            return jsonify({'message': 'O tipo da categoria deve ser "receita" ou "despesa".'}), 400

        # Chama o método para criar a categoria
        response = categoria_service.create_categoria(usuario_id=usuario_id, nome=nome, tipo=tipo)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 201

    ################################################################
    def get_categorias_by_usuario(self, usuario_id: str) -> jsonify:
        """ Método para buscar categorias de um usuário """

        # Chama o método para buscar as categorias
        response = categoria_service.get_categorias_by_usuario(usuario_id=usuario_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200
    
    def get_all_categorias(self) -> jsonify:
        """ Método para buscar todas as categorias """

        # Chama o método para buscar as categorias
        response = categoria_service.get_all_categorias()

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200

    ################################################################
    def delete_categoria(self, categoria_id: str) -> jsonify:
        """ Método para deletar uma categoria """

        # Chama o método para deletar a categoria
        response = categoria_service.delete_categoria(categoria_id=categoria_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        if response.get('status') == False:
            return jsonify({'message': response['message']}), 404

        return jsonify(response), 200
    
    def total_by_categoria(self, categoria_id: str) -> jsonify:
        """ Método para buscar o total de categorias por usuário """

        # Chama o método para buscar o total de categorias
        response = categoria_service.total_by_categoria(categoria_id=categoria_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200
    
    def get_categoria_type(self, tipo: str) -> jsonify:
        """ Método para buscar o tipo de uma categoria """

        # Chama o método para buscar o tipo da categoria
        response = categoria_service.get_categoria_type(tipo=tipo)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200

################################################################