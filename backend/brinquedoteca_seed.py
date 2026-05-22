import os
from dotenv import load_dotenv

load_dotenv()

from app import create_app
from app.seeds.usuario_seed import seed_usuarios
from app.seeds.indicacao_seed import seed_indicacoes
from app.seeds.endereco_seed import seed_enderecos
from app.seeds.localizacao_seed import seed_localizacoes
from app.seeds.fotografia_seed import seed_fotografias
from app.seeds.brinquedoteca_seed import seed_brinquedotecas
from app.seeds.avaliacao_seed import seed_avaliacoes

app = create_app()

usuarios = []

with app.app_context():
    usuarios = seed_usuarios(15)
    indicacoes = seed_indicacoes(60, usuarios)

    for indicacao in indicacoes:
        endereco = seed_enderecos(indicacao)
        localizacao = seed_localizacoes(endereco)
        seed_fotografias(indicacao)
    
    seed_brinquedotecas(indicacoes)
    seed_avaliacoes(usuarios)
