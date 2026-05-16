from app.models.indicacao import Indicacao
from app.extensions import db

class IndicacaoRepository:
    
    @staticmethod
    def listar(usuario_logado):
        if not usuario_logado:
            return Indicacao.query.all()
        return Indicacao.query.filter_by(usuario_indicador_id=usuario_logado.id).all()
