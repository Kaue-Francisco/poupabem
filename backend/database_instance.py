################################################################
# Imports

from database.config_database import DatabaseConnect
from flask import Flask

################################################################
# Defined

app = Flask(__name__)
database_config = DatabaseConnect(app)