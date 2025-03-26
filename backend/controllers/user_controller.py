################################################################
#region Imports

from flask import request, jsonify
from services.user_service import UserService
from database_instance import database_config

################################################################
# Defined

db_conn = database_config.get_db()
user_service = UserService(db_conn=db_conn)

################################################################
#region Main

class UserController:
    def login(self, data: dict) -> jsonify:
        """ Método para login de usuário """

        return data

    def register(self, data: dict) -> jsonify:
        """ Método para registro de usuário """

        response = user_service.register(data['name'], data['email'], data['password'], data['cpf'])
        print(response)
        return data

################################################################