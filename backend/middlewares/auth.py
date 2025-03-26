################################################################
# Imports

from flask import request, jsonify
from functools import wraps
import jwt  # Ensure you have the PyJWT library installed
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError

################################################################
# Constants

SECRET_KEY = 'secret'  # Use uma variável de ambiente para armazenar a chave secreta

################################################################
# Helper Functions

def decode_token(token: str):
    """ Decodifica e valida o token JWT """
    return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

################################################################
# Middlewares

def validate_auth(func):
    """ Middleware para autenticação """
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'error': 'Token não informado'}), 401

        # Remove "Bearer " prefix if present
        if token.startswith('Bearer '):
            token = token[7:]

        try:
            # Decodifica e valida o token
            decoded_token = decode_token(token)
            # Adiciona informações do token decodificado no request (opcional)
            request.user = decoded_token
        except ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401

        return func(*args, **kwargs)
    return wrapper


def validate_unauth(func):
    """ Middleware para verificar se o usuário está deslogado """
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = request.headers.get('Authorization')

        if token and token.startswith('Bearer '):
            token = token[7:]
            try:
                decode_token(token)
                return jsonify({'error': 'Usuário já logado'}), 401
            except (ExpiredSignatureError, InvalidTokenError):
                pass  # Token inválido ou expirado, considera como deslogado

        return func(*args, **kwargs)
    return wrapper
