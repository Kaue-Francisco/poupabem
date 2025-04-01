################################################################
# Imports

from models.user_model import User          # Importa o modelo de usuário
from flask_sqlalchemy import SQLAlchemy     # Importa o SQLAlchemy para conexão com o banco de dados
from datetime import datetime, timedelta    # Importa datetime e timedelta 
import bcrypt                               # Importa bcrypt para criptografia
import jwt as pyjwt                         # Importa jwt para token de sessão

################################################################
# Main

class UserService:

    def __init__(self, db_conn: SQLAlchemy):
        self.db_conn = db_conn

    ################################################################
    def login(self, email: str, password: str) -> bool:
        """ Método para login de usuário """

        # Busca o usuário pelo email
        user = self.find_by_email(email)

        # Retorna False se o usuário não for encontrado
        if user["status"] == False:
            return {"status": False}

        user = user["user"]

        # Verifica se a senha fornecida corresponde à senha armazenada
        if bcrypt.checkpw(password.encode('utf-8'), user.senha.encode('utf-8')):
            
            # Cria o token de sessão vinculado com o email e id
            # Duração de 1 dia.
            jwt_token = pyjwt.encode({'email': email, "id": str(user.id), 'exp': datetime.utcnow() + timedelta(days=1)}, 'secret', algorithm='HS256')
            
            return {"status": True, "token": jwt_token}

        return {"status": False}

    ################################################################
    def register(self, name: str, email: str, password: str) -> dict:
        """ Método para registro de usuário """

        try:
            print(name, email, password)
            user = User(nome=name, email=email, senha=password)
            self.db_conn.session.add(user)
            self.db_conn.session.commit()
        except Exception as e:
            return {'error': str(e)}

        return {'message': 'Usuário cadastrado com sucesso!'}
    
    ################################################################
    def find_by_email(self, email: str) -> User:
        """ Método para buscar usuário pelo email """

        # Busca o usuário pelo email
        user = self.db_conn.session.query(User).filter_by(email=email).first()

        if user:
            return {"status": True, "user": user}

        return {"status": False}

################################################################