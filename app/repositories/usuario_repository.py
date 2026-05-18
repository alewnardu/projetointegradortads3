from app.models.usuario import Usuario
from app.extensions import db

class UsuarioRepository:
    
    @staticmethod
    def listar():
        return Usuario.query.all()

    @staticmethod
    def buscar_por_id(usuario_id):
        return db.session.get(Usuario, usuario_id)


    @staticmethod
    def buscar_por_email(email):
        return Usuario.query.filter_by(email=email).first()

    @staticmethod
    def salvar(usuario):
        db.session.add(usuario)

        return usuario

    @staticmethod
    def deletar(usuario):
        db.session.delete(usuario)
        db.session.commit()