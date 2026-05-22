from faker import Faker
from app.models.indicacao import Indicacao
from app.extensions import db
from random import choice

fake = Faker("pt_BR")

def seed_indicacoes(quantidade=20, usuarios = None):
    
    indicacoes = []
    
    if not usuarios:
        raise Exception(
            'A seed de indicações requer pelo menos um usuário.'
        )

    try:
        for _ in range(quantidade):

            indicacao = Indicacao(
                nome=f"Brinquedoteca do {fake.company()}",
                descricao=fake.text(max_nb_chars=255),
                usuario_indicador_id=choice(usuarios).id,
                porte=choice([
                    'PEQUENO',
                    'MEDIO',
                    'GRANDE'
                ]),
                tem_climatizacao=choice([True, False]),
                tem_monitores=choice([True, False]),
                tem_gratuidade=choice([True, False]),
                status='PENDENTE',
            )

            db.session.add(indicacao)
            indicacoes.append(indicacao)
        
        db.session.commit()

        print(f"{len(indicacoes)} indicacoes de brinquedotecas criadas com sucesso.")

        return indicacoes           

    except Exception:
        db.session.rollback()
        raise