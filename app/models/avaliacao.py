from app.extensions import db

class Avaliacao(db.Model):

    __tablename__ = 'avaliacao'

    __table_args__ = (
        UniqueConstraint(
            'usuario_avaliador_id',
            'brinquedoteca_id',
            name='uq_usuario_brinquedoteca_avaliacao'
        ),
    )

    id = db.Column(db.Integer, primary_key=True)

    nota = db.Column(db.Integer, nullable=False)

    comentario = db.Column(db.String(500), nullable=False)

    brinquedoteca_id = db.Column(
        db.Integer,
        db.ForeignKey('brinquedoteca.id'),
        nullable=False
    )

    usuario_avaliador_id = db.Column(
        db.Integer,
        db.ForeignKey('usuario.id',
        name='fk_avaliacao_usuario_avaliador'),
        nullable=False
    )

    brinquedoteca = db.relationship(
        'Brinquedoteca',
        back_populates='avaliacoes'
    )

    usuario_avaliador = db.relationship(
        "Usuario",
        back_populates="avaliacoes"
    )
