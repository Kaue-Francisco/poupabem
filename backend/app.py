################################################################
# Imports

from database_instance import app              # Importando a instância do Flask
from routes.user_routes import user_routes     # Importando as rotas de usuário 
from routes.categoria_routes import categoria_routes

################################################################
# Main

# Registrando as rotas
app.register_blueprint(user_routes)
app.register_blueprint(categoria_routes)

################################################################

if __name__ == '__main__':
    app.run(debug=True)

################################################################