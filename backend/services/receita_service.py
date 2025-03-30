################################################################
# Imports

from models.receita_model import Receita  # Importa o modelo de receita
from flask_sqlalchemy import SQLAlchemy   # Importa o SQLAlchemy para conexão com o banco de dados
from datetime import datetime             # Importa datetime para manipulação de datas

################################################################
# Main

class ReceitaService:

    def __init__(self, db_conn: SQLAlchemy):
        self.db_conn = db_conn

    ################################################################
    def create_receita(self, usuario_id: str, categoria_id: str, valor: float, data: str, descricao: str) -> dict:
        """ Método para criar uma nova receita """

        try:
            # Converte a data para o formato correto, se fornecida
            if data:
                data = datetime.strptime(data, '%Y-%m-%d').date()

            # Cria uma nova instância de Receita
            receita = Receita(
                usuario_id=usuario_id,
                categoria_id=categoria_id,
                valor=valor,
                data=data,
                descricao=descricao
            )
            self.db_conn.session.add(receita)
            self.db_conn.session.commit()
        except Exception as e:
            print(f"Error creating receita: {e}")
            return {'error': str(e)}

        return {'message': 'Receita criada com sucesso!'}

    ################################################################
    def get_receitas_by_usuario(self, usuario_id: str) -> dict:
        """ Método para buscar receitas de um usuário """

        try:
            # Busca todas as receitas associadas ao usuário
            receitas = self.db_conn.session.query(Receita).filter_by(usuario_id=usuario_id).all()
            return {'status': True, 'receitas': [self.serialize_receita(r) for r in receitas]}
        except Exception as e:
            return {'error': str(e)}

    ################################################################
    def delete_receita(self, receita_id: str) -> dict:
        """ Método para deletar uma receita """

        try:
            # Busca a receita pelo ID
            receita = self.db_conn.session.query(Receita).filter_by(id=receita_id).first()

            if not receita:
                return {'status': False, 'message': 'Receita não encontrada'}

            self.db_conn.session.delete(receita)
            self.db_conn.session.commit()
        except Exception as e:
            return {'error': str(e)}

        return {'message': 'Receita deletada com sucesso!'}

    ################################################################
    def serialize_receita(self, receita: Receita) -> dict:
        """ Método para serializar uma receita """
        return {
            'id': receita.id,
            'usuario_id': receita.usuario_id,
            'categoria_id': receita.categoria_id,
            'valor': float(receita.valor),
            'data': receita.data.isoformat(),
            'descricao': receita.descricao,
            'criado_em': receita.criado_em.isoformat()
        }