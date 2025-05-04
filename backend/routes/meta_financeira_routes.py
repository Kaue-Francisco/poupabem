################################################################################
# Imports

from flask import Blueprint, request, jsonify
from middlewares.auth import *
from controllers.meta_financeira_controller import MetaFinanceiraController

################################################################################
# Defined

meta_financeira_routes = Blueprint('meta_financeira_routes', __name__, url_prefix='/meta_financeira')
meta_financeira_controller = MetaFinanceiraController()

################################################################################
# Routes

@meta_financeira_routes.route('/create', methods=['POST'])
@token_authorization
def create_meta_financeira() -> jsonify:
    """ Método para criar uma nova meta financeira """

    data = request.get_json()

    response = meta_financeira_controller.create_meta_financeira(data)

    return response

@meta_financeira_routes.route('/<usuario_id>', methods=['GET'])
@token_authorization
def get_metas_by_usuario(usuario_id: str) -> jsonify:
    """ Método para buscar metas financeiras de um usuário """

    response = meta_financeira_controller.get_metas_by_usuario(usuario_id)

    return response

@meta_financeira_routes.route('/delete/<meta_id>', methods=['DELETE'])
@token_authorization
def delete_meta(meta_id: str) -> jsonify:
    """ Método para deletar uma meta financeira """

    response = meta_financeira_controller.delete_meta(meta_id)

    return response

@meta_financeira_routes.route('/update', methods=['PUT'])
@token_authorization
def update_meta() -> jsonify:
    """ Método para atualizar uma meta financeira """

    data = request.get_json()

    response = meta_financeira_controller.update_meta(data)

    return response