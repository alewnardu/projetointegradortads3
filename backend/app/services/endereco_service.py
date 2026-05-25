from app.models.endereco import Endereco
from app.repositories.endereco_repository import EnderecoRepository
from app.exceptions import *
from app.extensions import db

class EnderecoService:
    
    @staticmethod
    def criar_endereco_por_indicacao(indicacao, endereco_data):
        try:
            endereco = Endereco(
                **endereco_data,
                indicacao=indicacao
            )
            return endereco
        except Exception:
            raise