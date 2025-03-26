from database.config_database import DatabaseConnect
from flask import Flask

app = Flask(__name__)
database_config = DatabaseConnect(app)