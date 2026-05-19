from app.extensions import db

class FotografiaRepository:
    @staticmethod
    def salvar(fotografia):
        db.session.add(fotografia)

        return fotografia