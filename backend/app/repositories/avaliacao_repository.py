from app.extensions import db

class AvaliacaoRepository:
    @staticmethod
    def salvar(avaliacao):
        db.session.add(avaliacao)

        return avaliacao