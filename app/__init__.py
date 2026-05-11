from flask import Flask
from app.extensions import db, migrate, jwt
from app.blueprints import lista_blueprints
from app.config import Config

def create_app():

    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    for blueprint in lista_blueprints():
        app.register_blueprint(blueprint)

    return app