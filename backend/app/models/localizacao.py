from app.extensions import db

class Localizacao(db.Model):
    __tablename__ = "localizacao"

    id = db.Column(db.Integer, primary_key=True)

    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    endereco_id = db.Column(
        db.Integer,
        db.ForeignKey("endereco.id"),
        nullable=False,
        unique=True
    )

    endereco = db.relationship("Endereco", back_populates="localizacao")