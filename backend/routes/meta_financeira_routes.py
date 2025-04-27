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