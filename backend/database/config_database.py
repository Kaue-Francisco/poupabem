################################################################
#region Imports

from flask_sqlalchemy import SQLAlchemy

################################################################
#region Defined

db = SQLAlchemy()

################################################################
#region Main

class DatabaseConnect:
    def __init__(self, app):
        self.app = app
        self.init_app()

    ################################################################
    def init_app(self):
        # Substitua os valores abaixo pelos detalhes do seu banco de dados PostgreSQL
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root@localhost:5432/poupabem'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(self.app)
        self.create_tables()

    ################################################################
    def create_tables(self):
        with self.app.app_context():
            db.create_all()
            db.session.commit()

    ################################################################
    def get_db(self):
        return db