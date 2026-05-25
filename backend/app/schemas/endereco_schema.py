from marshmallow import Schema, fields, validate, validates_schema, ValidationError
from app.schemas.localizacao_schema import LocalizacaoSchema

class EnderecoSchema(Schema):

    id = fields.Integer(dump_only=True)

    logradouro = fields.String(required=True)

    numero = fields.String(allow_none=True)

    bairro = fields.String(required=True)

    cidade = fields.String(required=True)

    estado = fields.String(required=True, 
        validate=validate.OneOf([
            'AC','AL','AP','AM','BA','CE','DF','ES',
            'GO','MA','MT','MS','MG','PA','PB','PR',
            'PE','PI','RJ','RN','RS','RO','RR','SC',
            'SP','SE','TO'],
            error='Estado inválido. Informe uma UF válida.'
        )
    )

    cep = fields.String(
        required=True, 
        validate=validate.Regexp(
            r'^\d{8}$',
            error='O CEP deve conter 8 números.'
        )
    )

    indicacao_id = fields.Integer(dump_only=True)

    localizacao = fields.Nested(LocalizacaoSchema, required=True)