################################################################################
# Imports

from models.meta_financeira_model import MetaFinanceira 
from flask_sqlalchemy import SQLAlchemy
from models.receita_model import Receita
from models.despesa_model import Despesa
from models.categoria_model import Categoria

################################################################################
# Main

class MetaFinanceiraService:

    def __init__(self, db_conn: SQLAlchemy):
        self.db_conn = db_conn

    ################################################################
    def create_meta_financeira(self, usuario_id: str, titulo: str, valor_atual: float, valor_meta: float, data_inicio: str, data_fim: str, tipo: str = 'geral', categoria_id: str = None) -> dict:
        """ Método para criar uma nova meta financeira """

        try:
            # Cria uma nova instância de MetaFinanceira
            meta = MetaFinanceira(
                usuario_id=usuario_id,
                titulo=titulo,
                valor_atual=valor_atual,
                valor_meta=valor_meta,
                data_inicio=data_inicio,
                data_fim=data_fim,
                tipo=tipo,
                categoria_id=categoria_id
            )
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
    def update_meta(self, meta_id: str, usuario_id: str, titulo:str, valor_meta: float, data_inicio, data_fim, tipo: str = 'geral', categoria_id: str = None) -> dict:
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
            meta.tipo = tipo
            meta.categoria_id = categoria_id

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
            'data_fim': meta.data_fim,
            'tipo': meta.tipo,
            'categoria_id': meta.categoria_id,
            'criado_em': meta.criado_em,
            'atualizado_em': meta.atualizado_em
        }

    def atualizar_valor_atual(self, meta_id: str) -> dict:
        """Atualiza o valor atual da meta baseado nas transações do período"""
        try:
            # Se meta_id for um dicionário (meta temporária), extrai os dados
            if isinstance(meta_id, dict):
                meta_data = meta_id
                meta_id = meta_data.get('id')
                usuario_id = int(meta_data.get('usuario_id'))
                data_inicio = meta_data.get('data_inicio')
                data_fim = meta_data.get('data_fim')
                tipo = meta_data.get('tipo')
                categoria_id = meta_data.get('categoria_id')
                
                # Se for uma meta temporária, não precisa buscar no banco
                if meta_id == 'temp':
                    meta = type('Meta', (), {
                        'id': 'temp',
                        'usuario_id': usuario_id,
                        'data_inicio': data_inicio,
                        'data_fim': data_fim,
                        'tipo': tipo,
                        'categoria_id': categoria_id
                    })
                else:
                    meta = self.db_conn.session.query(MetaFinanceira).filter_by(id=meta_id).first()
            else:
                meta = self.db_conn.session.query(MetaFinanceira).filter_by(id=meta_id).first()
                if not meta:
                    return {'error': 'Meta não encontrada'}
                usuario_id = int(meta.usuario_id)

            valor_atual = 0.0
            
            if meta.tipo == 'geral':
                # Para meta geral: receitas - despesas
                receitas = self.db_conn.session.query(Receita).filter(
                    Receita.usuario_id == usuario_id,
                    Receita.data >= meta.data_inicio,
                    Receita.data <= meta.data_fim
                ).all()
                
                despesas = self.db_conn.session.query(Despesa).filter(
                    Despesa.usuario_id == usuario_id,
                    Despesa.data >= meta.data_inicio,
                    Despesa.data <= meta.data_fim
                ).all()
                
                total_receitas = sum(r.valor for r in receitas)
                total_despesas = sum(d.valor for d in despesas)
                valor_atual = total_receitas - total_despesas
                
                
            elif meta.tipo == 'receita':
                # Para meta de receita: apenas receitas
                receitas = self.db_conn.session.query(Receita).filter(
                    Receita.usuario_id == usuario_id,
                    Receita.data >= meta.data_inicio,
                    Receita.data <= meta.data_fim
                ).all()
                
                valor_atual = sum(r.valor for r in receitas)
                
            elif meta.tipo == 'despesa':
                # Para meta de despesa: apenas despesas
                despesas = self.db_conn.session.query(Despesa).filter(
                    Despesa.usuario_id == usuario_id,
                    Despesa.data >= meta.data_inicio,
                    Despesa.data <= meta.data_fim
                ).all()
                
                valor_atual = sum(d.valor for d in despesas)
                
            elif meta.tipo == 'categoria' and meta.categoria_id:
                # Verifica se a categoria é de receita ou despesa
                categoria = self.db_conn.session.query(Categoria).filter_by(id=meta.categoria_id).first()
                if not categoria:
                    return {'error': 'Categoria não encontrada'}

                if categoria.tipo == 'receita':
                    # Para categoria de receita: apenas receitas da categoria
                    receitas = self.db_conn.session.query(Receita).filter(
                        Receita.usuario_id == usuario_id,
                        Receita.categoria_id == meta.categoria_id,
                        Receita.data >= meta.data_inicio,
                        Receita.data <= meta.data_fim
                    ).all()
                    
                    valor_atual = sum(r.valor for r in receitas)
                else:
                    # Para categoria de despesa: apenas despesas da categoria
                    despesas = self.db_conn.session.query(Despesa).filter(
                        Despesa.usuario_id == usuario_id,
                        Despesa.categoria_id == meta.categoria_id,
                        Despesa.data >= meta.data_inicio,
                        Despesa.data <= meta.data_fim
                    ).all()
                    
                    valor_atual = sum(d.valor for d in despesas)

            # Se não for uma meta temporária, atualiza no banco
            if meta_id != 'temp':
                meta.valor_atual = valor_atual
                self.db_conn.session.commit()

            # Verifica se a meta foi batida
            meta_batida = self.verificar_meta_batida(meta)
            
            return {
                'message': 'Valor atual atualizado com sucesso',
                'valor_atual': valor_atual,
                'meta_batida': meta_batida
            }
            
        except Exception as e:
            print(f"Erro ao atualizar valor atual: {str(e)}")
            return {'error': str(e)}

    def verificar_meta_batida(self, meta: MetaFinanceira) -> bool:
        """Verifica se a meta foi batida baseado no tipo"""
        try:
            # Calcula o progresso da meta
            if meta.valor_meta == 0:
                return False
                
            progresso = (meta.valor_atual / meta.valor_meta) * 100
            
            # Para metas de despesa e categoria, a meta é batida quando o valor atual é menor ou igual ao valor meta
            if meta.tipo in ['despesa', 'categoria']:
                return meta.valor_atual <= meta.valor_meta
                
            # Para metas de receita e geral, a meta é batida quando o valor atual é maior ou igual ao valor meta
            elif meta.tipo in ['receita', 'geral']:
                return meta.valor_atual >= meta.valor_meta
                
            return False
        except Exception as e:
            print(f"Erro ao verificar meta batida: {str(e)}")
            return False