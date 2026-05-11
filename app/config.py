import os

class Config:
    
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'mysql+pymysql://root:senha@localhost/brinquedoteca'
    )
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    JWT_SECRET_KEY = os.getenv(
        'JWT_SECRET_KEY',
        'secret'
    )
    
    SECRET_KEY = os.getenv('SECRET_KEY') or 'secret'
    
    PLOAD_FOLDER = 'uploads'

    MAX_CONTENT_LENGTH = 5 * 1024 * 1024