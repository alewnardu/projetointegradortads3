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

    LOCAL_APP_URL = os.getenv('LOCAL_APP_URL', 'http://127.0.0.1:5000')
    
    MAX_CONTENT_LENGTH = 25 * 1024 * 1024
    
    UPLOAD_FOLDER = 'uploads'

    ALLOWED_EXTENSIONS = {
        'png',
        'jpg',
        'jpeg',
        'webp'
    }

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)

    #Configurações de email
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_PORT = os.getenv('MAIL_PORT')
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS') == 'True'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER')