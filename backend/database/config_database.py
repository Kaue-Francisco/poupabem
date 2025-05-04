################################################################
# Imports

from flask_sqlalchemy import SQLAlchemy

################################################################
# Defined

db = SQLAlchemy()

################################################################
# Main

class DatabaseConnect:
    def __init__(self, app):
        self.app = app
        self.init_app()

    ################################################################
    def init_app(self):
        """ Inicializa a aplicação """

        # Substitua os valores abaixo pelos detalhes do seu banco de dados PostgreSQL
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:autaza@localhost:5432/poupabem'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(self.app)

    ################################################################
    def get_db(self):
        """ Retorna a instância do banco de dados """
        return db

################################################################