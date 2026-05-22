from app.extensions import db

class LocalizacaoRepository:
    @staticmethod
    def salvar(localizacao):
        db.session.add(localizacao)

        return localizacao