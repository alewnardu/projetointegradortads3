from app.models.fotografia import Fotografia
from app.repositories.fotografia_repository import FotografiaRepository
from app.extensions import db
import os
import uuid
from werkzeug.utils import secure_filename
from app.repositories.fotografia_repository import FotografiaRepository
from datetime import datetime

UPLOAD_FOLDER = 'uploads/indicacoes'

class FotografiaService:

    @staticmethod
    def criar_fotografia_por_indicacao(indicacao, fotografia, is_principal=False):
        try:
            nome_original = secure_filename(fotografia.filename)
            extensao = nome_original.rsplit('.', 1)[1].lower()
            nome_arquivo = f"{uuid.uuid4()}.{extensao}"

            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            
            caminho_completo = os.path.join(UPLOAD_FOLDER, nome_arquivo)
            fotografia.save(caminho_completo)
            
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
            db.session.rollback()
            raise