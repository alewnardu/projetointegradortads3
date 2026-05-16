from flask import current_app
from app.repositories.usuario_repository import UsuarioRepository
from werkzeug.security import (check_password_hash, generate_password_hash)
from app.exceptions import *
from datetime import timedelta
from flask_jwt_extended import create_access_token, decode_token
from app.services.email_service import EmailService
from jwt import ExpiredSignatureError

class AutenticacaoService:

    @staticmethod
    def autenticar_usuario(dados):
        email = dados.get('email')
        senha = dados.get('senha')

        if not all([email, senha]):
            raise ValidationError('Email e senha são obrigatórios')
        
        usuario = UsuarioRepository.buscar_por_email(email)

        if not usuario:
            raise NotFoundError('Credendiais inválidas')
        
        senha_valida = check_password_hash(usuario.senha, senha)
        if not senha_valida:
            raise AuthenticationError('Falha na autenticação')

        return usuario

    @staticmethod
    def cadastrar(dados):
        from app.repositories.usuario_repository import UsuarioRepository
        from app.models.usuario import Usuario
        from werkzeug.security import generate_password_hash
        from app.exceptions import ValidationError, EmailAlreadyExistsError

        nome = dados.get('nome')
        email = dados.get('email')
        senha = dados.get('senha')
        confirmacao_senha = dados.get('confirmacao_senha')

        if not all([nome, email, senha, confirmacao_senha]):
            raise ValidationError('Informe todos os campos obrigatórios: nome, email, senha e confirmação de senha')

        if senha != confirmacao_senha:
            raise ValidationError('A senha e a confirmação de senha não coincidem')

        if len(senha) < 6:
            raise ValidationError('A senha deve ter no mínimo 6 caracteres')

        usuario_existente = UsuarioRepository.buscar_por_email(email)
        if usuario_existente:
            raise EmailAlreadyExistsError('Este e-mail já está em uso')

        usuario = Usuario(
            nome=nome,
            email=email,
            senha=generate_password_hash(senha),
            perfil='CIDADAO'
        )

        return UsuarioRepository.salvar(usuario)
    
    @staticmethod
    def recuperar_senha(dados):
        email = dados.get('email')
        if not email:
            raise ValidationError('Email é obrigatório para recuperação de senha')
        
        usuario = UsuarioRepository.buscar_por_email(email)
        if not usuario:
            return True
        
        reset_token = create_access_token(identity=str(usuario.id), expires_delta=timedelta(minutes=5), additional_claims={'purpose': 'password_reset'})

        frontend_url = current_app.config.get('LOCAL_APP_URL')
        
        reset_link = f"{frontend_url}/resetar-senha?token={reset_token}"

        EmailService.enviar_email_recuperacao_senha(usuario, reset_link)
        return True

    @staticmethod
    def redefinir_senha(dados):
        
        token = dados.get('token')
        if not token:
            raise AuthenticationError('Token inválido ou expirado 1')

        nova_senha = dados.get('nova_senha')
        confirmacao_senha = dados.get('confirmacao_senha')

        if not all([nova_senha, confirmacao_senha]):
            raise ValidationError('Os campos nova senha e confirmação de senha são obrigatórios 2')
        
        if nova_senha != confirmacao_senha:
            raise ValidationError('A nova senha e a confirmação não coincidem 3')
        
        try:
            decoded_token = decode_token(token)
            if decoded_token.get('purpose') != 'password_reset':
                raise AuthenticationError('Token inválido 4')
            usuario_id = decoded_token.get('sub')
        except Exception as e:
            raise AuthenticationError(f'{str(e)} 5')

        usuario = UsuarioRepository.buscar_por_id(usuario_id)
        if not usuario:
            raise ValidationError('Usuário não encontrado 6')

        usuario.senha = generate_password_hash(nova_senha)
        return UsuarioRepository.salvar(usuario)

    @staticmethod
    def alterar_senha(usuario_id, dados):
        
        usuario = UsuarioRepository.buscar_por_id(usuario_id)
        if not usuario:
            raise NotFoundError('Usuário não encontrado')
        
        senha_atual = dados.get('senha_atual')
        nova_senha = dados.get('nova_senha')
        confirmacao_senha = dados.get('confirmacao_senha')

        if not all([senha_atual, nova_senha, confirmacao_senha]):
            raise ValidationError('Os campos senha atual, nova senha e confirmação de senha são obrigatórios')
        
        if not check_password_hash(usuario.senha, senha_atual):
            raise AuthenticationError('Senha atual incorreta')

        if nova_senha != confirmacao_senha:
            raise ValidationError('A nova senha e a confirmação não coincidem')
        
        usuario.senha = generate_password_hash(nova_senha)
        return UsuarioRepository.salvar(usuario)