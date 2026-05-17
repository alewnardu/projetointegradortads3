from werkzeug.security import generate_password_hash
from app.models.usuario import Usuario
from app.repositories.usuario_repository import UsuarioRepository
from app.exceptions import *
from app.extensions import db

class UsuarioService:

    @staticmethod
    def listar_usuarios(usuario_logado_id):

        if not usuario_logado_id:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')
        
        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)
        if not usuario_logado or usuario_logado.perfil != 'ADMIN':
            raise ForbiddenError('Acesso negado: Você não tem permissão para acessar a lista de usuários')

        return UsuarioRepository.listar()

    @staticmethod
    def buscar_usuario(usuario_logado_id, usuario_id):
        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)
        if not usuario_logado:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')

        usuario = UsuarioRepository.buscar_por_id(usuario_id)

        if not usuario:
            raise NotFoundError('Usuário não encontrado')

        if (usuario.id != usuario_logado.id and usuario_logado.perfil != 'ADMIN'):
            raise ForbiddenError('Acesso negado! Você não tem permissão para acessar os dados deste usuário')

        return usuario
    
    @staticmethod
    def deletar_usuario(usuario_logado_id, usuario_id):
        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)
        
        if not usuario_logado:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')

        usuario = UsuarioRepository.buscar_por_id(usuario_id)

        if not usuario:
            raise NotFoundError('Usuário não encontrado')
        
        if usuario.id != usuario_logado.id and usuario_logado.perfil != 'ADMIN':
            raise ForbiddenError('Acesso negado: Você não tem permissão para acessar os dados deste usuário')

        UsuarioRepository.deletar(usuario)
        return True

    @staticmethod
    def criar_usuario(usuario_logado_id, dados):

        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)
        
        if not usuario_logado:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')

        if usuario_logado.perfil != 'ADMIN':
            raise ForbiddenError('Acesso negado: Você não tem permissão para criar usuários')

        if not all([dados.get('nome'), dados.get('email'), dados.get('senha'), dados.get('confirmacao_senha')]):
            raise ValidationError('Informe todos os campos obrigatórios')

        usuario_existente = UsuarioRepository.buscar_por_email(
            dados['email']
        )

        if usuario_existente:
            raise EmailAlreadyExistsError('O Email informado já está em uso')

        if dados['senha'] != dados['confirmacao_senha']:
            raise ValidationError('A senha e a confirmação de senha não coincidem')

        if dados['perfil'] not in ['ADMIN', 'CIDADAO']:
            raise ValidationError('Perfil inválido. Os perfis permitidos são ADMIN e CIDADAO')

        try:
            senha_hash = generate_password_hash(dados['senha'])
            usuario = Usuario(
                nome=dados['nome'],
                email=dados['email'],
                senha=senha_hash,
                perfil=dados['perfil']
            )
            UsuarioRepository.salvar(usuario)
            db.session.commit()
            return usuario
        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def alterar_dados_usuario(usuario_logado_id, usuario_id, dados):

        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)

        if not usuario_logado:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')

        usuario = UsuarioRepository.buscar_por_id(usuario_id)

        if not usuario:
            raise NotFoundError('Usuário não encontrado')
        
        if (usuario.id != usuario_logado.id and usuario_logado.perfil != 'ADMIN'):
            raise ForbiddenError('Acesso negado! Você não tem permissão para acessar os dados deste usuário')

        try:
            email = dados.get('email')

            if email:
                usuario_email_existente = UsuarioRepository.buscar_por_email(email)

                if usuario_email_existente and usuario.id != usuario_email_existente.id:
                    raise EmailAlreadyExistsError('O Email informado já está em uso')

                usuario.email = email

            if 'nome' in dados:
                usuario.nome = dados['nome']

            if 'perfil' in dados:
                usuario.perfil = dados['perfil']
            
            UsuarioRepository.salvar(usuario)
            db.session.commit()
            return usuario
        except Exception:
            db.session.rollback()
            raise