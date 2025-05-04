################################################################################
# Imports

from database.config_database import db
from datetime import datetime
from models.user_model import User  # Importando o modelo de usuário

################################################################################
# Main

class MetaFinanceira(db.Model):
    __tablename__ = 'meta_financeira'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    titulo = db.Column(db.String(255), nullable=False)
    valor_atual = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    valor_meta = db.Column(db.Numeric(10, 2), nullable=False)
    data_inicio = db.Column(db.DateTime, nullable=False)
    data_fim = db.Column(db.DateTime, nullable=False)
    tipo = db.Column(db.String(20), nullable=False, default='geral')  # 'geral', 'categoria', 'receita', 'despesa'
    categoria_id = db.Column(db.Integer, db.ForeignKey('categoria.id'), nullable=True)
    criado_em = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    atualizado_em = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)