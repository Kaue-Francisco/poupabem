################################################################
# Imports

from flask import jsonify, request
from services.alert_service import AlertService
from database_instance import database_config

#################################################################
# Defined

db_conn = database_config.get_db()
alert_service = AlertService(db_conn=db_conn)

#################################################################
# Main

class AlertController:
    
    def create_alert(self, data) -> jsonify:
        """ Método para criar um novo alerta """
        
        # Coleta os dados enviados pelo usuário
        usuario_id = data.get('usuario_id')
        titulo = data.get('titulo')
        descricao = data.get('descricao')
        data_alerta = data.get('data_alerta')

        # Valida os dados obrigatórios
        if not all([usuario_id, titulo, descricao, data_alerta]):
            return jsonify({'message': 'Todos os campos são obrigatórios.'}), 400

        # Chama o método para criar o alerta
        response = alert_service.create_alert(
            usuario_id=usuario_id,
            titulo=titulo,
            descricao=descricao,
            data_alerta=data_alerta
        )

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 201
    
    def is_alert(self, usuario_id: str) -> jsonify:
        """ Método para verificar se o usuário possui alertas """
        
        # Chama o método para verificar os alertas
        response = alert_service.is_alert(usuario_id=usuario_id)
        
        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200
    
    def update_alert(self, data) -> jsonify:
        """ Método para atualizar um alerta """
        
        # Coleta os dados enviados pelo usuário
        alert_id = data.get('alert_id')
        usuario_id = data.get('usuario_id')
        titulo = data.get('titulo')
        descricao = data.get('descricao')
        data_alerta = data.get('data_alerta')

        # Valida os dados obrigatórios
        if not all([alert_id, usuario_id, titulo, descricao, data_alerta]):
            return jsonify({'message': 'Todos os campos são obrigatórios.'}), 400

        # Chama o método para atualizar o alerta
        response = alert_service.update_alert(
            alert_id=alert_id,
            usuario_id=usuario_id,
            titulo=titulo,
            descricao=descricao,
            data_alerta=data_alerta
        )

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200
    
    def delete_alert(self, alert_id: str) -> jsonify:
        """ Método para deletar um alerta """
        
        # Chama o método para deletar o alerta
        response = alert_service.delete_alert(alert_id=alert_id)

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200
    
    def all_alerts(self) -> jsonify:
        """ Método para buscar todos os alertas """
        
        # Chama o método para buscar todos os alertas
        response = alert_service.all_alerts()

        # Retorna a resposta
        if 'error' in response:
            return jsonify({'message': response['error']}), 400

        return jsonify(response), 200