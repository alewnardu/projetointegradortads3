from app.extensions import db

class Fotografia(db.Model):

    __tablename__ = 'fotografia'

    id = db.Column(db.Integer, primary_key=True)

    nome_arquivo = db.Column(db.String(255), nullable=False)

    caminho = db.Column(db.String(500), nullable=False)

    is_principal = db.Column(db.Boolean,nullable=False,default=False)

    data_upload = db.Column(
        db.DateTime,
        server_default=db.func.current_timestamp()
    )

    indicacao_id = db.Column(
        db.Integer,
        db.ForeignKey('indicacao.id'),
        nullable=False
    )

    indicacao = db.relationship(
        'Indicacao',
        back_populates='fotografias'
    )