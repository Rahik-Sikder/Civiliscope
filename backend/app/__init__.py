from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from .config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Configure CORS using environment variable
    CORS(app, origins=[app.config['FRONTEND_URL']], supports_credentials=True)
    
    db.init_app(app)
    migrate = Migrate(app, db)

    with app.app_context():
        from .routes import senators
        from .routes import representatives
        app.register_blueprint(senators.bp)
        app.register_blueprint(representatives.bp)

        db.create_all()

    return app