from app.models.indicacao import Indicacao
from app.extensions import db

class IndicacaoRepository:
    
    @staticmethod
    def listar():
        return Indicacao.query.all()
