from app.models.indicacao import Indicacao
from app.repositories.indicacao_repository import IndicacaoRepository
from app.exceptions import *

class IndicacaoService:

    @staticmethod
    def listar_indicacoes(usuario_logado_id):

        if not usuario_logado_id:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')
        
        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)
        if not usuario_logado:
            raise ForbiddenError('Acesso negado! Você não tem permissão para acessar esta funcionalidade')

        indicacoes = IndicacaoRepository.listar_por_usuario(usuario_logado_id)
        return indicacoes