from app.models.indicacao import Indicacao
from app.repositories.indicacao_repository import IndicacaoRepository
from app.exceptions import *
from app.repositories.usuario_repository import UsuarioRepository

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