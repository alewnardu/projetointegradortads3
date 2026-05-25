from app.extensions import db
from sqlalchemy import Enum

class Indicacao(db.Model):

    __tablename__ = 'indicacao'
    
    id = db.Column(db.Integer, primary_key=True)
    
    nome = db.Column(db.String(100), nullable=False)

    descricao = db.Column(db.Text, nullable=True)

    data_criacao = db.Column(db.DateTime, nullable=False, server_default=db.func.current_timestamp())
    
    status = db.Column(Enum('PENDENTE', 'APROVADA', 'CANCELADA', 'REJEITADA', name="status_indicacao_enum"), nullable=False, default='PENDENTE')

    data_aprovacao = db.Column(db.DateTime, nullable=True)

    data_rejeicao = db.Column(db.DateTime, nullable=True)

    tem_climatizacao = db.Column(db.Boolean, nullable=False, default=False)

    tem_monitores = db.Column(db.Boolean, nullable=False, default=False)

    tem_gratuidade = db.Column(db.Boolean, nullable=False, default=False)

    porte = db.Column(Enum('PEQUENO', 'MEDIO', 'GRANDE', name="porte_indicacao_enum"), nullable=False, default='MEDIO')

    usuario_indicador_id = db.Column(db.Integer, db.ForeignKey('usuario.id', name='fk_indicacao_usuario_indicador'), nullable=False)

    usuario_analisador_id = db.Column(db.Integer, db.ForeignKey('usuario.id', name='fk_indicacao_usuario_analisador'), nullable=True)

    usuario_indicador = db.relationship(
        'Usuario',
        foreign_keys=[usuario_indicador_id],
        backref='indicacoes_realizadas'
    )

    usuario_analisador = db.relationship(
        'Usuario',
        foreign_keys=[usuario_analisador_id],
        backref='indicacoes_analisadas'
    )
    
    fotografias = db.relationship(
        'Fotografia',
        back_populates='indicacao',
        cascade='all, delete-orphan'
    )