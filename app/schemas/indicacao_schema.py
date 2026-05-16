from marshmallow import Schema, fields, validate

class IndicacaoSchema(Schema):

    id = fields.Integer(dump_only=True)

    nome = fields.String(required=True)

    descricao = fields.String(allow_none=True)

    data_criacao = fields.DateTime(dump_only=True)

    status = fields.String(dump_only=True)

    data_aprovacao = fields.DateTime(allow_none=True)

    data_rejeicao = fields.DateTime(allow_none=True)

    tem_climatizacao = fields.Boolean(load_default=False)

    tem_monitores = fields.Boolean(load_default=False)

    tem_gratuidade = fields.Boolean(load_default=False)

    porte = fields.String(
        validate=validate.OneOf([
            'PEQUENO',
            'MEDIO',
            'GRANDE'
        ])
    )

    usuario_indicador_id = fields.Integer(required=True)

    usuario_analisador_id = fields.Integer(allow_none=True)