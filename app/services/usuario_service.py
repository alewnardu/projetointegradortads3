from werkzeug.security import generate_password_hash
from app.models.usuario import Usuario
from app.repositories.usuario_repository import UsuarioRepository

class UsuarioService:

    @staticmethod
    def listar_usuarios():
        return UsuarioRepository.listar()

    @staticmethod
    def buscar_usuario(usuario_id):
        return UsuarioRepository.buscar_por_id(usuario_id)
    
    @staticmethod
    def deletar_usuario(usuario_id):
        usuario = UsuarioRepository.buscar_por_id(usuario_id)
    
        if not usuario:
            return False

        UsuarioRepository.deletar(usuario)
        return True

    @staticmethod
    def criar_usuario(dados):

        usuario_existente = UsuarioRepository.buscar_por_email(
            dados['email']
        )

        if usuario_existente:
            raise Exception('O Email informado já está em uso')

        senha_hash = generate_password_hash(dados['senha'])

        usuario = Usuario(
            nome=dados['nome'],
            email=dados['email'],
            senha=senha_hash,
            perfil=dados['perfil']
        )

        return UsuarioRepository.salvar(usuario)

    @staticmethod
    def alterar_dados_usuario(usuario):

        usuario_encontrado = UsuarioRepository.buscar_por_email(
            usuario.email
        )

        if usuario_encontrado and usuario_encontrado.id != usuario.id:
            raise Exception('O Email informado já está em uso')

        return UsuarioRepository.salvar(usuario)
        
        
        