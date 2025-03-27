################################################################
# Imports

import uuid
from database.config_database import db
from datetime import datetime

################################################################
# Main

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nome = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(150), nullable=False, unique=True)
    senha = db.Column(db.BigInteger, nullable=False)
    criado_em = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)