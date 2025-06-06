################################################################
# Imports

import uuid
from database.config_database import db
from datetime import datetime
from models.user_model import User
from models.categoria_model import Categoria

################################################################
# Main

class Despesa(db.Model):
    __tablename__ = 'despesa'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    categoria_id = db.Column(db.Integer, db.ForeignKey(Categoria.id), nullable=False)
    valor = db.Column(db.Numeric(8, 2), nullable=False)
    data = db.Column(db.Date, nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    imagem = db.Column(db.String(255), nullable=True)
    latitude = db.Column(db.Numeric(10, 8), nullable=True)
    longitude = db.Column(db.Numeric(11, 8), nullable=True)
    criado_em = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)