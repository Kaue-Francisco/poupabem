################################################################
# Imports

from flask import request, jsonify                       # Registrar as rotas e métodos HTTP
from services.categoria_service import CategoriaService  # Serviço de categoria
from database_instance import database_config            # Instância do banco de dados
from models.categoria_model import Categoria             # Modelo de categoria

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
        usuario_id = data.get('usuario_id')
        nome = data.get('nome')
        tipo = data.get('tipo')
        limite_gasto = data.get('limite_gasto')

        # Valida os dados obrigatórios
        if not all([usuario_id, nome, tipo]):
            return jsonify({'message': 'Usuário, nome e tipo são campos obrigatórios.'}), 400

        # Valida o tipo da categoria
        if tipo not in ['receita', 'despesa']:
            return jsonify({'message': 'O tipo da categoria deve ser "receita" ou "despesa".'}), 400

        # Chama o método para criar a categoria
        response = categoria_service.create_categoria(
            usuario_id=usuario_id,
            nome=nome,
            tipo=tipo,
            limite_gasto=limite_gasto
        )

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 201

    ################################################################
    def get_categorias_by_usuario(self, usuario_id: str) -> jsonify:
        """ Método para buscar categorias de um usuário """

        # Chama o método para buscar as categorias
        response = categoria_service.get_categorias_by_usuario(usuario_id=usuario_id)
        print(response)
        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200
    
    ################################################################
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
    
    ################################################################
    def update_categoria(self, categoria_id: str, data: dict) -> jsonify:
        """ Método para atualizar uma categoria """

        # Coleta os dados enviados pelo usuário
        nome = data.get('nome')
        tipo = data.get('tipo')
        limite_gasto = data.get('limite_gasto')

        # Valida o tipo da categoria
        if tipo not in ['receita', 'despesa']:
            return jsonify({'message': 'O tipo da categoria deve ser "receita" ou "despesa".'}), 400

        # Obtém a categoria atual para verificar se o tipo está sendo alterado
        categoria_atual = db_conn.session.query(Categoria).filter_by(id=categoria_id).first()
        
        tipo_alterado = False
        if categoria_atual and categoria_atual.tipo != tipo:
            tipo_alterado = True
            tipo_original = categoria_atual.tipo
            tipo_novo = tipo

        # Chama o método para atualizar a categoria
        response = categoria_service.update_categoria(
            categoria_id=categoria_id,
            nome=nome,
            tipo=tipo,
            limite_gasto=limite_gasto
        )

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        if response.get('status') == False:
            return jsonify({'message': response['message']}), 400

        # Se o tipo foi alterado, adiciona informação adicional na mensagem
        if tipo_alterado:
            response['message'] = f"Categoria atualizada com sucesso! Todas as transações foram convertidas de {tipo_original} para {tipo_novo}."

        return jsonify(response), 200
    
    ################################################################
    def total_by_categoria(self, categoria_id: str) -> jsonify:
        """ Método para buscar o total de categorias por usuário """

        # Chama o método para buscar o total de categorias
        response = categoria_service.total_by_categoria(categoria_id=categoria_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200
    
    ################################################################
    def get_categoria_type(self, tipo: str) -> jsonify:
        """ Método para buscar o tipo de uma categoria """

        # Chama o método para buscar o tipo da categoria
        response = categoria_service.get_categoria_type(tipo=tipo)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200

################################################################