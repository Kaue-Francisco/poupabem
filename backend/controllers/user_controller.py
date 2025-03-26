################################################################
# Imports

from flask import request, jsonify                # Registrar as rotas e métodos HTTP
from services.user_service import UserService     # Serviço de usuário
from database_instance import database_config     # Instância do banco de dados
import bcrypt                                     # Biblioteca para criptografia de senhas

################################################################
# Defined

db_conn = database_config.get_db()
user_service = UserService(db_conn=db_conn)

################################################################
# Main

class UserController:

    def login(self, data: dict) -> jsonify:
        """ Método para login de usuário """

        # Coleta os dados enviados pelo o usuário
        email, password = data['email'], data['password']

        # Verifica se o e-mail existe
        if user_service.find_by_email(email)["status"] == False:
            return jsonify({'message': 'O e-mail ou a senha estão incorretos!'}), 400

        # Chama o método onde verifica se a senha está correta e retorna o token
        response = user_service.login(email=email, password=password)

        # Caso a senha estiver incorreta
        if response["status"] == False:
            return jsonify({'message': 'O e-mail ou a senha estão incorretos!'}), 400
        
        return response, 200
    
    ################################################################
    def register(self, data: dict) -> jsonify:
        """ Método para registro de usuário """

        # Coleta os dados enviados pelo o usuário
        name, email, password = data['name'], data['email'], data['password']
        
        # Verifica se o e-mail já está em uso
        exists_email = user_service.find_by_email(email)
        if exists_email["status"] == True:
            return jsonify({'message': 'Este e-mail já está em uso!'}), 400
        
        # Criptografa a senha
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Chama o método onde registra o usuário
        response = user_service.register(name=name, email=email, password=password_hash)

        return jsonify(response), 201

################################################################