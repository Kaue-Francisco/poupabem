################################################################
#region Imports

from flask import request, jsonify
from services.user_service import UserService
from database_instance import database_config
import bcrypt

################################################################
# Defined

db_conn = database_config.get_db()
user_service = UserService(db_conn=db_conn)

################################################################
#region Main

class UserController:
    def login(self, data: dict) -> jsonify:
        """ Método para login de usuário """

        email, password = data['email'], data['password']

        if user_service.find_by_email(email)["status"] == False:
            return jsonify({'message': 'O e-mail ou a senha estão incorretos!'}), 400

        response = user_service.login(email=email, password=password)

        if response["status"] == False:
            return jsonify({'message': 'O e-mail ou a senha estão incorretos!'}), 400
        
        return response, 200
    
    ################################################################
    def register(self, data: dict) -> jsonify:
        """ Método para registro de usuário """

        name, email, password, cpf = data['name'], data['email'], data['password'], data['cpf']
        
        if user_service.find_by_email(email)["status"] == True:
            return jsonify({'message': 'Este e-mail já está em uso!'}), 400

        if user_service.exists_cpf(cpf) == True:
            return jsonify({'message': 'Este CPF já está em uso!'}), 400
        
        if self.validate_cpf(cpf) == False:
            return jsonify({'message': 'CPF inválido!'}), 400
        
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        response = user_service.register(name=name, email=email, password=password_hash, cpf=cpf)

        return jsonify(response), 201
    
    ################################################################
    def validate_cpf(self, cpf: str) -> bool:
        """ Método para validar CPF """
        
        # Remove caracteres não numéricos
        cpf = ''.join(filter(str.isdigit, cpf))
        
        # Verifica se o CPF tem 11 dígitos
        if len(cpf) != 11:
            return False

        # Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
        if cpf == cpf[0] * len(cpf):
            return False

        # Validação dos dígitos verificadores
        def calcular_digito(cpf, peso_inicial):
            soma = sum(int(cpf[i]) * (peso_inicial - i) for i in range(peso_inicial - 1))
            resto = (soma * 10) % 11
            return resto if resto < 10 else 0

        # Calcula o primeiro dígito verificador
        primeiro_digito = calcular_digito(cpf, 10)
        if primeiro_digito != int(cpf[9]):
            return False

        # Calcula o segundo dígito verificador
        segundo_digito = calcular_digito(cpf, 11)
        if segundo_digito != int(cpf[10]):
            return False

        return True

################################################################