from app.models.brinquedoteca import Brinquedoteca
from app.repositories.brinquedoteca_repository import BrinquedotecaRepository
from app.exceptions import *
from app.extensions import db

class BrinquedotecaService:

    @staticmethod
    def listar_brinquedotecas():
        return BrinquedotecaRepository.listar()

    @staticmethod
    def criar_brinquedoteca_por_indicacao(indicacao):

        if indicacao.brinquedoteca:
            raise BadRequestError(
                'Já existe brinquedoteca vinculada a essa indicação'
            )

        try:
            brinquedoteca = Brinquedoteca(
                indicacao=indicacao,
                observacao="Brinquedoteca criada mediante aprovação de indicação",
                status='ATIVA'
            )
            BrinquedotecaRepository.salvar(brinquedoteca)
            db.session.commit()
            return brinquedoteca
        except Exception:
            db.session.rollback()
            raise