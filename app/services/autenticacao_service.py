from app.repositories.usuario_repository import UsuarioRepository
from werkzeug.security import check_password_hash

class AutenticacaoService:

    def autenticar_usuario(dados):
        email = dados.get('email')
        senha = dados.get('senha')

        if not email or not senha:
            raise Exception('Email e senha são obrigatórios')
        
        usuario = UsuarioRepository.buscar_por_email(email)

        if not usuario:
            raise Exception('Usuário não encontrado com o email informado')
        
        senha_valida = check_password_hash(usuario.senha, senha)
        if not senha_valida:
            raise Exception('Senha inválida')

        return usuario