################################################################
# Imports

from flask import Blueprint, request, jsonify

################################################################
# Main

user_routes = Blueprint('user_routes', __name__, url_prefix='/user')

################################################################
# Routes

@user_routes.route('/login', methods=['POST'])
def login() -> jsonify:
    """ Método para login de usuário """

    data = request.get_json()

    return data

################################################################