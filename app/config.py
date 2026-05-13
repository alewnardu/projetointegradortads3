import os
from datetime import timedelta

class Config:
    
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'mysql+pymysql://usuario:senha@localhost/brinquedoteca'
    )
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    JWT_SECRET_KEY = os.getenv(
        'JWT_SECRET_KEY',
        'secret'
    )
    
    SECRET_KEY = os.getenv('SECRET_KEY') or 'secret'
    
    UPLOAD_FOLDER = 'uploads'

    MAX_CONTENT_LENGTH = 5 * 1024 * 1024

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)