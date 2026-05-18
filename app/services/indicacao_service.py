from app.models.indicacao import Indicacao
from app.repositories.indicacao_repository import IndicacaoRepository
from app.exceptions import *
from app.repositories.usuario_repository import UsuarioRepository
from datetime import datetime
from app.services.brinquedoteca_service import BrinquedotecaService
from app.extensions import db
from app.models.endereco import Endereco
from app.repositories.endereco_repository import EnderecoRepository
from app.services.endereco_service import EnderecoService
from app.services.localizacao_service import LocalizacaoService
from app.repositories.localizacao_repository import LocalizacaoRepository

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

        if usuario_logado.perfil != 'ADMIN' and indicacao.usuario_indicador_id != usuario_logado.id:
            raise ForbiddenError('Acesso negado! Você não tem permissão para acessar as indicações de terceiros.')

        return indicacao

    @staticmethod
    def criar_indicacao(usuario_logado_id, dados):
        
        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)

        if not usuario_logado:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')        
        
        try:
            endereco_dados = dados.pop('endereco')
            localizacao_dados = endereco_dados.pop('localizacao')

            indicacao = Indicacao(
                **dados,
                usuario_indicador=usuario_logado
            )

            IndicacaoRepository.salvar(indicacao)
            db.session.flush()

            endereco = EnderecoService.criar_endereco_por_indicacao(
                indicacao,
                endereco_dados
            )

            EnderecoRepository.salvar(endereco)
            db.session.flush()

            localizacao = LocalizacaoService.criar_localizacao_por_endereco(
                endereco,
                localizacao_dados
            )

            LocalizacaoRepository.salvar(localizacao)

            db.session.commit()

            return IndicacaoRepository.buscar_por_id(indicacao.id)

        except Exception:
            db.session.rollback()
            raise
    
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

        try:
            indicacao.status = 'REJEITADA'
            indicacao.usuario_analisador = usuario_logado
            indicacao.data_rejeicao = datetime.utcnow()
            IndicacaoRepository.salvar(indicacao)
            db.session.commit()
            return indicacao
        except Exception:
            db.session.rollback()
            raise
    
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

        try:
            indicacao.status = 'CANCELADA'
            indicacao.usuario_analisador = usuario_logado
            indicacao.data_rejeicao = datetime.utcnow()
            IndicacaoRepository.salvar(indicacao)
            db.session.commit()
            return indicacao
        except Exception:
            db.session.rollback()
            raise

    @staticmethod
    def aprovar_indicacao(indicacao_id, usuario_logado_id):

        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)

        if not usuario_logado:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')        

        indicacao = IndicacaoRepository.buscar_por_id(indicacao_id)
        if not indicacao:
            raise NotFoundError('Indicação de brinquedoteca não encontrada')

        if usuario_logado.perfil != 'ADMIN':
            raise ForbiddenError('Acesso negado! Você não tem permissão para analisar indicações.')

        if indicacao.status != 'PENDENTE':
            raise BadRequestError(f'Não é possível aprovar uma indicação com status {indicacao.status}')

        try:
            indicacao.status = 'APROVADA'
            indicacao.usuario_analisador = usuario_logado
            indicacao.data_aprovacao = datetime.utcnow()

            IndicacaoRepository.salvar(indicacao)

            BrinquedotecaService.criar_brinquedoteca_por_indicacao(indicacao)

            db.session.commit()

            return indicacao

        except Exception:

            db.session.rollback()
            raise

    @staticmethod
    def atualizar_indicacao(indicacao_id, usuario_logado_id, dados):

        usuario_logado = UsuarioRepository.buscar_por_id(usuario_logado_id)

        if not usuario_logado:
            raise UnauthorizedError('Acesso negado! Esta funcionalidade requer autenticação')        

        indicacao = IndicacaoRepository.buscar_por_id(indicacao_id)
        if not indicacao:
            raise NotFoundError('Indicação de brinquedoteca não encontrada')

        if indicacao.usuario_indicador_id != usuario_logado.id and usuario_logado.perfil != 'ADMIN':
            raise ForbiddenError('Acesso negado! Você não tem permissão para atualizar indicações de terceiros.')

        if indicacao.status != 'PENDENTE':
            raise BadRequestError(f'Não é possível atualizar uma indicação com status {indicacao.status}')

        try:
            endereco_dados = dados.pop('endereco', None)
            for key, value in dados.items():
                setattr(indicacao, key, value)
            
            if endereco_dados:
                localizacao_dados = endereco_dados.pop('localizacao', None)

                if not indicacao.endereco:
                    raise NotFoundError('Endereço não encontrado')

                endereco_atual = indicacao.endereco
                for key, value in endereco_dados.items():
                    setattr(endereco_atual, key, value)
                
                if localizacao_dados:

                    if not endereco_atual.localizacao:
                        raise NotFoundError('Localização não encontrada')
                    
                    localizacao_atual = endereco_atual.localizacao
                    for key, value in localizacao_dados.items():
                        setattr(localizacao_atual, key, value)

            db.session.commit()
            return indicacao
        except Exception:
            db.session.rollback()
            raise