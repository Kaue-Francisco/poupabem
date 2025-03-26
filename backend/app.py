################################################################
# Imports

from flask import Flask
from routes.user_routes import user_routes

################################################################
# Main

def create_app() -> Flask:
    """ Método para criar a aplicação Flask """
    app = Flask(__name__)

    # Registrando as rotas
    app.register_blueprint(user_routes)

    return app

################################################################

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

################################################################