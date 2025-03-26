################################################################
#region Imports

from models.user_model import User
from flask_sqlalchemy import SQLAlchemy

################################################################
#region Main

class UserService:

    def __init__(self, db_conn: SQLAlchemy):
        self.db_conn = db_conn

    ################################################################
    def login(self, data: dict) -> dict:
        """ Método para login de usuário """

        return data

    ################################################################
    def register(self, name: str, email: str, password: str, cpf: str) -> dict:
        """ Método para registro de usuário """

        try:
            user = User(name=name, email=email, password=password, cpf=cpf)
            self.db_conn.session.add(user)
            self.db_conn.session.commit()
        except Exception as e:
            return {'error': str(e)}

        return {'message': 'Usuário cadastrado com sucesso!'}
    
    ################################################################
    def exists_email(self, email: str) -> bool:
        """ Método para verificar se o email já existe """

        user = self.db_conn.session.query(User).filter_by(email=email).first()

        if user:
            return True
        
        return False
    
    ################################################################
    def exists_cpf(self, cpf: str) -> bool:
        """ Método para verificar se o CPF já existe """

        user = self.db_conn.session.query(User).filter_by(cpf=cpf).first()

        if user:
            return True
        
        return False