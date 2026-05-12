from app.extensions import db
from sqlalchemy import Enum

class Usuario(db.Model):
    
    __tablename__ = 'usuario'
    
    id = db.Column(db.Integer, primary_key=True)
    
    nome = db.Column(db.String(100), nullable=False)
    
    email = db.Column(db.String(150), nullable=False, unique=True)
    
    senha = db.Column(db.String(255), nullable=False)
    
    perfil = db.Column(Enum('CIDADAO', 'ADMIN', name="perfil_usuario_enum"), nullable=False, default='CIDADAO')