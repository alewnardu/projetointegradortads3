from app.extensions import db
from app.models.fotografia import Fotografia

class FotografiaRepository:
    @staticmethod
    def salvar(fotografia):
        db.session.add(fotografia)

        return fotografia
    
    @staticmethod
    def buscar_por_id(fotografia_id):
        return db.session.get(Fotografia, fotografia_id)
    
    @staticmethod
    def total_fotografias_por_indicacao(indicacao_id, is_principal=None):
        query = Fotografia.query.filter_by(indicacao_id=indicacao_id)

        if is_principal is not None:
            query = query.filter_by(is_principal=is_principal)

        return query.count()

    @staticmethod
    def deletar(fotografia):
        db.session.delete(fotografia)