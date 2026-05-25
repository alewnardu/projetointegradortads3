from faker import Faker
from app.models.avaliacao import Avaliacao
from app.models.brinquedoteca import Brinquedoteca
from app.extensions import db
from random import choice

fake = Faker("pt_BR")

def seed_avaliacoes(usuarios):

    total_avaliacoes = 0

    try:
        brinquedotecas = Brinquedoteca.query.filter_by(status="ATIVA").all()
        for brinquedoteca in brinquedotecas:
            avaliacao = Avaliacao(
                nota=choice(range(1, 6)),
                comentario=fake.text(max_nb_chars=500),
                brinquedoteca=brinquedoteca,
                usuario_avaliador=choice(usuarios)
            )
            db.session.add(avaliacao)
            total_avaliacoes += 1

        db.session.commit()
        print(f"{total_avaliacoes} avaliações realizadas com sucesso!\n"
              f"Total de brinquedotecas avaliadas: {len(brinquedotecas)}")
    except Exception:
        db.session.rollback()
        raise