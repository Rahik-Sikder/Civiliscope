import os


class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FRONTEND_URL = os.getenv("FRONTEND_URL")

    # Use SQLite for both development and production
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "sqlite:////app/instance/civiliscope.db"
    )
