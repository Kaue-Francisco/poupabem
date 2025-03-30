################################################################
# Imports

from database_instance import app              # Importando a instância do Flask
from routes.user_routes import user_routes     # Importando as rotas de usuário 
from routes.categoria_routes import categoria_routes
from routes.despesa_routes import despesa_routes  # Importando as rotas de despesa
from routes.receita_routes import receita_routes  # Importando as rotas de receita

################################################################
# Main

# Registrando as rotas
app.register_blueprint(user_routes)
app.register_blueprint(categoria_routes)
app.register_blueprint(despesa_routes)
app.register_blueprint(receita_routes)

################################################################

if __name__ == '__main__':
    app.run(debug=True)

################################################################