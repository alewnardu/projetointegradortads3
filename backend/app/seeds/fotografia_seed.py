from io import BytesIO
from werkzeug.datastructures import FileStorage
from PIL import Image
import uuid
import os
from app.services.fotografia_service import FotografiaService
from app.extensions import db

from io import BytesIO

from PIL import Image
from werkzeug.datastructures import FileStorage

from app.services.fotografia_service import FotografiaService
from app.extensions import db


def gerar_imagem_fake(indicacao, is_principal=False):
    buffer = BytesIO()

    imagem = Image.new("RGB", (800, 600))

    imagem.save(buffer, format="JPEG")

    buffer.seek(0)
    complemento = "_principal" if is_principal else "_adicional"
    return FileStorage(
        stream=buffer,
        filename=f"{indicacao.nome}_{complemento}.jpg",
        content_type="image/jpeg"
    )

def seed_fotografias(indicacao):
    try:
        fotografia_arquivo = Image.new("RGB", (800, 600))

        fotografia_principal = FotografiaService.criar_fotografia_por_indicacao(
            indicacao, 
            gerar_imagem_fake(indicacao, is_principal=True),
            is_principal=True
        )
        db.session.add(fotografia_principal)

        for _ in range(3):
            fotografia_adicional = FotografiaService.criar_fotografia_por_indicacao(
                indicacao, 
                gerar_imagem_fake(indicacao, is_principal=False),
                is_principal=False
            )
            db.session.add(fotografia_adicional)

        db.session.commit()
    except Exception:
        db.session.rollback()
        raise