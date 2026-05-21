from faker import Faker
from app.services.endereco_service import EnderecoService
from app.extensions import db

fake = Faker('pt_BR')

def seed_enderecos(indicacao):

    try:
        endereco = EnderecoService.criar_endereco_por_indicacao(indicacao, {
            "logradouro": fake.street_name(),
            "numero": fake.building_number(),
            "bairro": fake.neighborhood(),
            "cidade": fake.city(),
            "estado": fake.estado_sigla(),
            "cep": fake.postcode().replace("-", "")
        })

        db.session.add(endereco)

        db.session.commit()
        return endereco or None
    except Exception:
        db.session.rollback()
        raise