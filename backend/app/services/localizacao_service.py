from app.models.localizacao import Localizacao
from app.repositories.localizacao_repository import LocalizacaoRepository
from app.exceptions import *
from app.extensions import db

class LocalizacaoService:
    
    @staticmethod
    def criar_localizacao_por_endereco(endereco, localizacao_data):
        try:
            localizacao = Localizacao(**localizacao_data,
                endereco=endereco
            )
            return localizacao
        except Exception:
            raise