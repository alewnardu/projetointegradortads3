from flask import current_app
from app.repositories.usuario_repository import UsuarioRepository
from werkzeug.security import (check_password_hash, generate_password_hash)
from app.exceptions import *
from app.extensions import db
from datetime import timedelta
from flask_jwt_extended import create_access_token, decode_token
from app.services.email_service import EmailService
from jwt import ExpiredSignatureError
from app.models.usuario import Usuario

class AutenticacaoService:

    @staticmethod
    def autenticar_usuario(dados):

        usuario = UsuarioRepository.buscar_por_email(
            dados['email']
        )

        if not usuario:
            raise AuthenticationError('Credenciais inválidas')
        
        senha_valida = check_password_hash(
            usuario.senha,
            dados['senha']
        )

        if not senha_valida:
            raise AuthenticationError('Credenciais inválidas')

        return usuario
    
    @staticmethod
    def primeiro_acesso(dados):
        try:
            if UsuarioRepository.buscar_por_email(dados['email']):
                raise ValidationError(f'Já existe um usuário cadastrado com o email {dados['email']}')
            
            senha_hash = generate_password_hash(dados['senha'])
            usuario = Usuario(
                nome=dados['nome'], 
                email=dados['email'], 
                senha=senha_hash
            )
            UsuarioRepository.salvar(usuario)
            db.session.commit()
            return usuario
        except Exception:
            db.session.rollback()
            raise
    
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

        try:
            usuario.senha = generate_password_hash(nova_senha)
            UsuarioRepository.salvar(usuario)
            db.session.commit()
            return usuario
        except Exception:
            db.session.rollback()
            raise
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
        
        try:
            usuario.senha = generate_password_hash(nova_senha)
            UsuarioRepository.salvar(usuario)
            db.session.commit()
            return usuario
        except Exception:
            db.session.rollback()
            raise