################################################################
# Imports

from models.categoria_model import Categoria  # Importa o modelo de categoria
from models.despesa_model import Despesa          # Importa o modelo de despesa
from models.receita_model import Receita          # Importa o modelo de receita
from flask_sqlalchemy import SQLAlchemy       # Importa o SQLAlchemy para conexão com o banco de dados

################################################################
# Main

class CategoriaService:

    def __init__(self, db_conn: SQLAlchemy):
        self.db_conn = db_conn

    ################################################################
    def create_categoria(self, usuario_id: str, nome: str, tipo: str) -> dict:
        """ Método para criar uma nova categoria """

        try:
            # Cria uma nova instância de Categoria
            categoria = Categoria(usuario_id=usuario_id, nome=nome, tipo=tipo)
            self.db_conn.session.add(categoria)
            self.db_conn.session.commit()
        except Exception as e:
            return {'error': str(e)}

        return {'message': 'Categoria criada com sucesso!'}

    ################################################################
    def get_categorias_by_usuario(self, usuario_id: str) -> dict:
        """ Método para buscar categorias de um usuário """

        try:
            # Busca todas as categorias associadas ao usuário
            categorias = self.db_conn.session.query(Categoria).filter_by(usuario_id=usuario_id).all()
            return {'status': True, 'categorias': [self.serialize_categoria(c) for c in categorias]}
        except Exception as e:
            return {'error': str(e)}

    ################################################################
    def get_all_categorias(self) -> dict:
        """ Método para buscar todas as categorias """
        try:
            # Busca todas as categorias
            categorias = self.db_conn.session.query(Categoria).all()
            return {'status': True, 'categorias': [self.serialize_categoria(c) for c in categorias]}
        except Exception as e:
            return {'error': str(e)}

    ################################################################
    def delete_categoria(self, categoria_id: str) -> dict:
        """ Método para deletar uma categoria e seus registros vinculados """

        try:
            # Busca a categoria pelo ID
            categoria = self.db_conn.session.query(Categoria).filter_by(id=categoria_id).first()

            if not categoria:
                return {'status': False, 'message': 'Categoria não encontrada'}

            # Apaga receitas ou despesas vinculadas à categoria
            if categoria.tipo == 'receita':
                self.db_conn.session.query(Receita).filter_by(categoria_id=categoria_id).delete()
            else:
                self.db_conn.session.query(Despesa).filter_by(categoria_id=categoria_id).delete()

            # Apaga a categoria
            self.db_conn.session.delete(categoria)
            self.db_conn.session.commit()
        except Exception as e:
            return {'error': str(e)}

        return {'message': 'Categoria e registros vinculados deletados com sucesso!'}
    
    ################################################################
    def total_by_categoria(self, categoria_id: str) -> dict:
        """ Método para buscar o total de categorias por usuário """
        try:
            # Busca o total de categorias associadas ao usuário
            categoria = self.db_conn.session.query(Categoria).filter_by(id=categoria_id).first()
            if not categoria:
                return {'status': False, 'message': 'Categoria não encontrada'}
            
            if categoria.tipo == 'receita':
                receitas = self.db_conn.session.query(Receita).filter_by(categoria_id=categoria_id).all()
                total = sum(receita.valor for receita in receitas)
            else:
                despesas = self.db_conn.session.query(Despesa).filter_by(categoria_id=categoria_id).all()
                total = sum(despesa.valor for despesa in despesas)

            return {'status': True, 'total': total}
        except Exception as e:
            return {'error': str(e)}
    
    ################################################################
    def get_categoria_type(self, tipo: str) -> dict:
        """ Método para buscar o tipo de uma categoria """
        try:
            # Busca a categoria pelo ID
            categoria = self.db_conn.session.query(Categoria).filter_by(tipo=tipo).first()

            if not categoria:
                return {'status': False, 'message': 'Categoria não encontrada'}

            return {'status': True, 'tipo': categoria.tipo}
        except Exception as e:
            return {'error': str(e)}

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