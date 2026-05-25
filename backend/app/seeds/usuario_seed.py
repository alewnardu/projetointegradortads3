from faker import Faker
from app.services.autenticacao_service import AutenticacaoService
from app.models.usuario import Usuario
from werkzeug.security import generate_password_hash
from app.extensions import db

fake = Faker('pt_BR')

def seed_usuarios(quantidade=10):
    usuarios = []
    integrantes = [
        {"nome": "AQUILES DOS SANTOS RODRIGUES", "email": "aquilesrodrigues@unitins.br"},
        {"nome": "CRISTOVAO RODRIGUES DE CARVALHO JUNIOR", "email": "dkjunior13@gmail.com"},
        {"nome": "LEONARDO ARAUJO", "email": "leonardoaraujo@unitins.br"},
        {"nome": "WENDELL MAGALHÃES", "email": "wendell@unitins.br"},
        {"nome": "WILKONYS DA COSTA OLIVEIRA", "email": "wilkonys@unitins.br"},
    ]

    try:

        for integrante in integrantes:
            usuario = Usuario(
                nome= integrante['nome'],
                email=integrante['email'],
                senha=generate_password_hash("teste@123"),
                perfil="ADMIN",
                status=True,
                data_inativacao=None
            )
            db.session.add(usuario)
            usuarios.append(usuario)
            print(f"Usuário [{usuario.nome}] com perfil [ADMIN] criado com sucesso.")

        for _ in range(quantidade):
            usuario = AutenticacaoService.primeiro_acesso({
                "nome": fake.name(),
                "email": fake.unique.email(),
                "senha": "teste@123",
                "perfil": "CIDADAO",
                "status": True,
                "data_inativacao": None
            })
            db.session.add(usuario)
            usuarios.append(usuario)

        print(f"{len(usuarios) -5} usuários com perfil [CIDADAO] criados com sucesso.")
        
        db.session.commit()
        return usuarios or []
    except Exception:
        db.session.rollback()
        raise