################################################################
#region Imports

from flask import Blueprint, request, jsonify
from middlewares.auth import validate_auth
from controllers.user_controller import UserController

################################################################
#region Main

user_routes = Blueprint('user_routes', __name__, url_prefix='/user')
user_controller = UserController()

################################################################
#region Routes

@user_routes.route('/login', methods=['POST'])
def login() -> jsonify:
    """ Método para login de usuário """

    data = request.get_json()

    return data

################################################################
@user_routes.route('/register', methods=['POST'])
def register() -> jsonify:
    """ Método para registro de usuário """

    data = request.get_json()

    response = user_controller.register(data)

    return response

################################################################