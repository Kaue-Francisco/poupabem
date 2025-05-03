################################################################
# Imports

from database.config_database import db
from datetime import datetime
from models.user_model import User

#################################################################
# Main

class Alert(db.Model):
    __tablename__ = 'alert'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    titulo = db.Column(db.String(255), nullable=False)
    descricao = db.Column(db.String(255), nullable=False)
    data_alerta = db.Column(db.DateTime, nullable=False)
    criado_em = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)