from marshmallow import Schema, fields, validate
from app.schemas.indicacao_schema import IndicacaoSchema
from app.schemas.avaliacao_schema import AvaliacaoSchema

class BrinquedotecaSchema(Schema):

    id = fields.Integer(dump_only=True)

    observacao = fields.String(allow_none=True)

    status = fields.String(dump_only=True)

    indicacao_id = fields.Integer(dump_only=True)

    indicacao = fields.Nested(
        IndicacaoSchema,
        dump_only=True
    )

    avaliacoes = fields.Nested(
        AvaliacaoSchema,
        many=True,
        dump_only=True
    )