from flask import Flask, send_from_directory
import os
from flask_cors import CORS
from app.extensions import db, migrate, jwt, mail
from app.blueprints import lista_blueprints
from app.config import Config

def create_app():

    app = Flask(__name__)
    
    app.config.from_object(Config)

    # Allow specific origins for development
    CORS(app, resources={r"/*": {"origins": ["http://127.0.0.1:5173","http://127.0.0.1:5174","http://localhost:5173", "http://localhost:5174"]}}, supports_credentials=True)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    
    for blueprint in lista_blueprints():
        app.register_blueprint(blueprint)

    @app.route('/uploads/<path:filename>', methods=['GET'])
    def servir_upload(filename):
        return send_from_directory(os.path.join(app.root_path, '..', 'uploads'), filename)

    return app
