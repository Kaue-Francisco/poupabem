################################################################
# Imports

from database_instance import app
from routes.user_routes import user_routes

################################################################
# Main

# Registrando as rotas
app.register_blueprint(user_routes)

################################################################

if __name__ == '__main__':
    app.run(debug=True)

################################################################