from app.models.brinquedoteca import Brinquedoteca
from app.repositories.brinquedoteca_repository import BrinquedotecaRepository
from app.exceptions import *

class BrinquedotecaService:

    @staticmethod
    def listar_brinquedotecas():
        return BrinquedotecaRepository.listar()