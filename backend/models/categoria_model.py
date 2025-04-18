################################################################
# Imports

import uuid
from database.config_database import db
from datetime import datetime
from models.user_model import User

################################################################
# Main

class Categoria(db.Model):
    __tablename__ = 'categoria'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    nome = db.Column(db.String(255), nullable=False)
    tipo = db.Column(db.String(255), nullable=False)
    limite_gasto = db.Column(db.Numeric(10, 2), nullable=True)
    criado_em = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        db.CheckConstraint("tipo IN ('receita', 'despesa')", name='check_tipo_valores'),
    )