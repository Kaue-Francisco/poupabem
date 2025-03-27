################################################################
# Imports

import uuid
from database.config_database import db
from datetime import datetime

################################################################
# Main

class Orcamento(db.Model):
    __tablename__ = 'orcamento'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    usuario_id = db.Column(db.String(36), nullable=False)
    categoria_id = db.Column(db.String(36), nullable=False)
    limite = db.Column(db.Numeric(8, 2), nullable=False)
    mes_ano = db.Column(db.String(7), nullable=False)
    criado_em = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Foreign key relationships
    usuario = db.relationship('User', backref='orcamentos', foreign_keys=[usuario_id])
    categoria = db.relationship('Categoria', backref='orcamentos', foreign_keys=[categoria_id])