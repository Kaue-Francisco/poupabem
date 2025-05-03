################################################################
# Imports

from models.alert_model import Alert  # Importa o modelo de alerta
from flask_sqlalchemy import SQLAlchemy   # Importa o SQLAlchemy para conexão com o banco de dados
from datetime import datetime             # Importa datetime para manipulação de datas

################################################################
# Main

class AlertService:

    def __init__(self, db_conn: SQLAlchemy):
        self.db_conn = db_conn

    ################################################################
    def create_alert(self, usuario_id: str, titulo: str, descricao: str, data_alerta: str) -> dict:
        """ Método para criar um novo alerta """

        try:
            # Converte a data para o formato correto, se fornecida
            if data_alerta:
                data_alerta = datetime.strptime(data_alerta, '%Y-%m-%d').date()

            # Cria uma nova instância de Alerta
            alert = Alert(
                usuario_id=usuario_id,
                titulo=titulo,
                descricao=descricao,
                data_alerta=data_alerta
            )
            self.db_conn.session.add(alert)
            self.db_conn.session.commit()

        except Exception as e:
            print(f"Error creating alert: {e}")
            return {'error': str(e)}

        return {'message': 'Alerta criado com sucesso!'}
    
    def is_alert(self, usuario_id: str) -> dict:
        """ Método para verificar se o usuário possui alertas """
        
        try:
            # Busca todos os alertas associados ao usuário
            alertas = self.db_conn.session.query(Alert).filter_by(usuario_id=usuario_id).all()
            
            if not alertas:
                return {'message': 'Nenhum alerta encontrado para o usuário.'}
            
            alertas_disparados = []

            # Serializa os alertas
            alertas = [self.serialize_alert(alerta) for alerta in alertas]
            
            for alerta in alertas:
                # Acessa data_alerta como chave do dicionário
                if alerta['data_alerta'] and datetime.strptime(alerta['data_alerta'], '%Y-%m-%d').date() == datetime.now().date():
                    alertas_disparados.append(alerta)

            if len(alertas_disparados) == 0:
                return {'message': 'Nenhum alerta disparado.'}
            
            return {'alertas_disparados': alertas_disparados}
        
        except Exception as e:
            print(f"Error fetching alerts: {e}")
            return {'error': str(e)}
        
    def update_alert(self, alert_id: str, usuario_id, titulo, descricao, data_alerta) -> dict:
        """ Método para atualizar um alerta """

        try:
            # Busca o alerta pelo ID
            alert = self.db_conn.session.query(Alert).filter_by(id=alert_id).first()

            if not alert:
                return {'error': 'Alerta não encontrado.'}

            # Atualiza os campos do alerta
            alert.usuario_id = usuario_id
            alert.titulo = titulo
            alert.descricao = descricao
            alert.data_alerta = datetime.strptime(data_alerta, '%Y-%m-%d').date() if data_alerta else None

            self.db_conn.session.commit()

        except Exception as e:
            print(f"Error updating alert: {e}")
            return {'error': str(e)}

        return {'message': 'Alerta atualizado com sucesso!'}
    
    def delete_alert(self, alert_id: str) -> dict:
        """ Método para deletar um alerta """

        try:
            # Busca o alerta pelo ID
            alert = self.db_conn.session.query(Alert).filter_by(id=alert_id).first()

            if not alert:
                return {'error': 'Alerta não encontrado.'}

            # Deleta o alerta
            self.db_conn.session.delete(alert)
            self.db_conn.session.commit()

        except Exception as e:
            print(f"Error deleting alert: {e}")
            return {'error': str(e)}

        return {'message': 'Alerta deletado com sucesso!'}
    
    def all_alerts(self) -> dict:
        """ Método para buscar todos os alertas que ainda não chegaram no dia do alerta """

        try:
            # Busca todos os alertas
            alertas = self.db_conn.session.query(Alert).all()

            alertas_validos = []

            for alerta in alertas:
                # Verifica se data_alerta é uma instância de datetime e compara com a data atual
                if alerta.data_alerta and alerta.data_alerta.date() > datetime.now().date():
                    alertas_validos.append(alerta)
            
            if len(alertas_validos) == 0:
                return {'message': 'Nenhum alerta encontrado.'}

            # Serializa os alertas válidos
            alertas = [self.serialize_alert(alerta) for alerta in alertas_validos]

            return {'alertas': alertas}

        except Exception as e:
            print(f"Error fetching all alerts: {e}")
            return {'error': str(e)}
                
    def serialize_alert(self, alert: Alert) -> dict:
        """ Método para serializar um alerta """
        
        return {
            'id': alert.id,
            'usuario_id': alert.usuario_id,
            'titulo': alert.titulo,
            'descricao': alert.descricao,
            'data_alerta': alert.data_alerta.strftime('%Y-%m-%d') if alert.data_alerta else None
        }