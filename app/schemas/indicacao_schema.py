from marshmallow import Schema, fields, validate
from app.schemas.endereco_schema import EnderecoSchema

class IndicacaoSchema(Schema):

    id = fields.Integer(dump_only=True)

    nome = fields.String(required=True)

    descricao = fields.String(allow_none=True)

    data_criacao = fields.DateTime(dump_only=True)

    status = fields.String(dump_only=True)

    data_aprovacao = fields.DateTime(dump_only=True)

    data_rejeicao = fields.DateTime(dump_only=True)

    tem_climatizacao = fields.Boolean(load_default=False)

    tem_monitores = fields.Boolean(load_default=False)

    tem_gratuidade = fields.Boolean(load_default=False)

    porte = fields.String(
        load_default='MEDIO',
        validate=validate.OneOf([
            'PEQUENO',
            'MEDIO',
            'GRANDE'
        ])
    )

    usuario_indicador_id = fields.Integer(dump_only=True)

    usuario_analisador_id = fields.Integer(dump_only=True)

    endereco = fields.Nested(EnderecoSchema, required=True)