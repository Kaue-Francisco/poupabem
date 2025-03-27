################################################################
# Imports

import uuid
from database.config_database import db
from datetime import date

################################################################
# Main

class Receita(db.Model):
    __tablename__ = 'receita'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    usuario_id = db.Column(db.String(36), nullable=False)
    categoria_id = db.Column(db.String(36), nullable=False)
    valor = db.Column(db.Numeric(8, 2), nullable=False)
    data = db.Column(db.Date, nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    criado_em = db.Column(db.Date, nullable=False, default=date.today)