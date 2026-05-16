from app.models.indicacao import Indicacao
from app.repositories.indicacao_repository import IndicacaoRepository
from app.exceptions import *
from app.repositories.usuario_repository import UsuarioRepository
from datetime import datetime

class IndicacaoService:

    @staticmethod
    def listar_indicacoes(usuario_logado_id):

        if not usuario_logado_id:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')
        
        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)
        if not usuario_logado:
            raise ForbiddenError('Acesso negado! Você não tem permissão para acessar esta funcionalidade')
        
        if usuario_logado.perfil == 'ADMIN':
            return IndicacaoRepository.listar(None)

        return IndicacaoRepository.listar(usuario_logado)
    
    @staticmethod
    def buscar_indicacao(indicacao_id, usuario_logado_id):

        if not usuario_logado_id:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')
        
        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)
        if not usuario_logado:
            raise ForbiddenError('Acesso negado! Você não tem permissão para acessar esta funcionalidade')
        
        indicacao = IndicacaoRepository.buscar_por_id(indicacao_id)
        if not indicacao:
            raise NotFoundError('Indicação de brinquedoteca não encontrada')

        if usuario_logado.perfil != 'ADMIN' and indicacao.usuario.id != usuario_logado.id:
            raise ForbiddenError('Acesso negado! Você não tem permissão para acessar essa indicação.')

        return indicacao

    @staticmethod
    def criar_indicacao(usuario_logado_id, dados):
        
        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)

        if not usuario_logado:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')        

        indicacao = Indicacao(**dados, usuario_indicador=usuario_logado)
    
        return IndicacaoRepository.salvar(indicacao)
    
    @staticmethod
    def rejeitar_indicacao(indicacao_id, usuario_logado_id):

        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)

        if not usuario_logado:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')        

        indicacao = IndicacaoRepository.buscar_por_id(indicacao_id)
        if not indicacao:
            raise NotFoundError('Indicação de brinquedoteca não encontrada')

        if usuario_logado.perfil != 'ADMIN':
            raise ForbiddenError('Acesso negado! Você não tem permissão para analisar indicações.')

        if indicacao.status != 'PENDENTE':
            raise BadRequestError(f'Não é possível rejeitar uma indicação com status {indicacao.status}')

        indicacao.status = 'REJEITADA'
        indicacao.usuario_analisador = usuario_logado
        indicacao.data_rejeicao = datetime.utcnow()

        return IndicacaoRepository.salvar(indicacao)
    
    @staticmethod
    def cancelar_indicacao(indicacao_id, usuario_logado_id):

        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)

        if not usuario_logado:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')        

        indicacao = IndicacaoRepository.buscar_por_id(indicacao_id)
        if not indicacao:
            raise NotFoundError('Indicação de brinquedoteca não encontrada')

        if indicacao.usuario_indicador_id != usuario_logado.id and usuario_logado.perfil != 'ADMIN':
            raise ForbiddenError('Acesso negado! Você não tem permissão para cancelar indicações de terceiros.')

        if indicacao.status != 'PENDENTE':
            raise BadRequestError(f'Não é possível cancelar uma indicação com status {indicacao.status}')

        indicacao.status = 'CANCELADA'
        indicacao.usuario_analisador = usuario_logado
        indicacao.data_rejeicao = datetime.utcnow()

        return IndicacaoRepository.salvar(indicacao)
    