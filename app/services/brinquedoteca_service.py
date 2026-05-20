from app.models.brinquedoteca import Brinquedoteca
from app.repositories.brinquedoteca_repository import BrinquedotecaRepository
from app.exceptions import *
from app.extensions import db
from app.repositories.usuario_repository import UsuarioRepository
from app.repositories.avaliacao_repository import AvaliacaoRepository
from app.models.avaliacao import Avaliacao

class BrinquedotecaService:

    @staticmethod
    def listar_brinquedotecas():
        return BrinquedotecaRepository.listar()

    @staticmethod
    def inativar_brinquedoteca(usuario_id, brinquedoteca_id, dados):
        brinquedoteca = BrinquedotecaRepository.buscar_por_id(brinquedoteca_id)

        if not brinquedoteca:
            raise NotFoundError('Brinquedoteca não encontrada')
        
        usuario_logado = UsuarioRepository.buscar_por_id(usuario_id)
        if not usuario_logado:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')

        if usuario_logado.perfil != 'ADMIN':
            raise ForbiddenError('Acesso negado! Você não tem permissão para inativar brinquedotecas.')

        if brinquedoteca.status != "ATIVA":
            raise BadRequestError(f'Não é possível inativar uma brinquedoteca com status {brinquedoteca.status}')

        try:
            brinquedoteca.status = 'INATIVA'
            brinquedoteca.observacao = dados['observacao']
            BrinquedotecaRepository.salvar(brinquedoteca)
            
            db.session.commit()
            return brinquedoteca
        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def criar_brinquedoteca_por_indicacao(indicacao):

        if indicacao.brinquedoteca:
            raise BadRequestError(
                'Já existe brinquedoteca vinculada a essa indicação'
            )

        try:
            brinquedoteca = Brinquedoteca(
                indicacao=indicacao,
                observacao="Brinquedoteca criada mediante aprovação de indicação",
                status='ATIVA'
            )
            BrinquedotecaRepository.salvar(brinquedoteca)
            db.session.commit()
            return brinquedoteca
        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def avaliar_brinquedoteca(usuario_id, brinquedoteca_id, dados):
        brinquedoteca = BrinquedotecaRepository.buscar_por_id(brinquedoteca_id)

        if not brinquedoteca:
            raise NotFoundError('Brinquedoteca não encontrada')
        
        usuario_logado = UsuarioRepository.buscar_por_id(usuario_id)
        if not usuario_logado:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')

        if brinquedoteca.status != "ATIVA":
            raise BadRequestError(f'Não é possível avaliar uma brinquedoteca com status {brinquedoteca.status}')

        try:
            avaliacao = Avaliacao(**dados, usuario_avaliador=usuario_logado, brinquedoteca=brinquedoteca)

            AvaliacaoRepository.salvar(avaliacao)
            
            db.session.commit()
            return brinquedoteca
        except Exception:
            db.session.rollback()
            raise