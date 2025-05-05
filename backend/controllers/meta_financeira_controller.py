################################################################################
# Imports

from flask import request, jsonify
from services.meta_financeira_service import MetaFinanceiraService  # Serviço de meta financeira
from database_instance import database_config  # Instância do banco de dados
from controllers.receita_controller import ReceitaController  # Controller de receita
from controllers.despesa_controller import DespesaController  # Controller de despesa

################################################################################
# Defined

db_conn = database_config.get_db()
meta_financeira_service = MetaFinanceiraService(db_conn=db_conn)
receita_controller = ReceitaController()
despesa_controller = DespesaController()

################################################################################
# Main

class MetaFinanceiraController:
    
    def pegar_valor_atual(self, usuario_id: str, data_inicio: str, data_fim: str, tipo: str, categoria_id: str = None) -> float:
        """Calcula o valor atual baseado no tipo e período da meta"""
        try:
            # Converte o ID do usuário para inteiro
            usuario_id_int = int(usuario_id)
            
            # Cria uma meta temporária para usar o método atualizar_valor_atual
            meta_temp = {
                'id': 'temp',
                'usuario_id': usuario_id_int,
                'data_inicio': data_inicio,
                'data_fim': data_fim,
                'tipo': tipo,
                'categoria_id': categoria_id
            }
            
            # Usa o método atualizar_valor_atual do serviço
            response = meta_financeira_service.atualizar_valor_atual(meta_temp)
            
            if 'error' in response:
                raise ValueError(response['error'])
                
            return response['valor_atual']
            
        except ValueError as e:
            print(f"Erro ao converter ID do usuário: {str(e)}")
            return 0.0
        except Exception as e:
            print(f"Erro ao calcular valor atual: {str(e)}")
            return 0.0

    ################################################################################
    def create_meta_financeira(self, data: dict) -> jsonify:
        """ Método para criar uma nova meta financeira """

        # Coleta os dados enviados pelo usuário
        usuario_id = data.get('usuario_id')
        titulo = data.get('titulo')
        valor_meta = data.get('valor_meta')
        data_inicio = data.get('data_inicio')
        data_fim = data.get('data_fim')
        tipo = data.get('tipo', 'geral')
        categoria_id = data.get('categoria_id')
        valor_atual = self.pegar_valor_atual(usuario_id, data_inicio, data_fim, tipo, categoria_id)

        # Valida os dados obrigatórios
        if not all([usuario_id, titulo, valor_meta, data_inicio, data_fim]):
            return jsonify({'message': 'Usuário, título, valor meta, data de início e data de fim são campos obrigatórios.'}), 400

        # Chama o método para criar a meta financeira
        response = meta_financeira_service.create_meta_financeira(
            usuario_id=usuario_id,
            titulo=titulo,
            valor_atual=valor_atual,
            valor_meta=valor_meta,
            data_inicio=data_inicio,
            data_fim=data_fim,
            tipo=tipo,
            categoria_id=categoria_id
        )

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        # Atualiza o valor atual após a criação da meta
        meta_id = response.get('meta_id')
        if meta_id:
            atualizacao = meta_financeira_service.atualizar_valor_atual(meta_id)
            if 'error' in atualizacao:
                print(f"Erro ao atualizar valor atual: {atualizacao['error']}")

        return jsonify(response), 201
    
    ################################################################################
    def get_metas_by_usuario(self, usuario_id: str) -> jsonify:
        """ Método para buscar metas financeiras de um usuário """

        # Chama o método para buscar as metas
        response = meta_financeira_service.get_metas_by_usuario(usuario_id=usuario_id)

        # Atualiza o valor atual de cada meta
        if 'metas' in response:
            for meta in response['metas']:
                atualizacao = meta_financeira_service.atualizar_valor_atual(meta['id'])
                if 'valor_atual' in atualizacao:
                    meta['valor_atual'] = atualizacao['valor_atual']
                    meta['meta_batida'] = atualizacao['meta_batida']

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200
    
    #############################################################################
    def update_meta(self, data: dict) -> jsonify:
        """ Método para atualizar uma meta financeira """
        
        # Coleta os dados enviados pelo usuário
        meta_id = data.get('meta_id')
        usuario_id = data.get('usuario_id')
        titulo = data.get('titulo')
        valor_meta = data.get('valor_meta')
        data_inicio = data.get('data_inicio')
        data_fim = data.get('data_fim')
        tipo = data.get('tipo', 'geral')
        categoria_id = data.get('categoria_id')

        # Valida os dados obrigatórios
        if not all([meta_id, usuario_id, titulo, valor_meta, data_inicio, data_fim]):
            return jsonify({'message': 'ID da meta, usuário, título, valor meta, data de início e data de fim são campos obrigatórios.'}), 400

        # Se for meta de categoria, valida a categoria_id
        if tipo == 'categoria' and not categoria_id:
            return jsonify({'message': 'Para metas do tipo categoria, é necessário informar a categoria.'}), 400

        # Chama o método para atualizar a meta
        response = meta_financeira_service.update_meta(
            meta_id=meta_id,
            usuario_id=usuario_id,
            titulo=titulo,
            valor_meta=valor_meta,
            data_inicio=data_inicio,
            data_fim=data_fim,
            tipo=tipo,
            categoria_id=categoria_id
        )

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        # Atualiza o valor atual após a atualização da meta
        atualizacao = meta_financeira_service.atualizar_valor_atual(meta_id)
        if 'error' in atualizacao:
            print(f"Erro ao atualizar valor atual: {atualizacao['error']}")
            return jsonify({'message': atualizacao['error']}), 400

        return jsonify({
            'message': 'Meta financeira atualizada com sucesso!',
            'valor_atual': atualizacao.get('valor_atual', 0),
            'meta_batida': atualizacao.get('meta_batida', False)
        }), 200
    
    ################################################################################
    def delete_meta(self, meta_id: str) -> jsonify:
        """ Método para deletar uma meta financeira """
        
        # Chama o método para deletar a meta
        response = meta_financeira_service.delete_meta(meta_id=meta_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200
