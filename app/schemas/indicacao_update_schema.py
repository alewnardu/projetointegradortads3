from marshmallow import Schema, fields, validate
from app.schemas.endereco_update_schema import (EnderecoUpdateSchema)

class IndicacaoUpdateSchema(Schema):

    nome = fields.String()

    descricao = fields.String(allow_none=True)

    tem_climatizacao = fields.Boolean()

    tem_monitores = fields.Boolean()

    tem_gratuidade = fields.Boolean()

    porte = fields.String(
        validate=validate.OneOf([
            'PEQUENO',
            'MEDIO',
            'GRANDE'
        ])
    )

    endereco = fields.Nested(
        EnderecoUpdateSchema
    )