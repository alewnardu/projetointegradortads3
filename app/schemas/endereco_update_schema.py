from marshmallow import Schema, fields, validate
from app.schemas.localizacao_update_schema import (LocalizacaoUpdateSchema)

class EnderecoUpdateSchema(Schema):

    logradouro = fields.String()

    numero = fields.String(allow_none=True)

    bairro = fields.String()

    cidade = fields.String()

    estado = fields.String(
        validate=validate.OneOf([
            'AC','AL','AP','AM','BA','CE','DF','ES',
            'GO','MA','MT','MS','MG','PA','PB','PR',
            'PE','PI','RJ','RN','RS','RO','RR','SC',
            'SP','SE','TO'
        ], error='Estado inválido. Informe uma UF válida.')
    )

    cep = fields.String(
        validate=validate.Regexp(r'^\d{8}$', error='O CEP deve conter 8 números.')
    )

    localizacao = fields.Nested(
        LocalizacaoUpdateSchema
    )