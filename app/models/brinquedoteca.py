from app.extensions import db
from sqlalchemy import Enum

class Brinquedoteca(db.Model):
    
    __tablename__ = 'brinquedoteca'
    
    id = db.Column(db.Integer, primary_key=True)

    observacao = db.Column(db.String(255), nullable=True)

    status = db.Column(Enum('ATIVO', 'INATIVO', name="status_brinquedoteca_enum"), nullable=False, default='ATIVO')

    indicacao_id = db.Column(db.Integer, db.ForeignKey('indicacao.id'), nullable=False, unique=True)

    indicacao = db.relationship('Indicacao', backref=db.backref('brinquedoteca', uselist=False))