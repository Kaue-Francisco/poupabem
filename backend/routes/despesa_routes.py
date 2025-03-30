################################################################
# Imports

from flask import Blueprint, request, jsonify            # Registrar as rotas e métodos HTTP
from middlewares.auth import *                           # Middleware de autenticação
from controllers.despesa_controller import DespesaController  # Controller de despesa

################################################################
# Main

despesa_routes = Blueprint('despesa_routes', __name__, url_prefix='/despesa')
despesa_controller = DespesaController()

################################################################
# Routes

@despesa_routes.route('/create', methods=['POST'])
@token_authorization
def create_despesa() -> jsonify:
    """ Método para criar uma nova despesa """

    data = request.get_json()

    response = despesa_controller.create_despesa(data)

    return response

################################################################
@despesa_routes.route('/<usuario_id>', methods=['GET'])
@token_authorization
def get_despesas_by_usuario(usuario_id: str) -> jsonify:
    """ Método para buscar despesas de um usuário """

    response = despesa_controller.get_despesas_by_usuario(usuario_id)

    return response

################################################################
@despesa_routes.route('/delete/<despesa_id>', methods=['DELETE'])
@token_authorization
def delete_despesa(despesa_id: str) -> jsonify:
    """ Método para deletar uma despesa """

    response = despesa_controller.delete_despesa(despesa_id)

    return response

@despesa_routes.route('/total/<usuario_id>', methods=['GET'])
@token_authorization
def get_total_despesas(usuario_id: int) -> jsonify:
    """ Método para buscar o total de despesas de um usuário """

    response = despesa_controller.total_despesa(usuario_id)

    return response

@despesa_routes.route('/categorias/<usuario_id>', methods=['GET'])
@token_authorization
def get_categorias_despesas(usuario_id: str) -> jsonify:
    """ Método para buscar categorias de despesas de um usuário """

    response = despesa_controller.get_categorias_despesas(usuario_id)

    return response

################################################################