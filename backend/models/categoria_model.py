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

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    usuario_id = db.Column(db.String(36), db.ForeignKey(User.id), nullable=False)
    nome = db.Column(db.String(255), nullable=False)
    tipo = db.Column(db.String(255), nullable=False)
    criado_em = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    __table_args__ = (
        db.CheckConstraint("tipo IN ('receita', 'despesa')", name='check_tipo_valores'),
    )