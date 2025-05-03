################################################################
# Imports

from flask import Blueprint, request, jsonify            # Registrar as rotas e métodos HTTP
from middlewares.auth import *                           # Middleware de autenticação
from controllers.alert_controller import AlertController  # Controller de alerta

#################################################################
# Main

alert_routes = Blueprint('alert_routes', __name__, url_prefix='/alert')
alert_controller = AlertController()

#################################################################
# Routes

@alert_routes.route('/create', methods=['POST'])
@token_authorization
def create_alert() -> jsonify:
    """ Método para criar um novo alerta """

    data = request.get_json()

    response = alert_controller.create_alert(data)

    return response

@alert_routes.route('/<usuario_id>', methods=['GET'])
@token_authorization
def is_alert(usuario_id: str) -> jsonify:
    """ Método para verificar se o usuário possui alertas """

    response = alert_controller.is_alert(usuario_id)

    return response

@alert_routes.route('/update', methods=['PUT'])
@token_authorization
def update_alert() -> jsonify:
    """ Método para atualizar um alerta """

    data = request.get_json()

    response = alert_controller.update_alert(data)

    return response

@alert_routes.route('/delete/<alert_id>', methods=['DELETE'])
@token_authorization
def delete_alert(alert_id: str) -> jsonify:
    """ Método para deletar um alerta """

    response = alert_controller.delete_alert(alert_id)

    return response

@alert_routes.route('/all', methods=['GET'])
@token_authorization
def get_all_alerts() -> jsonify:
    """ Método para obter todos os alertas """

    response = alert_controller.all_alerts()

    return response