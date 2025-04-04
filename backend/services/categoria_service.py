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
    def update_categoria(self, categoria_id: str, nome: str, tipo: str) -> dict:
        """ Método para atualizar uma categoria, convertendo suas transações se o tipo mudar """
        try:
            # Busca a categoria pelo ID
            categoria = self.db_conn.session.query(Categoria).filter_by(id=categoria_id).first()

            if not categoria:
                return {'status': False, 'message': 'Categoria não encontrada'}
            
            # Verifica se o tipo está sendo alterado
            if categoria.tipo != tipo:
                # Se o tipo mudou, convertemos todas as transações
                if categoria.tipo == 'receita' and tipo == 'despesa':
                    # Converte de receita para despesa
                    receitas = self.db_conn.session.query(Receita).filter_by(categoria_id=categoria_id).all()
                    for receita in receitas:
                        # Cria uma nova despesa com os mesmos dados da receita
                        nova_despesa = Despesa(
                            usuario_id=receita.usuario_id,
                            categoria_id=receita.categoria_id,
                            valor=receita.valor,
                            descricao=receita.descricao,
                            data=receita.data
                        )
                        self.db_conn.session.add(nova_despesa)
                    
                    # Exclui as receitas originais
                    self.db_conn.session.query(Receita).filter_by(categoria_id=categoria_id).delete()
                
                elif categoria.tipo == 'despesa' and tipo == 'receita':
                    # Converte de despesa para receita
                    despesas = self.db_conn.session.query(Despesa).filter_by(categoria_id=categoria_id).all()
                    for despesa in despesas:
                        # Cria uma nova receita com os mesmos dados da despesa
                        nova_receita = Receita(
                            usuario_id=despesa.usuario_id,
                            categoria_id=despesa.categoria_id,
                            valor=despesa.valor,
                            descricao=despesa.descricao,
                            data=despesa.data
                        )
                        self.db_conn.session.add(nova_receita)
                    
                    # Exclui as despesas originais
                    self.db_conn.session.query(Despesa).filter_by(categoria_id=categoria_id).delete()
            
            # Atualiza os dados da categoria
            categoria.nome = nome
            categoria.tipo = tipo
            
            # Comita as alterações
            self.db_conn.session.commit()
            
            return {'status': True, 'message': 'Categoria atualizada com sucesso!'}
        except Exception as e:
            # Rollback em caso de erro
            self.db_conn.session.rollback()
            return {'error': str(e)}
    
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