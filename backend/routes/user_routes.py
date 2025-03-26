################################################################
# Imports

from flask import Blueprint, request, jsonify            # Registrar as rotas e métodos HTTP
from middlewares.auth import *                           # Middleware de autenticação
from controllers.user_controller import UserController   # Controller de usuário

################################################################
# Main

user_routes = Blueprint('user_routes', __name__, url_prefix='/user')
user_controller = UserController()

################################################################
# Routes

@user_routes.route('/login', methods=['POST'])
@validate_unauth
def login() -> jsonify:
    """ Método para login de usuário """

    data = request.get_json()

    response = user_controller.login(data)

    return response

################################################################
@user_routes.route('/register', methods=['POST'])
@validate_unauth
def register() -> jsonify:
    """ Método para registro de usuário """

    data = request.get_json()

    response = user_controller.register(data)

    return response

################################################################