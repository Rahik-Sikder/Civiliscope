from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Configure CORS using environment variable
    CORS(app, origins=[app.config["FRONTEND_URL"]], supports_credentials=True)

    db.init_app(app)

    with app.app_context():
        from .routes import senators
        from .routes import representatives
        from .routes import members
        from .routes import congress

        app.register_blueprint(senators.bp)
        app.register_blueprint(representatives.bp)
        app.register_blueprint(members.bp)
        app.register_blueprint(congress.bp)

        # Health check endpoint for EB
        @app.route('/health')
        def health_check():
            return {'status': 'healthy'}, 200
        
        # Root endpoint for ELB health checks
        @app.route('/')
        def root():
            return {'status': 'ok', 'message': 'Civiliscope Backend API'}, 200

        db.create_all()

    return app
