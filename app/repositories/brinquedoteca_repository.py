from app.models.brinquedoteca import Brinquedoteca
from app.extensions import db

class BrinquedotecaRepository:
    
    @staticmethod
    def listar():
        return Brinquedoteca.query.all()

    @staticmethod
    def buscar_por_id(brinquedoteca_id):
        return Brinquedoteca.query.get(brinquedoteca_id)

    @staticmethod
    def salvar(brinquedoteca):
        db.session.add(brinquedoteca)

        return brinquedoteca

    @staticmethod
    def deletar(brinquedoteca):
        db.session.delete(brinquedoteca)
        db.session.commit()