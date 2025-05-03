################################################################
# Imports

from database_instance import app              # Importando a instância do Flask
from routes.user_routes import user_routes     # Importando as rotas de usuário 
from routes.categoria_routes import categoria_routes
from routes.despesa_routes import despesa_routes  # Importando as rotas de despesa
from routes.receita_routes import receita_routes  # Importando as rotas de receita
from routes.meta_financeira_routes import meta_financeira_routes  # Importando as rotas de meta financeira
from routes.alert_routes import alert_routes  # Importando as rotas de alerta

################################################################
# Main

# Registrando as rotas
app.register_blueprint(user_routes)
app.register_blueprint(categoria_routes)
app.register_blueprint(despesa_routes)
app.register_blueprint(receita_routes)
app.register_blueprint(meta_financeira_routes)
app.register_blueprint(alert_routes)

################################################################

if __name__ == '__main__':
    app.run(debug=True)

################################################################