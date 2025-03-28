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

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    usuario_id = db.Column(db.String(36), db.ForeignKey(User.id), nullable=False)
    categoria_id = db.Column(db.String(36), db.ForeignKey(Categoria.id), nullable=False)
    valor = db.Column(db.Numeric(8, 2), nullable=False)
    data = db.Column(db.Date, nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    criado_em = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)