################################################################
# Imports

from flask import Blueprint, request, jsonify            # Registrar as rotas e métodos HTTP
from middlewares.auth import *                           # Middleware de autenticação
from controllers.receita_controller import ReceitaController  # Controller de receita

################################################################
# Main

receita_routes = Blueprint('receita_routes', __name__, url_prefix='/receita')
receita_controller = ReceitaController()

################################################################
# Routes

@receita_routes.route('/create', methods=['POST'])
@token_authorization
def create_receita() -> jsonify:
    """ Método para criar uma nova receita """

    data = request.get_json()

    response = receita_controller.create_receita(data)

    return response

################################################################
@receita_routes.route('/<usuario_id>', methods=['GET'])
@token_authorization
def get_receitas_by_usuario(usuario_id: str) -> jsonify:
    """ Método para buscar receitas de um usuário """

    response = receita_controller.get_receitas_by_usuario(usuario_id)

    return response

################################################################
@receita_routes.route('/delete/<receita_id>', methods=['DELETE'])
@token_authorization
def delete_receita(receita_id: str) -> jsonify:
    """ Método para deletar uma receita """

    response = receita_controller.delete_receita(receita_id)

    return response

################################################################
@receita_routes.route('/total/<usuario_id>', methods=['GET'])
@token_authorization
def get_total_receitas(usuario_id: int) -> jsonify:
    """ Método para buscar o total de receitas de um usuário """

    response = receita_controller.total_receitas(usuario_id)

    return response

################################################################
@receita_routes.route('/categorias/<usuario_id>', methods=['GET'])
@token_authorization
def get_categorias_receitas(usuario_id: str) -> jsonify:
    """ Método para buscar categorias de receitas de um usuário """

    response = receita_controller.get_categorias_receitas(usuario_id)

    return response

@receita_routes.route('/por-categoria/<categoria_id>', methods=['GET'])
@token_authorization
def get_receitas_by_categoria(categoria_id: str) -> jsonify:
    """ Método para buscar receitas por categoria """

    response = receita_controller.get_receitas_by_categoria(categoria_id)

    return response

################################################################