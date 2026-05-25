from faker import Faker
from app.services.localizacao_service import LocalizacaoService
from app.extensions import db

fake = Faker('pt_BR')

def seed_localizacoes(endereco):

    try:
        localizacao = LocalizacaoService.criar_localizacao_por_endereco(endereco, {
            "latitude": fake.latitude(),
            "longitude": fake.longitude(),
        })

        db.session.add(localizacao)

        db.session.commit()
        return localizacao or None
    except Exception:
        db.session.rollback()
        raise