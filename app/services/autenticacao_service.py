from app.repositories.usuario_repository import UsuarioRepository
from werkzeug.security import (
    check_password_hash,
    generate_password_hash
)

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
    
    def alterar_senha(usuario_id, dados):
        
        usuario = UsuarioRepository.buscar_por_id(usuario_id)

        if not usuario:
            raise Exception('Usuário não encontrado')
        
        senha_atual = dados.get('senha_atual')
        nova_senha = dados.get('nova_senha')
        confirmacao_senha = dados.get('confirmacao_senha')

        if not all([senha_atual, nova_senha, confirmacao_senha]):
            raise Exception('Informe a senha atual, nova senha e confirmação da nova senha')
        
        if not check_password_hash(usuario.senha, senha_atual):
            raise Exception('Senha atual incorreta')

        if nova_senha != confirmacao_senha:
            raise Exception('A nova senha e a confirmação não coincidem')
        
        usuario.senha = generate_password_hash(nova_senha)
        UsuarioRepository.salvar(usuario)