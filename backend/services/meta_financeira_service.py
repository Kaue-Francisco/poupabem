################################################################################
# Imports

from models.meta_financeira_model import MetaFinanceira 
from flask_sqlalchemy import SQLAlchemy

################################################################################
# Main

class MetaFinanceiraService:

    def __init__(self, db_conn: SQLAlchemy):
        self.db_conn = db_conn

    ################################################################
    def create_meta_financeira(self, usuario_id: str, titulo: str, valor_atual: float, valor_meta: float, data_inicio: str, data_fim: str) -> dict:
        """ Método para criar uma nova meta financeira """

        try:
            # Cria uma nova instância de MetaFinanceira
            meta = MetaFinanceira(usuario_id=usuario_id, titulo=titulo, valor_atual=valor_atual,valor_meta=valor_meta, data_inicio=data_inicio, data_fim=data_fim)
            self.db_conn.session.add(meta)
            self.db_conn.session.commit()
        except Exception as e:
            return {'error': str(e)}

        return {'message': 'Meta financeira criada com sucesso!'}
    
    ################################################################
    def get_metas_by_usuario(self, usuario_id: str) -> dict:
        """ Método para buscar metas financeiras de um usuário """

        try:
            # Busca todas as metas associadas ao usuário
            metas = self.db_conn.session.query(MetaFinanceira).filter_by(usuario_id=usuario_id).all()
            return {'status': True, 'metas': [self.serialize_meta(meta) for meta in metas]}
        except Exception as e:
            return {'error': str(e)}
        
    ################################################################
    def delete_meta(self, meta_id: str) -> dict:
        """ Método para deletar uma meta financeira """
        
        try:
            # Busca a meta pelo ID
            meta = self.db_conn.session.query(MetaFinanceira).filter_by(id=meta_id).first()

            if not meta:
                return {'error': 'Meta não encontrada'}

            # Deleta a meta
            self.db_conn.session.delete(meta)
            self.db_conn.session.commit()
        except Exception as e:
            return {'error': str(e)}

        return {'message': 'Meta financeira deletada com sucesso!'}

    ################################################################
    def update_meta(self, meta_id: str, usuario_id: str, titulo:str, valor_meta: float, data_inicio, data_fim) -> dict:
        """ Método para atualizar uma meta financeira """

        try:
            # Busca a meta pelo ID
            meta = self.db_conn.session.query(MetaFinanceira).filter_by(id=meta_id).first()

            if not meta:
                return {'error': 'Meta não encontrada'}

            # Atualiza os dados da meta
            meta.usuario_id = usuario_id
            meta.titulo = titulo
            meta.valor_meta = valor_meta
            meta.data_inicio = data_inicio
            meta.data_fim = data_fim

            self.db_conn.session.commit()
        except Exception as e:
            return {'error': str(e)}

        return {'message': 'Meta financeira atualizada com sucesso!'}

    ################################################################
    def serialize_meta(self, meta: MetaFinanceira) -> dict:
        """ Método para serializar uma meta financeira """
        return {
            'id': meta.id,
            'usuario_id': meta.usuario_id,
            'titulo': meta.titulo,
            'valor_atual': meta.valor_atual,
            'valor_meta': meta.valor_meta,
            'data_inicio': meta.data_inicio,
            'data_fim': meta.data_fim
        }