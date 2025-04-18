################################################################
# Imports

from flask import Blueprint, request, jsonify            # Registrar as rotas e métodos HTTP
from middlewares.auth import *                           # Middleware de autenticação
from controllers.categoria_controller import CategoriaController  # Controller de categoria

################################################################
# Main

categoria_routes = Blueprint('categoria_routes', __name__, url_prefix='/categoria')
categoria_controller = CategoriaController()

################################################################
# Routes

@categoria_routes.route('/create', methods=['POST'])
@token_authorization
def create_categoria() -> jsonify:
    """ Método para criar uma nova categoria """

    data = request.get_json()

    response = categoria_controller.create_categoria(data)

    return response

################################################################
@categoria_routes.route('/<usuario_id>', methods=['GET'])
@token_authorization
def get_categorias_by_usuario(usuario_id: str) -> jsonify:
    """ Método para buscar categorias de um usuário """

    response = categoria_controller.get_categorias_by_usuario(usuario_id)

    return response

################################################################
@categoria_routes.route('/listar', methods=['GET'])
@token_authorization
def get_all_categorias() -> jsonify:
    """ Método para buscar todas as categorias """

    response = categoria_controller.get_all_categorias()

    return response

################################################################
@categoria_routes.route('/delete/<categoria_id>', methods=['DELETE'])
@token_authorization
def delete_categoria(categoria_id: str) -> jsonify:
    """ Método para deletar uma categoria """

    response = categoria_controller.delete_categoria(categoria_id)

    return response

################################################################
@categoria_routes.route('/update/<categoria_id>', methods=['PUT'])
@token_authorization
def update_categoria(categoria_id: str) -> jsonify:
    """ Método para atualizar uma categoria """

    data = request.get_json()

    response = categoria_controller.update_categoria(categoria_id, data)

    return response

################################################################
@categoria_routes.route('/total/<categoria_id>', methods=['GET'])
@token_authorization
def total_by_categoria(categoria_id: str) -> jsonify:
    """ Método para buscar o total de uma categoria """

    response = categoria_controller.total_by_categoria(categoria_id)

    return response

################################################################