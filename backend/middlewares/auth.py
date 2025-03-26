################################################################
# Imports

from flask import request, jsonify
from functools import wraps

################################################################
# Main

# Middleware para autenticação
def validate_auth(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')

        if token is None:
            return jsonify({'error': 'Token não informado'}), 401

        if token != 'Bearer mytoken':
            return jsonify({'error': 'Token inválido'}), 401

        return func(*args, **kwargs)
    return wrapper

################################################################