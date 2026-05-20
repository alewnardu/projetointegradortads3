from app.models.fotografia import Fotografia
from app.repositories.fotografia_repository import FotografiaRepository
from app.extensions import db
import os
import uuid
from werkzeug.utils import secure_filename
from app.repositories.fotografia_repository import FotografiaRepository
from datetime import datetime
from app.exceptions import *
from app.repositories.usuario_repository import UsuarioRepository
from app.repositories.indicacao_repository import IndicacaoRepository
from flask import current_app

UPLOAD_FOLDER = 'uploads/indicacoes'

class FotografiaService:

    @staticmethod
    def criar_fotografia_por_indicacao(indicacao, fotografia_aquivo, is_principal=False):
        try:
            if is_principal:

            total_principais = (
                FotografiaRepository
                .total_fotografias_por_indicacao(
                    indicacao.id,
                    is_principal=True
                )
            )

            if total_principais > 0:
                raise ValidationError('A indicação deve conter apenas uma fotografia principal.')
            
            nome_original = secure_filename(fotografia_aquivo.filename)
            if not nome_original:
                raise ValidationError('Nome de arquivo inválido.')

            extensoes_permitidas = current_app.config['ALLOWED_EXTENSIONS']
            extensao = nome_original.rsplit('.', 1)[1].lower()
            if extensao not in extensoes_permitidas:
                raise ValidationError('Formato de imagem não permitido.')

            nome_arquivo = f"{uuid.uuid4()}.{extensao}"

            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            
            caminho_completo = os.path.join(UPLOAD_FOLDER, nome_arquivo)
            fotografia_aquivo.save(caminho_completo)
            
            fotografia = Fotografia(
                nome_arquivo=nome_original,
                caminho=caminho_completo,
                is_principal=is_principal,
                data_upload=datetime.utcnow(),
                indicacao=indicacao
            )
            
            FotografiaRepository.salvar(fotografia)
            
            return fotografia
        except Exception:
            if (caminho_completo and os.path.exists(caminho_completo)):
                os.remove(caminho_completo)
                
            db.session.rollback()
            raise

    @staticmethod
    def deletar_fotografia(usuario_logado_id, indicacao_id, fotografia_id):

        try:

            if not usuario_logado_id:
                raise UnauthorizedError(
                    'Acesso negado! Esta funcionalidade requer autenticação'
                )

            usuario_logado = UsuarioRepository.buscar_por_id(
                usuario_logado_id
            )

            if not usuario_logado:
                raise NotFoundError('Usuário não encontrado')

            indicacao = IndicacaoRepository.buscar_por_id(
                indicacao_id
            )

            if not indicacao:
                raise NotFoundError(
                    'Indicação de brinquedoteca não encontrada'
                )

            fotografia = FotografiaRepository.buscar_por_id(
                fotografia_id
            )

            if not fotografia:
                raise NotFoundError(
                    'Registro fotográfico não encontrado'
                )

            if fotografia.indicacao_id != indicacao_id:
                raise ForbiddenError(
                    'A fotografia não pertence à indicação informada.'
                )

            is_admin = usuario_logado.perfil == 'ADMIN'

            is_dono_indicacao = (
                indicacao.usuario_indicador_id
                == usuario_logado.id
            )

            if indicacao.status == 'APROVADA' and not is_admin:
                raise ForbiddenError(
                    'Somente administradores podem remover fotografias de indicações aprovadas.'
                )

            if indicacao.status == 'PENDENTE':

                if not is_admin and not is_dono_indicacao:
                    raise ForbiddenError(
                        'Você não tem permissão para remover fotografias desta indicação de terceiros.'
                    )

            if (
                fotografia.is_principal
                and FotografiaRepository.total_fotografias_por_indicacao(
                    indicacao_id,
                    is_principal=True
                ) <= 1
            ):
                raise ValidationError(
                    'Não é permitido remover a única fotografia principal da indicação.'
                )

            if (
                fotografia.caminho
                and os.path.exists(fotografia.caminho)
            ):
                os.remove(fotografia.caminho)

            FotografiaRepository.deletar(fotografia)

            db.session.commit()

            return True

        except Exception:
            db.session.rollback()
            raise