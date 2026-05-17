from marshmallow import Schema, fields, validate
from app.schemas.indicacao_schema import IndicacaoSchema

class BrinquedotecaSchema(Schema):

    id = fields.Integer(dump_only=True)

    observacao = fields.String(allow_none=True)

    status = fields.String(dump_only=True)

    indicacao_id = fields.Integer(dump_only=True)

    indicacao = fields.Nested(
        IndicacaoSchema,
        dump_only=True
    )