from app.extensions import db

class Endereco(db.Model):
    __tablename__ = 'endereco'
    
    id = db.Column(db.Integer, primary_key=True)

    logradouro = db.Column(db.String(150), nullable=False)

    numero = db.Column(db.String(20), nullable=True)

    bairro = db.Column(db.String(100), nullable=False)

    cidade = db.Column(db.String(100), nullable=False)

    estado = db.Column(db.String(2), nullable=False)

    cep = db.Column(db.String(8), nullable=False)

    indicacao_id = db.Column(db.Integer, db.ForeignKey('indicacao.id'), nullable=False, unique=True)

    indicacao = db.relationship('Indicacao', backref=db.backref('endereco', uselist=False))

    localizacao = db.relationship(
        "Localizacao",
        back_populates="endereco",
        uselist=False
    )