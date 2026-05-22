from app.extensions import db

class EnderecoRepository:
    @staticmethod
    def salvar(endereco):
        db.session.add(endereco)

        return endereco