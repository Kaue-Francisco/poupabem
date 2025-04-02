################################################################
# Imports

from models.despesa_model import Despesa  # Importa o modelo de despesa
from flask_sqlalchemy import SQLAlchemy   # Importa o SQLAlchemy para conexão com o banco de dados
from datetime import datetime             # Importa datetime para manipulação de datas
from models.user_model import User             # Importa o modelo de usuário
from models.categoria_model import Categoria         # Importa o modelo de categoria

################################################################
# Main

class DespesaService:

    def __init__(self, db_conn: SQLAlchemy):
        self.db_conn = db_conn

    ################################################################
    def create_despesa(self, usuario_id: str, categoria_id: str, valor: float, data: str, descricao: str) -> dict:
        """ Método para criar uma nova despesa """

        try:
            # Converte a data para o formato correto, se fornecida
            if data:
                data = datetime.strptime(data, '%Y-%m-%d').date()

            # Cria uma nova instância de Despesa
            despesa = Despesa(
                usuario_id=usuario_id,
                categoria_id=categoria_id,
                valor=valor,
                data=data,
                descricao=descricao
            )
            self.db_conn.session.add(despesa)
            self.db_conn.session.commit()
        except Exception as e:
            print(f"Error creating despesa: {e}")
            return {'error': str(e)}

        return {'message': 'Despesa criada com sucesso!'}

    ################################################################
    def get_despesas_by_usuario(self, usuario_id: str) -> dict:
        """ Método para buscar despesas de um usuário """

        try:
            # Busca todas as despesas associadas ao usuário
            despesas = self.db_conn.session.query(Despesa).filter_by(usuario_id=usuario_id).all()
            return {'status': True, 'despesas': [self.serialize_despesa(d) for d in despesas]}
        except Exception as e:
            return {'error': str(e)}

    ################################################################
    def delete_despesa(self, despesa_id: str) -> dict:
        """ Método para deletar uma despesa """

        try:
            # Busca a despesa pelo ID
            despesa = self.db_conn.session.query(Despesa).filter_by(id=despesa_id).first()

            if not despesa:
                return {'status': False, 'message': 'Despesa não encontrada'}

            self.db_conn.session.delete(despesa)
            self.db_conn.session.commit()
        except Exception as e:
            return {'error': str(e)}

        return {'message': 'Despesa deletada com sucesso!'}
    
    def total_despesa(self, usuario_id: str) -> dict:
        """ Método para buscar o total de despesas de um usuário """
        
        try:
            # Busca todas as despesas associadas ao usuário
            despesas = self.db_conn.session.query(Despesa).filter_by(usuario_id=usuario_id).all()
            total = sum(despesa.valor for despesa in despesas)
            return {'status': True, 'total': total}
        except Exception as e:
            return {'error': str(e)}
    
    ################################################################
    def get_categorias_despesas(self, usuario_id: str) -> dict:
        """ Método para buscar categorias de despesas de um usuário """
        
        try:
            # Busca todas as categorias de despesas associadas ao usuário
            categorias = self.db_conn.session.query(Categoria).filter_by(usuario_id=usuario_id, tipo='despesa').all()
            return {'status': True, 'categorias': [self.serialize_categoria(c) for c in categorias]}
        except Exception as e:
            return {'error': str(e)}
        
    def get_despesas_by_categoria(self, categoria_id: str) -> dict:
        """ Método para buscar despesas de um usuário por categoria """
        
        try:
            # Busca todas as despesas associadas ao usuário e à categoria
            despesas = self.db_conn.session.query(Despesa).filter_by(categoria_id=categoria_id).all()
            return {'status': True, 'despesas': [self.serialize_despesa(d) for d in despesas]}
        except Exception as e:
            return {'error': str(e)}

    ################################################################
    def serialize_despesa(self, despesa: Despesa) -> dict:
        """ Método para serializar uma despesa """
        return {
            'id': despesa.id,
            'usuario_id': despesa.usuario_id,
            'categoria_id': despesa.categoria_id,
            'valor': float(despesa.valor),
            'data': despesa.data.isoformat(),
            'descricao': despesa.descricao,
            'criado_em': despesa.criado_em.isoformat()
        }
    
    ################################################################
    def serialize_categoria(self, categoria: Categoria) -> dict:
        """ Método para serializar uma categoria """
        return {
            'id': categoria.id,
            'usuario_id': categoria.usuario_id,
            'nome': categoria.nome,
            'tipo': categoria.tipo,
            'criado_em': categoria.criado_em.isoformat()
        }

################################################################